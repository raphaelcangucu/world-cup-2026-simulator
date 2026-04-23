let cached = null;

export async function loadThirdMap() {
  if (cached) return cached;
  const response = await fetch("third-place-map.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Falha ao carregar third-place-map.json: ${response.status}`);
  }
  cached = await response.json();
  return cached;
}
