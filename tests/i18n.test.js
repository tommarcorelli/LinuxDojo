// tests/i18n.test.js
// Vérifie le système d'internationalisation (js/i18n.js) sans navigateur :
//   1. t() : lookup, repli FR, repli sur la clé, interpolation {var}
//   2. pick() : sélection { fr, en } et passe-plat des chaînes simples
//   3. Parité des clés fr ↔ en (aucune traduction oubliée d'un côté)
//   4. Toutes les clés data-i18n* posées dans index.html existent dans la table
// Zéro dépendance : exécuter avec  node tests/i18n.test.js
//
// i18n.js est écrit pour le navigateur (document, navigator, localStorage) et
// exécute du code au chargement. On le charge dans un contexte vm isolé avec
// des stubs minimaux, en forçant document.readyState = "loading" pour que
// initI18n() ne se lance pas tout de suite (il s'abonne à DOMContentLoaded).

"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

let pass = 0, fail = 0;
const failures = [];
function test(name, fn) {
  try { fn(); pass++; }
  catch (e) { fail++; failures.push({ name, error: e.message }); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || "assertion échouée"); }
function assertEqual(a, b, label) {
  assert(a === b, `${label || "valeur"} attendue: ${JSON.stringify(b)}, reçue: ${JSON.stringify(a)}`);
}

// ── Chargement de i18n.js dans un contexte vm ───────────────────
function loadI18n(navLang) {
  const src = fs.readFileSync(path.join(__dirname, "..", "js", "i18n.js"), "utf8");
  const store = {};
  const sandbox = {
    navigator: { language: navLang || "fr-FR" },
    localStorage: {
      getItem(k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
      setItem(k, v) { store[k] = String(v); },
    },
    document: {
      readyState: "loading",              // → initI18n différé, pas exécuté ici
      documentElement: {},
      addEventListener() {},
      querySelectorAll() { return []; },
      querySelector() { return null; },
    },
    console,
  };
  const exportLine = `\nvar __I18N__ = { UI, t, pick, rankName, LANGS, LANG };\n`;
  vm.createContext(sandbox);
  vm.runInContext(src + exportLine, sandbox, { filename: "js/i18n.js" });
  return sandbox.__I18N__;
}

// ═══════════════════════════════════════════════════════════════
// t() — traduction, replis, interpolation
// ═══════════════════════════════════════════════════════════════
test("t() renvoie la chaîne EN quand la langue du navigateur est l'anglais", () => {
  const { t, LANG } = loadI18n("en-US");
  assertEqual(LANG, "en", "LANG détectée");
  assertEqual(t("nav.home"), "Home", "nav.home en anglais");
});

test("t() retombe sur FR quand la langue du navigateur est autre", () => {
  const { t, LANG } = loadI18n("fr-FR");
  assertEqual(LANG, "fr", "LANG détectée");
  assertEqual(t("nav.home"), "Accueil", "nav.home en français");
});

test("t() renvoie la clé elle-même si elle est absente (signale sans planter)", () => {
  const { t } = loadI18n("fr-FR");
  assertEqual(t("clé.inexistante.xyz"), "clé.inexistante.xyz", "clé manquante");
});

test("t() interpole les variables {var}", () => {
  const { t } = loadI18n("fr-FR");
  assertEqual(t("rank.new", { name: "Root" }), "Nouveau rang : Root", "interpolation name");
  assertEqual(t("rank.reached", { xp: 1800 }), "Tu as atteint 1800 XP !", "interpolation xp");
});

// ═══════════════════════════════════════════════════════════════
// pick() — contenu multilingue
// ═══════════════════════════════════════════════════════════════
test("pick({fr,en}) choisit la variante de la langue courante", () => {
  const { pick } = loadI18n("en-US");
  assertEqual(pick({ fr: "Bonjour", en: "Hello" }), "Hello", "variante EN");
});

test("pick({fr}) retombe sur FR si la variante EN manque", () => {
  const { pick } = loadI18n("en-US");
  assertEqual(pick({ fr: "Bonjour" }), "Bonjour", "repli FR");
});

test("pick('texte') renvoie la chaîne telle quelle (contenu non traduit)", () => {
  const { pick } = loadI18n("en-US");
  assertEqual(pick("chaîne simple"), "chaîne simple", "passe-plat");
});

test("rankName() lit un name string ou {fr,en}", () => {
  const { rankName } = loadI18n("en-US");
  assertEqual(rankName({ name: { fr: "Bleu", en: "Blue" } }), "Blue", "rank {fr,en}");
  assertEqual(rankName({ name: "Root" }), "Root", "rank string");
});

// ═══════════════════════════════════════════════════════════════
// Parité des clés fr ↔ en
// ═══════════════════════════════════════════════════════════════
test("aucune clé présente en FR n'est absente en EN (et inversement)", () => {
  const { UI } = loadI18n("fr-FR");
  const frKeys = Object.keys(UI.fr).sort();
  const enKeys = Object.keys(UI.en).sort();
  const missingInEn = frKeys.filter(k => !(k in UI.en));
  const missingInFr = enKeys.filter(k => !(k in UI.fr));
  assert(missingInEn.length === 0, "clés absentes en EN : " + missingInEn.join(", "));
  assert(missingInFr.length === 0, "clés absentes en FR : " + missingInFr.join(", "));
});

// ═══════════════════════════════════════════════════════════════
// Cohérence index.html ↔ table de chaînes
// ═══════════════════════════════════════════════════════════════
test("toutes les clés data-i18n* d'index.html existent dans la table", () => {
  const { UI } = loadI18n("fr-FR");
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const keys = new Set();

  // data-i18n="k" et data-i18n-html="k"
  for (const m of html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)) keys.add(m[1]);
  // data-i18n-attr="attr:k;attr2:k2"
  for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    m[1].split(";").forEach(pair => {
      const key = pair.split(":")[1];
      if (key) keys.add(key.trim());
    });
  }

  assert(keys.size > 0, "aucune clé data-i18n trouvée dans index.html (annotation cassée ?)");
  const missing = [...keys].filter(k => !(k in UI.fr) || !(k in UI.en));
  assert(missing.length === 0, "clés utilisées dans le HTML mais absentes de la table : " + missing.join(", "));
});

// ─────────────────────────────────────────────────────────────────────────
console.log(`\n${pass} test(s) réussi(s), ${fail} échec(s) sur ${pass + fail} au total.\n`);
if (fail > 0) {
  console.log("❌ Échecs :");
  failures.forEach(f => console.log(`  • ${f.name}\n    → ${f.error}`));
  process.exit(1);
} else {
  console.log("✅ Tous les tests passent.");
}
