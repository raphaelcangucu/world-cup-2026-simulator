import { teamLabel } from "../data/teams.js";

const MACRO_LOGO = `<img src="assets/macro-markets-favicon.svg" alt="macro.markets" decoding="async" />`;

const SUN_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
const MOON_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

export function renderHero(container, snapshot, actions) {
  const { state, derived } = snapshot;
  const progressPct = Math.round((derived.completedMatches / Math.max(1, derived.totalMatches)) * 100);
  const championDisplay = derived.champion ? teamLabel(derived.champion) : "Em aberto";

  container.classList.add("hero");
  container.setAttribute("role", "banner");

  container.innerHTML = `
    <div class="hero-top">
      <div class="hero-brand">
        <div class="hero-logo" aria-hidden="true">${MACRO_LOGO}</div>
        <div class="hero-titles">
          <p class="kicker">macro.markets · cenário do torneio</p>
          <h1 id="heroTitle">Simulador Copa do Mundo <span class="text-grad">2026</span></h1>
        </div>
      </div>
      <div class="hero-actions" role="toolbar" aria-label="Ações globais">
        <button class="theme-toggle" type="button" id="themeToggleBtn" aria-label="Alternar tema claro/escuro" title="Alternar tema">
          ${state.theme === "dark" ? SUN_ICON : MOON_ICON}
        </button>
        <button class="btn btn--secondary btn--sm" type="button" id="tourBtn" aria-label="Rever dicas">Dicas</button>
        <button class="btn btn--secondary btn--sm" type="button" id="copyLinkBtn">Copiar link</button>
        <button class="btn btn--secondary btn--sm" type="button" id="resetBtn">Resetar</button>
        <button class="btn btn--primary btn--sm" type="button" id="shareBtn">Compartilhar</button>
      </div>
    </div>

    <div class="hero-progress" role="region" aria-label="Progresso do torneio">
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressPct}">
        <div class="progress-fill" style="--progress: ${progressPct}%"></div>
      </div>
      <div class="hero-progress-meta">
        <span><strong>${progressPct}%</strong> preenchido</span>
        <span><strong>${derived.filledGroupMatches}/${derived.totalGroupMatches}</strong> jogos de grupo</span>
        <span><strong>${derived.decidedKnockoutMatches}/${derived.totalKnockoutMatches}</strong> mata-mata definidos</span>
        <span>Campeão projetado: <strong>${championDisplay}</strong></span>
      </div>
    </div>
  `;

  bindHero(container, state, actions);
}

function bindHero(container, state, actions) {
  container.querySelector("#themeToggleBtn").addEventListener("click", () => {
    actions.setTheme(state.theme === "dark" ? "light" : "dark");
  });
  container.querySelector("#tourBtn").addEventListener("click", () => {
    actions.resetOnboarding();
  });
  container.querySelector("#copyLinkBtn").addEventListener("click", () => {
    actions.copyLink();
  });
  container.querySelector("#resetBtn").addEventListener("click", () => {
    if (confirm("Resetar todos os placares e escolhas?")) actions.reset();
  });
  container.querySelector("#shareBtn").addEventListener("click", () => {
    actions.openShare();
  });
}
