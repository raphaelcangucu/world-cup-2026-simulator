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
  { id:"R32-1", label:"R32 1", home:"A2", away:"B2" },
  { id:"R32-2", label:"R32 2", home:"C1", away:"F2" },
  { id:"R32-3", label:"R32 3", home:"E1", away:"TP:E1" },
  { id:"R32-4", label:"R32 4", home:"F1", away:"C2" },
  { id:"R32-5", label:"R32 5", home:"E2", away:"I2" },
  { id:"R32-6", label:"R32 6", home:"I1", away:"TP:I1" },
  { id:"R32-7", label:"R32 7", home:"A1", away:"TP:A1" },
  { id:"R32-8", label:"R32 8", home:"L1", away:"TP:L1" },
  { id:"R32-9", label:"R32 9", home:"G1", away:"TP:G1" },
  { id:"R32-10", label:"R32 10", home:"D1", away:"TP:D1" },
  { id:"R32-11", label:"R32 11", home:"H1", away:"J2" },
  { id:"R32-12", label:"R32 12", home:"K2", away:"L2" },
  { id:"R32-13", label:"R32 13", home:"B1", away:"TP:B1" },
  { id:"R32-14", label:"R32 14", home:"D2", away:"G2" },
  { id:"R32-15", label:"R32 15", home:"J1", away:"H2" },
  { id:"R32-16", label:"R32 16", home:"K1", away:"TP:K1" },
];

const NEXT_ROUNDS = {
  R16:[['R32-1','R32-2'],['R32-3','R32-4'],['R32-5','R32-6'],['R32-7','R32-8'],['R32-9','R32-10'],['R32-11','R32-12'],['R32-13','R32-14'],['R32-15','R32-16']],
  QF:[['R16-1','R16-2'],['R16-3','R16-4'],['R16-5','R16-6'],['R16-7','R16-8']],
  SF:[['QF-1','QF-2'],['QF-3','QF-4']],
  F:[['SF-1','SF-2']],
};

const STEPS = [
  { id: 'intro', label: 'Intro' },
  { id: 'groupsSection', label: 'Grupos' },
  { id: 'qualifiersSection', label: 'Classificados' },
  { id: 'knockoutSection', label: 'Mata-mata' },
  { id: 'championSection', label: 'Campeão' },
];

const state = { groupMatches: {}, knockoutMatches: {}, activeGroup: 'A', thirdMap: null };
let derived = null;

function init() {
  buildDefaultState();
  renderStepNav();
  renderGroupPager();
  loadThirdMap().then(() => {
    restoreState();
    bindTopActions();
    recomputeAndRender();
  });
}

function buildDefaultState() {
  Object.entries(GROUP_FIXTURES).forEach(([group, fixtures]) => fixtures.forEach((f, i) => state.groupMatches[`${group}-${i}`] = { home:'', away:'' }));
  [...R32_TEMPLATE, ...makeRound('R16'), ...makeRound('QF'), ...makeRound('SF'), ...makeRound('F')].forEach(match => state.knockoutMatches[match.id] = { home:'', away:'' });
}

function makeRound(code) {
  return NEXT_ROUNDS[code].map((pair, i) => ({ id: `${code}-${i+1}`, pair }));
}

async function loadThirdMap() { state.thirdMap = await fetch('third-place-map.json').then(r => r.json()); }

function restoreState() {
  const url = new URL(location.href);
  const payload = url.hash.startsWith('#s=') ? url.hash.slice(3) : localStorage.getItem('wc26-state');
  if (!payload) return;
  try {
    const decoded = JSON.parse(decodeURIComponent(escape(atob(payload.replace(/-/g,'+').replace(/_/g,'/')))));
    Object.assign(state.groupMatches, decoded.groupMatches || {});
    Object.assign(state.knockoutMatches, decoded.knockoutMatches || {});
    state.activeGroup = decoded.activeGroup || 'A';
  } catch {}
}

function persistState() {
  const slim = { groupMatches: state.groupMatches, knockoutMatches: state.knockoutMatches, activeGroup: state.activeGroup };
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify(slim)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  history.replaceState(null, '', `${location.pathname}${location.search}#s=${payload}`);
  localStorage.setItem('wc26-state', payload);
  return `${location.origin}${location.pathname}${location.search}#s=${payload}`;
}

function bindTopActions() {
  document.getElementById('shareBtn').onclick = async () => {
    const url = persistState();
    const text = 'Meu cenário da Copa 2026 no macro.markets';
    if (navigator.share) { try { await navigator.share({ title:text, text, url }); setStatus('Link de palpite compartilhado.'); return; } catch {} }
    copyText(url); setStatus('Link pronto e copiado.');
  };
  document.getElementById('copyBtn').onclick = () => { copyText(persistState()); setStatus('Link copiado.'); };
  document.getElementById('resetBtn').onclick = () => { localStorage.removeItem('wc26-state'); location.href = location.pathname; };
}

function copyText(text) { navigator.clipboard?.writeText(text); }
function setStatus(text) { document.getElementById('shareStatus').textContent = text; }

function renderStepNav() {
  document.getElementById('stepNav').innerHTML = STEPS.map(step => `<a class="step-link" href="#${step.id}">${step.label}</a>`).join('');
}

function renderGroupPager() {
  document.getElementById('groupPager').innerHTML = Object.keys(GROUPS).map(group => `<button class="group-tab ${group===state.activeGroup?'active':''}" data-group="${group}">${group}</button>`).join('');
  document.getElementById('groupPager').onclick = e => { if (!e.target.dataset.group) return; state.activeGroup = e.target.dataset.group; recomputeAndRender(); };
}

function recomputeAndRender() {
  derived = computeTournament();
  persistState();
  renderGroupPager();
  renderGroups();
  renderQualifiers();
  renderKnockout();
  renderChampion();
}

function computeTournament() {
  const groupTables = {};
  const seeds = {};
  const thirds = [];
  Object.keys(GROUPS).forEach(group => {
    const table = computeGroupTable(group);
    groupTables[group] = table;
    table.forEach((row, index) => seeds[`${group}${index+1}`] = row.team);
    thirds.push({ ...table[2], group });
  });
  const rankedThirds = rankThirds(thirds);
  rankedThirds.slice(0,8).forEach((row, index) => seeds[`3${row.group}`] = row.team, row.rank = index + 1);
  const qualifiedGroupsKey = rankedThirds.slice(0,8).map(r => r.group).sort().join('');
  const thirdAssignments = state.thirdMap[qualifiedGroupsKey] || {};
  const matches = buildKnockoutMatches(seeds, thirdAssignments);
  return { groupTables, seeds, rankedThirds, thirdAssignments, matches, champion: getMatchWinner(matches.F[0]) };
}

function computeGroupTable(group) {
  const teams = GROUPS[group];
  const rows = Object.fromEntries(teams.map(team => [team, { team, pts:0, w:0, d:0, l:0, gf:0, ga:0, gd:0, fair:0, opponents:{} }]));
  GROUP_FIXTURES[group].forEach((fixture, i) => {
    const match = state.groupMatches[`${group}-${i}`];
    if (match.home === '' || match.away === '') return;
    const [home, away] = fixture;
    const hg = Number(match.home), ag = Number(match.away);
    const a = rows[home], b = rows[away];
    a.gf += hg; a.ga += ag; b.gf += ag; b.ga += hg;
    a.gd = a.gf - a.ga; b.gd = b.gf - b.ga;
    a.opponents[away] = { pts: hg>ag?3:hg===ag?1:0, gd: hg-ag, gf: hg };
    b.opponents[home] = { pts: ag>hg?3:ag===hg?1:0, gd: ag-hg, gf: ag };
    if (hg > ag) { a.pts += 3; a.w++; b.l++; } else if (hg < ag) { b.pts += 3; b.w++; a.l++; } else { a.pts++; b.pts++; a.d++; b.d++; }
  });
  return rankRows(Object.values(rows));
}

function rankRows(rows) {
  const base = [...rows].sort((a,b) => b.pts - a.pts);
  const out = [];
  for (let i=0; i<base.length;) {
    let j = i + 1;
    while (j < base.length && base[j].pts === base[i].pts) j++;
    const tied = base.slice(i, j);
    out.push(...rankTiedRows(tied));
    i = j;
  }
  return out;
}

function rankTiedRows(rows) {
  if (rows.length === 1) return rows;
  const names = rows.map(r => r.team);
  const withHead = rows.map(row => {
    const stats = names.filter(n => n !== row.team).reduce((acc, opp) => {
      const h = row.opponents[opp] || { pts:0, gd:0, gf:0 };
      acc.pts += h.pts; acc.gd += h.gd; acc.gf += h.gf; return acc;
    }, { pts:0, gd:0, gf:0 });
    return { ...row, head: stats };
  }).sort((a,b) => sortByOfficial(a,b));

  const final = [];
  for (let i=0; i<withHead.length;) {
    let j = i + 1;
    while (j < withHead.length && compareHead(withHead[i], withHead[j]) === 0) j++;
    if (j - i > 1 && j - i < rows.length) {
      final.push(...rankTiedRows(withHead.slice(i,j).map(({head,...rest}) => rest)));
    } else {
      final.push(...withHead.slice(i,j).sort((a,b) => fallbackSort(a,b)).map(({head,...rest}) => rest));
    }
    i = j;
  }
  return final;
}

function compareHead(a,b) {
  return (b.head.pts-a.head.pts) || (b.head.gd-a.head.gd) || (b.head.gf-a.head.gf);
}
function sortByOfficial(a,b) { return compareHead(a,b) || fallbackSort(a,b); }
function fallbackSort(a,b) { return (b.gd-a.gd) || (b.gf-a.gf) || (a.fair-b.fair) || ((FIFA_RANKING[a.team]||999) - (FIFA_RANKING[b.team]||999)); }
function rankThirds(rows) { return [...rows].sort((a,b) => (b.pts-a.pts) || (b.gd-a.gd) || (b.gf-a.gf) || (a.fair-b.fair) || ((FIFA_RANKING[a.team]||999) - (FIFA_RANKING[b.team]||999))); }

function resolveSeed(seed, seeds, thirdAssignments) {
  if (!seed) return 'TBD';
  if (seed.startsWith('TP:')) return seeds[thirdAssignments[seed.split(':')[1]] || ''] || 'TBD';
  return seeds[seed] || 'TBD';
}

function buildKnockoutMatches(seeds, thirdAssignments) {
  const rounds = { R32: [], R16: [], QF: [], SF: [], F: [] };
  R32_TEMPLATE.forEach(t => rounds.R32.push(resolveKnockoutMatch({ ...t }, seeds, thirdAssignments)));
  makeRound('R16').forEach((match, i) => rounds.R16.push(resolveNextMatch(match.id, NEXT_ROUNDS.R16[i], rounds)));
  makeRound('QF').forEach((match, i) => rounds.QF.push(resolveNextMatch(match.id, NEXT_ROUNDS.QF[i], rounds)));
  makeRound('SF').forEach((match, i) => rounds.SF.push(resolveNextMatch(match.id, NEXT_ROUNDS.SF[i], rounds)));
  makeRound('F').forEach((match, i) => rounds.F.push(resolveNextMatch(match.id, NEXT_ROUNDS.F[i], rounds)));
  return rounds;
}

function resolveKnockoutMatch(match, seeds, thirdAssignments) {
  const editable = state.knockoutMatches[match.id];
  return { ...match, homeTeam: resolveSeed(match.home, seeds, thirdAssignments), awayTeam: resolveSeed(match.away, seeds, thirdAssignments), ...editable };
}

function resolveNextMatch(id, pair, rounds) {
  const homeTeam = getMatchWinner(findMatch(pair[0], rounds));
  const awayTeam = getMatchWinner(findMatch(pair[1], rounds));
  return { id, pair, homeTeam, awayTeam, ...state.knockoutMatches[id] };
}

function findMatch(id, rounds) { return Object.values(rounds).flat().find(m => m.id === id); }
function getMatchWinner(match) {
  if (!match || !match.homeTeam || !match.awayTeam || match.homeTeam === 'TBD' || match.awayTeam === 'TBD') return 'TBD';
  if (match.home === '' || match.away === '') return 'TBD';
  const hg = Number(match.home), ag = Number(match.away);
  if (hg === ag) return 'TBD';
  return hg > ag ? match.homeTeam : match.awayTeam;
}

function renderGroups() {
  const container = document.getElementById('groupsContainer');
  container.innerHTML = Object.keys(GROUPS).map(group => {
    const table = derived.groupTables[group];
    return `<article class="group-card ${group===state.activeGroup?'active':''}">
      <div class="chip-row"><span class="badge">Group ${group}</span><span class="small">Top 2 avançam, terceiro entra na corrida pelos 8 melhores.</span></div>
      <div>${GROUP_FIXTURES[group].map((fixture, i) => renderGroupMatch(group, i, fixture)).join('')}</div>
      <div class="table-wrap">
        <div class="table-header table-row"><div>Seleção</div><div>Pts</div><div>V</div><div>E</div><div>D</div><div>GP</div><div>GC</div><div>SG</div></div>
        ${table.map((row, i) => `<div class="table-row ${i<2?'qualify':''} ${i===2?'third-live':''}"><div>${i+1}. ${row.team}</div><div>${row.pts}</div><div>${row.w}</div><div>${row.d}</div><div>${row.l}</div><div>${row.gf}</div><div>${row.ga}</div><div>${row.gd}</div></div>`).join('')}
      </div>
    </article>`;
  }).join('');

  container.querySelectorAll('input').forEach(input => input.oninput = e => {
    const { match, side } = e.target.dataset;
    state.groupMatches[match][side] = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
    recomputeAndRender();
  });
}

function renderGroupMatch(group, index, fixture) {
  const matchId = `${group}-${index}`;
  const val = state.groupMatches[matchId];
  return `<div class="match-row"><div class="team-name">${fixture[0]}</div><div class="input-score"><input type="number" min="0" inputmode="numeric" data-match="${matchId}" data-side="home" value="${val.home}"><span class="small">vs</span><input type="number" min="0" inputmode="numeric" data-match="${matchId}" data-side="away" value="${val.away}"></div><div class="team-name">${fixture[1]}</div></div>`;
}

function renderQualifiers() {
  const topThirds = derived.rankedThirds.slice(0,8);
  document.getElementById('qualifiersContainer').innerHTML = `<div class="qual-grid">
    ${Object.keys(GROUPS).map(group => {
      const table = derived.groupTables[group];
      return `<div class="summary-card card" style="padding:16px"><h3>Group ${group}</h3><p><strong>1º</strong> ${table[0].team}</p><p><strong>2º</strong> ${table[1].team}</p><p class="small"><strong>3º</strong> ${table[2].team}</p></div>`;
    }).join('')}
  </div>
  <div class="table-wrap" style="margin-top:18px"><h3>Ranking dos terceiros</h3>
  ${derived.rankedThirds.map((row, i) => `<div class="seed-row"><div>${i+1}</div><div>${row.team} <span class="small">(Grupo ${row.group})</span></div><div>${row.pts} pts, SG ${row.gd}</div></div>`).join('')}
  </div>
  <div class="summary-grid" style="margin-top:18px">
    <div class="summary-card card" style="padding:16px"><h3>8 que avançam</h3><p>${topThirds.map(r => `${r.team} (${r.group})`).join('<br>')}</p></div>
    <div class="summary-card card" style="padding:16px"><h3>Chave oficial dos terceiros</h3><p class="small">Combinação: ${topThirds.map(r => r.group).sort().join(', ') || 'aguardando'}</p><p>${Object.entries(derived.thirdAssignments).map(([slot, seed]) => `${slot} → ${derived.seeds[seed] || seed}`).join('<br>') || 'Preencha mais cenários para fechar o Round of 32.'}</p></div>
  </div>`;
}

function renderKnockout() {
  const rounds = [
    { name:'Round of 32', key:'R32' },
    { name:'Round of 16', key:'R16' },
    { name:'Quarterfinals', key:'QF' },
    { name:'Semifinals', key:'SF' },
    { name:'Final', key:'F' },
  ];
  document.getElementById('knockoutContainer').innerHTML = `<div class="knockout-grid">${rounds.map(round => `<div class="round-col"><h3>${round.name}</h3>${derived.matches[round.key].map(renderKnockoutMatch).join('')}</div>`).join('')}</div>`;
  document.querySelectorAll('#knockoutContainer input').forEach(input => input.oninput = e => {
    const { match, side } = e.target.dataset;
    state.knockoutMatches[match][side] = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
    recomputeAndRender();
  });
}

function renderKnockoutMatch(match) {
  const winner = getMatchWinner(match);
  return `<div class="bracket-card ${winner !== 'TBD' ? 'winner' : ''}">
    <div class="small">${match.id}</div>
    <div class="match-row"><div>${match.homeTeam}</div><div class="input-score"><input type="number" min="0" data-match="${match.id}" data-side="home" value="${match.home}"></div><div></div></div>
    <div class="match-row"><div>${match.awayTeam}</div><div class="input-score"><input type="number" min="0" data-match="${match.id}" data-side="away" value="${match.away}"></div><div></div></div>
    <div class="small">${winner === 'TBD' ? 'Empate não avança, defina um vencedor.' : `Avança: ${winner}`}</div>
  </div>`;
}

function renderChampion() {
  const champion = derived.champion;
  const final = derived.matches.F[0];
  const path = [];
  if (champion !== 'TBD') {
    ['R32','R16','QF','SF','F'].forEach(round => {
      const match = derived.matches[round].find(m => getMatchWinner(m) === champion);
      if (match) path.push(`${match.id}: ${match.homeTeam} ${match.home} x ${match.away} ${match.awayTeam}`);
    });
  }
  document.getElementById('championContainer').innerHTML = `<div class="champion-card">
    <p class="eyebrow">Projected winner</p>
    <h2>${champion === 'TBD' ? 'A final ainda está em aberto' : champion}</h2>
    <p class="muted">${champion === 'TBD' ? 'Preencha os placares do mata-mata até surgir um outcome final.' : `Final: ${final.homeTeam} ${final.home} x ${final.away} ${final.awayTeam}`}</p>
    <ul class="path-list">${path.map(item => `<li>${item}</li>`).join('')}</ul>
  </div>`;
}

init();
