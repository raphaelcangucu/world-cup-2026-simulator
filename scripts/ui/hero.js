import { teamLabel } from "../data/teams.js";
import { getLang, getSupportedLangs, setLang, t } from "../i18n/index.js";

const MACRO_LOGO = `<img src="assets/macro-markets-favicon.svg" alt="macro.markets" decoding="async" />`;

const SUN_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
const MOON_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

const LANG_LABELS = { pt: "PT", en: "EN", es: "ES" };

export function renderHero(container, snapshot, actions) {
  const { state, derived } = snapshot;
  const progressPct = Math.round((derived.completedMatches / Math.max(1, derived.totalMatches)) * 100);
  const championDisplay = derived.champion ? teamLabel(derived.champion) : t("hero.championOpen");
  const currentLang = getLang();

  container.classList.add("hero");
  container.setAttribute("role", "banner");

  const langButtons = getSupportedLangs()
    .map(lang => `
      <button type="button"
              class="lang-chip ${lang === currentLang ? "is-active" : ""}"
              data-lang="${lang}"
              aria-pressed="${lang === currentLang}"
              aria-label="${t("hero.languageLabel")}: ${LANG_LABELS[lang]}">
        ${LANG_LABELS[lang]}
      </button>`)
    .join("");

  container.innerHTML = `
    <div class="hero-top">
      <div class="hero-brand">
        <div class="hero-logo" aria-hidden="true">${MACRO_LOGO}</div>
        <div class="hero-titles">
          <p class="kicker">${t("hero.kicker")}</p>
          <h1 id="heroTitle">${t("hero.title")} <span class="text-grad">2026</span></h1>
        </div>
      </div>
      <div class="hero-actions" role="toolbar" aria-label="${t("hero.globalActions")}">
        <div class="lang-switch" role="group" aria-label="${t("hero.languageLabel")}">${langButtons}</div>
        <button class="theme-toggle" type="button" id="themeToggleBtn" aria-label="${t("hero.themeToggle")}" title="${t("hero.themeToggleTitle")}">
          ${state.theme === "dark" ? SUN_ICON : MOON_ICON}
        </button>
        <button class="btn btn--secondary btn--sm" type="button" id="tourBtn" aria-label="${t("hero.tipsAria")}">${t("hero.tips")}</button>
        <button class="btn btn--secondary btn--sm" type="button" id="copyLinkBtn">${t("hero.copyLink")}</button>
        <button class="btn btn--secondary btn--sm" type="button" id="resetBtn">${t("hero.reset")}</button>
        <button class="btn btn--primary btn--sm" type="button" id="shareBtn">${t("hero.share")}</button>
      </div>
    </div>

    <div class="hero-progress" role="region" aria-label="${t("hero.progressRegion")}">
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressPct}">
        <div class="progress-fill" style="--progress: ${progressPct}%"></div>
      </div>
      <div class="hero-progress-meta">
        <span>${t("hero.progressFilled", { pct: `<strong>${progressPct}</strong>` })}</span>
        <span>${t("hero.groupMatches", { done: `<strong>${derived.filledGroupMatches}</strong>`, total: derived.totalGroupMatches })}</span>
        <span>${t("hero.knockoutMatches", { done: `<strong>${derived.decidedKnockoutMatches}</strong>`, total: derived.totalKnockoutMatches })}</span>
        <span>${t("hero.championProjected")}: <strong>${championDisplay}</strong></span>
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
    if (confirm(t("hero.resetConfirm"))) actions.reset();
  });
  container.querySelector("#shareBtn").addEventListener("click", () => {
    actions.openShare();
  });

  container.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      setLang(btn.dataset.lang);
    });
  });
}
