import { loadFixtures } from "./data/fixtures.js";
import { loadThirdMap } from "./data/third-place-map.js";
import { createStore } from "./state/store.js";
import { applyTheme, listenSystemTheme } from "./utils/theme.js";
import { wireKeyboardFlow, restoreFocus, captureFocusId } from "./utils/keyboard.js";
import { onReady, announce } from "./utils/dom.js";
import { renderHero } from "./ui/hero.js";
import { renderGroupsSection } from "./ui/groups.js";
import { renderQualifiersSection } from "./ui/thirds.js";
import { renderBracketSection } from "./ui/bracket.js";
import { renderChampionSection } from "./ui/champion.js";
import { openShareModal, copyShareLink } from "./ui/share.js";
import { startOnboarding } from "./ui/onboarding.js";
import { readTheme } from "./state/storage.js";

async function bootstrap() {
  const [fixtures, thirdMap] = await Promise.all([loadFixtures(), loadThirdMap()]);
  const store = createStore({ fixtures, thirdMap });

  const heroEl = document.getElementById("heroSection");
  const groupsEl = document.getElementById("groupsSection");
  const qualifiersEl = document.getElementById("qualifiersSection");
  const knockoutEl = document.getElementById("knockoutSection");
  const championEl = document.getElementById("championSection");
  const mainEl = document.getElementById("mainContent");

  wireKeyboardFlow(mainEl);

  const actions = {
    setGroupScore: (match, side, value) => store.setGroupScore(match, side, value),
    pickGroupWinner: (match, homeWin) => store.pickGroupWinner(match, homeWin),
    setKnockoutScore: (match, side, value) => store.setKnockoutScore(match, side, value),
    pickKnockoutWinner: (match, homeWin) => store.pickKnockoutWinner(match, homeWin),
    setActiveGroup: group => store.setActiveGroup(group),
    setActiveRound: round => store.setActiveRound(round),
    setGroupView: view => store.setGroupView(view),
    setKnockoutPhase: phase => store.setKnockoutPhase(phase),
    setTheme: theme => store.setTheme(theme),
    reset: () => store.reset(),
    markOnboardingDone: () => store.markOnboardingDone(),
    resetOnboarding: () => {
      store.resetOnboarding();
      setTimeout(() => startOnboarding(() => store.markOnboardingDone()), 120);
    },
    openShare: () => openShareModal(store.getSnapshot()),
    copyLink: () => copyShareLink(store.getSnapshot())
  };

  store.subscribe(snapshot => {
    applyTheme(snapshot.state.theme);
    const flowId = captureFocusId(mainEl, "data-flow-id");

    renderHero(heroEl, snapshot, actions);
    renderGroupsSection(groupsEl, snapshot, actions, fixtures);
    renderQualifiersSection(qualifiersEl, snapshot);
    renderBracketSection(knockoutEl, snapshot, actions);
    renderChampionSection(championEl, snapshot);

    if (flowId) restoreFocus(mainEl, "data-flow-id", flowId);
  });

  listenSystemTheme(newTheme => {
    if (!readTheme()) store.setTheme(newTheme);
  });

  const initial = store.getSnapshot();
  if (!initial.state.onboardingDone) {
    setTimeout(() => startOnboarding(() => store.markOnboardingDone()), 800);
  }

  announce("Simulador pronto.");
}

onReady(() => {
  bootstrap().catch(err => {
    console.error(err);
    const root = document.getElementById("mainContent");
    if (root) {
      root.innerHTML = `<section class="section-panel"><h2>Erro ao carregar</h2><p class="muted">${err.message}</p></section>`;
    }
  });
});
