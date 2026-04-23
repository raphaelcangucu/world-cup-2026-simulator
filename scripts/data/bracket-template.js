export const R32_TEMPLATE = [
  { id: "R32-1", label: "Round of 32 · 1", home: "A2", away: "B2", side: "L" },
  { id: "R32-2", label: "Round of 32 · 2", home: "C1", away: "F2", side: "L" },
  { id: "R32-3", label: "Round of 32 · 3", home: "E1", away: "TP:E1", side: "L" },
  { id: "R32-4", label: "Round of 32 · 4", home: "F1", away: "C2", side: "L" },
  { id: "R32-5", label: "Round of 32 · 5", home: "E2", away: "I2", side: "L" },
  { id: "R32-6", label: "Round of 32 · 6", home: "I1", away: "TP:I1", side: "L" },
  { id: "R32-7", label: "Round of 32 · 7", home: "A1", away: "TP:A1", side: "L" },
  { id: "R32-8", label: "Round of 32 · 8", home: "L1", away: "TP:L1", side: "L" },
  { id: "R32-9", label: "Round of 32 · 9", home: "G1", away: "TP:G1", side: "R" },
  { id: "R32-10", label: "Round of 32 · 10", home: "D1", away: "TP:D1", side: "R" },
  { id: "R32-11", label: "Round of 32 · 11", home: "H1", away: "J2", side: "R" },
  { id: "R32-12", label: "Round of 32 · 12", home: "K2", away: "L2", side: "R" },
  { id: "R32-13", label: "Round of 32 · 13", home: "B1", away: "TP:B1", side: "R" },
  { id: "R32-14", label: "Round of 32 · 14", home: "D2", away: "G2", side: "R" },
  { id: "R32-15", label: "Round of 32 · 15", home: "J1", away: "H2", side: "R" },
  { id: "R32-16", label: "Round of 32 · 16", home: "K1", away: "TP:K1", side: "R" }
];

export const NEXT_ROUNDS = {
  R16: [
    ["R32-1", "R32-2"], ["R32-3", "R32-4"], ["R32-5", "R32-6"], ["R32-7", "R32-8"],
    ["R32-9", "R32-10"], ["R32-11", "R32-12"], ["R32-13", "R32-14"], ["R32-15", "R32-16"]
  ],
  QF: [
    ["R16-1", "R16-2"], ["R16-3", "R16-4"],
    ["R16-5", "R16-6"], ["R16-7", "R16-8"]
  ],
  SF: [
    ["QF-1", "QF-2"],
    ["QF-3", "QF-4"]
  ],
  F: [["SF-1", "SF-2"]]
};

import { t } from "../i18n/index.js";

export const ROUND_ORDER = ["R32", "R16", "QF", "SF", "F"];

export function roundLabel(round) {
  return t(`round.${round}`);
}

export function isLeftSide(matchId) {
  if (matchId === "F") return null;
  if (matchId.startsWith("R32-")) {
    const idx = Number(matchId.split("-")[1]);
    return idx <= 8;
  }
  if (matchId.startsWith("R16-")) {
    const idx = Number(matchId.split("-")[1]);
    return idx <= 4;
  }
  if (matchId.startsWith("QF-")) {
    const idx = Number(matchId.split("-")[1]);
    return idx <= 2;
  }
  if (matchId.startsWith("SF-")) {
    return matchId === "SF-1";
  }
  return null;
}
