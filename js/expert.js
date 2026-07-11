// expert.js — Mode Expert : missions avancées, sans leçon ni indices
// Débloqué une fois toutes les missions de base terminées.
// Chaque mission combine plusieurs commandes (pipes) — c'est le joueur qui
// doit assembler la solution, sans filet.

const EXPERT_MISSIONS = [

  {
    id: 9001,
    name: "Expert 1 — Élimination du bruit",
    cmd: "grep -v",
    xp: 40,
    noHints: true,
    desc: "Le fichier <code>server.log</code> mélange plusieurs niveaux de gravité. " +
          "Affiche le NOMBRE de lignes qui ne sont NI du <code>DEBUG</code> NI de l'<code>INFO</code> " +
          "(donc les lignes vraiment importantes : WARN, ERROR, CRITICAL).",
    fs: {
      "server.log": { type: "file", content:
        "DEBUG init\nINFO started\nWARN latency\nERROR crash\nCRITICAL oom\nERROR timeout\nDEBUG trace" },
    },
    hint: "grep -v DEBUG server.log | grep -v INFO | wc -l",
    check: (out) => /^4$/.test(out.trim()),
    explanation: "En chaînant deux <code>grep -v</code>, tu élimines les niveaux qui ne t'intéressent pas " +
                 "avant de compter avec <code>wc -l</code>. C'est ce type de pipeline qu'on écrit en vrai pour " +
                 "surveiller des logs en production."
  },

  {
    id: 9002,
    name: "Expert 2 — L'IP la plus active",
    cmd: "sort | uniq -c",
    xp: 40,
    noHints: true,
    desc: "Dans <code>access.log</code>, trouve l'adresse IP qui revient le plus souvent " +
          "(1ère colonne de chaque ligne). Affiche uniquement le résultat le plus fréquent, avec son compte.",
    fs: {
      "access.log": { type: "file", content:
        "10.0.0.1 GET /\n10.0.0.2 GET /a\n10.0.0.1 GET /b\n10.0.0.3 GET /c\n10.0.0.1 GET /d" },
    },
    hint: "awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -n 1",
    check: (out) => /^\s*3\s+10\.0\.0\.1/.test(out),
    explanation: "Le combo <code>sort | uniq -c | sort -rn</code> est LE classique pour compter des occurrences " +
                 "et faire ressortir la plus fréquente. Ici, <code>10.0.0.1</code> revient 3 fois : c'est elle " +
                 "qu'il faut surveiller."
  },

  {
    id: 9003,
    name: "Expert 3 — Nettoyage en masse",
    cmd: "find | xargs",
    xp: 40,
    noHints: true,
    desc: "Le dossier est plein de fichiers temporaires <code>.tmp</code> qui traînent. " +
          "Trouve-les tous d'un coup et supprime-les en une seule ligne de commande.",
    fs: {
      "a.tmp":    { type: "file", content: "temp" },
      "b.tmp":    { type: "file", content: "temp" },
      "keep.txt": { type: "file", content: "important" },
    },
    hint: "find . -name '*.tmp' | xargs rm",
    check: (out, s) => s.rm === "./a.tmp",
    explanation: "<code>find</code> localise les fichiers, et <code>xargs</code> transforme cette liste en " +
                 "arguments pour <code>rm</code>. Plus besoin de supprimer un par un — c'est le combo qu'utilisent " +
                 "les admins pour le ménage en masse."
  },

  {
    id: 9004,
    name: "Expert 4 — Bascule en production",
    cmd: "sed | > ",
    xp: 40,
    noHints: true,
    desc: "Le fichier <code>config.ini</code> est encore en mode <code>development</code>. " +
          "Sans modifier l'original, crée un nouveau fichier <code>config.prod.ini</code> où " +
          "<code>development</code> est remplacé par <code>production</code>.",
    fs: {
      "config.ini": { type: "file", content: "env=development\nport=8080" },
    },
    hint: "sed 's/development/production/' config.ini > config.prod.ini",
    check: (out, s) => s.redirect === "config.prod.ini",
    explanation: "<code>sed</code> transforme le texte à la volée, et la redirection <code>&gt;</code> enregistre " +
                 "le résultat dans un nouveau fichier sans toucher à l'original. Exactement ce qu'il faut avant " +
                 "un déploiement."
  },

  {
    id: 9005,
    name: "Expert 5 — Régions uniques",
    cmd: "cut | sort -u",
    xp: 40,
    noHints: true,
    desc: "Le fichier <code>sales.csv</code> contient des ventes par région, avec des doublons. " +
          "Affiche la liste des régions (1ère colonne), sans doublon, triée par ordre alphabétique.",
    fs: {
      "sales.csv": { type: "file", content:
        "nord,stylo,12\nsud,cahier,5\nnord,regle,3\nest,stylo,7\nsud,cahier,2" },
    },
    hint: "cut -d',' -f1 sales.csv | sort -u",
    check: (out) => out.trim() === "est\nnord\nsud",
    explanation: "<code>cut -d',' -f1</code> extrait la première colonne d'un CSV, et <code>sort -u</code> trie " +
                 "tout en éliminant les doublons en une seule passe."
  },

  {
    id: 9006,
    name: "Expert 6 — Le fichier dangereux",
    cmd: "ls -l | grep",
    xp: 40,
    noHints: true,
    desc: "Parmi ces fichiers, un seul a des permissions dangereuses (accessible en écriture par tout le monde). " +
          "Retrouve-le en combinant l'affichage détaillé et un filtre.",
    fs: {
      "a.txt":    { type: "file", content: "ok",     perms: "-rw-r--r--" },
      "leak.key": { type: "file", content: "secret", perms: "-rwxrwxrwx" },
      "b.txt":    { type: "file", content: "ok2",    perms: "-rw-r--r--" },
    },
    hint: "ls -l | grep rwxrwxrwx",
    check: (out) => /rwxrwxrwx/.test(out) && /leak\.key/.test(out),
    explanation: "<code>ls -l | grep rwxrwxrwx</code> repère en un instant le fichier où TOUT LE MONDE peut " +
                 "lire, écrire ET exécuter — un vrai trou de sécurité si c'est un fichier sensible."
  },

  {
    id: 9007,
    name: "Expert 7 — Le poids lourd",
    cmd: "du | sort -rn",
    xp: 40,
    noHints: true,
    desc: "Trouve le fichier le plus volumineux du dossier courant, en une seule ligne de commande.",
    fs: {
      "small.txt":  { type: "file", content: "hi" },
      "big.txt":    { type: "file", content: "x".repeat(3000) },
      "medium.txt": { type: "file", content: "y".repeat(500) },
    },
    hint: "du | sort -rn | head -n 1",
    check: (out) => /^6\s+\.?\/?big\.txt/.test(out.trim()),
    explanation: "<code>du</code> affiche la taille de chaque fichier, <code>sort -rn</code> les classe du plus " +
                 "gros au plus petit, et <code>head -n 1</code> ne garde que le premier. Diagnostic de disque plein " +
                 "en une ligne."
  },

  {
    id: 9008,
    name: "Expert 8 — Rapport express",
    cmd: "grep | cut | sort | uniq -c | sort -rn",
    xp: 60,
    noHints: true,
    desc: "Dernière épreuve : dans <code>events.log</code> (format <code>service:NIVEAU:message</code>), " +
          "trouve quel <b>service</b> génère le plus de lignes <code>ERROR</code>. Une seule ligne de commande, " +
          "cinq outils enchaînés.",
    fs: {
      "events.log": { type: "file", content:
        "auth:ERROR:timeout\nauth:INFO:ok\ndb:ERROR:crash\nweb:ERROR:502\nauth:ERROR:timeout2\ndb:INFO:ok" },
    },
    hint: "grep ERROR events.log | cut -d':' -f1 | sort | uniq -c | sort -rn | head -n 1",
    check: (out) => /^\s*2\s+auth/.test(out),
    explanation: "Le pipeline complet : <code>grep</code> filtre les ERROR, <code>cut</code> isole le service, " +
                 "<code>sort | uniq -c</code> compte les occurrences, et <code>sort -rn</code> fait ressortir le " +
                 "pire. C'est exactement ce qu'un admin tape en debug de prod à 3h du matin. Tu es prêt(e)."
  },

];

if (typeof module !== "undefined") module.exports = { EXPERT_MISSIONS };
