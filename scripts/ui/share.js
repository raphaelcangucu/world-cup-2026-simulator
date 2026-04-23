import { teamLabel, teamFlagCode, teamFlagUrl } from "../data/teams.js";
import { ROUND_LABELS } from "../data/bracket-template.js";
import { buildShareUrl } from "../state/serialize.js";
import { announce, escapeHtml } from "../utils/dom.js";

const PNG_W = 1200;
const PNG_H = 630;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function drawShareImage(snapshot) {
  const canvas = document.createElement("canvas");
  canvas.width = PNG_W;
  canvas.height = PNG_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const theme = snapshot.state.theme;
  const bg = theme === "light" ? "#F9FAFB" : "#111318";
  const text = theme === "light" ? "#111827" : "#F2F4F8";
  const muted = theme === "light" ? "#6B7280" : "#9CA0AF";
  const card = theme === "light" ? "#FFFFFF" : "#212632";
  const border = theme === "light" ? "#E1E4EB" : "#2B2F37";
  const green = "#22C55E";

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, PNG_W, PNG_H);

  const grad = ctx.createLinearGradient(80, 0, PNG_W - 80, 0);
  grad.addColorStop(0, "#E6F9EF");
  grad.addColorStop(0.5, "#22C55E");
  grad.addColorStop(1, "#368BC9");

  ctx.font = '700 20px "Inter", system-ui, sans-serif';
  ctx.fillStyle = green;
  ctx.textBaseline = "top";
  ctx.fillText("MACRO.MARKETS · CENÁRIO DO TORNEIO", 80, 70);

  ctx.font = '800 60px "Inter", system-ui, sans-serif';
  ctx.fillStyle = grad;
  ctx.fillText("Simulador Copa 2026", 80, 100);

  const champion = snapshot.derived.champion;
  if (champion) {
    ctx.font = '600 22px "Inter", system-ui, sans-serif';
    ctx.fillStyle = muted;
    ctx.fillText("Campeão projetado", 80, 200);

    ctx.font = '800 80px "Inter", system-ui, sans-serif';
    ctx.fillStyle = text;
    ctx.fillText(teamLabel(champion), 80, 232);

    const code = teamFlagCode(champion);
    if (code) {
      try {
        const img = await loadImage(`https://flagcdn.com/w160/${code}.png`);
        if (img) {
          const flagW = 120;
          const flagH = 90;
          const flagY = 236;
          const nameWidth = ctx.measureText(teamLabel(champion)).width;
          ctx.drawImage(img, 80 + nameWidth + 30, flagY, flagW, flagH);
        }
      } catch { /* ignore */ }
    }

    await drawMiniBracket(ctx, snapshot, {
      x: 80, y: 360, w: PNG_W - 160, h: 200,
      text, muted, card, border, green, theme
    });
  } else {
    ctx.font = '600 30px "Inter", system-ui, sans-serif';
    ctx.fillStyle = muted;
    ctx.fillText("Monte seu cenário do torneio.", 80, 260);
    ctx.font = '500 22px "Inter", system-ui, sans-serif';
    ctx.fillStyle = muted;
    ctx.fillText("Preencha placares da fase de grupos, veja classificados e simule o mata-mata.", 80, 310);
  }

  ctx.font = '500 18px "Inter", system-ui, sans-serif';
  ctx.fillStyle = muted;
  ctx.fillText("gerado em macro.markets · compartilhe seu palpite", 80, PNG_H - 50);

  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, PNG_W - 80, PNG_H - 80);

  return canvas;
}

async function drawMiniBracket(ctx, snapshot, box) {
  const { derived } = snapshot;
  const rounds = ["QF", "SF", "F"];
  const colW = box.w / 3;

  ctx.font = '700 14px "Inter", system-ui, sans-serif';
  rounds.forEach((r, i) => {
    ctx.fillStyle = box.muted;
    ctx.fillText(ROUND_LABELS[r].toUpperCase(), box.x + colW * i + 10, box.y);
  });

  const flagCache = {};
  const teams = new Set();
  rounds.forEach(r => {
    (derived.matches[r] || []).forEach(m => {
      if (m.homeTeam) teams.add(m.homeTeam);
      if (m.awayTeam) teams.add(m.awayTeam);
    });
  });

  await Promise.all([...teams].map(async team => {
    const code = teamFlagCode(team);
    if (!code) return;
    const img = await loadImage(`https://flagcdn.com/w40/${code}.png`);
    if (img) flagCache[team] = img;
  }));

  rounds.forEach((round, roundIdx) => {
    const list = derived.matches[round] || [];
    list.forEach((match, idx) => {
      const cardH = 54;
      const gap = 12;
      const colTop = box.y + 24;
      const cardW = colW - 20;
      const cardX = box.x + colW * roundIdx + 10;
      const cardY = colTop + idx * (cardH + gap);

      ctx.fillStyle = box.card;
      ctx.strokeStyle = box.border;
      ctx.lineWidth = 1;
      roundRect(ctx, cardX, cardY, cardW, cardH, 6);
      ctx.fill();
      ctx.stroke();

      drawMiniRow(ctx, match, "home", cardX, cardY, cardW, box, flagCache);
      drawMiniRow(ctx, match, "away", cardX, cardY + cardH / 2, cardW, box, flagCache);

      ctx.strokeStyle = box.border;
      ctx.beginPath();
      ctx.moveTo(cardX, cardY + cardH / 2);
      ctx.lineTo(cardX + cardW, cardY + cardH / 2);
      ctx.stroke();
    });
  });
}

function drawMiniRow(ctx, match, side, x, y, w, box, flagCache) {
  const team = side === "home" ? match.homeTeam : match.awayTeam;
  const score = side === "home" ? match.home : match.away;
  const isWinner = match.winner && match.winner === team;
  const label = team && team !== "TBD" ? teamLabel(team) : "A definir";

  if (isWinner) {
    ctx.fillStyle = "rgba(34,197,94,0.12)";
    ctx.fillRect(x + 1, y + 1, w - 2, 26);
    ctx.fillStyle = "#22C55E";
    ctx.fillRect(x + 1, y + 1, 3, 26);
  }

  if (flagCache[team]) {
    ctx.drawImage(flagCache[team], x + 10, y + 7, 18, 14);
  }

  ctx.font = isWinner ? '700 14px "Inter", system-ui, sans-serif' : '500 14px "Inter", system-ui, sans-serif';
  ctx.fillStyle = isWinner ? "#22C55E" : (team && team !== "TBD" ? box.text : box.muted);
  const maxW = w - 70;
  const display = truncateLabel(ctx, label, maxW);
  ctx.fillText(display, x + 34, y + 8);

  ctx.font = '700 14px "Inter", system-ui, sans-serif';
  ctx.fillStyle = isWinner ? "#22C55E" : box.text;
  const s = score !== "" ? String(score) : "-";
  const sw = ctx.measureText(s).width;
  ctx.fillText(s, x + w - sw - 12, y + 8);
}

function truncateLabel(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + "…").width > maxW) t = t.slice(0, -1);
  return t + "…";
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function openShareModal(snapshot) {
  const root = document.getElementById("shareModalRoot");
  if (!root) return;
  root.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="shareTitle">
      <div class="modal">
        <div class="modal-head">
          <div>
            <p class="kicker">Compartilhar</p>
            <h2 id="shareTitle">Seu cenário</h2>
          </div>
          <button class="modal-close" type="button" aria-label="Fechar" data-modal-close>×</button>
        </div>
        <div id="sharePreview" style="display:grid;gap:10px;align-items:center;justify-items:center">
          <div class="muted small" id="shareLoading">Gerando imagem…</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">
          <button class="btn btn--secondary" type="button" id="shareCopyLink">Copiar link</button>
          <button class="btn btn--secondary" type="button" id="shareDownloadImg">Baixar imagem</button>
          <button class="btn btn--primary" type="button" id="shareNative">Compartilhar</button>
        </div>
      </div>
    </div>
  `;

  const backdrop = root.querySelector(".modal-backdrop");
  const close = () => { root.innerHTML = ""; };
  backdrop.addEventListener("click", event => {
    if (event.target === backdrop) close();
  });
  root.querySelector("[data-modal-close]").addEventListener("click", close);
  document.addEventListener("keydown", function esc(event) {
    if (event.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
  });

  const canvas = await drawShareImage(snapshot);
  const preview = root.querySelector("#sharePreview");
  preview.innerHTML = "";
  if (canvas) {
    canvas.style.width = "100%";
    canvas.style.maxWidth = "480px";
    canvas.style.borderRadius = "10px";
    canvas.style.border = "1px solid var(--divider)";
    preview.appendChild(canvas);
  } else {
    preview.innerHTML = `<p class="muted small">Não foi possível gerar a prévia.</p>`;
  }

  const url = buildShareUrl(snapshot.state);

  root.querySelector("#shareCopyLink").addEventListener("click", async () => {
    await navigator.clipboard.writeText(url);
    announce("Link copiado.");
  });

  root.querySelector("#shareDownloadImg").addEventListener("click", () => {
    if (!canvas) return;
    canvas.toBlob(blob => {
      if (!blob) return;
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = "simulador-copa-2026.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
      announce("Imagem baixada.");
    }, "image/png");
  });

  root.querySelector("#shareNative").addEventListener("click", async () => {
    try {
      if (canvas && navigator.canShare) {
        const blob = await new Promise(r => canvas.toBlob(r, "image/png"));
        if (blob) {
          const file = new File([blob], "simulador-copa-2026.png", { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], url, title: "Simulador Copa 2026" });
            return;
          }
        }
      }
      if (navigator.share) {
        await navigator.share({ url, title: "Simulador Copa 2026" });
        return;
      }
      await navigator.clipboard.writeText(url);
      announce("Link copiado.");
    } catch {
      /* cancelled or unsupported */
    }
  });
}

export async function copyShareLink(snapshot) {
  const url = buildShareUrl(snapshot.state);
  try {
    await navigator.clipboard.writeText(url);
    announce("Link copiado.");
  } catch {
    announce("Não foi possível copiar. Use Compartilhar.");
  }
}
