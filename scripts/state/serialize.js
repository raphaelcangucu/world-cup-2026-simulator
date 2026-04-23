const VERSION = 2;

function encodeBase64Url(str) {
  const base = btoa(unescape(encodeURIComponent(str)));
  return base.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(payload) {
  const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
  return decodeURIComponent(escape(atob(padded)));
}

export function serialize(state) {
  const raw = JSON.stringify({
    v: VERSION,
    scores: state.scores,
    knockoutMatches: state.knockoutMatches,
    activeGroup: state.activeGroup,
    activeRound: state.activeRound,
    groupView: state.groupView,
    knockoutPhase: state.knockoutPhase
  });
  return encodeBase64Url(raw);
}

export function deserialize(payload) {
  if (!payload) return null;
  try {
    const decoded = JSON.parse(decodeBase64Url(payload));
    if (!decoded || typeof decoded !== "object") return null;
    return {
      v: typeof decoded.v === "number" ? decoded.v : 1,
      scores: isObject(decoded.scores) ? decoded.scores : {},
      knockoutMatches: isObject(decoded.knockoutMatches) ? sanitizeKnockout(decoded.knockoutMatches) : {},
      activeGroup: typeof decoded.activeGroup === "string" ? decoded.activeGroup : "A",
      activeRound: typeof decoded.activeRound === "string" ? decoded.activeRound : "R1",
      groupView: decoded.groupView === "round" ? "round" : "group",
      knockoutPhase: typeof decoded.knockoutPhase === "string" ? decoded.knockoutPhase : "R32"
    };
  } catch {
    return null;
  }
}

function isObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function sanitizeKnockout(raw) {
  const out = {};
  for (const [id, record] of Object.entries(raw)) {
    if (!isObject(record)) continue;
    out[id] = {
      home: typeof record.home === "string" ? record.home : "",
      away: typeof record.away === "string" ? record.away : ""
    };
  }
  return out;
}

export function buildShareUrl(state) {
  const payload = serialize(state);
  return `${location.origin}${location.pathname}${location.search}#s=${payload}`;
}

export function readUrlPayload() {
  const hash = location.hash || "";
  if (!hash.startsWith("#s=")) return "";
  return hash.slice(3);
}

export function pushUrlPayload(state) {
  const payload = serialize(state);
  history.replaceState(null, "", `${location.pathname}${location.search}#s=${payload}`);
  return payload;
}
