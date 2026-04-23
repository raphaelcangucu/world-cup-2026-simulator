import { roundLabel } from "../data/bracket-template.js";
import { teamFlagUrl, teamLabel } from "../data/teams.js";
import { escapeHtml } from "../utils/dom.js";
import { t } from "../i18n/index.js";

export function renderChampionSection(container, snapshot) {
  const { derived } = snapshot;
  const champion = derived.champion;

  if (!champion) {
    container.innerHTML = `
      <div class="section-head">
        <div>
          <p class="kicker">${t("champion.kicker")}</p>
          <h2 id="championTitle">${t("champion.openMarket")}</h2>
        </div>
      </div>
      <div class="champion-card">
        <div>
          <p class="muted">${t("champion.openHint")}</p>
        </div>
        <div class="champion-mark" aria-hidden="true">🏆</div>
      </div>
    `;
    return;
  }

  const path = buildPathRows(derived);

  container.innerHTML = `
    <div class="section-head">
      <div>
        <p class="kicker">${t("champion.kicker")}</p>
        <h2 id="championTitle">
          <img class="flag-lg" style="display:inline-block;vertical-align:-4px;margin-right:8px" src="${teamFlagUrl(champion)}" alt="">
          <span class="text-grad">${escapeHtml(teamLabel(champion))}</span>
        </h2>
      </div>
    </div>
    <div class="champion-card">
      <div>
        <p class="kicker">${t("champion.pathKicker")}</p>
        <div class="champion-path">${path}</div>
      </div>
      <div class="champion-mark is-lit" aria-hidden="true">🏆</div>
    </div>
  `;
}

function buildPathRows(derived) {
  const path = new Set(derived.championPath || []);
  const champion = derived.champion;
  const rows = [];

  for (const round of ["R32", "R16", "QF", "SF", "F"]) {
    const list = derived.matches[round] || [];
    list.filter(m => path.has(m.id)).forEach(match => {
      const opponent = match.homeTeam === champion ? match.awayTeam : match.homeTeam;
      const championGoals = match.homeTeam === champion ? match.home : match.away;
      const opponentGoals = match.homeTeam === champion ? match.away : match.home;
      rows.push(`
        <div class="champion-path-row">
          <span class="label">${escapeHtml(roundLabel(round))}</span>
          <div class="team-cell" style="display:flex;align-items:center;gap:8px;justify-content:space-between">
            <span style="display:flex;align-items:center;gap:6px">
              <img class="flag-lg" src="${teamFlagUrl(champion)}" alt="">
              <strong>${escapeHtml(teamLabel(champion))}</strong>
            </span>
            <span class="mono"><strong>${escapeHtml(championGoals || "0")}</strong> × ${escapeHtml(opponentGoals || "0")}</span>
            <span style="display:flex;align-items:center;gap:6px">
              <img class="flag-lg" src="${teamFlagUrl(opponent)}" alt="">
              <span>${escapeHtml(teamLabel(opponent))}</span>
            </span>
          </div>
        </div>
      `);
    });
  }

  return rows.join("") || `<p class="muted small">${t("champion.pathEmpty")}</p>`;
}
