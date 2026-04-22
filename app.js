const TEAM_FLAG_CODES = {
  Mexico: "mx",
  "South Africa": "za",
  "South Korea": "kr",
  Czechia: "cz",
  Canada: "ca",
  "Bosnia and Herzegovina": "ba",
  Qatar: "qa",
  Switzerland: "ch",
  Brazil: "br",
  Morocco: "ma",
  Haiti: "ht",
  Scotland: "gb-sct",
  USA: "us",
  Paraguay: "py",
  Australia: "au",
  "Türkiye": "tr",
  Germany: "de",
  "Curaçao": "cw",
  "Ivory Coast": "ci",
  Ecuador: "ec",
  Netherlands: "nl",
  Japan: "jp",
  Sweden: "se",
  Tunisia: "tn",
  Belgium: "be",
  Egypt: "eg",
  Iran: "ir",
  "New Zealand": "nz",
  Spain: "es",
  "Cape Verde": "cv",
  "Saudi Arabia": "sa",
  Uruguay: "uy",
  France: "fr",
  Senegal: "sn",
  Iraq: "iq",
  Norway: "no",
  Argentina: "ar",
  Algeria: "dz",
  Austria: "at",
  Jordan: "jo",
  Portugal: "pt",
  "DR Congo": "cd",
  Uzbekistan: "uz",
  Colombia: "co",
  England: "gb-eng",
  Croatia: "hr",
  Ghana: "gh",
  Panama: "pa",
};

const GROUPS = {
  A: ["Mexico", "South Africa", "South Korea", "Czechia"],
  B: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["USA", "Paraguay", "Australia", "Türkiye"],
  E: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
  G: ["Belgium", "Egypt", "Iran", "New Zealand"],
  H: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Iraq", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"],
};

const GROUP_FIXTURES = {
  A: [["Mexico","South Africa"],["South Korea","Czechia"],["Czechia","South Africa"],["Mexico","South Korea"],["Czechia","Mexico"],["South Africa","South Korea"]],
  B: [["Canada","Bosnia and Herzegovina"],["Qatar","Switzerland"],["Switzerland","Bosnia and Herzegovina"],["Canada","Qatar"],["Switzerland","Canada"],["Bosnia and Herzegovina","Qatar"]],
  C: [["Brazil","Morocco"],["Haiti","Scotland"],["Scotland","Morocco"],["Brazil","Haiti"],["Scotland","Brazil"],["Morocco","Haiti"]],
  D: [["USA","Paraguay"],["Australia","Türkiye"],["USA","Australia"],["Türkiye","Paraguay"],["Türkiye","USA"],["Paraguay","Australia"]],
  E: [["Germany","Curaçao"],["Ivory Coast","Ecuador"],["Germany","Ivory Coast"],["Ecuador","Curaçao"],["Ecuador","Germany"],["Curaçao","Ivory Coast"]],
  F: [["Netherlands","Japan"],["Sweden","Tunisia"],["Netherlands","Sweden"],["Tunisia","Japan"],["Japan","Sweden"],["Tunisia","Netherlands"]],
  G: [["Belgium","Egypt"],["Iran","New Zealand"],["Belgium","Iran"],["New Zealand","Egypt"],["Egypt","Iran"],["New Zealand","Belgium"]],
  H: [["Spain","Cape Verde"],["Saudi Arabia","Uruguay"],["Spain","Saudi Arabia"],["Uruguay","Cape Verde"],["Cape Verde","Saudi Arabia"],["Uruguay","Spain"]],
  I: [["France","Senegal"],["Iraq","Norway"],["France","Iraq"],["Norway","Senegal"],["Norway","France"],["Senegal","Iraq"]],
  J: [["Argentina","Algeria"],["Austria","Jordan"],["Argentina","Austria"],["Jordan","Algeria"],["Algeria","Austria"],["Jordan","Argentina"]],
  K: [["Portugal","DR Congo"],["Uzbekistan","Colombia"],["Portugal","Uzbekistan"],["Colombia","DR Congo"],["Colombia","Portugal"],["DR Congo","Uzbekistan"]],
  L: [["England","Croatia"],["Ghana","Panama"],["England","Ghana"],["Panama","Croatia"],["Panama","England"],["Croatia","Ghana"]],
};

const FIFA_RANKING = { Argentina:1, Spain:2, France:3, England:4, Brazil:5, Portugal:6, Netherlands:7, Belgium:8, Germany:9, Croatia:10, Morocco:11, Colombia:12, Uruguay:13, Switzerland:14, Japan:15, Senegal:16, Iran:17, "South Korea":18, Ecuador:19, Austria:20, Australia:21, Panama:22, Norway:23, Egypt:24, Algeria:25, Scotland:26, Paraguay:27, "Ivory Coast":28, Tunisia:29, Uzbekistan:30, Qatar:31, "Saudi Arabia":32, "South Africa":33, Jordan:34, "Cape Verde":35, Ghana:36, "Curaçao":37, Haiti:38, "New Zealand":39, Mexico:40, Canada:41, USA:42, Czechia:43, "Bosnia and Herzegovina":44, Türkiye:45, Iraq:46, "DR Congo":47 };

const R32_TEMPLATE = [
  { id:"R32-1", label:"Round of 32 · 1", home:"A2", away:"B2" },
  { id:"R32-2", label:"Round of 32 · 2", home:"C1", away:"F2" },
  { id:"R32-3", label:"Round of 32 · 3", home:"E1", away:"TP:E1" },
  { id:"R32-4", label:"Round of 32 · 4", home:"F1", away:"C2" },
  { id:"R32-5", label:"Round of 32 · 5", home:"E2", away:"I2" },
  { id:"R32-6", label:"Round of 32 · 6", home:"I1", away:"TP:I1" },
  { id:"R32-7", label:"Round of 32 · 7", home:"A1", away:"TP:A1" },
  { id:"R32-8", label:"Round of 32 · 8", home:"L1", away:"TP:L1" },
  { id:"R32-9", label:"Round of 32 · 9", home:"G1", away:"TP:G1" },
  { id:"R32-10", label:"Round of 32 · 10", home:"D1", away:"TP:D1" },
  { id:"R32-11", label:"Round of 32 · 11", home:"H1", away:"J2" },
  { id:"R32-12", label:"Round of 32 · 12", home:"K2", away:"L2" },
  { id:"R32-13", label:"Round of 32 · 13", home:"B1", away:"TP:B1" },
  { id:"R32-14", label:"Round of 32 · 14", home:"D2", away:"G2" },
  { id:"R32-15", label:"Round of 32 · 15", home:"J1", away:"H2" },
  { id:"R32-16", label:"Round of 32 · 16", home:"K1", away:"TP:K1" },
];

const NEXT_ROUNDS = {
  R16:[["R32-1","R32-2"],["R32-3","R32-4"],["R32-5","R32-6"],["R32-7","R32-8"],["R32-9","R32-10"],["R32-11","R32-12"],["R32-13","R32-14"],["R32-15","R32-16"]],
  QF:[["R16-1","R16-2"],["R16-3","R16-4"],["R16-5","R16-6"],["R16-7","R16-8"]],
  SF:[["QF-1","QF-2"],["QF-3","QF-4"]],
  F:[["SF-1","SF-2"]],
};

const NAV_STEPS = [
  { id: "groupsSection", label: "Group stage" },
  { id: "qualifiersSection", label: "Qualifiers" },
  { id: "knockoutSection", label: "Knockout" },
  { id: "championSection", label: "Champion" },
];

const state = { groupMatches: {}, knockoutMatches: {}, activeGroup: "A", thirdMap: {} };
let derived = null;

function createDefaultKnockoutState() {
  const all = [...R32_TEMPLATE, ...makeRound("R16"), ...makeRound("QF"), ...makeRound("SF"), ...makeRound("F")];
  return Object.fromEntries(all.map(match => [match.id, { home: "", away: "", winner: "" }]));
}

function buildDefaultState() {
  Object.entries(GROUP_FIXTURES).forEach(([group, fixtures]) => {
    fixtures.forEach((fixture, index) => {
      state.groupMatches[`${group}-${index}`] = { home: "", away: "" };
    });
  });
  Object.assign(state.knockoutMatches, createDefaultKnockoutState());
}

function makeRound(code) {
  return NEXT_ROUNDS[code].map((pair, index) => ({ id: `${code}-${index + 1}`, pair, label: `${code} · ${index + 1}` }));
}

async function init() {
  buildDefaultState();
  renderNav();
  bindTopActions();
  window.addEventListener("hashchange", renderNavActive);
  try {
    await loadThirdMap();
    restoreState();
    recomputeAndRender();
  } catch (error) {
    console.error(error);
    setStatus("Could not load official third-place routing. Refresh and try again.");
  }
}

async function loadThirdMap() {
  const response = await fetch("third-place-map.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`third-place-map.json failed: ${response.status}`);
  state.thirdMap = await response.json();
}

function restoreState() {
  const payload = location.hash.startsWith("#s=") ? location.hash.slice(3) : localStorage.getItem("wc26-state");
  if (!payload) return;
  try {
    const decoded = decodePayload(payload);
    Object.assign(state.groupMatches, decoded.groupMatches || {});
    Object.assign(state.knockoutMatches, decoded.knockoutMatches || {});
    if (GROUPS[decoded.activeGroup]) state.activeGroup = decoded.activeGroup;
  } catch (error) {
    console.warn("Failed to restore simulator state", error);
  }
}

function persistState() {
  const payload = encodePayload({
    groupMatches: state.groupMatches,
    knockoutMatches: state.knockoutMatches,
    activeGroup: state.activeGroup,
  });
  history.replaceState(null, "", `${location.pathname}${location.search}#s=${payload}`);
  localStorage.setItem("wc26-state", payload);
  return `${location.origin}${location.pathname}${location.search}#s=${payload}`;
}

function encodePayload(value) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(value))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodePayload(payload) {
  return JSON.parse(decodeURIComponent(escape(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))));
}

function bindTopActions() {
  document.getElementById("shareBtn").addEventListener("click", async () => {
    const url = persistState();
    const text = "My World Cup 2026 scenario on macro.markets";
    if (navigator.share) {
      try {
        await navigator.share({ title: text, text, url });
        setStatus("Scenario shared.");
        return;
      } catch {}
    }
    await copyText(url);
    setStatus("Scenario link copied.");
  });

  document.getElementById("copyBtn").addEventListener("click", async () => {
    await copyText(persistState());
    setStatus("Scenario link copied.");
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    localStorage.removeItem("wc26-state");
    location.href = location.pathname;
  });
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "true");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
  return true;
}

function setStatus(text) {
  document.getElementById("shareStatus").textContent = text;
}

function renderNav() {
  document.getElementById("stepNav").innerHTML = NAV_STEPS.map(step => `<a class="nav-link" href="#${step.id}" data-section-link="${step.id}">${step.label}</a>`).join("");
}

function recomputeAndRender() {
  derived = computeTournament();
  persistState();
  renderNavActive();
  renderHeroStats();
  renderGroupPager();
  renderGroups();
  renderQualifiers();
  renderKnockout();
  renderChampion();
}

function renderNavActive() {
  const currentSection = location.hash.replace(/^#/, "") || "groupsSection";
  document.querySelectorAll("[data-section-link]").forEach(link => {
    link.classList.toggle("active", link.dataset.sectionLink === currentSection);
  });
}

function renderHeroStats() {
  const champion = derived.champion;
  const openGroupMatches = Object.values(state.groupMatches).filter(match => match.home === "" || match.away === "").length;
  const openKnockoutMatches = Object.values(state.knockoutMatches).filter(match => !match.winner).length;
  const advancingThirds = derived.rankedThirds.slice(0, 8);

  document.getElementById("heroStats").innerHTML = [
    { label: "Projected champion", value: champion === "TBD" ? "Open" : champion },
    { label: "Best third-place set", value: advancingThirds.map(row => row.group).join(" ") || "-" },
    { label: "Open group matches", value: openGroupMatches },
    { label: "Open knockout picks", value: openKnockoutMatches },
  ].map(item => `<div class="hero-stat"><span class="mini-kicker">${item.label}</span><strong>${item.value}</strong></div>`).join("");
}

function renderGroupPager() {
  document.getElementById("groupPager").innerHTML = Object.keys(GROUPS)
    .map(group => `<button class="group-tab ${group === state.activeGroup ? "active" : ""}" data-group="${group}">${group}</button>`)
    .join("");

  document.getElementById("groupPager").onclick = event => {
    const button = event.target.closest("[data-group]");
    if (!button) return;
    state.activeGroup = button.dataset.group;
    recomputeAndRender();
  };
}

function computeTournament() {
  const groupTables = {};
  const seeds = {};
  const thirds = [];

  Object.keys(GROUPS).forEach(group => {
    const table = computeGroupTable(group);
    groupTables[group] = table;
    table.forEach((row, index) => {
      seeds[`${group}${index + 1}`] = row.team;
    });
    thirds.push({ ...table[2], group });
  });

  const rankedThirds = rankThirds(thirds).map((row, index) => ({ ...row, rank: index + 1 }));
  rankedThirds.slice(0, 8).forEach(row => {
    seeds[`3${row.group}`] = row.team;
  });

  const qualifiedGroupsKey = rankedThirds.slice(0, 8).map(row => row.group).sort().join("");
  const thirdAssignments = state.thirdMap[qualifiedGroupsKey] || {};
  const matches = buildKnockoutMatches(seeds, thirdAssignments);

  return {
    groupTables,
    seeds,
    rankedThirds,
    thirdAssignments,
    qualifiedGroupsKey,
    matches,
    champion: getMatchWinner(matches.F[0]),
  };
}

function computeGroupTable(group) {
  const rows = Object.fromEntries(GROUPS[group].map(team => [team, { team, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, fair: 0, opponents: {} }]));

  GROUP_FIXTURES[group].forEach((fixture, index) => {
    const played = state.groupMatches[`${group}-${index}`];
    if (!isScoreReady(played.home) || !isScoreReady(played.away)) return;

    const [homeTeam, awayTeam] = fixture;
    const homeGoals = Number(played.home);
    const awayGoals = Number(played.away);
    const home = rows[homeTeam];
    const away = rows[awayTeam];

    home.gf += homeGoals;
    home.ga += awayGoals;
    away.gf += awayGoals;
    away.ga += homeGoals;
    home.gd = home.gf - home.ga;
    away.gd = away.gf - away.ga;

    home.opponents[awayTeam] = { pts: homeGoals > awayGoals ? 3 : homeGoals === awayGoals ? 1 : 0, gd: homeGoals - awayGoals, gf: homeGoals };
    away.opponents[homeTeam] = { pts: awayGoals > homeGoals ? 3 : homeGoals === awayGoals ? 1 : 0, gd: awayGoals - homeGoals, gf: awayGoals };

    if (homeGoals > awayGoals) {
      home.pts += 3;
      home.w += 1;
      away.l += 1;
    } else if (awayGoals > homeGoals) {
      away.pts += 3;
      away.w += 1;
      home.l += 1;
    } else {
      home.pts += 1;
      away.pts += 1;
      home.d += 1;
      away.d += 1;
    }
  });

  return rankRows(Object.values(rows));
}

function rankRows(rows) {
  const base = [...rows].sort((a, b) => b.pts - a.pts);
  const ranked = [];
  for (let index = 0; index < base.length;) {
    let cursor = index + 1;
    while (cursor < base.length && base[cursor].pts === base[index].pts) cursor += 1;
    ranked.push(...rankTiedRows(base.slice(index, cursor)));
    index = cursor;
  }
  return ranked;
}

function rankTiedRows(rows) {
  if (rows.length === 1) return rows;

  const names = rows.map(row => row.team);
  const withHead = rows.map(row => {
    const head = names.filter(name => name !== row.team).reduce((acc, opponent) => {
      const value = row.opponents[opponent] || { pts: 0, gd: 0, gf: 0 };
      acc.pts += value.pts;
      acc.gd += value.gd;
      acc.gf += value.gf;
      return acc;
    }, { pts: 0, gd: 0, gf: 0 });
    return { ...row, head };
  }).sort((a, b) => compareHead(a, b) || fallbackSort(a, b));

  const resolved = [];
  for (let index = 0; index < withHead.length;) {
    let cursor = index + 1;
    while (cursor < withHead.length && compareHead(withHead[index], withHead[cursor]) === 0) cursor += 1;

    if (cursor - index > 1 && cursor - index < rows.length) {
      resolved.push(...rankTiedRows(withHead.slice(index, cursor).map(({ head, ...rest }) => rest)));
    } else {
      resolved.push(...withHead.slice(index, cursor).sort(fallbackSort).map(({ head, ...rest }) => rest));
    }

    index = cursor;
  }

  return resolved;
}

function compareHead(a, b) {
  return (b.head.pts - a.head.pts) || (b.head.gd - a.head.gd) || (b.head.gf - a.head.gf);
}

function fallbackSort(a, b) {
  return (b.gd - a.gd) || (b.gf - a.gf) || (a.fair - b.fair) || ((FIFA_RANKING[a.team] || 999) - (FIFA_RANKING[b.team] || 999));
}

function rankThirds(rows) {
  return [...rows].sort(fallbackSort);
}

function buildKnockoutMatches(seeds, thirdAssignments) {
  const rounds = { R32: [], R16: [], QF: [], SF: [], F: [] };
  R32_TEMPLATE.forEach(template => rounds.R32.push(resolveKnockoutMatch(template, seeds, thirdAssignments)));
  makeRound("R16").forEach((match, index) => rounds.R16.push(resolveNextMatch(match.id, NEXT_ROUNDS.R16[index], rounds)));
  makeRound("QF").forEach((match, index) => rounds.QF.push(resolveNextMatch(match.id, NEXT_ROUNDS.QF[index], rounds)));
  makeRound("SF").forEach((match, index) => rounds.SF.push(resolveNextMatch(match.id, NEXT_ROUNDS.SF[index], rounds)));
  makeRound("F").forEach((match, index) => rounds.F.push(resolveNextMatch(match.id, NEXT_ROUNDS.F[index], rounds)));
  return rounds;
}

function ensureKnockoutState(id) {
  if (!state.knockoutMatches[id]) state.knockoutMatches[id] = { home: "", away: "", winner: "" };
  return state.knockoutMatches[id];
}

function resolveKnockoutMatch(match, seeds, thirdAssignments) {
  const editable = ensureKnockoutState(match.id);
  const homeTeam = resolveSeed(match.home, seeds, thirdAssignments);
  const awayTeam = resolveSeed(match.away, seeds, thirdAssignments);
  const winner = sanitizeWinner(editable.winner, homeTeam, awayTeam);
  state.knockoutMatches[match.id].winner = winner;
  return { ...match, homeTeam, awayTeam, home: sanitizeScore(editable.home), away: sanitizeScore(editable.away), winner };
}

function resolveNextMatch(id, pair, rounds) {
  const editable = ensureKnockoutState(id);
  const homeTeam = getMatchWinner(findMatch(pair[0], rounds));
  const awayTeam = getMatchWinner(findMatch(pair[1], rounds));
  const winner = sanitizeWinner(editable.winner, homeTeam, awayTeam);
  state.knockoutMatches[id].winner = winner;
  return { id, pair, homeTeam, awayTeam, home: sanitizeScore(editable.home), away: sanitizeScore(editable.away), winner };
}

function resolveSeed(seed, seeds, thirdAssignments) {
  if (!seed) return "TBD";
  if (seed.startsWith("TP:")) {
    const slotSeed = thirdAssignments[seed.split(":")[1]];
    return seeds[slotSeed] || "TBD";
  }
  return seeds[seed] || "TBD";
}

function findMatch(id, rounds) {
  return Object.values(rounds).flat().find(match => match.id === id);
}

function getMatchWinner(match) {
  if (!match) return "TBD";
  if (!match.homeTeam || !match.awayTeam || match.homeTeam === "TBD" || match.awayTeam === "TBD") return "TBD";
  if (!match.winner || ![match.homeTeam, match.awayTeam].includes(match.winner)) return "TBD";
  return match.winner;
}

function renderGroups() {
  const container = document.getElementById("groupsContainer");
  container.innerHTML = Object.keys(GROUPS).map(group => {
    const table = derived.groupTables[group];
    return `
      <article class="group-card ${group === state.activeGroup ? "active" : ""}">
        <div class="market-meta-row">
          <div>
            <span class="brand-pill">Group ${group}</span>
            <span class="match-meta">Top 2 avançam automaticamente, o 3º entra na disputa dos melhores terceiros.</span>
          </div>
        </div>
        <div class="group-layout">
          <div class="group-match-card">
            <div class="card-head">
              <p class="mini-kicker">Fixtures</p>
              <h3>Matchday inputs</h3>
            </div>
            <div class="match-list">
              ${GROUP_FIXTURES[group].map((fixture, index) => renderGroupMatch(group, index, fixture)).join("")}
            </div>
          </div>
          <div class="group-table-card">
            <div class="card-head">
              <p class="mini-kicker">Table</p>
              <h3>Live standings</h3>
            </div>
            <div class="table-header">
              <div>Team</div><div>Pts</div><div>W</div><div>D</div><div>L</div><div>GF</div><div>GA</div><div>GD</div>
            </div>
            <div class="table-body">
              ${table.map((row, index) => `
                <div class="table-row ${index < 2 ? "qualify" : ""} ${index === 2 ? "third-live" : ""}">
                  <div class="team-row">${renderFlag(row.team)}<span>${index + 1}. ${row.team}</span></div>
                  <div>${row.pts}</div>
                  <div>${row.w}</div>
                  <div>${row.d}</div>
                  <div>${row.l}</div>
                  <div>${row.gf}</div>
                  <div>${row.ga}</div>
                  <div>${row.gd}</div>
                </div>`).join("")}
            </div>
          </div>
        </div>
      </article>`;
  }).join("");

  container.querySelectorAll("[data-match][data-side]").forEach(input => {
    input.addEventListener("input", event => updateScoreState(state.groupMatches, event.target.dataset.match, event.target.dataset.side, event.target.value));
  });
}

function renderGroupMatch(group, index, fixture) {
  const matchId = `${group}-${index}`;
  const value = state.groupMatches[matchId];
  return `
    <div class="match-row">
      <div class="team-stack">
        <div class="team-row">${renderFlag(fixture[0])}<span class="team-name">${fixture[0]}</span></div>
        <div class="team-row">${renderFlag(fixture[1])}<span class="team-name team-sub">${fixture[1]}</span></div>
      </div>
      <div class="score-box">
        <input class="score-input" type="number" min="0" step="1" inputmode="numeric" data-match="${matchId}" data-side="home" value="${value.home}" aria-label="${fixture[0]} goals">
        <span class="score-x">x</span>
        <input class="score-input" type="number" min="0" step="1" inputmode="numeric" data-match="${matchId}" data-side="away" value="${value.away}" aria-label="${fixture[1]} goals">
      </div>
    </div>`;
}

function renderQualifiers() {
  const topThirds = derived.rankedThirds.slice(0, 8);
  document.getElementById("qualifiersContainer").innerHTML = `
    <div class="summary-grid">
      <div class="summary-card">
        <div class="card-head"><p class="mini-kicker">Seeds</p><h3>Qualified teams</h3></div>
        ${Object.keys(GROUPS).map(group => {
          const table = derived.groupTables[group];
          return `<div class="seed-row"><div>${group}</div><div>${table[0].team}<br><span class="small">Runner-up: ${table[1].team}</span></div><div class="small">Third: ${table[2].team}</div></div>`;
        }).join("")}
      </div>
      <div class="summary-card">
        <div class="card-head"><p class="mini-kicker">Ranking</p><h3>Third-place table</h3></div>
        <div class="third-board">
          ${derived.rankedThirds.map((row, index) => `
            <div class="seed-row ${index < 8 ? "live" : ""}">
              <div>${index + 1}</div>
              <div>${row.team} <span class="small">Group ${row.group}</span></div>
              <div class="small">${row.pts} pts · GD ${row.gd} · GF ${row.gf}</div>
            </div>`).join("")}
        </div>
      </div>
      <div class="summary-card">
        <div class="card-head"><p class="mini-kicker">Routing</p><h3>Official third-place map</h3></div>
        <p class="inline-note">Qualified third-place groups: <strong>${derived.qualifiedGroupsKey ? derived.qualifiedGroupsKey.split("").join(", ") : "Awaiting data"}</strong></p>
        <div class="third-board" style="margin-top:12px;">
          ${Object.entries(derived.thirdAssignments).length
            ? Object.entries(derived.thirdAssignments).map(([slot, seed]) => `<div class="seed-row"><div>${slot}</div><div>${derived.seeds[seed]}</div><div class="small">${seed}</div></div>`).join("")
            : `<p class="muted">No official combination found yet. Complete more results to lock the bracket.</p>`}
        </div>
        <div class="inline-note" style="margin-top:12px;">Advancing thirds: ${topThirds.map(row => `${row.team} (${row.group})`).join(" · ")}</div>
      </div>
    </div>`;
}

function renderKnockout() {
  document.getElementById("knockoutControls").innerHTML = `
    <div class="knockout-controls-grid">
      ${["R32", "R16", "QF", "SF", "F"].flatMap(round => derived.matches[round]).map(renderKnockoutMatch).join("")}
    </div>`;

  document.querySelectorAll("#knockoutControls [data-match][data-side]").forEach(input => {
    input.addEventListener("input", event => updateScoreState(state.knockoutMatches, event.target.dataset.match, event.target.dataset.side, event.target.value, true));
  });

  document.querySelectorAll("#knockoutControls [data-winner]").forEach(button => {
    button.addEventListener("click", event => {
      const { match, winner } = event.currentTarget.dataset;
      state.knockoutMatches[match].winner = winner;
      recomputeAndRender();
    });
  });

  drawBracketCanvas();
}

function renderKnockoutMatch(match) {
  const lockedWinner = getMatchWinner(match);
  const teamsKnown = match.homeTeam !== "TBD" && match.awayTeam !== "TBD";
  const tie = isScoreReady(match.home) && isScoreReady(match.away) && Number(match.home) === Number(match.away);
  const winnerText = lockedWinner === "TBD" ? (teamsKnown ? "Escolha o classificado em caso de empate, ou coloque um placar vencedor." : "Aguardando rodada anterior.") : `Classificado: ${lockedWinner}`;

  return `
    <div class="knockout-control-card ${lockedWinner !== "TBD" ? "winner-locked" : ""}">
      <div class="card-head">
        <p class="mini-kicker">${match.id}</p>
        <h3>${match.label || "Knockout"}</h3>
      </div>
      <div class="team-stack ${teamsKnown ? "" : "is-disabled"}">
        <div class="team-row">${renderFlag(match.homeTeam)}<span class="team-name">${match.homeTeam}</span></div>
        <div class="team-row">${renderFlag(match.awayTeam)}<span class="team-name team-sub">${match.awayTeam}</span></div>
      </div>
      <div class="score-box" style="margin-top:12px;">
        <input class="score-input" type="number" min="0" step="1" inputmode="numeric" data-match="${match.id}" data-side="home" value="${match.home}" ${teamsKnown ? "" : "disabled"} aria-label="${match.homeTeam} goals">
        <span class="score-x">x</span>
        <input class="score-input" type="number" min="0" step="1" inputmode="numeric" data-match="${match.id}" data-side="away" value="${match.away}" ${teamsKnown ? "" : "disabled"} aria-label="${match.awayTeam} goals">
      </div>
      ${tie && teamsKnown ? `
        <div class="winner-picker">
          <button class="winner-chip ${match.winner === match.homeTeam ? "active" : ""}" data-match="${match.id}" data-winner="${match.homeTeam}">${match.homeTeam}</button>
          <button class="winner-chip ${match.winner === match.awayTeam ? "active" : ""}" data-match="${match.id}" data-winner="${match.awayTeam}">${match.awayTeam}</button>
        </div>` : ""}
      <p class="canvas-note" style="margin-top:10px;">${winnerText}</p>
    </div>`;
}

function renderChampion() {
  const champion = derived.champion;
  const final = derived.matches.F[0];
  const path = [];

  if (champion !== "TBD") {
    ["R32", "R16", "QF", "SF", "F"].forEach(round => {
      const match = derived.matches[round].find(item => getMatchWinner(item) === champion);
      if (match) path.push(`${match.id}: ${match.homeTeam} ${displayScore(match.home)} x ${displayScore(match.away)} ${match.awayTeam}`);
    });
  }

  document.getElementById("championContainer").innerHTML = `
    <div class="champion-card">
      <div class="champion-top">
        <div>
          <p class="section-kicker">Projected outcome</p>
          <h2>${champion === "TBD" ? "Market still open" : champion}</h2>
          <p class="muted">${champion === "TBD" ? "Complete the knockout picks to close the bracket." : `Final: ${final.homeTeam} ${displayScore(final.home)} x ${displayScore(final.away)} ${final.awayTeam}`}</p>
        </div>
        <div class="champion-mark">🏆</div>
      </div>
      ${path.length ? `<ul class="path-list">${path.map(item => `<li>${item}</li>`).join("")}</ul>` : `<div class="inline-note">No completed champion path yet.</div>`}
    </div>`;
}

function updateScoreState(target, matchId, side, rawValue, knockout = false) {
  target[matchId][side] = sanitizeScore(rawValue);
  if (knockout) {
    const match = target[matchId];
    if (!isScoreReady(match.home) || !isScoreReady(match.away)) {
      match.winner = "";
    } else if (Number(match.home) > Number(match.away)) {
      match.winner = derived?.matches ? findCurrentTeam(matchId, true) : match.winner;
    } else if (Number(match.away) > Number(match.home)) {
      match.winner = derived?.matches ? findCurrentTeam(matchId, false) : match.winner;
    }
  }
  recomputeAndRender();
}

function findCurrentTeam(matchId, home) {
  const match = ["R32", "R16", "QF", "SF", "F"].flatMap(round => derived?.matches?.[round] || []).find(item => item.id === matchId);
  return home ? match?.homeTeam || "" : match?.awayTeam || "";
}

function sanitizeScore(value) {
  if (value === "" || value == null) return "";
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  return String(Math.max(0, Math.floor(number)));
}

function sanitizeWinner(value, homeTeam, awayTeam) {
  if (value === homeTeam || value === awayTeam) return value;
  if (homeTeam === "TBD" || awayTeam === "TBD") return "";
  return "";
}

function isScoreReady(value) {
  return value !== "" && value != null && Number.isFinite(Number(value));
}

function displayScore(value) {
  return value === "" ? "-" : value;
}

function renderFlag(team) {
  if (!team || team === "TBD") return `<span class="flag" aria-hidden="true"></span>`;
  const code = TEAM_FLAG_CODES[team];
  if (!code) return `<span class="flag" aria-hidden="true"></span>`;
  return `<img class="flag" src="https://flagcdn.com/${code}.svg" alt="${team} flag" loading="lazy">`;
}

function drawBracketCanvas() {
  const canvas = document.getElementById("bracketCanvas");
  if (!canvas) return;
  const ratio = window.devicePixelRatio || 1;
  const cssWidth = 1400;
  const cssHeight = 900;
  canvas.width = cssWidth * ratio;
  canvas.height = cssHeight * ratio;
  const ctx = canvas.getContext("2d");
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);

  const rounds = [
    { key: "R32", title: "Round of 32" },
    { key: "R16", title: "Round of 16" },
    { key: "QF", title: "Quarterfinals" },
    { key: "SF", title: "Semifinals" },
    { key: "F", title: "Final" },
  ];

  const cardW = 220;
  const cardH = 56;
  const colGap = 58;
  const startX = 30;
  const topMap = {
    R32: 24,
    R16: 52,
    QF: 108,
    SF: 220,
    F: 388,
  };
  const stepMap = {
    R32: 54,
    R16: 108,
    QF: 216,
    SF: 432,
    F: 0,
  };

  const positions = {};

  ctx.font = "700 13px Inter, sans-serif";
  ctx.fillStyle = "#64748b";
  rounds.forEach((round, colIndex) => {
    const x = startX + colIndex * (cardW + colGap);
    ctx.fillText(round.title, x, 18);
    derived.matches[round.key].forEach((match, index) => {
      const y = topMap[round.key] + index * (cardH + stepMap[round.key]);
      positions[match.id] = { x, y, cx: x + cardW, cy: y + cardH / 2 };
      drawMatchCard(ctx, x, y, cardW, cardH, match, getMatchWinner(match) !== "TBD");
    });
  });

  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 2;
  Object.entries(NEXT_ROUNDS).forEach(([round, pairs]) => {
    pairs.forEach((pair, index) => {
      const target = positions[`${round}-${index + 1}`];
      const a = positions[pair[0]];
      const b = positions[pair[1]];
      if (!target || !a || !b) return;
      const midX = target.x - 28;
      ctx.beginPath();
      ctx.moveTo(a.cx, a.cy);
      ctx.lineTo(midX, a.cy);
      ctx.lineTo(midX, target.cy);
      ctx.lineTo(target.x, target.cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(b.cx, b.cy);
      ctx.lineTo(midX, b.cy);
      ctx.lineTo(midX, target.cy);
      ctx.lineTo(target.x, target.cy);
      ctx.stroke();
    });
  });
}

function drawMatchCard(ctx, x, y, w, h, match, locked) {
  const radius = 12;
  ctx.fillStyle = locked ? "#f0fdf4" : "#ffffff";
  ctx.strokeStyle = locked ? "#86efac" : "#dbe2ea";
  ctx.lineWidth = 1.5;
  roundedRect(ctx, x, y, w, h, radius);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#0f172a";
  ctx.font = "700 12px Inter, sans-serif";
  ctx.fillText(match.homeTeam || "TBD", x + 12, y + 22);
  ctx.fillText(match.awayTeam || "TBD", x + 12, y + 42);

  ctx.fillStyle = "#64748b";
  ctx.font = "700 11px Inter, sans-serif";
  ctx.fillText(`${displayScore(match.home)} x ${displayScore(match.away)}`, x + w - 48, y + 32);
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

window.addEventListener("resize", () => {
  if (derived) drawBracketCanvas();
});

init();
