import { NEXT_ROUNDS } from "../data/bracket-template.js";
import { debounce } from "../utils/dom.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function buildPairs(matches) {
  const pairs = [];
  ["R16", "QF", "SF", "F"].forEach(round => {
    NEXT_ROUNDS[round].forEach((parents, index) => {
      const targetId = `${round}-${index + 1}`;
      parents.forEach(parentId => {
        const parentMatch = findMatch(parentId, matches);
        const targetMatch = findMatch(targetId, matches);
        const active = parentMatch?.winner && targetMatch?.winner === parentMatch?.winner;
        const highlight = active;
        pairs.push({ from: parentId, to: targetId, active: highlight });
      });
    });
  });
  return pairs;
}

function findMatch(id, matches) {
  for (const key of ["R32", "R16", "QF", "SF", "F"]) {
    const match = matches[key]?.find(m => m.id === id);
    if (match) return match;
  }
  return null;
}

export function drawConnectors(board, svg, matches, pathIds) {
  if (!board || !svg) return;
  const rect = board.getBoundingClientRect();
  svg.setAttribute("width", rect.width);
  svg.setAttribute("height", rect.height);
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const pairs = buildPairs(matches);
  const pathSet = new Set(pathIds || []);

  pairs.forEach(({ from, to, active }) => {
    const fromEl = board.querySelector(`[data-match-id="${from}"]`);
    const toEl = board.querySelector(`[data-match-id="${to}"]`);
    if (!fromEl || !toEl) return;

    const fr = fromEl.getBoundingClientRect();
    const tr = toEl.getBoundingClientRect();
    const leftFlow = fr.left < tr.left;

    const x1 = leftFlow ? fr.right - rect.left : fr.left - rect.left;
    const y1 = fr.top + fr.height / 2 - rect.top;
    const x2 = leftFlow ? tr.left - rect.left : tr.right - rect.left;
    const y2 = tr.top + tr.height / 2 - rect.top;
    const mx = (x1 + x2) / 2;

    const isOnPath = pathSet.has(from) && pathSet.has(to);
    const strokeColor = isOnPath
      ? "var(--primary)"
      : active
        ? "rgba(34,197,94,0.4)"
        : "var(--divider)";
    const width = isOnPath ? "2" : "1";

    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", `M${x1} ${y1} H${mx} V${y2} H${x2}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", strokeColor);
    path.setAttribute("stroke-width", width);
    path.setAttribute("stroke-linecap", "round");
    svg.appendChild(path);
  });
}

export function observeResize(board, redraw) {
  const debounced = debounce(redraw, 100);
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(debounced);
    ro.observe(board);
    return () => ro.disconnect();
  }
  window.addEventListener("resize", debounced);
  return () => window.removeEventListener("resize", debounced);
}
