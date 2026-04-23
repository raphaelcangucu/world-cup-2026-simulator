import { GROUP_KEYS } from "../data/groups.js";
import { getMatchId } from "../data/fixtures.js";
import { R32_TEMPLATE, ROUND_ORDER, ROUND_LABELS } from "../data/bracket-template.js";
import { computeAllGroupTables, isReady } from "../engine/standings.js";
import { buildSeeds, addThirdSeeds, rankThirds, pickBestThirds, resolveThirdAssignments } from "../engine/qualifiers.js";
import { buildKnockoutMatches, championPath, getChampion, countMatches, countDecided } from "../engine/bracket-engine.js";
import { deserialize, pushUrlPayload, readUrlPayload } from "./serialize.js";
import {
  readPersistedState, savePersistedState, clearPersistedState,
  readTheme, saveTheme, readTourDone, saveTourDone, clearTour
} from "./storage.js";

function defaultState() {
  return {
    scores: {},
    knockoutMatches: {},
    activeGroup: "A",
    activeRound: "1ª rodada",
    groupView: "group",
    knockoutPhase: "R32",
    theme: "dark",
    onboardingDone: false
  };
}

function initialTheme() {
  const saved = readTheme();
  if (saved === "dark" || saved === "light") return saved;
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  return "dark";
}

function ensureKnockoutRecords(knockoutState) {
  const seeded = { ...knockoutState };
  const roundIds = [
    ...R32_TEMPLATE.map(t => t.id),
    ...[1, 2, 3, 4, 5, 6, 7, 8].map(i => `R16-${i}`),
    ...[1, 2, 3, 4].map(i => `QF-${i}`),
    ...[1, 2].map(i => `SF-${i}`),
    "F-1"
  ];
  roundIds.forEach(id => {
    if (!seeded[id]) seeded[id] = { home: "", away: "" };
  });
  return seeded;
}

function ensureGroupScores(fixtures, scores) {
  const seeded = { ...scores };
  fixtures.forEach(match => {
    const id = getMatchId(match);
    if (!seeded[id]) seeded[id] = { home: "", away: "" };
  });
  return seeded;
}

function validGroup(key) {
  return GROUP_KEYS.includes(key);
}

function sanitizeScoreValue(value) {
  if (value === "" || value == null) return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return String(Math.max(0, Math.floor(n)));
}

export function createStore({ fixtures, thirdMap }) {
  const listeners = new Set();
  let state = defaultState();
  state.theme = initialTheme();
  state.onboardingDone = readTourDone();
  state.scores = ensureGroupScores(fixtures, state.scores);
  state.knockoutMatches = ensureKnockoutRecords(state.knockoutMatches);

  const urlPayload = readUrlPayload();
  const saved = urlPayload ? deserialize(urlPayload) : deserialize(readPersistedState());
  if (saved) {
    state.scores = ensureGroupScores(fixtures, { ...state.scores, ...saved.scores });
    state.knockoutMatches = ensureKnockoutRecords({ ...state.knockoutMatches, ...saved.knockoutMatches });
    if (validGroup(saved.activeGroup)) state.activeGroup = saved.activeGroup;
    if (typeof saved.activeRound === "string") state.activeRound = saved.activeRound;
    if (saved.groupView === "round" || saved.groupView === "group") state.groupView = saved.groupView;
    if (ROUND_ORDER.includes(saved.knockoutPhase)) state.knockoutPhase = saved.knockoutPhase;
  }

  let derived = compute();
  let lastSeeds = snapshotSeeds(derived);
  let lastThirds = snapshotThirds(derived);

  function snapshotSeeds(d) {
    return JSON.stringify(d.seeds);
  }
  function snapshotThirds(d) {
    return (d.rankedThirds || []).map(row => row.team).join(",");
  }

  function compute() {
    const groupTables = computeAllGroupTables(fixtures, state.scores);
    const seeds = buildSeeds(groupTables);
    const rankedThirds = rankThirds(groupTables);
    const bestThirds = pickBestThirds(rankedThirds, 8);
    addThirdSeeds(seeds, bestThirds);
    const { key: qualifiedGroupsKey, assignments: thirdAssignments } = resolveThirdAssignments(bestThirds, thirdMap);
    const matches = buildKnockoutMatches(seeds, thirdAssignments, state.knockoutMatches);
    const champion = getChampion(matches);
    const path = championPath(matches);

    const totalGroupMatches = fixtures.length;
    const filledGroupMatches = fixtures.filter(match => {
      const id = getMatchId(match);
      const entry = state.scores[id];
      return entry && isReady(entry.home) && isReady(entry.away);
    }).length;

    const totalKnockoutMatches = countMatches(matches);
    const decidedKnockoutMatches = countDecided(matches);

    const totalMatches = totalGroupMatches + totalKnockoutMatches;
    const completedMatches = filledGroupMatches + decidedKnockoutMatches;

    return {
      groupTables,
      seeds,
      rankedThirds,
      bestThirds,
      qualifiedGroupsKey,
      thirdAssignments,
      matches,
      champion,
      championPath: path,
      totalGroupMatches,
      filledGroupMatches,
      totalKnockoutMatches,
      decidedKnockoutMatches,
      totalMatches,
      completedMatches
    };
  }

  function notify() {
    const previousSeeds = lastSeeds;
    const previousThirds = lastThirds;
    derived = compute();
    const currentSeeds = snapshotSeeds(derived);
    const currentThirds = snapshotThirds(derived);
    const changes = detectQualificationChanges(previousSeeds, currentSeeds, previousThirds, currentThirds);
    lastSeeds = currentSeeds;
    lastThirds = currentThirds;
    const payload = { state: { ...state }, derived, changes };
    pushUrlPayload(state);
    savePersistedState(serializeSnapshot());
    listeners.forEach(fn => {
      try { fn(payload); } catch (err) { console.error("Listener error", err); }
    });
  }

  function detectQualificationChanges(prevSeedsJson, currSeedsJson, prevThirdsJson, currThirdsJson) {
    const prevSeeds = JSON.parse(prevSeedsJson || "{}");
    const currSeeds = JSON.parse(currSeedsJson || "{}");
    const changedTeams = new Set();
    const allKeys = new Set([...Object.keys(prevSeeds), ...Object.keys(currSeeds)]);
    allKeys.forEach(key => {
      if (prevSeeds[key] !== currSeeds[key]) {
        if (prevSeeds[key]) changedTeams.add(prevSeeds[key]);
        if (currSeeds[key]) changedTeams.add(currSeeds[key]);
      }
    });
    const prevThirds = prevThirdsJson.split(",").filter(Boolean);
    const currThirds = currThirdsJson.split(",").filter(Boolean);
    const thirdChanges = prevThirds.filter((t, i) => t !== currThirds[i]);
    thirdChanges.forEach(team => changedTeams.add(team));
    currThirds.forEach((team, i) => { if (team !== prevThirds[i]) changedTeams.add(team); });
    return { changedTeams: [...changedTeams] };
  }

  function serializeSnapshot() {
    return window.btoa(unescape(encodeURIComponent(JSON.stringify({
      v: 2,
      scores: state.scores,
      knockoutMatches: state.knockoutMatches,
      activeGroup: state.activeGroup,
      activeRound: state.activeRound,
      groupView: state.groupView,
      knockoutPhase: state.knockoutPhase
    })))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function setGroupScore(matchId, side, value) {
    if (!state.scores[matchId]) return;
    const prev = state.scores[matchId];
    const next = { ...prev, [side]: sanitizeScoreValue(value) };
    if (next.home === prev.home && next.away === prev.away) return;
    state.scores = { ...state.scores, [matchId]: next };
    notify();
  }

  function pickGroupWinner(matchId, homeWin) {
    if (!state.scores[matchId]) return;
    state.scores = {
      ...state.scores,
      [matchId]: { home: homeWin ? "1" : "0", away: homeWin ? "0" : "1" }
    };
    notify();
  }

  function setKnockoutScore(matchId, side, value) {
    if (!state.knockoutMatches[matchId]) return;
    const prev = state.knockoutMatches[matchId];
    const next = { ...prev, [side]: sanitizeScoreValue(value) };
    if (next.home === prev.home && next.away === prev.away) return;
    state.knockoutMatches = { ...state.knockoutMatches, [matchId]: next };
    notify();
  }

  function pickKnockoutWinner(matchId, homeWin) {
    if (!state.knockoutMatches[matchId]) return;
    state.knockoutMatches = {
      ...state.knockoutMatches,
      [matchId]: { home: homeWin ? "1" : "0", away: homeWin ? "0" : "1" }
    };
    notify();
  }

  function setActiveGroup(group) {
    if (!validGroup(group) || group === state.activeGroup) return;
    state.activeGroup = group;
    notify();
  }

  function setActiveRound(round) {
    if (typeof round !== "string" || round === state.activeRound) return;
    state.activeRound = round;
    notify();
  }

  function setGroupView(view) {
    if (view !== "group" && view !== "round") return;
    if (view === state.groupView) return;
    state.groupView = view;
    notify();
  }

  function setKnockoutPhase(phase) {
    if (!ROUND_ORDER.includes(phase) || phase === state.knockoutPhase) return;
    state.knockoutPhase = phase;
    notify();
  }

  function setTheme(theme) {
    if (theme !== "dark" && theme !== "light") return;
    if (theme === state.theme) return;
    state.theme = theme;
    saveTheme(theme);
    notify();
  }

  function markOnboardingDone() {
    if (state.onboardingDone) return;
    state.onboardingDone = true;
    saveTourDone();
    notify();
  }

  function resetOnboarding() {
    state.onboardingDone = false;
    clearTour();
    notify();
  }

  function reset() {
    const theme = state.theme;
    clearPersistedState();
    state = defaultState();
    state.theme = theme;
    state.onboardingDone = readTourDone();
    state.scores = ensureGroupScores(fixtures, {});
    state.knockoutMatches = ensureKnockoutRecords({});
    history.replaceState(null, "", location.pathname + location.search);
    notify();
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener({ state: { ...state }, derived, changes: { changedTeams: [] } });
    return () => listeners.delete(listener);
  }

  function getSnapshot() {
    return { state: { ...state }, derived };
  }

  return {
    subscribe,
    getSnapshot,
    setGroupScore,
    pickGroupWinner,
    setKnockoutScore,
    pickKnockoutWinner,
    setActiveGroup,
    setActiveRound,
    setGroupView,
    setKnockoutPhase,
    setTheme,
    markOnboardingDone,
    resetOnboarding,
    reset
  };
}

export { ROUND_LABELS };
