const THEME_COLORS = {
  dark: "#111318",
  light: "#F9FAFB"
};

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.getElementById("themeColorMeta");
  if (meta) meta.setAttribute("content", THEME_COLORS[theme] || THEME_COLORS.dark);
}

export function listenSystemTheme(callback) {
  if (!window.matchMedia) return () => {};
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  const handler = e => callback(e.matches ? "light" : "dark");
  if (mq.addEventListener) mq.addEventListener("change", handler);
  else mq.addListener(handler);
  return () => {
    if (mq.removeEventListener) mq.removeEventListener("change", handler);
    else mq.removeListener(handler);
  };
}
