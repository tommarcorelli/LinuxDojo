// tests/terminal.test.js
// Suite de tests unitaires pour le simulateur de shell (js/terminal.js).
// Aucune dépendance externe : exécuter avec  node tests/terminal.test.js
//
// Ces tests protègent le cœur du projet (le parseur de commandes) contre
// les régressions lors de futures évolutions. Si un de ces tests casse
// après une modification de terminal.js, c'est probablement un vrai bug.

"use strict";
const path = require("path");

// Le simulateur appelle document.createElement() pour afficher les lignes
// à l'écran. En dehors du navigateur, on fournit un stub minimal : ses
// valeurs ne sont jamais lues par les tests (on ne regarde que le retour
// de term.run()), seule l'absence de crash compte.
if (typeof document === "undefined") {
  global.document = { createElement: () => ({}) };
}

// terminal.js s'appuie sur des helpers d'i18n.js (non chargé ici) : sh(fr,en)
// pour les sorties bilingues, LANG et dateLocale(). En test, on force le
// français — les assertions portent sur la sortie FR, inchangée par l'i18n.
if (typeof global.sh === "undefined") global.sh = (fr) => fr;
if (typeof global.LANG === "undefined") global.LANG = "fr";
if (typeof global.dateLocale === "undefined") global.dateLocale = () => "fr-FR";

const { Terminal } = require(path.join(__dirname, "..", "js", "terminal.js"));

// ─────────────────────────────────────────────────────────────────────────
// Mini framework de test (zéro dépendance)
// ─────────────────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
const failures = [];

function makeTerm(fs, opts) {
  const el = { innerHTML: "", scrollTop: 0, scrollHeight: 0, appendChild() {} };
  const t = new Terminal(el);
  t.loadFS(fs || {}, opts);
  return t;
}

function runSeq(term, script) {
  // Exécute une séquence "cmd1 && cmd2 && cmd3" comme le fait le hint runner
  // des missions ; renvoie le résultat de la DERNIÈRE commande.
  let res = { output: "", error: false };
  for (const line of script.split("&&").map(s => s.trim())) {
    res = term.run(line);
  }
  return res;
}

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
function assertIncludes(haystack, needle, label) {
  assert((haystack || "").includes(needle), `${label || "sortie"} devrait contenir ${JSON.stringify(needle)}, reçu: ${JSON.stringify(haystack)}`);
}
function assertMatches(haystack, re, label) {
  assert(re.test(haystack || ""), `${label || "sortie"} devrait matcher ${re}, reçu: ${JSON.stringify(haystack)}`);
}
function assertEqual(actual, expected, label) {
  assert(actual === expected, `${label || "valeur"} attendu ${JSON.stringify(expected)}, reçu ${JSON.stringify(actual)}`);
}

// ═══════════════════════════════════════════════════════════════════════
// NAVIGATION & FICHIERS
// ═══════════════════════════════════════════════════════════════════════

test("ls liste les fichiers du dossier courant", () => {
  const t = makeTerm({ "a.txt": { type: "file", content: "1" }, "b.txt": { type: "file", content: "2" } });
  const r = t.run("ls");
  assertIncludes(r.output, "a.txt");
  assertIncludes(r.output, "b.txt");
});

test("cd change de dossier puis pwd le confirme", () => {
  const t = makeTerm({ "sub": { type: "dir" } });
  t.run("cd sub");
  const r = t.run("pwd");
  assertIncludes(r.output, "/sub");
});

test("cd .. remonte d'un niveau", () => {
  const t = makeTerm({ "sub": { type: "dir" } });
  t.run("cd sub");
  t.run("cd ..");
  const r = t.run("pwd");
  assert(!r.output.includes("/sub"), "ne devrait plus être dans sub");
});

test("mkdir crée un dossier utilisable ensuite", () => {
  const t = makeTerm({});
  t.run("mkdir projet");
  const r2 = runSeq(t, "cd projet && pwd");
  assertIncludes(r2.output, "/projet");
});

test("touch crée un fichier vide détectable par ls", () => {
  const t = makeTerm({});
  t.run("touch note.txt");
  const r = t.run("ls");
  assertIncludes(r.output, "note.txt");
});

test("cp copie le contenu d'un fichier", () => {
  const t = makeTerm({ "src.txt": { type: "file", content: "contenu original" } });
  t.run("cp src.txt dest.txt");
  const r = t.run("cat dest.txt");
  assertIncludes(r.output, "contenu original");
});

test("mv renomme un fichier (l'original disparaît)", () => {
  const t = makeTerm({ "old.txt": { type: "file", content: "x" } });
  t.run("mv old.txt new.txt");
  const r = t.run("ls");
  assertIncludes(r.output, "new.txt");
  assert(!r.output.includes("old.txt"), "old.txt ne devrait plus exister");
});

test("rm supprime un fichier", () => {
  const t = makeTerm({ "a.txt": { type: "file", content: "x" } });
  t.run("rm a.txt");
  const r = t.run("ls");
  assert(!r.output.includes("a.txt"), "a.txt devrait avoir disparu");
});

test("rm -rf / est refusé (garde-fou de sécurité)", () => {
  const t = makeTerm({});
  const r = t.run("rm -rf /");
  assertEqual(r.error, true, "erreur attendue");
  assertIncludes(r.output.toLowerCase(), "sérieuse", "message de refus");
});

// ═══════════════════════════════════════════════════════════════════════
// TEXTE : cat, grep, sort, uniq, wc, cut, head, tail
// ═══════════════════════════════════════════════════════════════════════

test("cat affiche le contenu d'un fichier", () => {
  const t = makeTerm({ "f.txt": { type: "file", content: "bonjour\nmonde" } });
  const r = t.run("cat f.txt");
  assertIncludes(r.output, "bonjour");
  assertIncludes(r.output, "monde");
});

test("grep filtre les lignes correspondantes", () => {
  const t = makeTerm({ "log.txt": { type: "file", content: "ok\nERROR disque plein\nok\nERROR réseau" } });
  const r = t.run("grep ERROR log.txt");
  assertIncludes(r.output, "disque plein");
  assertIncludes(r.output, "réseau");
  assert(!r.output.includes("\nok"), "les lignes 'ok' ne doivent pas apparaître");
});

test("wc -l compte les lignes", () => {
  const t = makeTerm({ "f.txt": { type: "file", content: "a\nb\nc" } });
  const r = t.run("wc -l f.txt");
  assertIncludes(r.output, "3");
});

test("sort trie les lignes, uniq déduplique après sort", () => {
  const t = makeTerm({ "f.txt": { type: "file", content: "banane\npomme\nbanane\nabricot" } });
  const sorted = t.run("sort f.txt").output.split("\n");
  assertEqual(sorted[0], "abricot", "première ligne triée");
  const r = t.run("sort f.txt | uniq");
  const lines = r.output.split("\n");
  assertEqual(lines.length, 3, "3 valeurs uniques attendues");
});

test("sort -rn (flags combinés) trie numérique inversé", () => {
  // Régression : sort ne détectait pas -r/-n quand combinés en un seul token (-rn),
  // contrairement à grep/ls qui gèrent déjà les flags combinés.
  const t = makeTerm({ "n.txt": { type: "file", content: "3\n1\n10\n2" } });
  const r = t.run("sort -rn n.txt");
  assertEqual(r.output.split("\n").join(","), "10,3,2,1", "tri numérique inversé attendu");
});

test("sort -rn combiné avec uniq -c (combo grep|sort|uniq -c|sort -rn)", () => {
  const t = makeTerm({ "ips.txt": { type: "file", content: "a\nb\na\nc\na" } });
  const r = t.run("sort ips.txt | uniq -c | sort -rn");
  const first = r.output.split("\n")[0].trim();
  assert(first.startsWith("3"), `la ligne la plus fréquente devrait être en tête, reçu: ${JSON.stringify(r.output)}`);
});

// ═══════════════════════════════════════════════════════════════════════
// PIPES & REDIRECTIONS
// ═══════════════════════════════════════════════════════════════════════

test("pipe simple : cat | grep", () => {
  const t = makeTerm({ "f.txt": { type: "file", content: "chat\nchien\nchèvre" } });
  const r = t.run("cat f.txt | grep ch");
  assertIncludes(r.output, "chat");
  assertIncludes(r.output, "chèvre");
});

test("&& enchaîne réellement plusieurs commandes (régression : purement décoratif avant)", () => {
  const t = makeTerm({ "app.py": { type: "file", content: "print(1)" } });
  const r = t.run('git init && git add . && git commit -m "msg"');
  assertEqual(t.state.gitCommit, "msg", "le commit doit avoir eu lieu après le double &&");
  assert(!r.error, "la chaîne complète ne doit pas être en erreur");
});

test("&& s'arrête au premier échec (court-circuit comme un vrai shell)", () => {
  const t = makeTerm({});
  const r = t.run("git status && git commit -m 'jamais atteint'");
  // git status échoue (pas encore de dépôt) : la 2e commande ne doit jamais s'exécuter
  assert(r.error, "la commande échouée doit remonter une erreur");
  assertEqual(t.state.gitCommit, undefined, "git commit ne doit pas avoir été exécuté après l'échec");
});

test("pipe en chaîne : cat | grep | wc -l", () => {
  const t = makeTerm({ "f.txt": { type: "file", content: "a1\nb2\na3\nb4\na5" } });
  const r = t.run("cat f.txt | grep a | wc -l");
  assertEqual(r.output.trim(), "3");
});

test("redirection > écrase le fichier", () => {
  const t = makeTerm({ "f.txt": { type: "file", content: "ancien contenu" } });
  t.run("echo nouveau > f.txt");
  const r = t.run("cat f.txt");
  assertEqual(r.output.trim(), "nouveau");
});

test("redirection >> ajoute au fichier", () => {
  const t = makeTerm({});
  t.run("echo ligne1 > f.txt");
  t.run("echo ligne2 >> f.txt");
  const r = t.run("cat f.txt");
  assertIncludes(r.output, "ligne1");
  assertIncludes(r.output, "ligne2");
});

// ═══════════════════════════════════════════════════════════════════════
// JOKERS, VARIABLES, SUBSTITUTION DE COMMANDE
// ═══════════════════════════════════════════════════════════════════════

test("les jokers *.txt filtrent correctement", () => {
  const t = makeTerm({
    "a.txt": { type: "file", content: "1" },
    "b.log": { type: "file", content: "2" },
    "c.txt": { type: "file", content: "3" },
  });
  const r = t.run("ls *.txt");
  assertIncludes(r.output, "a.txt");
  assertIncludes(r.output, "c.txt");
  assert(!r.output.includes("b.log"), "b.log ne doit pas matcher *.txt");
});

test("affectation de variable et lecture avec $", () => {
  const t = makeTerm({});
  t.run("x=42");
  const r = t.run("echo $x");
  assertEqual(r.output.trim(), "42");
});

test("substitution de commande $(...)", () => {
  const t = makeTerm({ "a.txt": {type:"file",content:"1"}, "b.txt": {type:"file",content:"2"} });
  const r = t.run("echo $(ls | wc -l)");
  assertEqual(r.output.trim(), "2");
});

// ═══════════════════════════════════════════════════════════════════════
// SCRIPTING : for, if, bash
// ═══════════════════════════════════════════════════════════════════════

test("boucle for itère sur les fichiers correspondants", () => {
  const t = makeTerm({
    "a.txt": { type: "file", content: "1" },
    "b.txt": { type: "file", content: "2" },
  });
  const r = runSeq(t, 'for f in *.txt; do echo $f; done');
  assertIncludes(r.output, "a.txt");
  assertIncludes(r.output, "b.txt");
});

test("if [ -f fichier ] détecte la présence d'un fichier", () => {
  const t = makeTerm({ "present.txt": { type: "file", content: "x" } });
  const r = runSeq(t, 'if [ -f present.txt ]; then echo oui; else echo non; fi');
  assertIncludes(r.output, "oui");
});

test("bash exécute un script multi-lignes", () => {
  const t = makeTerm({
    "deploy.sh": { type: "file", content: "echo debut\necho fin" },
  });
  const r = t.run("bash deploy.sh");
  assertIncludes(r.output, "debut");
  assertIncludes(r.output, "fin");
});

// ═══════════════════════════════════════════════════════════════════════
// PERMISSIONS : chmod, chown, chgrp
// ═══════════════════════════════════════════════════════════════════════

test("chmod +x rend un script exécutable", () => {
  const t = makeTerm({ "s.sh": { type: "file", content: "echo hi" } });
  t.run("chmod +x s.sh");
  const r = t.run("ls -l s.sh");
  assertMatches(r.output, /x/, "les droits d'exécution doivent apparaître");
});

test("chown change le propriétaire visible dans ls -l", () => {
  const t = makeTerm({ "f.txt": { type: "file", content: "x" } });
  t.run("chown sensei:dojo f.txt");
  const r = t.run("ls -l f.txt");
  assertIncludes(r.output, "sensei");
  assertIncludes(r.output, "dojo");
});

test("chgrp change uniquement le groupe", () => {
  const t = makeTerm({ "f.txt": { type: "file", content: "x" } });
  t.run("chgrp admins f.txt");
  const r = t.run("ls -l f.txt");
  assertIncludes(r.output, "admins");
});

// ═══════════════════════════════════════════════════════════════════════
// UTILITAIRES : alias, xargs, diff, jobs/fg
// ═══════════════════════════════════════════════════════════════════════

test("alias crée un raccourci utilisable immédiatement", () => {
  const t = makeTerm({ "a.txt": { type: "file", content: "x" } });
  t.run("alias ll='ls -la'");
  const r = t.run("ll");
  assertIncludes(r.output, "a.txt");
});

test("unalias supprime un alias existant", () => {
  const t = makeTerm({});
  t.run("alias ll='ls -la'");
  t.run("unalias ll");
  const r = t.run("ll");
  assertEqual(r.error, true, "ll ne devrait plus être reconnu");
});

test("diff détecte une ligne différente entre deux fichiers", () => {
  const t = makeTerm({
    "a.txt": { type: "file", content: "ligne1\nligne2\nligne3" },
    "b.txt": { type: "file", content: "ligne1\nligneX\nligne3" },
  });
  const r = t.run("diff a.txt b.txt");
  assertIncludes(r.output, "ligne2");
  assertIncludes(r.output, "ligneX");
});

test("diff ne produit rien pour deux fichiers identiques", () => {
  const t = makeTerm({
    "a.txt": { type: "file", content: "même contenu" },
    "b.txt": { type: "file", content: "même contenu" },
  });
  const r = t.run("diff a.txt b.txt");
  assertEqual(r.output.trim(), "");
});

test("xargs applique une commande à chaque token reçu", () => {
  const t = makeTerm({ "a.txt": {type:"file",content:"1"}, "b.txt": {type:"file",content:"22"} });
  const r = t.run("echo a.txt b.txt | xargs wc -l");
  assertMatches(r.output, /a\.txt/);
  assertMatches(r.output, /b\.txt/);
});

test("cmd & crée un job listé par jobs, puis récupérable par fg", () => {
  const t = makeTerm({});
  const bg = t.run("echo tache_de_fond &");
  assertMatches(bg.output, /^\[1\] \d+/, "un numéro de job doit être retourné");
  const jobsOut = t.run("jobs");
  assertIncludes(jobsOut.output, "echo tache_de_fond");
  const fgOut = t.run("fg");
  assertIncludes(fgOut.output, "tache_de_fond");
  const jobsAfter = t.run("jobs");
  assertEqual(jobsAfter.output, "", "plus aucun job après fg");
});

// ═══════════════════════════════════════════════════════════════════════
// RÉSEAU : ssh, scp, netstat
// ═══════════════════════════════════════════════════════════════════════

test("ssh change le prompt et expose l'hôte/utilisateur dans le state", () => {
  const t = makeTerm({});
  const r = t.run("ssh admin@webserver01");
  assertEqual(r.error, false);
  assertEqual(t.state.sshHost, "webserver01");
  assertEqual(t.state.sshUser, "admin");
  assertIncludes(t.promptStr(), "admin@webserver01");
});

test("ssh refuse un format invalide (pas de user@hôte)", () => {
  const t = makeTerm({});
  const r = t.run("ssh webserver01");
  assertEqual(r.error, true);
});

test("netstat liste des services en LISTEN", () => {
  const t = makeTerm({});
  const r = t.run("netstat");
  assertMatches(r.output, /LISTEN/);
});

test("scp échoue si le fichier source n'existe pas", () => {
  const t = makeTerm({});
  const r = t.run("scp absent.txt admin@webserver01:/var/www");
  assertEqual(r.error, true);
});

test("scp réussit et enregistre fichier/hôte/chemin dans le state", () => {
  const t = makeTerm({ "deploy.sh": { type: "file", content: "echo hi" } });
  t.run("scp deploy.sh admin@webserver01:/var/www");
  assertEqual(t.state.scp.file, "deploy.sh");
  assertEqual(t.state.scp.host, "webserver01");
});

test("exit en SSH déconnecte et restaure le prompt local", () => {
  const t = makeTerm({});
  t.run("ssh admin@webserver01");
  assertIncludes(t.promptStr(), "webserver01");
  const r = t.run("exit");
  assertIncludes(r.output.toLowerCase(), "fermée");
  assertEqual(t.state.sshExit, "webserver01");
  assert(!t.promptStr().includes("webserver01"), "le prompt doit être revenu en local");
});

test("exit hors SSH garde l'ancien easter egg (pas de fausse déconnexion)", () => {
  const t = makeTerm({});
  const r = t.run("exit");
  assertIncludes(r.output.toLowerCase(), "dojo");
});

// ═══════════════════════════════════════════════════════════════════════
// GIT (simulation)
// ═══════════════════════════════════════════════════════════════════════

test("git refuse toute commande avant 'git init'", () => {
  const t = makeTerm({});
  const r = t.run("git status");
  assertEqual(r.error, true);
  assertIncludes(r.output.toLowerCase(), "git init");
});

test("cycle complet : init → add → commit → log", () => {
  const t = makeTerm({ "app.py": { type: "file", content: "print(1)" } });
  t.run("git init");
  t.run("git add app.py");
  const commitRes = t.run('git commit -m "premier commit"');
  assertIncludes(commitRes.output, "premier commit");
  const logRes = t.run("git log");
  assertIncludes(logRes.output, "premier commit");
});

test("git commit échoue si rien n'est en scène", () => {
  const t = makeTerm({ "app.py": { type: "file", content: "x" } });
  t.run("git init");
  const r = t.run('git commit -m "rien"');
  assertEqual(r.error, true);
});

test("git checkout -b crée et bascule sur une nouvelle branche", () => {
  const t = makeTerm({});
  t.run("git init");
  t.run("git checkout -b feature-x");
  const r = t.run("git branch");
  assertMatches(r.output, /\*\s*feature-x/, "feature-x doit être marquée comme branche active");
});

test("git status affiche 'propre' une fois tout committé", () => {
  const t = makeTerm({ "a.txt": { type: "file", content: "x" } });
  t.run("git init");
  t.run("git add .");
  t.run('git commit -m "init"');
  const r = t.run("git status");
  assertIncludes(r.output.toLowerCase(), "propre");
});

// ═══════════════════════════════════════════════════════════════════════
// SERVICES SYSTEMD (simulation systemctl / journalctl)
// ═══════════════════════════════════════════════════════════════════════

test("systemctl status montre nginx en failed au départ", () => {
  const t = makeTerm({});
  const r = t.run("systemctl status nginx");
  assertMatches(r.output, /Active: failed/, "nginx doit démarrer le scénario en failed");
  assertEqual(t.state.sysStatus, "nginx");
});

test("journalctl -u nginx révèle le conflit de port", () => {
  const t = makeTerm({});
  const r = t.run("journalctl -u nginx");
  assertMatches(r.output, /Address already in use/, "les logs doivent donner la cause du crash");
  assertEqual(t.state.journalUnit, "nginx");
});

test("systemctl start nginx échoue tant qu'apache2 occupe le port 80", () => {
  const t = makeTerm({});
  const r = t.run("systemctl start nginx");
  assertEqual(r.error, true, "le démarrage doit échouer port occupé");
  assert(t.state.sysStart !== "nginx", "sysStart ne doit PAS être posé sur un échec");
});

test("stop apache2 puis start nginx réussit (résolution du conflit)", () => {
  const t = makeTerm({});
  const r = runSeq(t, "systemctl stop apache2 && systemctl start nginx");
  assertEqual(r.error, false, "nginx doit démarrer une fois le port libéré");
  assertEqual(t.state.sysStop, "apache2");
  assertEqual(t.state.sysStart, "nginx");
  const st = t.run("systemctl status nginx");
  assertMatches(st.output, /active \(running\)/, "le statut doit refléter le démarrage");
});

test("systemctl enable/disable posent l'état et répondent comme systemd", () => {
  const t = makeTerm({});
  const en = t.run("systemctl enable nginx");
  assertIncludes(en.output, "Created symlink");
  assertEqual(t.state.sysEnable, "nginx");
  const dis = t.run("systemctl disable apache2");
  assertIncludes(dis.output, "Removed");
  assertEqual(t.state.sysDisable, "apache2");
});

test("systemctl accepte le suffixe .service et refuse une unité inconnue", () => {
  const t = makeTerm({});
  const ok = t.run("systemctl status nginx.service");
  assertEqual(t.state.sysStatus, "nginx", "nginx.service doit être normalisé en nginx");
  assertEqual(ok.error, false);
  const ko = t.run("systemctl status foobar");
  assertEqual(ko.error, true);
  assertIncludes(ko.output, "could not be found");
});

test("journalctl -n limite le nombre de lignes", () => {
  const t = makeTerm({});
  const r = t.run("journalctl -u nginx -n 2");
  assertEqual(r.output.split("\n").length, 2, "-n 2 doit ne garder que 2 lignes");
});

test("l'état des services est réinitialisé par loadFS (isolation entre missions)", () => {
  const t = makeTerm({});
  runSeq(t, "systemctl stop apache2 && systemctl start nginx");
  t.loadFS({});
  const r = t.run("systemctl status nginx");
  assertMatches(r.output, /Active: failed/, "après loadFS, nginx doit être retombé en failed");
});

// ═══════════════════════════════════════════════════════════════════════
// UTILISATEURS & GROUPES (useradd / passwd / usermod / groups / su)
// ═══════════════════════════════════════════════════════════════════════

test("useradd -m crée le compte, le home, et la ligne /etc/passwd", () => {
  const t = makeTerm({ "/etc/passwd": { type: "file", content: "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash" } });
  const r = t.run("useradd -m sarah");
  assertEqual(r.error, false);
  assertEqual(t.state.useradd, "sarah");
  assertEqual(t.state.useraddHome, true);
  assertIncludes(t.run("ls /home").output, "sarah", "le home doit exister");
  assertMatches(t.run("cat /etc/passwd").output, /sarah:x:1001/, "/etc/passwd doit gagner la ligne");
});

test("useradd refuse un doublon ; sans -m pas de home", () => {
  const t = makeTerm({});
  t.run("useradd bob");
  assert(t.state.useraddHome !== true, "pas de -m → pas de home");
  const dup = t.run("useradd bob");
  assertEqual(dup.error, true, "doublon refusé");
});

test("passwd échoue sur un compte inexistant, réussit sinon", () => {
  const t = makeTerm({});
  assertEqual(t.run("passwd fantome").error, true);
  t.run("useradd -m sarah");
  const r = t.run("passwd sarah");
  assertEqual(r.error, false);
  assertIncludes(r.output, "succès");
  assertEqual(t.state.passwd, "sarah");
});

test("usermod -aG ajoute au groupe sans écraser les existants", () => {
  const t = makeTerm({});
  runSeq(t, "useradd -m sarah && usermod -aG sudo sarah");
  assertEqual(t.state.usermodAG, "sarah:sudo");
  const g = t.run("groups sarah");
  assertMatches(g.output, /sarah : sarah sudo/, "les deux groupes doivent être là");
});

test("usermod -G sans -a REMPLACE les groupes (piège simulé fidèlement)", () => {
  const t = makeTerm({});
  runSeq(t, "useradd -m sarah && usermod -aG sudo sarah && usermod -G docker sarah");
  const g = t.run("groups sarah");
  assert(!/sudo/.test(g.output), "sudo doit avoir été perdu (remplacement)");
  assertMatches(g.output, /docker/, "docker doit être le seul groupe secondaire");
});

test("su échoue sans mot de passe, réussit après passwd, exit revient", () => {
  const t = makeTerm({});
  t.run("useradd -m sarah");
  const ko = t.run("su sarah");
  assertEqual(ko.error, true, "su doit échouer sur un compte verrouillé");
  assertIncludes(ko.output, "authentification");
  runSeq(t, "passwd sarah && su sarah");
  assertEqual(t.state.su, "sarah");
  assertEqual(t.run("whoami").output, "sarah", "whoami doit refléter le su");
  assertMatches(t.promptStr(), /^sarah@/, "le prompt doit changer d'utilisateur");
  t.run("exit");
  assertEqual(t.run("whoami").output, "user", "exit doit rendre l'identité d'origine");
});

test("id sans argument reste compatible (uid=1000(user)...)", () => {
  const t = makeTerm({});
  const r = t.run("id");
  assertIncludes(r.output, "uid=1000(user) gid=1000(user)");
  assertIncludes(r.output, "27(sudo)");
});

test("id NOM détaille un compte créé ; les comptes sont réinitialisés par loadFS", () => {
  const t = makeTerm({});
  runSeq(t, "useradd -m sarah && usermod -aG sudo sarah");
  const r = t.run("id sarah");
  assertMatches(r.output, /uid=1001\(sarah\).*27\(sudo\)/, "id doit refléter uid et groupes");
  t.loadFS({});
  assertEqual(t.run("id sarah").error, true, "après loadFS, sarah ne doit plus exister");
});

// ═══════════════════════════════════════════════════════════════════════
// ROBUSTESSE
// ═══════════════════════════════════════════════════════════════════════

test("une commande inconnue renvoie une erreur propre (pas de crash)", () => {
  const t = makeTerm({});
  const r = t.run("blablabla_inexistant");
  assertEqual(r.error, true);
});

test("cat sur un fichier inexistant renvoie une erreur (pas de crash)", () => {
  const t = makeTerm({});
  const r = t.run("cat ne_existe_pas.txt");
  assertEqual(r.error, true);
});

test("une ligne vide ne crashe pas", () => {
  const t = makeTerm({});
  const r = t.run("");
  assertEqual(r.error, false);
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
