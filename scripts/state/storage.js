const STATE_KEY = "wc26-state";
const THEME_KEY = "wc26-theme";
const TOUR_KEY = "wc26-tour";

export function savePersistedState(payload) {
  try {
    localStorage.setItem(STATE_KEY, payload);
  } catch {
    /* quota/private mode — ignore */
  }
}

export function readPersistedState() {
  try {
    return localStorage.getItem(STATE_KEY) || "";
  } catch {
    return "";
  }
}

export function clearPersistedState() {
  try {
    localStorage.removeItem(STATE_KEY);
  } catch {
    /* ignore */
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function readTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "";
  } catch {
    return "";
  }
}

export function saveTourDone() {
  try {
    localStorage.setItem(TOUR_KEY, "done");
  } catch {
    /* ignore */
  }
}

export function readTourDone() {
  try {
    return localStorage.getItem(TOUR_KEY) === "done";
  } catch {
    return false;
  }
}

export function clearTour() {
  try {
    localStorage.removeItem(TOUR_KEY);
  } catch {
    /* ignore */
  }
}
