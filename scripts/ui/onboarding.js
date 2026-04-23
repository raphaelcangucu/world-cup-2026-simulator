import { t } from "../i18n/index.js";

const STEPS = [
  {
    id: "groups",
    target: '[data-match-card] input[data-score="group"]',
    titleKey: "onboarding.groups.title",
    bodyKey: "onboarding.groups.body",
    placement: "bottom"
  },
  {
    id: "table",
    target: "#groupsSection .group-table",
    titleKey: "onboarding.table.title",
    bodyKey: "onboarding.table.body",
    placement: "top"
  },
  {
    id: "bracket",
    target: "#knockoutSection .bracket-stage",
    titleKey: "onboarding.bracket.title",
    bodyKey: "onboarding.bracket.body",
    placement: "top"
  }
];

let activeStepIdx = -1;
let activeTooltip = null;

export function startOnboarding(onDone) {
  if (activeStepIdx !== -1) return;
  activeStepIdx = 0;
  renderStep(onDone);
}

function renderStep(onDone) {
  cleanup();
  if (activeStepIdx >= STEPS.length) {
    activeStepIdx = -1;
    onDone?.();
    return;
  }
  const step = STEPS[activeStepIdx];
  const target = document.querySelector(step.target);
  if (!target) {
    activeStepIdx += 1;
    requestAnimationFrame(() => renderStep(onDone));
    return;
  }

  const rect = target.getBoundingClientRect();
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.setAttribute("role", "tooltip");
  const isLast = activeStepIdx === STEPS.length - 1;
  tooltip.innerHTML = `
    <div class="tooltip-head">
      <strong>${t(step.titleKey)}</strong>
      <button class="tooltip-close" type="button" aria-label="${t("onboarding.closeAria")}">×</button>
    </div>
    <p class="small">${t(step.bodyKey)}</p>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <span class="small muted">${t("onboarding.step", { current: activeStepIdx + 1, total: STEPS.length })}</span>
      <div style="display:flex;gap:6px">
        ${activeStepIdx > 0 ? `<button class="btn btn--ghost btn--sm" type="button" data-nav="back">${t("onboarding.back")}</button>` : ""}
        <button class="btn btn--primary btn--sm" type="button" data-nav="next">${isLast ? t("onboarding.close") : t("onboarding.next")}</button>
      </div>
    </div>
  `;

  document.body.appendChild(tooltip);
  activeTooltip = tooltip;

  const tRect = tooltip.getBoundingClientRect();
  let top;
  if (step.placement === "top") {
    top = window.scrollY + rect.top - tRect.height - 10;
  } else {
    top = window.scrollY + rect.bottom + 10;
  }
  let left = window.scrollX + rect.left + rect.width / 2 - tRect.width / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - tRect.width - 12));

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;

  tooltip.querySelector(".tooltip-close").addEventListener("click", () => {
    cleanup();
    activeStepIdx = -1;
    onDone?.();
  });
  tooltip.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => {
      activeStepIdx += btn.dataset.nav === "back" ? -1 : 1;
      renderStep(onDone);
    });
  });
}

function cleanup() {
  if (activeTooltip && activeTooltip.parentNode) {
    activeTooltip.parentNode.removeChild(activeTooltip);
  }
  activeTooltip = null;
}

export function stopOnboarding() {
  cleanup();
  activeStepIdx = -1;
}
