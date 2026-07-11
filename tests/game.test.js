// tests/game.test.js
// Suite de tests unitaires pour la logique de progression (js/game.js) :
// sauvegarde/chargement, XP, badges. Aucune dépendance externe :
// exécuter avec  node tests/game.test.js
//
// game.js est écrit pour tourner dans un navigateur : il exécute du code
// au chargement (création du terminal, écoute d'événements DOM, etc.).
// Plutôt que de le réécrire, on l'exécute dans un contexte vm isolé avec
// un DOM minimal "stub" (assez pour ne pas planter, pas assez pour être
// un vrai navigateur). On stub aussi `getRank` à un rang constant pour
// éviter de déclencher les animations de changement de rang (SFX,
// particules...), hors-sujet ici : ce fichier teste la logique, pas l'UI.

"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// ─────────────────────────────────────────────────────────────────────────
// Mini framework de test (zéro dépendance) — identique à terminal.test.js
// ─────────────────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    pass++;
  } catch (e) {
    fail++;
    failures.push({ name, error: e.message });
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || "assertion échouée");
}
function assertEqual(a, b, label) {
  assert(a === b, `${label || "valeur"} attendue: ${JSON.stringify(b)}, reçue: ${JSON.stringify(a)}`);
}
// game.js tourne dans son propre contexte vm : son `Set` n'est pas le même
// objet que le `Set` de ce fichier de test, donc `instanceof` ne marche
// pas d'un contexte à l'autre. On vérifie la forme plutôt que le type exact.
function assertIsSetLike(v, label) {
  assert(v && typeof v.add === "function" && typeof v.has === "function" && typeof v.size === "number",
    `${label || "valeur"} devrait se comporter comme un Set`);
}

// ─────────────────────────────────────────────────────────────────────────
// DOM stub minimal — juste assez pour que game.js se charge sans planter
// ─────────────────────────────────────────────────────────────────────────
function makeFakeElement() {
  const el = {
    classList: {
      _set: new Set(),
      add(c) { this._set.add(c); },
      remove(c) { this._set.delete(c); },
      toggle(c) { this._set.has(c) ? this._set.delete(c) : this._set.add(c); },
      contains(c) { return this._set.has(c); },
    },
    style: {},
    dataset: {},
    textContent: "",
    value: "",
    addEventListener() {},
    removeEventListener() {},
    appendChild() {},
    remove() {},
    focus() {},
    click() {},
    querySelectorAll() { return []; },
    querySelector() { return null; },
    closest() { return null; },
  };
  return el;
}

function makeFakeLocalStorage() {
  const store = {};
  return {
    getItem(k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
    setItem(k, v) { store[k] = String(v); },
    removeItem(k) { delete store[k]; },
    _dump() { return store; },
  };
}

// Classe Terminal minimale : game.js fait `new Terminal($("terminal"))` et
// réassigne `Terminal.prototype.printErr` au chargement.
function FakeTerminal(el) { this.el = el; }
FakeTerminal.prototype.printErr = function (text) { return text; };

function buildSandbox() {
  // Registre id → élément : contrairement à la version précédente,
  // getElementById(id) renvoie désormais TOUJOURS le même objet pour un
  // même id (comme un vrai DOM), ce qui permet aux tests d'inspecter après
  // coup l'état d'un élément que game.js a manipulé (ex: la bannière
  // multi-onglets).
  const elements = new Map();
  function elementFor(id) {
    if (!elements.has(id)) elements.set(id, makeFakeElement());
    return elements.get(id);
  }

  const fakeDocument = {
    getElementById(id) { return elementFor(id); },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    createElement() { return makeFakeElement(); },
    addEventListener() {},
    body: makeFakeElement(),
    activeElement: null,
  };

  // window.addEventListener("storage", ...) doit vraiment enregistrer le
  // callback pour qu'un test puisse simuler un événement venant d'un autre
  // onglet via fakeWindow.__dispatch("storage", { key, newValue }).
  const listeners = {};
  const fakeWindow = {
    innerWidth: 1024, innerHeight: 768,
    addEventListener(type, cb) { (listeners[type] = listeners[type] || []).push(cb); },
    removeEventListener() {},
    location: { reload() {} },
    __dispatch(type, evt) { (listeners[type] || []).forEach(cb => cb(evt)); },
  };

  const sandbox = {
    document: fakeDocument,
    window: fakeWindow,
    localStorage: makeFakeLocalStorage(),
    Terminal: FakeTerminal,
    // Rang constant : neutralise la branche "changement de rang" d'addXP()
    // (animation/son hors-sujet pour ces tests de logique pure)
    getRank() { return { name: "Rang-Test", icon: "🏅" }; },
    setTimeout,
    clearTimeout,
    console,
    confirm() { return false; },
  };
  sandbox.window.document = fakeDocument;
  vm.createContext(sandbox);
  return sandbox;
}

// game.js déclare son état avec `let`/`const` au niveau racine du script.
// Ces déclarations ne deviennent PAS des propriétés du contexte global
// (contrairement à `var`), donc on ne peut pas les lire depuis l'extérieur
// telles quelles. Astuce : on ajoute à la suite du script une ligne `var`
// qui capture les bindings qui nous intéressent — `var`, lui, s'accroche
// bien au global du contexte vm.
const EXPORTED = [
  "GAME", "BADGES", "SAVE_KEY", "SAVE_VERSION", "MIGRATIONS", "migrateSave",
  "checkBadges", "addXP", "loadSave", "defaultSave", "persist", "markSecret",
];

function loadGame() {
  const src = fs.readFileSync(path.join(__dirname, "..", "js", "game.js"), "utf8");
  const exportLine = `\nvar __TEST_EXPORTS__ = { ${EXPORTED.map(n => `${n}: ${n}`).join(", ")} };\n`;
  const sandbox = buildSandbox();
  vm.runInContext(src + exportLine, sandbox, { filename: "js/game.js" });
  return {
    ...sandbox.__TEST_EXPORTS__,
    localStorage: sandbox.localStorage,
    document: sandbox.document,
    window: sandbox.window,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// SAUVEGARDE / CHARGEMENT
// ═══════════════════════════════════════════════════════════════════════

test("defaultSave() renvoie une sauvegarde vierge avec la bonne forme", () => {
  const ctx = loadGame();
  const s = ctx.defaultSave();
  assertEqual(s.xp, 0, "xp");
  assertIsSetLike(s.completed, "completed");
  assertEqual(s.completed.size, 0, "completed.size");
  assert(Array.isArray(s.badges), "badges doit être un tableau");
  assertIsSetLike(s.quizzes, "quizzes");
  assert(typeof s.reviewCounts === "object", "reviewCounts doit être un objet");
  assert(Array.isArray(s.objectives), "objectives doit être un tableau");
  assert(typeof s.secrets === "object", "secrets doit être un objet");
});

test("persist() puis loadSave() redonnent un état équivalent (round-trip)", () => {
  const ctx = loadGame();
  ctx.GAME.xp = 250;
  ctx.GAME.completed.add(1);
  ctx.GAME.completed.add(2);
  ctx.GAME.badges.push("first_blood");
  ctx.GAME.quizzes.add(1);
  ctx.persist();

  const reloaded = ctx.loadSave();
  assertEqual(reloaded.xp, 250, "xp rechargé");
  assertIsSetLike(reloaded.completed, "completed rechargé");
  assertEqual(reloaded.completed.has(1) && reloaded.completed.has(2), true, "missions rechargées");
  assertEqual(reloaded.badges.includes("first_blood"), true, "badges rechargés");
  assertEqual(reloaded.quizzes.has(1), true, "quizzes rechargés (Set)");
});

test("loadSave() se rabat sur defaultSave() si le JSON en localStorage est corrompu", () => {
  const ctx = loadGame();
  ctx.localStorage.setItem(ctx.SAVE_KEY, "{ceci n'est pas du json valide");
  const s = ctx.loadSave();
  assertEqual(s.xp, 0, "xp par défaut après corruption");
  assertEqual(s.completed.size, 0, "completed par défaut après corruption");
});

test("loadSave() migre une ancienne sauvegarde sans les champs récents (reviewCounts/objectives/secrets)", () => {
  const ctx = loadGame();
  // Simule une sauvegarde d'une version antérieure du jeu, avant l'ajout
  // de reviewCounts / objectives / secrets.
  const oldSave = { xp: 40, completed: [1, 2], badges: ["first_blood"], quizzes: [] };
  ctx.localStorage.setItem(ctx.SAVE_KEY, JSON.stringify(oldSave));

  const s = ctx.loadSave();
  assertEqual(s.xp, 40, "xp préservé après migration");
  assertEqual(s.completed.has(1) && s.completed.has(2), true, "missions préservées après migration");
  assert(typeof s.reviewCounts === "object" && s.reviewCounts !== null, "reviewCounts ajouté par migration");
  assert(Array.isArray(s.objectives), "objectives ajouté par migration");
  assert(typeof s.secrets === "object" && s.secrets !== null, "secrets ajouté par migration");
});

test("loadSave() renvoie defaultSave() si aucune sauvegarde n'existe encore", () => {
  const ctx = loadGame();
  const s = ctx.loadSave();
  assertEqual(s.xp, 0, "xp sans sauvegarde existante");
});

// ═══════════════════════════════════════════════════════════════════════
// VERSIONING / MIGRATION
// ═══════════════════════════════════════════════════════════════════════

test("defaultSave() est déjà taguée à la version courante", () => {
  const ctx = loadGame();
  assertEqual(ctx.defaultSave().version, ctx.SAVE_VERSION);
});

test("migrateSave() fait passer une sauvegarde legacy (sans champ version) à la version courante", () => {
  const ctx = loadGame();
  const legacy = { xp: 10, completed: [], badges: [], quizzes: [] };
  const migrated = ctx.migrateSave(legacy);
  assertEqual(migrated.version, ctx.SAVE_VERSION, "version posée après migration");
  assert(typeof migrated.reviewCounts === "object", "reviewCounts ajouté par la migration v0→v1");
  assert(Array.isArray(migrated.objectives), "objectives ajouté par la migration v0→v1");
  assert(typeof migrated.secrets === "object", "secrets ajouté par la migration v0→v1");
});

test("migrateSave() est idempotente sur une sauvegarde déjà à la version courante", () => {
  const ctx = loadGame();
  const current = ctx.defaultSave();
  current.xp = 77;
  const migrated = ctx.migrateSave(current);
  assertEqual(migrated.version, ctx.SAVE_VERSION);
  assertEqual(migrated.xp, 77, "aucune donnée perdue/modifiée quand il n'y a rien à migrer");
});

test("migrateSave() ne régresse jamais une sauvegarde plus récente que le code actuel", () => {
  const ctx = loadGame();
  const fromFuture = { version: ctx.SAVE_VERSION + 5, xp: 999, reviewCounts: {}, objectives: [], secrets: {} };
  const migrated = ctx.migrateSave(fromFuture);
  assertEqual(migrated.version, ctx.SAVE_VERSION + 5, "la version d'une sauvegarde future n'est pas rabaissée");
  assertEqual(migrated.xp, 999, "les données d'une sauvegarde future ne sont pas altérées");
});

test("MIGRATIONS contient exactement SAVE_VERSION étape(s) (invariant du système)", () => {
  const ctx = loadGame();
  assertEqual(ctx.MIGRATIONS.length, ctx.SAVE_VERSION);
});

test("loadSave() migre automatiquement une sauvegarde legacy lue depuis localStorage", () => {
  const ctx = loadGame();
  const legacyRaw = JSON.stringify({ xp: 60, completed: [1, 2, 3], badges: ["first_blood"], quizzes: [] });
  ctx.localStorage.setItem(ctx.SAVE_KEY, legacyRaw);
  const s = ctx.loadSave();
  assertEqual(s.version, ctx.SAVE_VERSION, "sauvegarde legacy migrée à la volée par loadSave()");
  assertEqual(s.xp, 60, "xp legacy préservé");
  assert(typeof s.secrets === "object", "champs manquants comblés par la migration");
});

// ═══════════════════════════════════════════════════════════════════════
// BADGES
// ═══════════════════════════════════════════════════════════════════════

test("checkBadges() débloque 'first_blood' dès la 1ère mission complétée", () => {
  const ctx = loadGame();
  ctx.GAME.completed.add(1);
  ctx.checkBadges();
  assertEqual(ctx.GAME.badges.includes("first_blood"), true);
});

test("checkBadges() ne débloque pas un badge de chapitre si une mission manque", () => {
  const ctx = loadGame();
  [1, 2, 3, 4, 5].forEach(id => ctx.GAME.completed.add(id)); // il manque la 6
  ctx.checkBadges();
  assertEqual(ctx.GAME.badges.includes("chapter1"), false);
});

test("checkBadges() débloque le badge de chapitre quand toutes les missions y sont", () => {
  const ctx = loadGame();
  [1, 2, 3, 4, 5, 6].forEach(id => ctx.GAME.completed.add(id));
  ctx.checkBadges();
  assertEqual(ctx.GAME.badges.includes("chapter1"), true);
});

test("checkBadges() débloque les paliers d'XP (xp100 / xp500)", () => {
  const ctx = loadGame();
  ctx.GAME.xp = 100;
  ctx.checkBadges();
  assertEqual(ctx.GAME.badges.includes("xp100"), true, "xp100 à 100 XP");
  assertEqual(ctx.GAME.badges.includes("xp500"), false, "xp500 pas encore à 100 XP");

  ctx.GAME.xp = 500;
  ctx.checkBadges();
  assertEqual(ctx.GAME.badges.includes("xp500"), true, "xp500 à 500 XP");
});

test("checkBadges() ne duplique jamais un badge déjà débloqué", () => {
  const ctx = loadGame();
  ctx.GAME.completed.add(1);
  ctx.checkBadges();
  ctx.checkBadges();
  ctx.checkBadges();
  const count = ctx.GAME.badges.filter(b => b === "first_blood").length;
  assertEqual(count, 1, "un seul exemplaire du badge malgré 3 appels");
});

test("checkBadges() débloque le badge secret 'konami' via GAME.secrets", () => {
  const ctx = loadGame();
  ctx.GAME.secrets.konami = true;
  ctx.checkBadges();
  assertEqual(ctx.GAME.badges.includes("konami"), true);
});

// ═══════════════════════════════════════════════════════════════════════
// XP
// ═══════════════════════════════════════════════════════════════════════

test("addXP() augmente GAME.xp du bon montant", () => {
  const ctx = loadGame();
  const before = ctx.GAME.xp;
  ctx.addXP(15);
  assertEqual(ctx.GAME.xp, before + 15);
});

test("addXP() persiste immédiatement en localStorage", () => {
  const ctx = loadGame();
  ctx.addXP(30);
  const raw = ctx.localStorage.getItem(ctx.SAVE_KEY);
  assert(raw !== null, "une sauvegarde doit exister après addXP()");
  const saved = JSON.parse(raw);
  assertEqual(saved.xp, 30, "xp persisté");
});

test("addXP() déclenche checkBadges() (ex: passage à 100 XP débloque 'xp100')", () => {
  const ctx = loadGame();
  ctx.addXP(100);
  assertEqual(ctx.GAME.badges.includes("xp100"), true);
});

test("addXP() cumule correctement sur plusieurs appels successifs", () => {
  const ctx = loadGame();
  ctx.addXP(10);
  ctx.addXP(20);
  ctx.addXP(5);
  assertEqual(ctx.GAME.xp, 35);
});

// ═══════════════════════════════════════════════════════════════════════
// SECRETS
// ═══════════════════════════════════════════════════════════════════════

test("markSecret() n'écrase pas un secret déjà marqué", () => {
  const ctx = loadGame();
  ctx.markSecret("speedrun");
  const raw1 = ctx.localStorage.getItem(ctx.SAVE_KEY);
  ctx.markSecret("speedrun");
  const raw2 = ctx.localStorage.getItem(ctx.SAVE_KEY);
  assertEqual(raw1, raw2, "aucune ré-écriture inutile si le secret existe déjà");
  assertEqual(ctx.GAME.secrets.speedrun, true);
});

test("markSecret() débloque le badge secret correspondant", () => {
  const ctx = loadGame();
  ctx.markSecret("konami");
  assertEqual(ctx.GAME.badges.includes("konami"), true);
});

// ═══════════════════════════════════════════════════════════════════════
// SAUVEGARDE CONCURRENTE MULTI-ONGLETS
// ═══════════════════════════════════════════════════════════════════════

test("un événement storage sur SAVE_KEY affiche la bannière multi-onglets", () => {
  const ctx = loadGame();
  const banner = ctx.document.getElementById("multitab-banner");
  assertEqual(banner.style.display, undefined, "bannière masquée avant tout événement");

  ctx.window.__dispatch("storage", { key: ctx.SAVE_KEY, newValue: '{"xp":42}' });
  assertEqual(banner.style.display, "flex", "bannière affichée après un changement externe");
});

test("un événement storage sur une autre clé n'affiche pas la bannière", () => {
  const ctx = loadGame();
  const banner = ctx.document.getElementById("multitab-banner");
  ctx.window.__dispatch("storage", { key: "une_autre_cle", newValue: "peu importe" });
  assertEqual(banner.style.display, undefined, "bannière ignorée pour une clé sans rapport");
});

test("un événement storage avec newValue=null (suppression) n'affiche pas la bannière", () => {
  const ctx = loadGame();
  const banner = ctx.document.getElementById("multitab-banner");
  ctx.window.__dispatch("storage", { key: ctx.SAVE_KEY, newValue: null });
  assertEqual(banner.style.display, undefined, "une suppression de clé n'est pas traitée comme un conflit");
});

test("le bouton 'Ignorer' masque la bannière multi-onglets", () => {
  const ctx = loadGame();
  const banner = ctx.document.getElementById("multitab-banner");
  ctx.window.__dispatch("storage", { key: ctx.SAVE_KEY, newValue: '{"xp":42}' });
  assertEqual(banner.style.display, "flex");

  const dismiss = ctx.document.getElementById("multitab-banner-dismiss");
  dismiss.onclick();
  assertEqual(banner.style.display, "none", "bannière masquée après clic sur Ignorer");
});

// ═══════════════════════════════════════════════════════════════════════
// RAPPORT FINAL
// ═══════════════════════════════════════════════════════════════════════

console.log(`\n${pass} test(s) réussi(s), ${fail} échec(s) sur ${pass + fail} au total.\n`);
if (failures.length) {
  console.log("── Détail des échecs ──");
  failures.forEach(f => console.log(`✗ ${f.name}\n  → ${f.error}`));
  process.exitCode = 1;
} else {
  console.log("✅ Tous les tests passent.");
}
