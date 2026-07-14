// seasonal.js — Événements saisonniers : thème temporaire + easter egg limité dans le temps
//
// Pendant les fenêtres de dates ci-dessous, le site bascule automatiquement sur un thème
// visuel spécial (indépendant des thèmes déblocables du profil) et affiche une bannière
// annonçant l'événement. Une commande cachée dans le terminal (jamais révélée) débloque un
// badge exclusif tant que l'événement est actif — le badge reste ensuite acquis pour de bon,
// mais on ne peut le décrocher que pendant la fenêtre concernée.

const SEASONAL_EVENTS = [
  {
    id: "halloween",
    name: "Halloween",
    icon: "🎃",
    bodyClass: "season-halloween",
    fx: "spooky",
    banner: "Le dojo se pare de citrouilles pour Halloween. Un fantôme rôderait dans le terminal...",
    badge: { id: "halloween", label: "🎃 Citrouille runtime" },
    // [mois, jourDébut, jourFin] — un événement peut couvrir plusieurs segments (chevauchement de mois)
    ranges: [[10, 24, 31], [11, 1, 2]],
  },
  {
    id: "noel",
    name: "Noël",
    icon: "🎄",
    bodyClass: "season-noel",
    fx: "snow",
    banner: "Le dojo se couvre de neige pour les fêtes. Un sapin scintille quelque part dans le terminal...",
    badge: { id: "noel", label: "🎄 Elfe du terminal" },
    ranges: [[12, 15, 31], [1, 1, 2]],
  },
];

// Renvoie l'événement actif aujourd'hui (ou null). Exposé globalement pour terminal.js.
function getActiveSeasonalEvent(date) {
  const d = date || new Date();
  const m = d.getMonth() + 1, day = d.getDate();
  return SEASONAL_EVENTS.find(ev => ev.ranges.some(([rm, d1, d2]) => rm === m && day >= d1 && day <= d2)) || null;
}

// Clé de sauvegarde stable pour toute la durée d'un événement, même s'il chevauche deux
// années civiles (ex: Noël du 15/12 au 02/01) — le segment de janvier compte sur l'année
// de décembre qui précède.
function _seasonalYearKey(ev, date) {
  const d = date || new Date();
  const y = (d.getMonth() + 1 === 1 && ev.ranges.some(r => r[0] === 12)) ? d.getFullYear() - 1 : d.getFullYear();
  return ev.id + "_" + y;
}

// Marque le secret de l'événement en cours comme découvert (appelé depuis terminal.js).
function markSeasonalSecret(eventId) {
  const ev = SEASONAL_EVENTS.find(e => e.id === eventId);
  if (!ev) return;
  const key = _seasonalYearKey(ev);
  if (typeof GAME === "undefined") return;
  const already = GAME.secrets && GAME.secrets[key];
  if (typeof markSecret === "function") markSecret(key);
  if (!already) {
    if (typeof addXP === "function") addXP(100);
    if (typeof showAchievement === "function") {
      showAchievement(ev.icon, ev.badge.label.split(" ").slice(1).join(" "), t("season.secret"));
    }
    if (typeof SFX !== "undefined") SFX.levelup();
  }
}

// Un badge saisonnier est acquis dès qu'une des années de son historique a été trouvée.
function _seasonalBadgeUnlocked(prefix) {
  return typeof GAME !== "undefined" && GAME.secrets &&
    Object.keys(GAME.secrets).some(k => k.startsWith(prefix + "_"));
}

// Enregistre les badges saisonniers dans le système de badges existant (une seule fois).
function registerSeasonalBadges() {
  if (typeof BADGES === "undefined") return;
  SEASONAL_EVENTS.forEach(ev => {
    if (BADGES.some(b => b.id === "season_" + ev.id)) return;
    BADGES.push({
      id: "season_" + ev.id,
      label: ev.badge.label,
      secret: true,
      cond: () => _seasonalBadgeUnlocked(ev.id),
    });
  });
}

/* ── Effets visuels : neige (Noël) et brume spectrale (Halloween) ─────── */
class SeasonalFX {
  constructor(mode) {
    this.mode = mode; // "snow" | "spooky"
    this.canvas = document.createElement("canvas");
    this.canvas.id = "seasonal-canvas";
    this.canvas.style.cssText = "position:fixed;inset:0;z-index:1;opacity:0.65;pointer-events:none;";
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.running = false;
    this._resize();
    this._onResize = () => this._resize();
    window.addEventListener("resize", this._onResize);
  }
  _resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const count = this.mode === "snow" ? 70 : 14;
    this.items = Array.from({ length: count }, () => this._spawn());
  }
  _spawn() {
    const glyphs = this.mode === "snow" ? ["❄", "❅", "❆"] : ["🦇", "🎃", "👻"];
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      s: this.mode === "snow" ? 8 + Math.random() * 14 : 16 + Math.random() * 14,
      v: this.mode === "snow" ? 0.5 + Math.random() * 1.3 : 0.3 + Math.random() * 0.6,
      drift: Math.random() * 2 - 1,
      glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
      wobble: Math.random() * Math.PI * 2,
    };
  }
  start() { if (this.running) return; this.running = true; this._loop(); }
  stop() {
    this.running = false;
    window.removeEventListener("resize", this._onResize);
    if (this.canvas.parentNode) this.canvas.remove();
  }
  _loop() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.textBaseline = "top";
    this.items.forEach(p => {
      this.ctx.font = p.s + "px sans-serif";
      p.wobble += 0.02;
      this.ctx.globalAlpha = this.mode === "snow" ? 0.85 : 0.5;
      this.ctx.fillText(p.glyph, p.x + Math.sin(p.wobble) * 12, p.y);
      p.y += p.v;
      p.x += p.drift * 0.3;
      if (p.y > this.canvas.height + 20) { p.y = -20; p.x = Math.random() * this.canvas.width; }
    });
    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this._loop());
  }
}
let _seasonalFX = null;

/* ── Bannière d'annonce (dismissible pour la session) ──────────────────── */
function _seasonalBannerDismissKey(ev) { return "linuxdojo_season_dismiss_" + _seasonalYearKey(ev); }

function renderSeasonalBanner() {
  const existing = document.getElementById("seasonal-banner");
  if (existing) existing.remove();

  const ev = getActiveSeasonalEvent();
  if (!ev) return;
  try { if (sessionStorage.getItem(_seasonalBannerDismissKey(ev))) return; } catch {}

  const home = document.getElementById("page-home");
  const dailyBanner = document.getElementById("daily-banner");
  if (!home) return;

  const div = document.createElement("div");
  div.id = "seasonal-banner";
  div.className = "seasonal-banner seasonal-banner-" + ev.id;
  div.innerHTML = `
    <div class="daily-banner-left">
      <span class="daily-banner-icon">${ev.icon}</span>
      <div>
        <div class="daily-banner-title">${t("season.event", { name: ev.name })}</div>
        <div class="daily-banner-sub">${ev.banner}</div>
      </div>
    </div>
    <button class="seasonal-banner-close" aria-label="${t("season.close")}">✕</button>`;

  if (dailyBanner) home.insertBefore(div, dailyBanner);
  else home.insertBefore(div, home.firstChild);

  div.querySelector(".seasonal-banner-close").addEventListener("click", () => {
    div.remove();
    try { sessionStorage.setItem(_seasonalBannerDismissKey(ev), "1"); } catch {}
  });
}

/* ── Application du thème + effet visuel selon l'événement actif ──────── */
function applySeasonalTheme() {
  document.body.className = document.body.className.replace(/\bseason-\S+/g, "").trim();
  if (_seasonalFX) { _seasonalFX.stop(); _seasonalFX = null; }

  const ev = getActiveSeasonalEvent();
  if (!ev) return;
  document.body.classList.add(ev.bodyClass);
  _seasonalFX = new SeasonalFX(ev.fx);
  _seasonalFX.start();
}

function initSeasonal() {
  registerSeasonalBadges();
  applySeasonalTheme();
  renderSeasonalBanner();
}
