let cached = null;

export async function loadFixtures() {
  if (cached) return cached;
  const response = await fetch("group-schedule.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Falha ao carregar group-schedule.json: ${response.status}`);
  }
  cached = await response.json();
  return cached;
}

export function getMatchId(match) {
  return `${match.round}|${match.group}|${match.homeKey}|${match.awayKey}`;
}
