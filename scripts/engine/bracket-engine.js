import { R32_TEMPLATE, NEXT_ROUNDS, ROUND_LABELS, ROUND_ORDER, isLeftSide } from "../data/bracket-template.js";
import { isReady } from "./standings.js";

const TBD = "TBD";

function sanitizeScore(value) {
  if (value === "" || value == null) return "";
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  return String(Math.max(0, Math.floor(number)));
}

function resolveSeed(seedKey, seeds, thirdAssignments) {
  if (!seedKey) return TBD;
  if (seedKey.startsWith("TP:")) {
    const slot = seedKey.split(":")[1];
    const mappedSeed = thirdAssignments[slot];
    return mappedSeed ? (seeds[mappedSeed] || TBD) : TBD;
  }
  return seeds[seedKey] || TBD;
}

function decideWinner(match) {
  const { homeTeam, awayTeam, home, away } = match;
  if (homeTeam === TBD || awayTeam === TBD) return "";
  if (!isReady(home) || !isReady(away)) return "";
  const h = Number(home);
  const a = Number(away);
  if (h > a) return homeTeam;
  if (a > h) return awayTeam;
  return "";
}

export function isTiedKnockout(match) {
  if (!match) return false;
  if (match.homeTeam === TBD || match.awayTeam === TBD) return false;
  if (!isReady(match.home) || !isReady(match.away)) return false;
  return Number(match.home) === Number(match.away);
}

function buildRound32(seeds, thirdAssignments, knockoutState) {
  return R32_TEMPLATE.map(template => {
    const editable = knockoutState[template.id] || { home: "", away: "" };
    const homeTeam = resolveSeed(template.home, seeds, thirdAssignments);
    const awayTeam = resolveSeed(template.away, seeds, thirdAssignments);
    const match = {
      id: template.id,
      round: "R32",
      label: template.label,
      side: template.side,
      homeTeam,
      awayTeam,
      home: sanitizeScore(editable.home),
      away: sanitizeScore(editable.away)
    };
    match.winner = decideWinner(match);
    match.tied = isTiedKnockout(match);
    return match;
  });
}

function buildLaterRound(code, rounds, knockoutState) {
  return NEXT_ROUNDS[code].map((pair, index) => {
    const id = `${code}-${index + 1}`;
    const editable = knockoutState[id] || { home: "", away: "" };
    const prevHome = findMatch(pair[0], rounds);
    const prevAway = findMatch(pair[1], rounds);
    const homeTeam = prevHome?.winner ? prevHome.winner : TBD;
    const awayTeam = prevAway?.winner ? prevAway.winner : TBD;
    const match = {
      id,
      round: code,
      label: `${ROUND_LABELS[code]} · ${index + 1}`,
      side: isLeftSide(id) === true ? "L" : isLeftSide(id) === false ? "R" : "F",
      feedsFrom: [pair[0], pair[1]],
      homeTeam,
      awayTeam,
      home: sanitizeScore(editable.home),
      away: sanitizeScore(editable.away)
    };
    match.winner = decideWinner(match);
    match.tied = isTiedKnockout(match);
    return match;
  });
}

export function buildKnockoutMatches(seeds, thirdAssignments, knockoutState) {
  const rounds = {
    R32: buildRound32(seeds, thirdAssignments, knockoutState),
    R16: [],
    QF: [],
    SF: [],
    F: []
  };
  rounds.R16 = buildLaterRound("R16", rounds, knockoutState);
  rounds.QF = buildLaterRound("QF", rounds, knockoutState);
  rounds.SF = buildLaterRound("SF", rounds, knockoutState);
  rounds.F = buildLaterRound("F", rounds, knockoutState);
  return rounds;
}

export function findMatch(id, rounds) {
  if (!id) return null;
  for (const key of ROUND_ORDER) {
    const match = rounds[key]?.find(m => m.id === id);
    if (match) return match;
  }
  return null;
}

export function getChampion(rounds) {
  const finalMatch = rounds.F?.[0];
  if (!finalMatch || !finalMatch.winner) return "";
  return finalMatch.winner;
}

export function championPath(rounds) {
  const championTeam = getChampion(rounds);
  if (!championTeam) return [];

  const path = [];
  const visited = new Set();
  const queue = [rounds.F[0]];

  while (queue.length) {
    const match = queue.shift();
    if (!match || visited.has(match.id)) continue;
    if (match.winner !== championTeam) continue;
    visited.add(match.id);
    path.push(match.id);
    if (match.feedsFrom) {
      match.feedsFrom.forEach(prevId => {
        const prev = findMatch(prevId, rounds);
        if (prev && prev.winner === championTeam) queue.push(prev);
      });
    }
  }
  return path;
}

export function countMatches(rounds) {
  return ROUND_ORDER.reduce((acc, key) => acc + (rounds[key]?.length || 0), 0);
}

export function countDecided(rounds) {
  let decided = 0;
  for (const key of ROUND_ORDER) {
    (rounds[key] || []).forEach(match => {
      if (match.winner) decided += 1;
    });
  }
  return decided;
}
