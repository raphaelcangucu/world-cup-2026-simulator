import { GROUPS } from "../data/groups.js";
import { getMatchId } from "../data/fixtures.js";
import { rankRows } from "./tiebreak.js";

function emptyRow(team) {
  return {
    team,
    pts: 0,
    w: 0,
    d: 0,
    l: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    fair: 0,
    opponents: {}
  };
}

export function isReady(value) {
  return value !== "" && value != null && Number.isFinite(Number(value));
}

export function computeGroupTable(group, fixtures, scores) {
  const teams = GROUPS[group];
  if (!teams) throw new Error(`Grupo desconhecido: ${group}`);

  const rows = Object.fromEntries(teams.map(team => [team, emptyRow(team)]));

  fixtures
    .filter(match => match.group === group)
    .forEach(match => {
      const played = scores[getMatchId(match)];
      if (!played || !isReady(played.home) || !isReady(played.away)) return;

      const home = rows[match.homeKey];
      const away = rows[match.awayKey];
      if (!home || !away) return;

      const homeGoals = Number(played.home);
      const awayGoals = Number(played.away);

      home.gf += homeGoals;
      home.ga += awayGoals;
      away.gf += awayGoals;
      away.ga += homeGoals;
      home.gd = home.gf - home.ga;
      away.gd = away.gf - away.ga;

      home.opponents[match.awayKey] = {
        pts: homeGoals > awayGoals ? 3 : homeGoals === awayGoals ? 1 : 0,
        gd: homeGoals - awayGoals,
        gf: homeGoals
      };
      away.opponents[match.homeKey] = {
        pts: awayGoals > homeGoals ? 3 : homeGoals === awayGoals ? 1 : 0,
        gd: awayGoals - homeGoals,
        gf: awayGoals
      };

      if (homeGoals > awayGoals) {
        home.pts += 3;
        home.w += 1;
        away.l += 1;
      } else if (awayGoals > homeGoals) {
        away.pts += 3;
        away.w += 1;
        home.l += 1;
      } else {
        home.pts += 1;
        away.pts += 1;
        home.d += 1;
        away.d += 1;
      }
    });

  return rankRows(Object.values(rows));
}

export function computeAllGroupTables(fixtures, scores) {
  const groupTables = {};
  for (const group of Object.keys(GROUPS)) {
    groupTables[group] = computeGroupTable(group, fixtures, scores);
  }
  return groupTables;
}
