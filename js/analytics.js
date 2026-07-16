// analytics.js — Analytics respectueux de la vie privée (LinuxDojo)
//
// GoatCounter : sans cookie, sans donnée personnelle, open-source, hébergé
// (rien à opérer côté serveur). Cohérent avec l'esprit « zéro compte, zéro
// tracking intrusif » du jeu. Chargé en dernier, en asynchrone : n'impacte ni
// le temps d'affichage, ni le fonctionnement hors-ligne — si le script externe
// échoue (offline, bloqueur…), le jeu marche exactement pareil.
//
// ┌───────────────────────────────────────────────────────────────────────┐
// │  CONFIGURATION — UNE SEULE LIGNE À ÉDITER (GC_CODE ci-dessous)         │
// │  1. Crée un compte gratuit sur https://www.goatcounter.com/           │
// │     (choisis un « code », p.ex. "linuxdojo").                         │
// │  2. Reporte ce code dans GC_CODE.                                     │
// │  Tant que GC_CODE est vide, ce module ne charge RIEN et ne track      │
// │  RIEN (no-op total). Aucun tracking n'est actif tant que tu n'as pas  │
// │  fait ce choix explicite.                                             │
// └───────────────────────────────────────────────────────────────────────┘
const GC_CODE = "marcorelli"; // → https://marcorelli.goatcounter.com

// ── Garde-fous confidentialité / propreté ──────────────────────────────────
// On ne charge l'analytics que si : elle est configurée, le visiteur n'a pas
// demandé à ne pas être suivi (Do Not Track / Global Privacy Control), et on
// n'est pas en développement local (localhost / fichier ouvert directement).
function _gcAllowed() {
  if (!GC_CODE) return false;
  if (typeof navigator === "undefined" || typeof location === "undefined") return false;
  const dnt = navigator.doNotTrack || (typeof window !== "undefined" && window.doNotTrack) || navigator.msDoNotTrack;
  if (dnt === "1" || dnt === "yes") return false;
  if (navigator.globalPrivacyControl) return false;
  const h = location.hostname;
  if (location.protocol === "file:" || h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h === "") return false;
  return true;
}

function _gcEndpoint() { return "https://" + GC_CODE + ".goatcounter.com/count"; }

// Compte un évènement personnalisé (p.ex. "cert-obtenu", "mission-echouee").
// Sûr à appeler de partout : no-op si l'analytics n'est pas chargée (non
// configurée, DNT actif, hors-ligne…). Ne lève jamais.
function trackEvent(name) {
  try {
    if (typeof window !== "undefined" && window.goatcounter && typeof window.goatcounter.count === "function") {
      window.goatcounter.count({ path: String(name), title: String(name), event: true });
    }
  } catch { /* l'analytics ne doit jamais casser le jeu */ }
}

if (typeof window !== "undefined") {
  // Exposé pour les autres modules, même quand l'analytics est désactivée
  // (ils appellent trackEvent() sans se soucier de l'état — ce sera un no-op).
  window.trackEvent = trackEvent;

  if (_gcAllowed()) {
    // count.js compte automatiquement la vue de page à son chargement, puis
    // expose window.goatcounter.count() pour les évènements personnalisés.
    window.goatcounter = window.goatcounter || {};
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", _gcEndpoint());
    (document.body || document.documentElement).appendChild(s);
  }
}
