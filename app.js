const TEAM_FLAG_CODES = {
  Mexico: "mx", "South Africa": "za", "South Korea": "kr", Czechia: "cz", Canada: "ca", "Bosnia and Herzegovina": "ba", Qatar: "qa", Switzerland: "ch", Brazil: "br", Morocco: "ma", Haiti: "ht", Scotland: "gb-sct", USA: "us", Paraguay: "py", Australia: "au", "Türkiye": "tr", Germany: "de", "Curaçao": "cw", "Ivory Coast": "ci", Ecuador: "ec", Netherlands: "nl", Japan: "jp", Sweden: "se", Tunisia: "tn", Belgium: "be", Egypt: "eg", Iran: "ir", "New Zealand": "nz", Spain: "es", "Cape Verde": "cv", "Saudi Arabia": "sa", Uruguay: "uy", France: "fr", Senegal: "sn", Iraq: "iq", Norway: "no", Argentina: "ar", Algeria: "dz", Austria: "at", Jordan: "jo", Portugal: "pt", "DR Congo": "cd", Uzbekistan: "uz", Colombia: "co", England: "gb-eng", Croatia: "hr", Ghana: "gh", Panama: "pa"
};

const TEAM_LABELS = {
  Mexico: "México", "South Africa": "África do Sul", "South Korea": "República da Coreia", Czechia: "República Tcheca", Canada: "Canadá", "Bosnia and Herzegovina": "Bósnia e Herzegovina", Qatar: "Catar", Switzerland: "Suíça", Brazil: "Brasil", Morocco: "Marrocos", Haiti: "Haiti", Scotland: "Escócia", USA: "Estados Unidos", Paraguay: "Paraguai", Australia: "Austrália", "Türkiye": "Turquia", Germany: "Alemanha", "Curaçao": "Curaçau", "Ivory Coast": "Costa do Marfim", Ecuador: "Equador", Netherlands: "Holanda", Japan: "Japão", Sweden: "Suécia", Tunisia: "Tunísia", Belgium: "Bélgica", Egypt: "Egito", Iran: "Irã", "New Zealand": "Nova Zelândia", Spain: "Espanha", "Cape Verde": "Cabo Verde", "Saudi Arabia": "Arábia Saudita", Uruguay: "Uruguai", France: "França", Senegal: "Senegal", Iraq: "Iraque", Norway: "Noruega", Argentina: "Argentina", Algeria: "Argélia", Austria: "Áustria", Jordan: "Jordânia", Portugal: "Portugal", "DR Congo": "República Democrática do Congo", Uzbekistan: "Uzbequistão", Colombia: "Colômbia", England: "Inglaterra", Croatia: "Croácia", Ghana: "Gana", Panama: "Panamá"
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
  L: ["England", "Croatia", "Ghana", "Panama"]
};

const FIFA_RANKING = { Argentina:1, Spain:2, France:3, England:4, Brazil:5, Portugal:6, Netherlands:7, Belgium:8, Germany:9, Croatia:10, Morocco:11, Colombia:12, Uruguay:13, Switzerland:14, Japan:15, Senegal:16, Iran:17, "South Korea":18, Ecuador:19, Austria:20, Australia:21, Panama:22, Norway:23, Egypt:24, Algeria:25, Scotland:26, Paraguay:27, "Ivory Coast":28, Tunisia:29, Uzbekistan:30, Qatar:31, "Saudi Arabia":32, "South Africa":33, Jordan:34, "Cape Verde":35, Ghana:36, "Curaçao":37, Haiti:38, "New Zealand":39, Mexico:40, Canada:41, USA:42, Czechia:43, "Bosnia and Herzegovina":44, Türkiye:45, Iraq:46, "DR Congo":47 };

const R32_TEMPLATE = [
  { id:"R32-1", label:"32-avos 1", home:"A2", away:"B2" },
  { id:"R32-2", label:"32-avos 2", home:"C1", away:"F2" },
  { id:"R32-3", label:"32-avos 3", home:"E1", away:"TP:E1" },
  { id:"R32-4", label:"32-avos 4", home:"F1", away:"C2" },
  { id:"R32-5", label:"32-avos 5", home:"E2", away:"I2" },
  { id:"R32-6", label:"32-avos 6", home:"I1", away:"TP:I1" },
  { id:"R32-7", label:"32-avos 7", home:"A1", away:"TP:A1" },
  { id:"R32-8", label:"32-avos 8", home:"L1", away:"TP:L1" },
  { id:"R32-9", label:"32-avos 9", home:"G1", away:"TP:G1" },
  { id:"R32-10", label:"32-avos 10", home:"D1", away:"TP:D1" },
  { id:"R32-11", label:"32-avos 11", home:"H1", away:"J2" },
  { id:"R32-12", label:"32-avos 12", home:"K2", away:"L2" },
  { id:"R32-13", label:"32-avos 13", home:"B1", away:"TP:B1" },
  { id:"R32-14", label:"32-avos 14", home:"D2", away:"G2" },
  { id:"R32-15", label:"32-avos 15", home:"J1", away:"H2" },
  { id:"R32-16", label:"32-avos 16", home:"K1", away:"TP:K1" }
];

const NEXT_ROUNDS = {
  R16:[ ["R32-1","R32-2"], ["R32-3","R32-4"], ["R32-5","R32-6"], ["R32-7","R32-8"], ["R32-9","R32-10"], ["R32-11","R32-12"], ["R32-13","R32-14"], ["R32-15","R32-16"] ],
  QF:[ ["R16-1","R16-2"], ["R16-3","R16-4"], ["R16-5","R16-6"], ["R16-7","R16-8"] ],
  SF:[ ["QF-1","QF-2"], ["QF-3","QF-4"] ],
  F:[ ["SF-1","SF-2"] ]
};

const NAV_STEPS = [
  { id: "groupsSection", label: "Grupos" },
  { id: "qualifiersSection", label: "Classificados" },
  { id: "knockoutSection", label: "Bracket" },
  { id: "championSection", label: "Campeão" }
];

let SCHEDULE = [];
const state = { scores: {}, knockoutMatches: {}, activeGroup: "A", thirdMap: {} };
let derived = null;

async function init() {
  await Promise.all([loadSchedule(), loadThirdMap()]);
  buildDefaultState();
  restoreState();
  renderNav();
  bindTopActions();
  window.addEventListener("hashchange", renderNavActive);
  recomputeAndRender();
}

async function loadSchedule() {
  const response = await fetch("group-schedule.json", { cache: "no-store" });
  SCHEDULE = await response.json();
}

async function loadThirdMap() {
  const response = await fetch("third-place-map.json", { cache: "no-store" });
  state.thirdMap = await response.json();
}

function buildDefaultState() {
  SCHEDULE.forEach(match => {
    const id = getMatchId(match);
    if (!state.scores[id]) state.scores[id] = { home: "", away: "" };
  });
  const all = [...R32_TEMPLATE, ...makeRound("R16"), ...makeRound("QF"), ...makeRound("SF"), ...makeRound("F")];
  all.forEach(match => {
    if (!state.knockoutMatches[match.id]) state.knockoutMatches[match.id] = { home: "", away: "", winner: "" };
  });
}

function makeRound(code) {
  return NEXT_ROUNDS[code].map((pair, index) => ({ id: `${code}-${index + 1}`, pair, label: `${labelRound(code)} ${index + 1}` }));
}

function labelRound(code) {
  return ({ R16: "Oitavas", QF: "Quartas", SF: "Semifinal", F: "Final" })[code] || code;
}

function restoreState() {
  const payload = location.hash.startsWith("#s=") ? location.hash.slice(3) : localStorage.getItem("wc26-state");
  if (!payload) return;
  try {
    const decoded = JSON.parse(decodeURIComponent(escape(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))));
    Object.assign(state.scores, decoded.scores || {});
    Object.assign(state.knockoutMatches, decoded.knockoutMatches || {});
    if (GROUPS[decoded.activeGroup]) state.activeGroup = decoded.activeGroup;
  } catch {}
}

function persistState() {
  const raw = JSON.stringify({ scores: state.scores, knockoutMatches: state.knockoutMatches, activeGroup: state.activeGroup });
  const payload = btoa(unescape(encodeURIComponent(raw))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  history.replaceState(null, "", `${location.pathname}${location.search}#s=${payload}`);
  localStorage.setItem("wc26-state", payload);
  return `${location.origin}${location.pathname}${location.search}#s=${payload}`;
}

function renderNav() {
  document.getElementById("stepNav").innerHTML = NAV_STEPS.map(step => `<a class="nav-link" href="#${step.id}" data-section-link="${step.id}">${step.label}</a>`).join("");
  renderNavActive();
}

function renderNavActive() {
  const current = location.hash.replace(/^#/, "") || "groupsSection";
  document.querySelectorAll("[data-section-link]").forEach(link => link.classList.toggle("active", link.dataset.sectionLink === current));
}

function bindTopActions() {
  document.getElementById("copyBtn").addEventListener("click", async () => {
    await navigator.clipboard.writeText(persistState());
    setStatus("Link copiado.");
  });
  document.getElementById("shareBtn").addEventListener("click", async () => {
    const url = persistState();
    if (navigator.share) {
      try { await navigator.share({ title: "Simulador Copa 2026", url }); setStatus("Compartilhado."); return; } catch {}
    }
    await navigator.clipboard.writeText(url);
    setStatus("Link copiado.");
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    localStorage.removeItem("wc26-state");
    location.href = location.pathname;
  });
}

function setStatus(text) { document.getElementById("shareStatus").textContent = text; }

function recomputeAndRender() {
  derived = computeTournament();
  persistState();
  renderHeroStats();
  renderGroupPager();
  renderGroups();
  renderQualifiers();
  renderKnockout();
  renderChampion();
}

function renderHeroStats() {
  const openGroupMatches = Object.values(state.scores).filter(match => match.home === "" || match.away === "").length;
  const openKnockoutMatches = Object.values(state.knockoutMatches).filter(match => !match.winner).length;
  const advancingThirds = derived.rankedThirds.slice(0, 8);
  document.getElementById("heroStats").innerHTML = [
    { label: "Campeão projetado", value: derived.champion === "TBD" ? "Aberto" : label(derived.champion) },
    { label: "Melhores terceiros", value: advancingThirds.map(row => row.group).join(" ") || "-" },
    { label: "Jogos de grupos abertos", value: openGroupMatches },
    { label: "Confrontos mata-mata abertos", value: openKnockoutMatches }
  ].map(item => `<div class="hero-stat"><span class="mini-kicker">${item.label}</span><strong>${item.value}</strong></div>`).join("");
}

function renderGroupPager() {
  document.getElementById("groupPager").innerHTML = Object.keys(GROUPS).map(group => `<button class="group-tab ${group === state.activeGroup ? "active" : ""}" data-group="${group}">Grupo ${group}</button>`).join("");
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
    table.forEach((row, index) => { seeds[`${group}${index + 1}`] = row.team; });
    thirds.push({ ...table[2], group });
  });
  const rankedThirds = [...thirds].sort(fallbackSort).map((row, index) => ({ ...row, rank: index + 1 }));
  rankedThirds.slice(0, 8).forEach(row => { seeds[`3${row.group}`] = row.team; });
  const qualifiedGroupsKey = rankedThirds.slice(0, 8).map(row => row.group).sort().join("");
  const thirdAssignments = state.thirdMap[qualifiedGroupsKey] || {};
  const matches = buildKnockoutMatches(seeds, thirdAssignments);
  return { groupTables, seeds, rankedThirds, thirdAssignments, qualifiedGroupsKey, matches, champion: getMatchWinner(matches.F[0]) };
}

function computeGroupTable(group) {
  const rows = Object.fromEntries(GROUPS[group].map(team => [team, { team, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, fair: 0, opponents: {} }]));
  SCHEDULE.filter(match => match.group === group).forEach(match => {
    const played = state.scores[getMatchId(match)];
    if (!isReady(played.home) || !isReady(played.away)) return;
    const homeGoals = Number(played.home), awayGoals = Number(played.away);
    const home = rows[match.homeKey], away = rows[match.awayKey];
    home.gf += homeGoals; home.ga += awayGoals; away.gf += awayGoals; away.ga += homeGoals;
    home.gd = home.gf - home.ga; away.gd = away.gf - away.ga;
    home.opponents[match.awayKey] = { pts: homeGoals > awayGoals ? 3 : homeGoals === awayGoals ? 1 : 0, gd: homeGoals - awayGoals, gf: homeGoals };
    away.opponents[match.homeKey] = { pts: awayGoals > homeGoals ? 3 : homeGoals === awayGoals ? 1 : 0, gd: awayGoals - homeGoals, gf: awayGoals };
    if (homeGoals > awayGoals) { home.pts += 3; home.w++; away.l++; }
    else if (awayGoals > homeGoals) { away.pts += 3; away.w++; home.l++; }
    else { home.pts++; away.pts++; home.d++; away.d++; }
  });
  return rankRows(Object.values(rows));
}

function rankRows(rows) {
  const base = [...rows].sort((a, b) => b.pts - a.pts);
  const ranked = [];
  for (let i = 0; i < base.length;) {
    let j = i + 1;
    while (j < base.length && base[j].pts === base[i].pts) j++;
    ranked.push(...rankTiedRows(base.slice(i, j)));
    i = j;
  }
  return ranked;
}

function rankTiedRows(rows) {
  if (rows.length === 1) return rows;
  const names = rows.map(row => row.team);
  const withHead = rows.map(row => {
    const head = names.filter(name => name !== row.team).reduce((acc, opponent) => {
      const value = row.opponents[opponent] || { pts: 0, gd: 0, gf: 0 };
      acc.pts += value.pts; acc.gd += value.gd; acc.gf += value.gf; return acc;
    }, { pts: 0, gd: 0, gf: 0 });
    return { ...row, head };
  }).sort((a, b) => compareHead(a, b) || fallbackSort(a, b));
  return withHead.map(({ head, ...rest }) => rest);
}

function compareHead(a, b) { return (b.head.pts - a.head.pts) || (b.head.gd - a.head.gd) || (b.head.gf - a.head.gf); }
function fallbackSort(a, b) { return (b.pts - a.pts) || (b.gd - a.gd) || (b.gf - a.gf) || (a.fair - b.fair) || ((FIFA_RANKING[a.team] || 999) - (FIFA_RANKING[b.team] || 999)); }

function buildKnockoutMatches(seeds, thirdAssignments) {
  const rounds = { R32: [], R16: [], QF: [], SF: [], F: [] };
  R32_TEMPLATE.forEach(template => rounds.R32.push(resolveKnockoutMatch(template, seeds, thirdAssignments)));
  makeRound("R16").forEach((match, index) => rounds.R16.push(resolveNextMatch(match.id, NEXT_ROUNDS.R16[index], rounds)));
  makeRound("QF").forEach((match, index) => rounds.QF.push(resolveNextMatch(match.id, NEXT_ROUNDS.QF[index], rounds)));
  makeRound("SF").forEach((match, index) => rounds.SF.push(resolveNextMatch(match.id, NEXT_ROUNDS.SF[index], rounds)));
  makeRound("F").forEach((match, index) => rounds.F.push(resolveNextMatch(match.id, NEXT_ROUNDS.F[index], rounds)));
  return rounds;
}

function resolveKnockoutMatch(match, seeds, thirdAssignments) {
  const editable = state.knockoutMatches[match.id] || { home: "", away: "", winner: "" };
  const homeTeam = resolveSeed(match.home, seeds, thirdAssignments);
  const awayTeam = resolveSeed(match.away, seeds, thirdAssignments);
  const winner = sanitizeWinner(editable.winner, homeTeam, awayTeam);
  state.knockoutMatches[match.id] = { ...editable, winner };
  return { ...match, homeTeam, awayTeam, home: sanitizeScore(editable.home), away: sanitizeScore(editable.away), winner };
}

function resolveNextMatch(id, pair, rounds) {
  const editable = state.knockoutMatches[id] || { home: "", away: "", winner: "" };
  const homeTeam = getMatchWinner(findMatch(pair[0], rounds));
  const awayTeam = getMatchWinner(findMatch(pair[1], rounds));
  const winner = sanitizeWinner(editable.winner, homeTeam, awayTeam);
  state.knockoutMatches[id] = { ...editable, winner };
  return { id, pair, label: id, homeTeam, awayTeam, home: sanitizeScore(editable.home), away: sanitizeScore(editable.away), winner };
}

function resolveSeed(seed, seeds, thirdAssignments) {
  if (!seed) return "TBD";
  if (seed.startsWith("TP:")) {
    const slotSeed = thirdAssignments[seed.split(":")[1]];
    return seeds[slotSeed] || "TBD";
  }
  return seeds[seed] || "TBD";
}

function findMatch(id, rounds) { return Object.values(rounds).flat().find(match => match.id === id); }
function getMatchWinner(match) {
  if (!match || !match.homeTeam || !match.awayTeam || match.homeTeam === "TBD" || match.awayTeam === "TBD") return "TBD";
  if (!match.winner || ![match.homeTeam, match.awayTeam].includes(match.winner)) return "TBD";
  return match.winner;
}

function renderGroups() {
  const container = document.getElementById("groupsContainer");
  container.innerHTML = Object.keys(GROUPS).map(group => {
    const table = derived.groupTables[group];
    const matches = SCHEDULE.filter(match => match.group === group);
    return `
      <article class="group-card ${group === state.activeGroup ? "active" : ""}">
        <div class="group-layout">
          <div class="group-match-card">
            <div class="card-head"><p class="mini-kicker">Fixtures</p><h3>Matchday inputs</h3></div>
            <div class="match-list">${matches.map(renderGroupMatch).join("")}</div>
          </div>
          <div class="group-table-card">
            <div class="card-head"><p class="mini-kicker">Tabela</p><h3>Classificação ao vivo</h3></div>
            <div class="table-header"><div>Seleção</div><div>Pts</div><div>W</div><div>D</div><div>L</div><div>GF</div><div>GA</div><div>GD</div></div>
            <div class="table-body">${table.map((row, index) => `
              <div class="table-row ${index < 2 ? "qualify" : ""} ${index === 2 ? "third-live" : ""}">
                <div class="team-row">${renderFlag(row.team)}<span>${index + 1}. ${label(row.team)}</span></div>
                <div>${row.pts}</div><div>${row.w}</div><div>${row.d}</div><div>${row.l}</div><div>${row.gf}</div><div>${row.ga}</div><div>${row.gd}</div>
              </div>`).join("")}</div>
          </div>
        </div>
      </article>`;
  }).join("");
  document.querySelectorAll("#groupsContainer [data-match][data-side]").forEach(input => input.addEventListener("input", event => updateScoreState(state.scores, event.target.dataset.match, event.target.dataset.side, event.target.value)));
}

function renderGroupMatch(match) {
  const id = getMatchId(match);
  const value = state.scores[id];
  return `
    <article class="match-card-inline">
      <div class="match-topline"><span class="brand-pill">${match.round}</span><span class="seed-note">${match.date}</span></div>
      <div class="match-meta">${match.venue} · ${match.localTime} local · ${match.brasiliaTime} Brasília</div>
      <div class="match-row match-row-inline">
        <div class="team-inline">${renderFlag(match.homeKey)}<span class="team-name">${match.home}</span></div>
        <div class="score-box score-box-inline">
          <input class="score-input" type="number" min="0" step="1" inputmode="numeric" data-match="${id}" data-side="home" value="${value.home}" />
          <span class="score-x">x</span>
          <input class="score-input" type="number" min="0" step="1" inputmode="numeric" data-match="${id}" data-side="away" value="${value.away}" />
        </div>
        <div class="team-inline team-inline-away">${renderFlag(match.awayKey)}<span class="team-name team-sub">${match.away}</span></div>
      </div>
    </article>`;
}

function renderQualifiers() {
  const topThirds = derived.rankedThirds.slice(0, 8);
  document.getElementById("qualifiersContainer").innerHTML = `
    <div class="summary-grid">
      <div class="summary-card">
        <div class="card-head"><p class="mini-kicker">Seeds</p><h3>Classificados</h3></div>
        ${Object.keys(GROUPS).map(group => {
          const table = derived.groupTables[group];
          return `<div class="seed-row"><div>${group}</div><div>${label(table[0].team)}<br><span class="small">2º: ${label(table[1].team)}</span></div><div class="small">3º: ${label(table[2].team)}</div></div>`;
        }).join("")}
      </div>
      <div class="summary-card">
        <div class="card-head"><p class="mini-kicker">Ranking</p><h3>Melhores terceiros</h3></div>
        <div class="third-board">${derived.rankedThirds.map((row, index) => `<div class="seed-row ${index < 8 ? "live" : ""}"><div>${index + 1}</div><div>${label(row.team)} <span class="small">Grupo ${row.group}</span></div><div class="small">${row.pts} pts · GD ${row.gd} · GF ${row.gf}</div></div>`).join("")}</div>
      </div>
      <div class="summary-card">
        <div class="card-head"><p class="mini-kicker">Routing</p><h3>Mapa oficial FIFA</h3></div>
        <p class="inline-note">Grupos terceiros classificados: <strong>${derived.qualifiedGroupsKey ? derived.qualifiedGroupsKey.split("").join(", ") : "Aguardando"}</strong></p>
        <div class="third-board" style="margin-top:12px;">${Object.entries(derived.thirdAssignments).length ? Object.entries(derived.thirdAssignments).map(([slot, seed]) => `<div class="seed-row"><div>${slot}</div><div>${label(derived.seeds[seed])}</div><div class="small">${seed}</div></div>`).join("") : `<p class="muted">Complete mais resultados para travar o bracket.</p>`}</div>
        <div class="inline-note" style="margin-top:12px;">Melhores terceiros atuais: ${topThirds.map(row => `${label(row.team)} (${row.group})`).join(" · ")}</div>
      </div>
    </div>`;
}

function renderKnockout() {
  const rounds = [
    { key: "R32", title: "32-avos" },
    { key: "R16", title: "Oitavas" },
    { key: "QF", title: "Quartas" },
    { key: "SF", title: "Semifinal" },
    { key: "F", title: "Final" }
  ];
  document.getElementById("bracketBoard").innerHTML = rounds.map(round => `
    <div class="bracket-column">
      <div class="bracket-title">${round.title}</div>
      <div class="bracket-stack">${derived.matches[round.key].map(match => renderBracketMatch(match)).join("")}</div>
    </div>`).join("");
  document.getElementById("knockoutControls").innerHTML = `<div class="inline-note">Edite o placar direto no bracket. Em empate, escolha o classificado.</div>`;
  bindKnockoutEvents();
}

function renderBracketMatch(match) {
  const lockedWinner = getMatchWinner(match);
  const teamsKnown = match.homeTeam !== "TBD" && match.awayTeam !== "TBD";
  const tie = isReady(match.home) && isReady(match.away) && Number(match.home) === Number(match.away);
  return `
    <div class="bracket-match ${lockedWinner !== "TBD" ? "winner-locked" : ""}">
      <div class="bracket-match-label">${match.label || match.id}</div>
      <div class="bracket-slot ${lockedWinner === match.homeTeam ? "is-winner" : ""}">
        <div class="bracket-team">${renderFlag(match.homeTeam)}<span>${label(match.homeTeam)}</span></div>
        <input class="score-input bracket-score" type="number" min="0" step="1" inputmode="numeric" data-match="${match.id}" data-side="home" value="${match.home}" ${teamsKnown ? "" : "disabled"}>
      </div>
      <div class="bracket-slot ${lockedWinner === match.awayTeam ? "is-winner" : ""}">
        <div class="bracket-team">${renderFlag(match.awayTeam)}<span>${label(match.awayTeam)}</span></div>
        <input class="score-input bracket-score" type="number" min="0" step="1" inputmode="numeric" data-match="${match.id}" data-side="away" value="${match.away}" ${teamsKnown ? "" : "disabled"}>
      </div>
      ${tie && teamsKnown ? `<div class="winner-picker"> <button class="winner-chip ${match.winner === match.homeTeam ? "active" : ""}" data-winner-match="${match.id}" data-winner="${match.homeTeam}">${label(match.homeTeam)}</button><button class="winner-chip ${match.winner === match.awayTeam ? "active" : ""}" data-winner-match="${match.id}" data-winner="${match.awayTeam}">${label(match.awayTeam)}</button></div>` : ""}
    </div>`;
}

function bindKnockoutEvents() {
  document.querySelectorAll("#bracketBoard [data-match][data-side]").forEach(input => input.addEventListener("input", event => updateScoreState(state.knockoutMatches, event.target.dataset.match, event.target.dataset.side, event.target.value, true)));
  document.querySelectorAll("#bracketBoard [data-winner-match]").forEach(button => button.addEventListener("click", event => {
    const { winnerMatch, winner } = event.currentTarget.dataset;
    state.knockoutMatches[winnerMatch].winner = winner;
    recomputeAndRender();
  }));
}

function renderChampion() {
  const champion = derived.champion;
  const final = derived.matches.F[0];
  document.getElementById("championContainer").innerHTML = `
    <div class="champion-card">
      <div class="champion-top">
        <div>
          <p class="section-kicker">Resultado projetado</p>
          <h2>${champion === "TBD" ? "Mercado aberto" : label(champion)}</h2>
          <p class="muted">${champion === "TBD" ? "Feche o mata-mata para definir o campeão." : `Final: ${label(final.homeTeam)} ${displayScore(final.home)} x ${displayScore(final.away)} ${label(final.awayTeam)}`}</p>
        </div>
        <div class="champion-mark">🏆</div>
      </div>
    </div>`;
}

function updateScoreState(target, matchId, side, rawValue, knockout = false) {
  target[matchId][side] = sanitizeScore(rawValue);
  if (knockout) {
    const match = target[matchId];
    if (!isReady(match.home) || !isReady(match.away)) match.winner = "";
    else if (Number(match.home) > Number(match.away)) match.winner = findCurrentTeam(matchId, true);
    else if (Number(match.away) > Number(match.home)) match.winner = findCurrentTeam(matchId, false);
    else match.winner = "";
  }
  recomputeAndRender();
}

function findCurrentTeam(matchId, home) {
  const match = ["R32", "R16", "QF", "SF", "F"].flatMap(round => derived?.matches?.[round] || []).find(item => item.id === matchId);
  return home ? match?.homeTeam || "" : match?.awayTeam || "";
}

function renderFlag(team) {
  if (!team || team === "TBD") return `<span class="flag" aria-hidden="true"></span>`;
  const code = TEAM_FLAG_CODES[team];
  return code ? `<img class="flag" src="https://flagcdn.com/${code}.svg" alt="${label(team)} flag" loading="lazy">` : `<span class="flag" aria-hidden="true"></span>`;
}

function label(team) { return TEAM_LABELS[team] || team || "TBD"; }
function getMatchId(match) { return `${match.round}|${match.group}|${match.homeKey}|${match.awayKey}`; }
function sanitizeScore(value) { if (value === "" || value == null) return ""; const number = Number(value); return Number.isFinite(number) ? String(Math.max(0, Math.floor(number))) : ""; }
function sanitizeWinner(value, homeTeam, awayTeam) { return value === homeTeam || value === awayTeam ? value : ""; }
function isReady(value) { return value !== "" && value != null && Number.isFinite(Number(value)); }
function displayScore(value) { return value === "" ? "-" : value; }

init();
