const FLOW_SELECTOR = "[data-flow-input]";

function getFlowInputs(root) {
  return Array.from(root.querySelectorAll(FLOW_SELECTOR))
    .filter(el => !el.disabled && el.offsetParent !== null);
}

function focusByOffset(root, currentEl, delta) {
  const inputs = getFlowInputs(root);
  const currentIdx = inputs.indexOf(currentEl);
  if (currentIdx === -1) return false;
  const nextIdx = currentIdx + delta;
  if (nextIdx < 0 || nextIdx >= inputs.length) return false;
  const next = inputs[nextIdx];
  next.focus();
  if (typeof next.select === "function") next.select();
  return true;
}

export function wireKeyboardFlow(root) {
  root.addEventListener("keydown", event => {
    const target = event.target;
    if (!target || !target.matches || !target.matches(FLOW_SELECTOR)) return;

    if (event.key === "Enter") {
      event.preventDefault();
      focusByOffset(root, target, 1);
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      if (target.selectionStart === target.value.length || target.type !== "number") {
        event.preventDefault();
        focusByOffset(root, target, 1);
      }
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      if (target.selectionStart === 0 || target.type !== "number") {
        event.preventDefault();
        focusByOffset(root, target, -1);
      }
      return;
    }

    if (event.key === "Escape") {
      target.value = "";
      target.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }
  });

  root.addEventListener("input", event => {
    const target = event.target;
    if (!target || !target.matches || !target.matches(FLOW_SELECTOR)) return;
    if (target.type !== "number") return;
    if (target.value.length >= 2) {
      focusByOffset(root, target, 1);
    }
  });
}

export function restoreFocus(root, attr, value) {
  if (!value) return;
  const selector = `[${attr}="${CSS.escape(value)}"]`;
  const el = root.querySelector(selector);
  if (el && typeof el.focus === "function") {
    el.focus({ preventScroll: true });
    if (typeof el.select === "function") el.select();
  }
}

export function captureFocusId(root, attr) {
  const active = document.activeElement;
  if (!active || !active.matches || !active.matches(FLOW_SELECTOR)) return null;
  if (!root.contains(active)) return null;
  return active.getAttribute(attr);
}
