import { GROUPS, GROUP_KEYS } from "../data/groups.js";
import { getMatchId } from "../data/fixtures.js";
import { teamFlagUrl, teamLabel } from "../data/teams.js";
import { escapeHtml } from "../utils/dom.js";

export function renderGroupsSection(container, snapshot, actions, fixtures) {
  const { state, derived, changes } = snapshot;
  container.innerHTML = "";

  container.innerHTML = `
    <div class="section-head">
      <div>
        <p class="kicker">Fase de grupos</p>
        <h2 id="groupsTitle">Grupos e rodadas</h2>
      </div>
      <div class="view-switch" role="tablist" aria-label="Modo de visualização dos grupos">
        <button role="tab" type="button" data-view="group" class="${state.groupView === "group" ? "is-active" : ""}" aria-selected="${state.groupView === "group"}">Por grupo</button>
        <button role="tab" type="button" data-view="round" class="${state.groupView === "round" ? "is-active" : ""}" aria-selected="${state.groupView === "round"}">Por rodada</button>
      </div>
    </div>
    <div class="group-pager" id="groupPager" role="tablist" aria-label="Selecionar grupo"></div>
    <div id="groupsContent"></div>
  `;

  const pager = container.querySelector("#groupPager");
  const content = container.querySelector("#groupsContent");

  if (state.groupView === "group") {
    renderGroupPager(pager, state.activeGroup);
    renderGroupView(content, state, derived, fixtures, changes);
  } else {
    renderRoundPager(pager, state.activeRound, fixtures);
    renderRoundView(content, state, fixtures);
  }

  bindEvents(container, actions);
}

function renderGroupPager(pager, activeGroup) {
  pager.innerHTML = GROUP_KEYS
    .map(g => `<button role="tab" type="button" class="chip ${g === activeGroup ? "is-active" : ""}" data-group="${g}" aria-selected="${g === activeGroup}">Grupo ${g}</button>`)
    .join("");
}

function renderRoundPager(pager, activeRound, fixtures) {
  const rounds = [...new Set(fixtures.map(m => m.round))];
  pager.innerHTML = rounds
    .map(r => `<button role="tab" type="button" class="chip ${r === activeRound ? "is-active" : ""}" data-round="${r}" aria-selected="${r === activeRound}">${escapeHtml(r)}</button>`)
    .join("");
}

function renderGroupView(content, state, derived, fixtures, changes) {
  const group = state.activeGroup;
  const table = derived.groupTables[group] || [];
  const matches = fixtures.filter(m => m.group === group);

  content.innerHTML = `
    <div class="group-layout">
      <article class="group-card" aria-labelledby="groupMatches-${group}">
        <div class="group-card-head">
          <div>
            <p class="kicker">Partidas</p>
            <h3 id="groupMatches-${group}">Grupo ${group} · jogos</h3>
          </div>
        </div>
        <div class="match-list">
          ${matches.map(match => renderMatchCard(match, state.scores)).join("")}
        </div>
      </article>
      <article class="group-card" aria-labelledby="groupTable-${group}">
        <div class="group-card-head">
          <div>
            <p class="kicker">Tabela ao vivo</p>
            <h3 id="groupTable-${group}">Classificação</h3>
          </div>
        </div>
        ${renderTable(table, changes.changedTeams)}
      </article>
    </div>
  `;
}

function renderRoundView(content, state, fixtures) {
  const matches = fixtures.filter(m => m.round === state.activeRound);
  const dates = [...new Set(matches.map(m => m.date))];

  content.innerHTML = dates.map(date => `
    <article class="group-card">
      <div class="group-card-head">
        <div>
          <p class="kicker">${escapeHtml(state.activeRound)}</p>
          <h3>${escapeHtml(date)}</h3>
        </div>
      </div>
      <div class="match-list">
        ${matches.filter(m => m.date === date).map(m => renderMatchCard(m, state.scores, true)).join("")}
      </div>
    </article>
  `).join("");
}

function renderMatchCard(match, scores, showGroupPill = false) {
  const id = getMatchId(match);
  const value = scores[id] || { home: "", away: "" };
  const homeWins = value.home !== "" && value.away !== "" && Number(value.home) > Number(value.away);
  const awayWins = value.home !== "" && value.away !== "" && Number(value.away) > Number(value.home);

  return `
    <article class="match-card" data-match-card="${id}">
      <div class="match-top">
        <span class="pill ${showGroupPill ? "pill--brand" : ""}">${showGroupPill ? `Grupo ${match.group}` : escapeHtml(match.round)}</span>
        <span class="match-meta">${escapeHtml(match.date)} · ${escapeHtml(match.venue)}</span>
      </div>
      <div class="match-row">
        <label class="team-inline" data-team-row="home">
          <img class="flag-lg" src="${teamFlagUrl(match.homeKey)}" alt="" loading="lazy">
          <span class="radio-wrap">
            <input type="radio" name="winner-${id}" data-pick="group" data-match="${id}" data-side="home" ${homeWins ? "checked" : ""} aria-label="Escolher ${escapeHtml(match.home)} vencedor">
            <span class="radio-dot" aria-hidden="true"></span>
          </span>
          <span class="team-name">${escapeHtml(match.home)}</span>
        </label>
        <div class="score-pair">
          <input class="input input--score" type="number" min="0" step="1" inputmode="numeric"
                 data-flow-input data-flow-id="group:${id}:home"
                 data-score="group" data-match="${id}" data-side="home"
                 value="${escapeHtml(value.home)}"
                 aria-label="Gols de ${escapeHtml(match.home)}">
          <span class="score-x" aria-hidden="true">×</span>
          <input class="input input--score" type="number" min="0" step="1" inputmode="numeric"
                 data-flow-input data-flow-id="group:${id}:away"
                 data-score="group" data-match="${id}" data-side="away"
                 value="${escapeHtml(value.away)}"
                 aria-label="Gols de ${escapeHtml(match.away)}">
        </div>
        <label class="team-inline team-inline--away" data-team-row="away">
          <span class="team-name">${escapeHtml(match.away)}</span>
          <span class="radio-wrap">
            <input type="radio" name="winner-${id}" data-pick="group" data-match="${id}" data-side="away" ${awayWins ? "checked" : ""} aria-label="Escolher ${escapeHtml(match.away)} vencedor">
            <span class="radio-dot" aria-hidden="true"></span>
          </span>
          <img class="flag-lg" src="${teamFlagUrl(match.awayKey)}" alt="" loading="lazy">
        </label>
      </div>
    </article>
  `;
}

function renderTable(rows, changedTeams) {
  return `
    <div class="group-table" role="table" aria-label="Classificação do grupo">
      <div class="group-table-row is-head" role="row">
        <div role="columnheader">#</div>
        <div role="columnheader">Seleção</div>
        <div role="columnheader" title="Pontos">Pts</div>
        <div role="columnheader" title="Vitórias">V</div>
        <div role="columnheader" title="Empates">E</div>
        <div role="columnheader" title="Derrotas">D</div>
        <div role="columnheader" title="Gols pró">GP</div>
        <div role="columnheader" title="Gols contra">GC</div>
        <div role="columnheader" title="Saldo de gols">SG</div>
      </div>
      ${rows.map((row, index) => {
        const classes = [
          "group-table-row",
          index < 2 ? "is-qualified" : "",
          index === 2 ? "is-third-live" : "",
          changedTeams.includes(row.team) ? "flash-qualify" : ""
        ].filter(Boolean).join(" ");
        return `
          <div class="${classes}" role="row">
            <div role="cell"><span class="rank-dot">${index + 1}</span></div>
            <div class="team-cell" role="cell">
              <img class="flag-lg" src="${teamFlagUrl(row.team)}" alt="" loading="lazy">
              <span class="team-name">${escapeHtml(teamLabel(row.team))}</span>
            </div>
            <div class="mono" role="cell"><strong>${row.pts}</strong></div>
            <div class="mono" role="cell">${row.w}</div>
            <div class="mono" role="cell">${row.d}</div>
            <div class="mono" role="cell">${row.l}</div>
            <div class="mono" role="cell">${row.gf}</div>
            <div class="mono" role="cell">${row.ga}</div>
            <div class="mono" role="cell">${row.gd >= 0 ? "+" + row.gd : row.gd}</div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function bindEvents(container, actions) {
  container.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => actions.setGroupView(btn.dataset.view));
  });
  container.querySelectorAll("[data-group]").forEach(btn => {
    btn.addEventListener("click", () => actions.setActiveGroup(btn.dataset.group));
  });
  container.querySelectorAll("[data-round]").forEach(btn => {
    btn.addEventListener("click", () => actions.setActiveRound(btn.dataset.round));
  });

  container.querySelectorAll('input[data-score="group"]').forEach(input => {
    input.addEventListener("input", event => {
      const { match, side } = event.target.dataset;
      actions.setGroupScore(match, side, event.target.value);
    });
  });

  container.querySelectorAll('input[data-pick="group"]').forEach(radio => {
    radio.addEventListener("change", event => {
      if (!event.target.checked) return;
      const { match, side } = event.target.dataset;
      actions.pickGroupWinner(match, side === "home");
    });
  });
}

export { GROUPS };
