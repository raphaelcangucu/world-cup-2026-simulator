import { GROUP_KEYS, GROUPS } from "../data/groups.js";
import { teamFlagUrl, teamLabel } from "../data/teams.js";
import { escapeHtml } from "../utils/dom.js";

const prevPositions = new Map();

export function renderQualifiersSection(container, snapshot) {
  const { derived, changes } = snapshot;

  container.innerHTML = `
    <div class="section-head">
      <div>
        <p class="kicker">Classificados</p>
        <h2 id="qualifiersTitle">Seeds e melhores terceiros</h2>
      </div>
    </div>
    <div class="qualifiers-grid">
      ${renderSeedsCard(derived)}
      ${renderThirdsCard(derived, changes.changedTeams)}
      ${renderMappingCard(derived)}
    </div>
  `;

  applyFlipAnimation(container);
}

function renderSeedsCard(derived) {
  const rows = GROUP_KEYS.map(group => {
    const table = derived.groupTables[group] || [];
    const first = table[0]?.team;
    const second = table[1]?.team;
    return `
      <div class="seed-row">
        <span class="kicker">Grupo ${group}</span>
        <div class="team-cell">
          <img class="flag-lg" src="${teamFlagUrl(first)}" alt="" loading="lazy">
          <span class="team-name">${escapeHtml(teamLabel(first))}</span>
        </div>
        <span class="small">2º ${escapeHtml(teamLabel(second))}</span>
      </div>`;
  }).join("");

  return `
    <article class="qualifiers-card">
      <p class="kicker">Primeiros e segundos</p>
      <h3>Classificados diretos</h3>
      <div class="seed-list">${rows}</div>
    </article>
  `;
}

function renderThirdsCard(derived, changedTeams) {
  const ranked = derived.rankedThirds || [];
  const cutoff = 8;
  const bestCount = Math.min(cutoff, ranked.length);

  const rowsHtml = ranked.map((row, index) => {
    const classes = [
      "thirds-row",
      index < cutoff ? "is-qualified" : "is-dropped",
      changedTeams.includes(row.team) ? "flash-qualify" : ""
    ].filter(Boolean).join(" ");
    const cutBefore = index === cutoff ? '<div class="thirds-cut">Linha de corte</div>' : "";
    return `
      ${cutBefore}
      <div class="${classes}" data-third-team="${escapeHtml(row.team)}">
        <span class="kicker">#${index + 1}</span>
        <div class="team-cell">
          <img class="flag-lg" src="${teamFlagUrl(row.team)}" alt="" loading="lazy">
          <span class="team-name">${escapeHtml(teamLabel(row.team))}</span>
          <span class="small">Grupo ${row.group}</span>
        </div>
        <span class="small mono">${row.pts} pts · SG ${row.gd >= 0 ? "+" + row.gd : row.gd} · GP ${row.gf}</span>
      </div>`;
  }).join("");

  return `
    <article class="qualifiers-card">
      <p class="kicker">Melhores terceiros</p>
      <h3>${bestCount}/${cutoff} entram</h3>
      <div class="thirds-list" id="thirdsList">${rowsHtml}</div>
    </article>
  `;
}

function renderMappingCard(derived) {
  const assignments = derived.thirdAssignments || {};
  const seeds = derived.seeds || {};
  const entries = Object.entries(assignments);

  const content = entries.length
    ? entries.map(([slot, seed]) => `
        <div class="seed-row">
          <span class="kicker">Slot ${slot}</span>
          <div class="team-cell">
            <img class="flag-lg" src="${teamFlagUrl(seeds[seed])}" alt="" loading="lazy">
            <span class="team-name">${escapeHtml(teamLabel(seeds[seed]))}</span>
          </div>
          <span class="small">${escapeHtml(seed)}</span>
        </div>`).join("")
    : `<p class="muted small">Preencha mais jogos para travar o chaveamento.</p>`;

  return `
    <article class="qualifiers-card">
      <p class="kicker">Mapa oficial FIFA</p>
      <h3>Slots dos terceiros</h3>
      <p class="small">Grupos com terceiros classificados: <strong>${derived.qualifiedGroupsKey ? derived.qualifiedGroupsKey.split("").join(" · ") : "Aguardando"}</strong></p>
      <div class="seed-list">${content}</div>
    </article>
  `;
}

function applyFlipAnimation(container) {
  const rows = container.querySelectorAll("[data-third-team]");
  const newPositions = new Map();
  rows.forEach(row => {
    const rect = row.getBoundingClientRect();
    newPositions.set(row.dataset.thirdTeam, rect.top);
  });

  rows.forEach(row => {
    const team = row.dataset.thirdTeam;
    const prev = prevPositions.get(team);
    const curr = newPositions.get(team);
    if (prev == null || curr == null) return;
    const delta = prev - curr;
    if (Math.abs(delta) < 2) return;
    row.style.transform = `translateY(${delta}px)`;
    row.style.transition = "none";
    requestAnimationFrame(() => {
      row.style.transform = "";
      row.style.transition = "transform 280ms var(--ease)";
    });
  });

  prevPositions.clear();
  newPositions.forEach((v, k) => prevPositions.set(k, v));
}

export { GROUPS };
