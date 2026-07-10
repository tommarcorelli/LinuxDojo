# Contribuer à LinuxDojo

Merci de l'intérêt porté au projet ! Ce guide explique comment proposer une
correction, une amélioration, ou une nouvelle mission.

## Avant de commencer

- Aucune installation nécessaire : le projet est en vanilla JS/HTML/CSS,
  sans framework ni étape de build. Ouvre `index.html` dans un navigateur
  (ou sers le dossier avec `python3 -m http.server`) et c'est prêt.
- Jette un œil au [`ROADMAP.md`](ROADMAP.md) pour voir si ton idée y est
  déjà, ou pour t'inspirer d'une piste déjà identifiée.

## Lancer les tests

Avant toute Pull Request touchant `js/terminal.js`, lance la suite de tests :

```bash
node tests/terminal.test.js
```

Elle doit passer à 100 % (40 tests actuellement). Si tu ajoutes une commande
ou modifies le parseur, ajoute un test correspondant dans
`tests/terminal.test.js` — voir les tests existants pour le style attendu.

## Proposer une nouvelle commande shell

Le simulateur vit dans `js/terminal.js`. Chaque commande est un `case` dans
le switch de la méthode `_exec()`. Pour en ajouter une :

1. Ajoute le `case "nomcommande":` avec la logique (regarde `chown`/`diff`
   pour un exemple récent)
2. Ajoute-la à la liste `known`/`cmds` (autocomplétion Tab) dans la même
   fonction, un peu plus haut dans le fichier
3. Ajoute une entrée dans `js/glossary.js` (visible via `man`/`whatis` en jeu)
4. Ajoute au moins un test dans `tests/terminal.test.js`

## Proposer une nouvelle mission / un nouveau scénario

Les scénarios sont dans `js/levels.js`, sous forme de `CHAPTERS`. Chaque
mission suit ce schéma :

```js
{
  id: 49,                    // unique, suite du dernier id existant
  name: "Étape 1 — ...",
  cmd: "ls -la",              // aperçu affiché dans la liste des missions
  xp: 20,
  lesson: { title, intro, syntax, options, examples, tip },
  desc: "Consigne affichée pendant l'exercice",
  fs: { /* système de fichiers simulé pour cette mission */ },
  hint: "la commande exacte qui résout la mission",
  check: (out, state) => /* renvoie true/false */,
  explanation: "Texte affiché une fois la mission réussie",
}
```

Points importants :

- Le champ `hint` doit être une commande **directement exécutable telle
  quelle** (pas de texte en prose) — c'est vérifié par du code qui l'exécute
  littéralement pour valider chaque mission.
- `check()` reçoit la sortie de la dernière commande (en minuscules) et
  `term.state`, qui contient des indicateurs posés par certaines commandes
  (`state.chmod`, `state.gitCommit`, etc. — voir `terminal.js` pour la liste).

## Style de code

- Pas de build, pas de TypeScript, pas de framework — le projet reste
  volontairement simple. Merci de ne pas introduire de dépendance sans en
  discuter d'abord.
- Commentaires et messages utilisateur en français, cohérent avec le reste
  du projet.
- Encodage UTF-8, fins de ligne : `index.html`/`css/style.css` sont en
  CRLF, la plupart des fichiers `js/` sont en LF — merci de respecter la
  convention du fichier que tu modifies plutôt que de tout convertir.

## Avant d'ouvrir une Pull Request

- [ ] `node tests/terminal.test.js` passe à 100 %
- [ ] Testé manuellement dans un navigateur (pas seulement en Node)
- [ ] Pas de régression sur les missions existantes si tu as touché
      `terminal.js` ou `levels.js`

## Signaler un bug

Ouvre une issue avec : ce que tu as tapé, ce qui s'est affiché, ce que tu
attendais. Un screenshot ou un copier-coller de la sortie du terminal aide
beaucoup.
