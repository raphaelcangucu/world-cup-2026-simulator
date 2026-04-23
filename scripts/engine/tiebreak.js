import { FIFA_RANKING } from "../data/groups.js";

export function compareHeadToHead(a, b) {
  return (b.head.pts - a.head.pts) || (b.head.gd - a.head.gd) || (b.head.gf - a.head.gf);
}

export function compareFallback(a, b) {
  return (b.pts - a.pts)
    || (b.gd - a.gd)
    || (b.gf - a.gf)
    || (a.fair - b.fair)
    || ((FIFA_RANKING[a.team] || 999) - (FIFA_RANKING[b.team] || 999));
}

function resolveHead(row, tiedTeams) {
  const head = tiedTeams
    .filter(name => name !== row.team)
    .reduce(
      (acc, opponent) => {
        const match = row.opponents[opponent];
        if (!match) return acc;
        acc.pts += match.pts;
        acc.gd += match.gd;
        acc.gf += match.gf;
        return acc;
      },
      { pts: 0, gd: 0, gf: 0 }
    );
  return { ...row, head };
}

export function rankTiedRows(rows) {
  if (rows.length <= 1) return rows;
  const tiedTeams = rows.map(r => r.team);
  const withHead = rows
    .map(row => resolveHead(row, tiedTeams))
    .sort((a, b) => compareHeadToHead(a, b) || compareFallback(a, b));
  return withHead.map(({ head, ...rest }) => rest);
}

export function rankRows(rows) {
  const base = [...rows].sort((a, b) => b.pts - a.pts);
  const ranked = [];
  let i = 0;
  while (i < base.length) {
    let j = i + 1;
    while (j < base.length && base[j].pts === base[i].pts) j++;
    ranked.push(...rankTiedRows(base.slice(i, j)));
    i = j;
  }
  return ranked;
}
