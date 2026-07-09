# 🗺️ Roadmap — LinuxDojo

Ligne de route complète du projet : ce qui est fait, ce qui reste à faire, et les gros
chantiers structurants. Le but de ce fichier est de ne plus avoir à redemander — tout ce
qui a été identifié comme piste d'amélioration y est consigné.

> 💡 Pour proposer une nouvelle idée : ajoute-la dans la section qui correspond le mieux,
> avec une checkbox `- [ ]`. Coche-la (`- [x]`) et déplace-la dans "Déjà fait" une fois livrée.

---

## ✅ Déjà fait

- Commandes manquantes : `chown`, `chgrp`, `alias`, `xargs`, `diff`, jobs en arrière-plan (`&`/`jobs`/`fg`)
- Scénario 8 — Git : `init`, `add`, `commit`, `log`, `branch`, `checkout`, `status` (6 missions)
- Bannière de mise à jour du service worker (au lieu d'un rechargement silencieux)
- Meta tags Open Graph / Twitter Card (aperçu correct au partage de lien)
- Mode indices progressifs (3 paliers : gratuit → −3 XP → −5 XP)
- Accessibilité ARIA du terminal (labels, live regions, dialogs)
- Réorganisation du dossier (`css/`, `js/`, `tests/`)
- Suite de tests unitaires du parseur (40 tests, zéro dépendance) + CI GitHub Actions

---

## 🔜 Phase 1 — Fondations (rapide, faible risque)

Petites choses avec un bon rapport effort/valeur, à faire en premier.

- [ ] **`LICENSE`** — le repo est public sans licence explicite, ce qui signifie légalement
      "tous droits réservés" par défaut : personne ne peut légalement forker/réutiliser le
      code même si c'était l'intention. À trancher : MIT (permissif) ou autre.
- [ ] **`CONTRIBUTING.md` + templates d'issues GitHub** — cadre pour les contributions externes
      (comment lancer les tests, convention de code, comment proposer une mission)
- [ ] **`CHANGELOG.md`** — historique des versions/évolutions, utile dès que le projet a des
      contributeurs externes ou une communauté qui suit les nouveautés
- [ ] **`CODE_OF_CONDUCT.md`** — standard sur les projets open source communautaires
- [ ] **`sitemap.xml` + `robots.txt`** — améliore le référencement Google, ~10 min de travail
- [ ] **Audit contraste couleurs (WCAG AA)** — complément naturel du travail ARIA déjà fait,
      pour les malvoyants (pas seulement les non-voyants)
- [ ] **Mode daltonien** — vérifier que les couleurs de statut (vert succès / rouge erreur)
      restent distinguables, ajouter des icônes en complément de la couleur si besoin
- [ ] **Favicon multi-tailles + `theme-color`** — vérifier que le PWA a toutes les tailles
      d'icônes recommandées (192, 512, maskable) pour un score Lighthouse propre
- [ ] **Focus trap clavier dans les modales** — le travail ARIA a ajouté `role="dialog"` mais
      le focus clavier (Tab) n'est pas piégé à l'intérieur : un utilisateur au clavier peut
      Tab-er "derrière" la modale ouverte. Vrai trou d'accessibilité identifié après coup,
      pas corrigé lors du passage ARIA initial.

## 📚 Phase 2 — Contenu

- [ ] **Scénario réseau/SSH** — `ssh`, `scp`, `netstat`, dans la continuité logique après Git
- [ ] **Mode "Expert"** — missions plus difficiles sans indices, pour les joueurs qui ont
      fini les 48 missions de base
- [ ] **Défi du jour partageable** (façon Wordle : grille de résultat copiable) — bon levier
      de viralité
- [ ] **Plus de boss fights / kata** — le contenu actuel (5 boss, 6 katas) peut être étendu
      une fois le rythme de sortie des scénarios calé
- [ ] **Badges/succès secrets** — quelques badges cachés découvrables uniquement en explorant
      (ex: taper un easter egg précis, finir une mission en moins de 10s...)
- [ ] **Mini-scénario Docker** — après Git, la suite logique côté outils modernes : `docker ps`,
      `docker run`, `docker build` simulés (reste dans l'esprit "simulateur", pas de vrai Docker)
- [ ] **Overlay "raccourcis clavier"** (touche `?`) — Tab/↑↓/historique existent déjà mais ne
      sont découvrables qu'en lisant le `help` ; un overlay rapide améliorerait l'onboarding
- [ ] **Événements saisonniers** — thème visuel temporaire (Halloween, Noël) + un easter egg
      ou mini-défi limité dans le temps ; bon levier d'engagement à faible coût vu que les
      8 thèmes existent déjà comme base technique

## 🔧 Phase 3 — Technique / fiabilité

- [ ] **Étendre les tests** au-delà du parseur : XP, badges, sauvegarde/chargement (`game.js`)
      — zone jamais testée actuellement
- [ ] **Vérifier la migration de sauvegarde** — si la structure de `GAME` change un jour
      (ex: nouveau champ), les anciennes sauvegardes `localStorage` doivent rester
      compatibles. Pas de système de versioning vérifié dessus pour l'instant.
- [ ] **Gestion des sauvegardes multi-onglets** — si le joueur a le jeu ouvert dans 2 onglets,
      la dernière sauvegarde écrase l'autre silencieusement ; pas de détection de conflit
      actuellement (piste : `storage` event pour détecter un changement externe)
- [ ] **Audit Lighthouse PWA complet** (icônes maskable, `theme-color`, performance) — pour
      le score d'installabilité
- [ ] **Test de compatibilité navigateurs** — vérifié seulement sur Chromium jusqu'ici ;
      à tester sur Firefox et Safari (notamment le service worker et les animations CSS)
- [ ] **Suivi d'erreurs** (type Sentry, ou une solution auto-hébergée légère) — pour être
      notifié si une erreur JS survient chez un vrai joueur, plutôt que de ne jamais le savoir
- [ ] **Compression/minification** — même sans build, un script simple de minification avant
      déploiement réduirait le poids total (actuellement chargé tel quel, ~200 Ko de JS)
- [ ] **Recherche arrière dans l'historique** (`Ctrl+R` façon bash) — actuellement seulement
      ↑/↓ séquentiel ; un vrai réflexe de terminal qui manque pour les joueurs déjà à l'aise

## 📈 Phase 4 — Croissance / communauté

- [ ] **Analytics respectueux de la vie privée** (type Plausible/Umami, sans cookies) — pour
      savoir quelles missions bloquent le plus de joueurs, sans tracking intrusif
- [ ] **Partage social des succès** — bouton "partager" sur le certificat et les badges
      (génère une image ou un lien préformaté pour Twitter/LinkedIn)
- [ ] **Serveur Discord / espace communautaire** — pour centraliser feedback, entraide entre
      joueurs, et annonces de nouveaux scénarios
- [ ] **Page d'atterrissage dédiée** — actuellement le jeu = la landing page ; une vraie page
      marketing (screenshots, témoignages) avant le `▶ Commencer` pourrait améliorer la conversion
- [ ] **Page de stats publique agrégée** — ex: "X commandes tapées par la communauté", "Y
      certificats délivrés" ; teasing léger pour donner envie de rejoindre (nécessite un
      minimum de backend/compteur côté serveur, donc dépend des analytics ci-dessus)

---

## 💭 Gros chantiers (structurants, plusieurs sessions de travail)

Ces items changent l'architecture du projet ou demandent une infra nouvelle. À ne lancer
que si vraiment décidé, car ils engagent sur la durée (maintenance double, backend à opérer...).

- **Version anglaise complète** (UI + 48 missions + terminal) — traduire ~17 fichiers JS +
  tout le contenu pédagogique. 3 architectures possibles :
  1. Dossier `/en/` séparé avec copie complète du site (simple, mais double la maintenance
     à chaque futur changement)
  2. Traduire seulement l'UI (menus/boutons), missions restent en français (rapide, mais incomplet)
  3. Vrai système i18n — dictionnaire de traduction centralisé (`fr.js`/`en.js`), sélecteur
     de langue qui bascule tout dynamiquement (le mieux sur le long terme, mais gros refactor
     de 17 fichiers, donc plus risqué)
- **Compte utilisateur + sync cross-device** — actuellement tout est en `localStorage`, donc
  la progression est piégée sur un seul navigateur/appareil. Nécessite un vrai backend
  (auth + base de données), gros chantier d'infra.
- **Éditeur de missions communautaire** — permettre à la communauté de créer et partager ses
  propres scénarios/missions. Nécessite un format de mission exportable/importable, un
  back-office de modération, et probablement un backend.
- **App mobile native** (via Capacitor/Cordova) pour publication sur App Store / Play Store —
  le projet est déjà une PWA, donc c'est un wrapper plutôt qu'une réécriture, mais il faut
  gérer les spécificités stores (icônes, permissions, review Apple/Google).
- **Mode difficulté adaptative** — ajuster la difficulté des missions selon les erreurs du
  joueur (ex: proposer plus d'exercices sur `grep` si le joueur galère dessus), nécessite de
  repenser le système de progression linéaire actuel.
- **Vrai terminal Linux dans un conteneur** (sandbox isolée côté serveur/WASM) — pour les
  joueurs avancés qui veulent aller au-delà du simulateur et toucher un vrai shell. Change
  complètement la nature du projet (nécessite isolation/sécurité sérieuse), à ne considérer
  que si la demande existe vraiment.
- **Mode marque blanche / self-hosting pour écoles et formations** — permettre à une école ou
  un formateur de déployer sa propre instance avec son branding, ses scénarios additionnels,
  et un suivi de progression de sa classe. Débouché commercial potentiel, mais nécessite de
  découpler le contenu du code (config externalisée) et un vrai système de comptes.

---

## 📥 Idées en vrac (non triées)

Section de capture rapide — une idée qui arrive en cours de discussion atterrit ici en
premier, avant d'être rangée dans la bonne phase au prochain passage sur ce fichier.

- [ ] *(vide pour l'instant — les idées récentes ont déjà été rangées dans les phases ci-dessus)*

---

## Comment lire ce fichier

- **Phase 1 à 4** : ordre de priorité suggéré, du plus rapide/sûr au plus structurant
- **Gros chantiers** : à traiter à part, pas dans l'enchaînement des phases — ce sont des
  décisions de fond, pas des tâches ponctuelles
- Rien ici n'est gravé dans le marbre : dis-moi ce qui t'intéresse et on ajuste l'ordre
