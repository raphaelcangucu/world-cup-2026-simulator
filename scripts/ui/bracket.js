import { ROUND_LABELS, ROUND_ORDER, NEXT_ROUNDS } from "../data/bracket-template.js";
import { teamFlagUrl, teamLabel } from "../data/teams.js";
import { escapeHtml } from "../utils/dom.js";
import { drawConnectors, observeResize } from "./bracket-connectors.js";

const ROUND_COL_CLASS = {
  R32: "r32",
  R16: "r16",
  QF: "qf",
  SF: "sf",
  F: "is-final"
};

let cleanupResize = null;

export function renderBracketSection(container, snapshot, actions) {
  const { state, derived } = snapshot;
  if (cleanupResize) { cleanupResize(); cleanupResize = null; }

  container.innerHTML = `
    <div class="section-head">
      <div>
        <p class="kicker">Mata-mata</p>
        <h2 id="knockoutTitle">Bracket</h2>
      </div>
      <p class="small muted">Digite o placar ou clique no radio para declarar vencedor. Radio aplica 1×0.</p>
    </div>
    <div class="bracket-stage">
      <div class="bracket-board" id="bracketBoard" role="region" aria-label="Bracket do mata-mata">
        <svg class="bracket-svg" id="bracketSvg" aria-hidden="true"></svg>
        ${renderDesktop(derived)}
      </div>
      ${renderMobile(derived, state.knockoutPhase)}
    </div>
  `;

  const board = container.querySelector("#bracketBoard");
  const svg = container.querySelector("#bracketSvg");
  const pathIds = derived.championPath || [];

  const draw = () => drawConnectors(board, svg, derived.matches, pathIds);

  const trigger = () => {
    draw();
    if (document.fonts && typeof document.fonts.ready?.then === "function") {
      document.fonts.ready.then(draw).catch(() => {});
    }
  };

  requestAnimationFrame(trigger);
  cleanupResize = observeResize(board, draw);

  bindBracketEvents(container, actions);
}

function renderDesktop(derived) {
  const matches = derived.matches;
  const pathSet = new Set(derived.championPath || []);

  const buildCol = (round, side, visibleIds) => {
    const list = matches[round]?.filter(m => visibleIds.includes(m.id)) || [];
    return `
      <div class="bracket-col ${ROUND_COL_CLASS[round]}" data-round="${round}" data-side="${side}">
        <div class="bracket-col-label">${ROUND_LABELS[round]}</div>
        ${list.map(m => `<div class="bracket-slot">${renderCompactCard(m, pathSet)}</div>`).join("")}
      </div>
    `;
  };

  const leftCols = [
    buildCol("R32", "L", matches.R32.filter(m => m.side === "L").map(m => m.id)),
    buildCol("R16", "L", [1, 2, 3, 4].map(i => `R16-${i}`)),
    buildCol("QF", "L", ["QF-1", "QF-2"]),
    buildCol("SF", "L", ["SF-1"])
  ].join("");

  const finalCol = `
    <div class="bracket-col is-final" data-round="F" data-side="F">
      <div class="bracket-col-label">Final</div>
      <div class="bracket-slot">
        ${renderFinal(matches.F[0], derived.champion, pathSet)}
      </div>
    </div>
  `;

  const rightCols = [
    buildCol("SF", "R", ["SF-2"]),
    buildCol("QF", "R", ["QF-3", "QF-4"]),
    buildCol("R16", "R", [5, 6, 7, 8].map(i => `R16-${i}`)),
    buildCol("R32", "R", matches.R32.filter(m => m.side === "R").map(m => m.id))
  ].join("");

  return `${leftCols}${finalCol}${rightCols}`;
}

function renderFinal(match, champion, pathSet) {
  const isChampion = !!champion;
  return `
    <div class="bracket-final">
      <div class="trophy ${isChampion ? "is-lit" : ""}" aria-hidden="true">🏆</div>
      ${renderCompactCard(match, pathSet)}
      ${isChampion ? `<div class="champion-tag">Campeão<br>${escapeHtml(teamLabel(champion))}</div>` : ""}
    </div>
  `;
}

function renderCompactCard(match, pathSet) {
  if (!match) return "";
  const isPath = pathSet.has(match.id);
  const cardCls = [
    "match-card-compact",
    isPath ? "is-path" : "",
    match.tied ? "is-tied" : ""
  ].filter(Boolean).join(" ");

  return `
    <div class="${cardCls}" data-match-id="${escapeHtml(match.id)}" aria-label="${escapeHtml(match.label)}">
      ${renderCompactRow(match, "home")}
      <div class="divider-thin"></div>
      ${renderCompactRow(match, "away")}
      ${match.tied ? `<div class="tied-warning">Empate — escolha vencedor</div>` : ""}
    </div>
  `;
}

function renderCompactRow(match, side) {
  const team = side === "home" ? match.homeTeam : match.awayTeam;
  const score = side === "home" ? match.home : match.away;
  const isTbd = !team || team === "TBD";
  const isWinner = match.winner && match.winner === team;
  const isLoser = match.winner && match.winner !== team;
  const classes = [
    "team-row-compact",
    isTbd ? "is-tbd" : "",
    isWinner ? "is-winner" : "",
    isLoser ? "is-loser" : ""
  ].filter(Boolean).join(" ");

  const id = `${match.id}-${side}`;
  const label = teamLabel(team);

  return `
    <label class="${classes}" for="score-${id}">
      <img class="flag-compact" src="${teamFlagUrl(team)}" alt="" loading="lazy">
      <span class="name-compact">${escapeHtml(label)}</span>
      <span class="radio-wrap">
        <input type="radio" name="winner-${escapeHtml(match.id)}" data-pick="knockout" data-match="${escapeHtml(match.id)}" data-side="${side}" ${isWinner ? "checked" : ""} ${isTbd ? "disabled" : ""} aria-label="Escolher ${escapeHtml(label)} vencedor">
        <span class="radio-dot" aria-hidden="true"></span>
      </span>
      <input id="score-${id}" class="input input--score-sm" type="number" min="0" step="1" inputmode="numeric"
             data-flow-input data-flow-id="ko:${match.id}:${side}"
             data-score="knockout" data-match="${escapeHtml(match.id)}" data-side="${side}"
             value="${escapeHtml(score)}"
             ${isTbd ? "disabled" : ""}
             aria-label="Gols de ${escapeHtml(label)}">
    </label>
  `;
}

function renderMobile(derived, currentPhase) {
  const matches = derived.matches;
  const pathSet = new Set(derived.championPath || []);
  const list = matches[currentPhase] || [];

  return `
    <div class="bracket-mobile">
      <div class="bracket-mobile-tabs" role="tablist" aria-label="Fase do mata-mata">
        ${ROUND_ORDER.map(r => `
          <button role="tab" type="button" class="chip ${r === currentPhase ? "is-active" : ""}"
                  data-phase="${r}" aria-selected="${r === currentPhase}">
            ${ROUND_LABELS[r]}
          </button>`).join("")}
      </div>
      <div class="bracket-mobile-phase-head">
        <span class="kicker">${ROUND_LABELS[currentPhase]}</span>
        <span class="small">${list.filter(m => m.winner).length}/${list.length} decididos</span>
      </div>
      <div class="bracket-mobile-list">
        ${list.map(m => renderMobileMatch(m, pathSet)).join("")}
      </div>
    </div>
  `;
}

function renderMobileMatch(match, pathSet) {
  const isPath = pathSet.has(match.id);
  const classes = ["bracket-mobile-card", isPath ? "is-path" : "", match.tied ? "is-tied" : ""].filter(Boolean).join(" ");
  const feedsLabel = match.feedsFrom ? `Vindo de ${match.feedsFrom.join(" · ")}` : "";
  const breadcrumb = feedsLabel
    ? `${escapeHtml(match.label)} · <span>${escapeHtml(feedsLabel)}</span>`
    : escapeHtml(match.label);

  return `
    <article class="${classes}" data-match-id="${escapeHtml(match.id)}">
      <div class="bracket-mobile-breadcrumb">${breadcrumb}</div>
      ${renderMobileRow(match, "home")}
      ${renderMobileRow(match, "away")}
      ${match.tied ? `<div class="tied-warning">Empate — escolha vencedor</div>` : ""}
    </article>
  `;
}

function renderMobileRow(match, side) {
  const team = side === "home" ? match.homeTeam : match.awayTeam;
  const score = side === "home" ? match.home : match.away;
  const isTbd = !team || team === "TBD";
  const isWinner = match.winner && match.winner === team;
  const classes = [
    "bracket-mobile-row",
    isTbd ? "is-tbd" : "",
    isWinner ? "is-winner" : ""
  ].filter(Boolean).join(" ");
  const label = teamLabel(team);
  const id = `m-${match.id}-${side}`;

  return `
    <label class="${classes}" for="${id}">
      <img class="flag-lg" src="${teamFlagUrl(team)}" alt="" loading="lazy">
      <span class="name-compact">${escapeHtml(label)}</span>
      <span class="radio-wrap">
        <input type="radio" name="winner-m-${escapeHtml(match.id)}" data-pick="knockout" data-match="${escapeHtml(match.id)}" data-side="${side}" ${isWinner ? "checked" : ""} ${isTbd ? "disabled" : ""} aria-label="Escolher ${escapeHtml(label)} vencedor">
        <span class="radio-dot" aria-hidden="true"></span>
      </span>
      <input id="${id}" class="input" type="number" min="0" step="1" inputmode="numeric"
             data-flow-input data-flow-id="ko:${match.id}:${side}"
             data-score="knockout" data-match="${escapeHtml(match.id)}" data-side="${side}"
             value="${escapeHtml(score)}"
             ${isTbd ? "disabled" : ""}
             aria-label="Gols de ${escapeHtml(label)}">
    </label>
  `;
}

function bindBracketEvents(container, actions) {
  container.querySelectorAll('input[data-score="knockout"]').forEach(input => {
    input.addEventListener("input", event => {
      const { match, side } = event.target.dataset;
      actions.setKnockoutScore(match, side, event.target.value);
    });
  });

  container.querySelectorAll('input[data-pick="knockout"]').forEach(radio => {
    radio.addEventListener("change", event => {
      if (!event.target.checked) return;
      const { match, side } = event.target.dataset;
      actions.pickKnockoutWinner(match, side === "home");
    });
  });

  container.querySelectorAll("[data-phase]").forEach(btn => {
    btn.addEventListener("click", () => actions.setKnockoutPhase(btn.dataset.phase));
  });
}

export function disposeBracket() {
  if (cleanupResize) { cleanupResize(); cleanupResize = null; }
}
