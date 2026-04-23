import { VENUE_LABELS } from "./venues.js";

const SUPPORTED_LANGS = ["pt", "en", "es"];
const DEFAULT_LANG = "pt";
const STORAGE_KEY = "wc26-lang";
const BCP47 = { pt: "pt-BR", en: "en-US", es: "es-ES" };

const STRINGS = {
  pt: {
    "app.title": "Simulador Copa do Mundo 2026 · macro.markets",
    "app.description": "Simule seus palpites da Copa do Mundo 2026, do jogo de grupo ao campeão, e compartilhe seu cenário.",
    "app.og.title": "Simulador Copa do Mundo 2026 · macro.markets",
    "app.og.description": "Monte seus palpites e compartilhe seu cenário do torneio.",
    "app.skipLink": "Pular para o conteúdo",
    "app.errorLoading": "Erro ao carregar",
    "app.ready": "Simulador pronto.",

    "hero.kicker": "macro.markets · cenário do torneio",
    "hero.title": "Simulador Copa do Mundo",
    "hero.themeToggle": "Alternar tema claro/escuro",
    "hero.themeToggleTitle": "Alternar tema",
    "hero.tips": "Dicas",
    "hero.tipsAria": "Rever dicas",
    "hero.copyLink": "Copiar link",
    "hero.reset": "Resetar",
    "hero.resetConfirm": "Resetar todos os placares e escolhas?",
    "hero.share": "Compartilhar",
    "hero.globalActions": "Ações globais",
    "hero.progressRegion": "Progresso do torneio",
    "hero.progressFilled": "{pct}% preenchido",
    "hero.groupMatches": "{done}/{total} jogos de grupo",
    "hero.knockoutMatches": "{done}/{total} mata-mata definidos",
    "hero.championProjected": "Campeão projetado",
    "hero.championOpen": "Em aberto",
    "hero.languageLabel": "Idioma",

    "groups.kicker": "Fase de grupos",
    "groups.title": "Grupos e rodadas",
    "groups.viewSwitchLabel": "Modo de visualização dos grupos",
    "groups.viewByGroup": "Por grupo",
    "groups.viewByRound": "Por rodada",
    "groups.pagerLabel": "Selecionar grupo",
    "groups.groupN": "Grupo {g}",
    "groups.matchesKicker": "Partidas",
    "groups.matchesTitle": "Grupo {g} · jogos",
    "groups.tableKicker": "Tabela ao vivo",
    "groups.tableTitle": "Classificação",
    "groups.tableAria": "Classificação do grupo",
    "groups.col.team": "Seleção",
    "groups.col.pts": "Pts",
    "groups.col.w": "V",
    "groups.col.d": "E",
    "groups.col.l": "D",
    "groups.col.gf": "GP",
    "groups.col.ga": "GC",
    "groups.col.gd": "SG",
    "groups.col.ptsTitle": "Pontos",
    "groups.col.wTitle": "Vitórias",
    "groups.col.dTitle": "Empates",
    "groups.col.lTitle": "Derrotas",
    "groups.col.gfTitle": "Gols pró",
    "groups.col.gaTitle": "Gols contra",
    "groups.col.gdTitle": "Saldo de gols",
    "groups.pickWinner": "Escolher {team} vencedor",
    "groups.goalsOf": "Gols de {team}",

    "rounds.R1": "1ª rodada",
    "rounds.R2": "2ª rodada",
    "rounds.R3": "3ª rodada",

    "bracket.kicker": "Mata-mata",
    "bracket.title": "Bracket",
    "bracket.helper": "Digite o placar ou clique no radio para declarar vencedor. Radio aplica 1×0.",
    "bracket.regionLabel": "Bracket do mata-mata",
    "bracket.tiedWarning": "Empate — escolha vencedor",
    "bracket.mobileTabsLabel": "Fase do mata-mata",
    "bracket.decided": "{done}/{total} decididos",
    "bracket.feedsFrom": "Vindo de {labels}",
    "bracket.pickWinner": "Escolher {team} vencedor",
    "bracket.goalsOf": "Gols de {team}",
    "bracket.tbd": "A definir",

    "round.R32": "Round of 32",
    "round.R16": "Oitavas",
    "round.QF": "Quartas",
    "round.SF": "Semifinal",
    "round.F": "Final",

    "champion.kicker": "Campeão",
    "champion.openMarket": "Mercado aberto",
    "champion.openHint": "Preencha os placares do mata-mata para definir o campeão e ver o caminho percorrido até a final.",
    "champion.pathKicker": "Caminho pro título",
    "champion.pathEmpty": "Sem partidas no caminho.",
    "champion.champTag": "Campeão",

    "qualifiers.kicker": "Classificados",
    "qualifiers.title": "Seeds e melhores terceiros",
    "qualifiers.seeds.kicker": "Primeiros e segundos",
    "qualifiers.seeds.title": "Classificados diretos",
    "qualifiers.seeds.second": "2º {team}",
    "qualifiers.thirds.kicker": "Melhores terceiros",
    "qualifiers.thirds.title": "{best}/{cutoff} entram",
    "qualifiers.thirds.cut": "Linha de corte",
    "qualifiers.thirds.stats": "{pts} pts · SG {gd} · GP {gf}",
    "qualifiers.mapping.kicker": "Mapa oficial FIFA",
    "qualifiers.mapping.title": "Slots dos terceiros",
    "qualifiers.mapping.groupsQualified": "Grupos com terceiros classificados: <strong>{groups}</strong>",
    "qualifiers.mapping.pending": "Aguardando",
    "qualifiers.mapping.empty": "Preencha mais jogos para travar o chaveamento.",
    "qualifiers.mapping.slot": "Slot {slot}",

    "share.modal.kicker": "Compartilhar",
    "share.modal.title": "Seu cenário",
    "share.modal.close": "Fechar",
    "share.modal.loading": "Gerando imagem…",
    "share.modal.copyLink": "Copiar link",
    "share.modal.downloadImg": "Baixar imagem",
    "share.modal.share": "Compartilhar",
    "share.linkCopied": "Link copiado.",
    "share.linkCopyFailed": "Não foi possível copiar. Use Compartilhar.",
    "share.imgDownloaded": "Imagem baixada.",
    "share.previewFailed": "Não foi possível gerar a prévia.",
    "share.canvas.kicker": "MACRO.MARKETS · CENÁRIO DO TORNEIO",
    "share.canvas.title": "Simulador Copa 2026",
    "share.canvas.championLabel": "Campeão projetado",
    "share.canvas.emptyHeadline": "Monte seu cenário do torneio.",
    "share.canvas.emptyBody": "Preencha placares da fase de grupos, veja classificados e simule o mata-mata.",
    "share.canvas.footer": "gerado em macro.markets · compartilhe seu palpite",
    "share.filename": "simulador-copa-2026.png",
    "share.nativeTitle": "Simulador Copa 2026",

    "onboarding.groups.title": "Preencha os placares",
    "onboarding.groups.body": "Digite números ou use o radio para declarar 1×0 rápido. Enter avança pro próximo campo.",
    "onboarding.table.title": "Tabela ao vivo",
    "onboarding.table.body": "Critérios oficiais de desempate (pontos, SG, head-to-head) entram automaticamente.",
    "onboarding.bracket.title": "Bracket e campeão",
    "onboarding.bracket.body": "Preencha o mata-mata para desbloquear o caminho até o título. Compartilhe quando terminar.",
    "onboarding.close": "Fechar",
    "onboarding.closeAria": "Fechar",
    "onboarding.back": "Voltar",
    "onboarding.next": "Próximo",
    "onboarding.step": "{current} / {total}"
  },
  en: {
    "app.title": "World Cup 2026 Simulator · macro.markets",
    "app.description": "Simulate your 2026 World Cup picks — from group games to champion — and share your scenario.",
    "app.og.title": "World Cup 2026 Simulator · macro.markets",
    "app.og.description": "Build your picks and share your tournament scenario.",
    "app.skipLink": "Skip to content",
    "app.errorLoading": "Loading error",
    "app.ready": "Simulator ready.",

    "hero.kicker": "macro.markets · tournament scenario",
    "hero.title": "World Cup Simulator",
    "hero.themeToggle": "Toggle light/dark theme",
    "hero.themeToggleTitle": "Toggle theme",
    "hero.tips": "Tips",
    "hero.tipsAria": "Review tips",
    "hero.copyLink": "Copy link",
    "hero.reset": "Reset",
    "hero.resetConfirm": "Reset all scores and picks?",
    "hero.share": "Share",
    "hero.globalActions": "Global actions",
    "hero.progressRegion": "Tournament progress",
    "hero.progressFilled": "{pct}% filled",
    "hero.groupMatches": "{done}/{total} group matches",
    "hero.knockoutMatches": "{done}/{total} knockouts decided",
    "hero.championProjected": "Projected champion",
    "hero.championOpen": "Open",
    "hero.languageLabel": "Language",

    "groups.kicker": "Group stage",
    "groups.title": "Groups and rounds",
    "groups.viewSwitchLabel": "Groups view mode",
    "groups.viewByGroup": "By group",
    "groups.viewByRound": "By round",
    "groups.pagerLabel": "Select group",
    "groups.groupN": "Group {g}",
    "groups.matchesKicker": "Matches",
    "groups.matchesTitle": "Group {g} · matches",
    "groups.tableKicker": "Live table",
    "groups.tableTitle": "Standings",
    "groups.tableAria": "Group standings",
    "groups.col.team": "Team",
    "groups.col.pts": "Pts",
    "groups.col.w": "W",
    "groups.col.d": "D",
    "groups.col.l": "L",
    "groups.col.gf": "GF",
    "groups.col.ga": "GA",
    "groups.col.gd": "GD",
    "groups.col.ptsTitle": "Points",
    "groups.col.wTitle": "Wins",
    "groups.col.dTitle": "Draws",
    "groups.col.lTitle": "Losses",
    "groups.col.gfTitle": "Goals for",
    "groups.col.gaTitle": "Goals against",
    "groups.col.gdTitle": "Goal difference",
    "groups.pickWinner": "Pick {team} as winner",
    "groups.goalsOf": "{team} goals",

    "rounds.R1": "Matchday 1",
    "rounds.R2": "Matchday 2",
    "rounds.R3": "Matchday 3",

    "bracket.kicker": "Knockout",
    "bracket.title": "Bracket",
    "bracket.helper": "Type the score or click the radio to declare the winner. Radio applies 1×0.",
    "bracket.regionLabel": "Knockout bracket",
    "bracket.tiedWarning": "Tied — pick a winner",
    "bracket.mobileTabsLabel": "Knockout phase",
    "bracket.decided": "{done}/{total} decided",
    "bracket.feedsFrom": "From {labels}",
    "bracket.pickWinner": "Pick {team} as winner",
    "bracket.goalsOf": "{team} goals",
    "bracket.tbd": "TBD",

    "round.R32": "Round of 32",
    "round.R16": "Round of 16",
    "round.QF": "Quarterfinals",
    "round.SF": "Semifinal",
    "round.F": "Final",

    "champion.kicker": "Champion",
    "champion.openMarket": "Open market",
    "champion.openHint": "Fill in the knockout scores to crown a champion and see the path to the final.",
    "champion.pathKicker": "Path to the title",
    "champion.pathEmpty": "No matches in the path.",
    "champion.champTag": "Champion",

    "qualifiers.kicker": "Qualifiers",
    "qualifiers.title": "Seeds and best thirds",
    "qualifiers.seeds.kicker": "First and second place",
    "qualifiers.seeds.title": "Direct qualifiers",
    "qualifiers.seeds.second": "2nd {team}",
    "qualifiers.thirds.kicker": "Best thirds",
    "qualifiers.thirds.title": "{best}/{cutoff} advance",
    "qualifiers.thirds.cut": "Cut line",
    "qualifiers.thirds.stats": "{pts} pts · GD {gd} · GF {gf}",
    "qualifiers.mapping.kicker": "Official FIFA map",
    "qualifiers.mapping.title": "Thirds slots",
    "qualifiers.mapping.groupsQualified": "Groups with qualified thirds: <strong>{groups}</strong>",
    "qualifiers.mapping.pending": "Waiting",
    "qualifiers.mapping.empty": "Fill in more matches to lock the bracket.",
    "qualifiers.mapping.slot": "Slot {slot}",

    "share.modal.kicker": "Share",
    "share.modal.title": "Your scenario",
    "share.modal.close": "Close",
    "share.modal.loading": "Generating image…",
    "share.modal.copyLink": "Copy link",
    "share.modal.downloadImg": "Download image",
    "share.modal.share": "Share",
    "share.linkCopied": "Link copied.",
    "share.linkCopyFailed": "Could not copy. Use Share.",
    "share.imgDownloaded": "Image downloaded.",
    "share.previewFailed": "Could not generate preview.",
    "share.canvas.kicker": "MACRO.MARKETS · TOURNAMENT SCENARIO",
    "share.canvas.title": "World Cup 2026 Simulator",
    "share.canvas.championLabel": "Projected champion",
    "share.canvas.emptyHeadline": "Build your tournament scenario.",
    "share.canvas.emptyBody": "Fill in the group stage scores, see qualifiers and simulate the knockouts.",
    "share.canvas.footer": "generated at macro.markets · share your prediction",
    "share.filename": "world-cup-2026-simulator.png",
    "share.nativeTitle": "World Cup 2026 Simulator",

    "onboarding.groups.title": "Fill in the scores",
    "onboarding.groups.body": "Type numbers or use the radio for a quick 1×0. Enter jumps to the next field.",
    "onboarding.table.title": "Live standings",
    "onboarding.table.body": "Official tiebreakers (points, GD, head-to-head) apply automatically.",
    "onboarding.bracket.title": "Bracket and champion",
    "onboarding.bracket.body": "Fill the knockouts to unlock the path to the title. Share when you're done.",
    "onboarding.close": "Close",
    "onboarding.closeAria": "Close",
    "onboarding.back": "Back",
    "onboarding.next": "Next",
    "onboarding.step": "{current} / {total}"
  },
  es: {
    "app.title": "Simulador Mundial 2026 · macro.markets",
    "app.description": "Simula tus predicciones del Mundial 2026, desde la fase de grupos hasta el campeón, y comparte tu escenario.",
    "app.og.title": "Simulador Mundial 2026 · macro.markets",
    "app.og.description": "Arma tus predicciones y comparte tu escenario del torneo.",
    "app.skipLink": "Saltar al contenido",
    "app.errorLoading": "Error al cargar",
    "app.ready": "Simulador listo.",

    "hero.kicker": "macro.markets · escenario del torneo",
    "hero.title": "Simulador Mundial",
    "hero.themeToggle": "Alternar tema claro/oscuro",
    "hero.themeToggleTitle": "Alternar tema",
    "hero.tips": "Ayuda",
    "hero.tipsAria": "Revisar consejos",
    "hero.copyLink": "Copiar enlace",
    "hero.reset": "Reiniciar",
    "hero.resetConfirm": "¿Reiniciar todos los resultados y elecciones?",
    "hero.share": "Compartir",
    "hero.globalActions": "Acciones globales",
    "hero.progressRegion": "Progreso del torneo",
    "hero.progressFilled": "{pct}% completado",
    "hero.groupMatches": "{done}/{total} partidos de grupos",
    "hero.knockoutMatches": "{done}/{total} eliminatorias definidas",
    "hero.championProjected": "Campeón proyectado",
    "hero.championOpen": "Abierto",
    "hero.languageLabel": "Idioma",

    "groups.kicker": "Fase de grupos",
    "groups.title": "Grupos y jornadas",
    "groups.viewSwitchLabel": "Modo de vista de los grupos",
    "groups.viewByGroup": "Por grupo",
    "groups.viewByRound": "Por jornada",
    "groups.pagerLabel": "Seleccionar grupo",
    "groups.groupN": "Grupo {g}",
    "groups.matchesKicker": "Partidos",
    "groups.matchesTitle": "Grupo {g} · partidos",
    "groups.tableKicker": "Tabla en vivo",
    "groups.tableTitle": "Clasificación",
    "groups.tableAria": "Clasificación del grupo",
    "groups.col.team": "Selección",
    "groups.col.pts": "Pts",
    "groups.col.w": "G",
    "groups.col.d": "E",
    "groups.col.l": "P",
    "groups.col.gf": "GF",
    "groups.col.ga": "GC",
    "groups.col.gd": "DG",
    "groups.col.ptsTitle": "Puntos",
    "groups.col.wTitle": "Ganados",
    "groups.col.dTitle": "Empatados",
    "groups.col.lTitle": "Perdidos",
    "groups.col.gfTitle": "Goles a favor",
    "groups.col.gaTitle": "Goles en contra",
    "groups.col.gdTitle": "Diferencia de goles",
    "groups.pickWinner": "Elegir a {team} como ganador",
    "groups.goalsOf": "Goles de {team}",

    "rounds.R1": "Jornada 1",
    "rounds.R2": "Jornada 2",
    "rounds.R3": "Jornada 3",

    "bracket.kicker": "Eliminatorias",
    "bracket.title": "Llaves",
    "bracket.helper": "Escribe el resultado o haz clic en el radio para declarar al ganador. El radio aplica 1×0.",
    "bracket.regionLabel": "Llaves de eliminatoria",
    "bracket.tiedWarning": "Empate — elige un ganador",
    "bracket.mobileTabsLabel": "Fase eliminatoria",
    "bracket.decided": "{done}/{total} decididos",
    "bracket.feedsFrom": "Viene de {labels}",
    "bracket.pickWinner": "Elegir a {team} como ganador",
    "bracket.goalsOf": "Goles de {team}",
    "bracket.tbd": "Por definir",

    "round.R32": "Dieciseisavos",
    "round.R16": "Octavos",
    "round.QF": "Cuartos",
    "round.SF": "Semifinal",
    "round.F": "Final",

    "champion.kicker": "Campeón",
    "champion.openMarket": "Mercado abierto",
    "champion.openHint": "Completa los resultados de la eliminatoria para definir al campeón y ver el camino hasta la final.",
    "champion.pathKicker": "Camino al título",
    "champion.pathEmpty": "Sin partidos en el camino.",
    "champion.champTag": "Campeón",

    "qualifiers.kicker": "Clasificados",
    "qualifiers.title": "Cabezas de serie y mejores terceros",
    "qualifiers.seeds.kicker": "Primeros y segundos",
    "qualifiers.seeds.title": "Clasificados directos",
    "qualifiers.seeds.second": "2º {team}",
    "qualifiers.thirds.kicker": "Mejores terceros",
    "qualifiers.thirds.title": "{best}/{cutoff} avanzan",
    "qualifiers.thirds.cut": "Línea de corte",
    "qualifiers.thirds.stats": "{pts} pts · DG {gd} · GF {gf}",
    "qualifiers.mapping.kicker": "Mapa oficial FIFA",
    "qualifiers.mapping.title": "Slots de terceros",
    "qualifiers.mapping.groupsQualified": "Grupos con terceros clasificados: <strong>{groups}</strong>",
    "qualifiers.mapping.pending": "En espera",
    "qualifiers.mapping.empty": "Completa más partidos para fijar el cuadro.",
    "qualifiers.mapping.slot": "Slot {slot}",

    "share.modal.kicker": "Compartir",
    "share.modal.title": "Tu escenario",
    "share.modal.close": "Cerrar",
    "share.modal.loading": "Generando imagen…",
    "share.modal.copyLink": "Copiar enlace",
    "share.modal.downloadImg": "Descargar imagen",
    "share.modal.share": "Compartir",
    "share.linkCopied": "Enlace copiado.",
    "share.linkCopyFailed": "No se pudo copiar. Usa Compartir.",
    "share.imgDownloaded": "Imagen descargada.",
    "share.previewFailed": "No se pudo generar la vista previa.",
    "share.canvas.kicker": "MACRO.MARKETS · ESCENARIO DEL TORNEO",
    "share.canvas.title": "Simulador Mundial 2026",
    "share.canvas.championLabel": "Campeón proyectado",
    "share.canvas.emptyHeadline": "Arma tu escenario del torneo.",
    "share.canvas.emptyBody": "Completa los resultados de grupos, mira a los clasificados y simula las eliminatorias.",
    "share.canvas.footer": "generado en macro.markets · comparte tu pronóstico",
    "share.filename": "simulador-mundial-2026.png",
    "share.nativeTitle": "Simulador Mundial 2026",

    "onboarding.groups.title": "Completa los resultados",
    "onboarding.groups.body": "Escribe números o usa el radio para un 1×0 rápido. Enter avanza al siguiente campo.",
    "onboarding.table.title": "Tabla en vivo",
    "onboarding.table.body": "Los criterios oficiales de desempate (puntos, DG, head-to-head) se aplican automáticamente.",
    "onboarding.bracket.title": "Llaves y campeón",
    "onboarding.bracket.body": "Completa las eliminatorias para desbloquear el camino al título. Comparte cuando termines.",
    "onboarding.close": "Cerrar",
    "onboarding.closeAria": "Cerrar",
    "onboarding.back": "Atrás",
    "onboarding.next": "Siguiente",
    "onboarding.step": "{current} / {total}"
  }
};

let currentLang = loadInitialLang();
const listeners = new Set();

function loadInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED_LANGS.includes(saved)) return saved;
  } catch { /* ignore */ }

  if (typeof navigator !== "undefined" && navigator.language) {
    const short = navigator.language.slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS.includes(short)) return short;
  }
  return DEFAULT_LANG;
}

export function getLang() {
  return currentLang;
}

export function getSupportedLangs() {
  return SUPPORTED_LANGS.slice();
}

export function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang) || lang === currentLang) return;
  currentLang = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
  if (typeof document !== "undefined") {
    document.documentElement.lang = BCP47[lang];
  }
  listeners.forEach(fn => {
    try { fn(lang); } catch (err) { console.error("i18n listener error", err); }
  });
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function t(key, vars) {
  const dict = STRINGS[currentLang] || STRINGS[DEFAULT_LANG];
  const fallback = STRINGS[DEFAULT_LANG];
  const raw = dict[key] ?? fallback[key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, name) => (name in vars ? String(vars[name]) : `{${name}}`));
}

export function formatDate(isoDate) {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(BCP47[currentLang] || BCP47.pt, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

export function venueLabel(key) {
  if (!key) return "";
  const entry = VENUE_LABELS[key];
  if (!entry) return key;
  return entry[currentLang] || entry.pt || key;
}

export function applyDocumentLang() {
  if (typeof document !== "undefined") {
    document.documentElement.lang = BCP47[currentLang];
  }
}
