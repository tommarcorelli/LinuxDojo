// i18n/world.en.js — Traductions anglaises du monde Explorer (WORLD de gameshell.js).
// Chargé juste après js/gameshell.js. Indexé par chemin de zone. On traduit
// name/desc/lockedMsg/requiresMsg, le CONTENU des fichiers (les CLÉS = noms de
// fichiers restent, le joueur les tape), npc (name + lines) et item.name.
// Les `dirs`, emoji et item.id sont neutres. overlayWorld() applique si LANG=en.

const WORLD_EN = {
  "/": {
    name: "🌌 The Nexus",
    desc: "The starting point. Four paths open up: the Forest, the Dungeon, the Ocean and the Mountain. A sealed door waits at the back...",
    files: {
      "bienvenue.txt": "Welcome, Adventurer.\n\nThis world is explored with real Linux commands.\n  ls / ls -la  — look around\n  cd <place>   — move\n  cat <file>   — read\n  map          — see the map\n  inv          — your inventory\n  take <item>  — pick up\n  talk         — talk to characters\n\nCollect the 3 GEMS to open the Final Chest.",
    },
    npc: { name: "The Nexus Keeper",
      lines: ["Welcome. Three gems sleep in this world: the Green, the Blue, the Red.",
              "Find them all and the Final Chest will open to you.",
              "Some doors are locked — you'll need the right items."] },
  },

  "/foret": {
    name: "🌲 Forest of Processes",
    desc: "A dense forest where processes roam. Three trails: the clearing, the swamp, the cave (dark).",
    files: { "note.txt": "The swamp hides a lamp 🔦. Without it, the cave is too dark to enter." },
    npc: { name: "The Old Sage",
      lines: ["Ah, a traveler! The Green Gem hides in the cave.",
              "But it's dark in there. First look for a lamp in the swamp.",
              "Use 'ls -la' everywhere — the best treasures are hidden."] },
  },
  "/foret/clairiere": {
    name: "🌸 The Clearing",
    desc: "A peaceful clearing bathed in light. An old chest rests here.",
    files: {
      "coffre.txt": "You open the chest... 100 gold coins! (+20 XP)",
      ".herbe_rare": "🌿 Rare herb found! An item has joined your inventory.",
    },
    item: { name: "Rare herb" },
  },
  "/foret/marais": {
    name: "🐸 The Swamp",
    desc: "A muddy swamp. Something glints beneath the mud...",
    files: {
      "avertissement.txt": "Don't drink the water. Look for the hidden item with 'ls -la'.",
      ".lampe": "🔦 You pick up a flashlight! It will light up dark places.",
    },
    item: { name: "Flashlight" },
  },
  "/foret/caverne": {
    name: "🕳️ The Dark Cave",
    desc: "An ink-black cave. Thanks to your lamp, you make out a green glow at the back.",
    lockedMsg: "🔦 It's too dark. You need a flashlight (hidden in the swamp).",
    files: {
      "paroi.txt": "Ancient inscriptions speak of a green gem.",
      ".gemme_verte": "💚 THE GREEN GEM! One of the three legendary gems joins your bag.",
    },
    item: { name: "Green Gem" },
  },

  "/donjon": {
    name: "🏰 Dungeon of Permissions",
    desc: "A stone dungeon. Three rooms: the guarded room, the dungeon cell, the library.",
    files: { "regles.txt": "Permissions rule here. rwx = read/write/execute. 'ls -l' reveals everything." },
  },
  "/donjon/salle_gardee": {
    name: "⚔️ The Guarded Room",
    desc: "A protected room. A silver key hangs on the wall.",
    files: {
      "gardien.txt": "Take the silver key, it opens many doors.",
      ".cle_argent": "🗝️ Silver key obtained!",
    },
    item: { name: "Silver key" },
  },
  "/donjon/cachot": {
    name: "⛓️ The Dungeon Cell",
    desc: "A damp cell. A ghost prisoner watches you.",
    files: { "mur.txt": "Scratches on the wall: 'The library keeps the secret of the gems.'" },
    npc: { name: "The Ghost Prisoner",
      lines: ["Free me... well, so to speak, I'm already dead.",
              "Listen: the Blue Gem is in the wreck, deep in the Ocean.",
              "But the wreck is locked. You'll need a diving mask 🤿."] },
  },
  "/donjon/bibliotheque": {
    name: "📚 The Library",
    desc: "Thousands of scrolls. An open grimoire sits at the center.",
    lockedMsg: "🔒 The door is locked. You need the silver key (guarded room).",
    files: {
      "grimoire.txt": "GRIMOIRE OF GEMS\n================\n💚 Green : cave of the forest (lamp required)\n💙 Blue  : wreck of the ocean (mask required)\n❤️ Red   : summit of the mountain\n\nGather all three at the Final Chest in the Nexus.",
      ".savoir": "📖 Scroll of Knowledge obtained! (+30 XP)",
    },
    item: { name: "Scroll of Knowledge" },
  },

  "/ocean": {
    name: "🌊 Ocean of Data",
    desc: "An infinite ocean of bits. Three areas: the reefs, the wreck, the abyss.",
    files: { "bouteille.txt": "Message: the reefs hide a diving mask 🤿." },
  },
  "/ocean/recifs": {
    name: "🪸 The Reefs",
    desc: "Multicolored corals. A piece of diving gear is wedged between two rocks.",
    files: {
      "corail.txt": "A diving mask is here, hidden. 'ls -la' to see it.",
      ".masque": "🤿 Diving mask obtained! You can explore the wreck.",
    },
    item: { name: "Diving mask" },
  },
  "/ocean/epave": {
    name: "🚢 The Wreck",
    desc: "A sunken wreck. Your mask lets you search the hold, where a blue glint shines.",
    lockedMsg: "🤿 Can't dive without a mask (look in the reefs).",
    files: {
      "cale.txt": "In a watertight chest...",
      ".gemme_bleue": "💙 THE BLUE GEM! Second legendary gem acquired.",
    },
    item: { name: "Blue Gem" },
  },
  "/ocean/abysses": {
    name: "🌑 The Abyss",
    desc: "The dark depths. Your lamp reveals an ancient trident.",
    lockedMsg: "🔦 Too dark without a lamp.",
    files: {
      "fond.txt": "The total silence of the abyss.",
      ".trident": "🔱 Trident of the Abyss obtained! (+35 XP)",
    },
    item: { name: "Trident" },
  },

  "/montagne": {
    name: "⛰️ Mountain of Scripts",
    desc: "A steep mountain. Three paths: the summit, the valley, the frozen cave.",
    files: { "panneau.txt": "The Red Gem awaits at the summit. Happy climbing." },
  },
  "/montagne/sommet": {
    name: "🏔️ The Summit",
    desc: "The roof of the world. A stone altar bears a scarlet gem.",
    files: {
      "autel.txt": "On the altar rests the red gem, warm to the touch.",
      ".gemme_rouge": "❤️ THE RED GEM! The third and final gem is yours.",
    },
    item: { name: "Red Gem" },
  },
  "/montagne/vallee": {
    name: "🌄 The Valley",
    desc: "A quiet valley. A hermit meditates by a fire.",
    files: { "config.ini": "[game]\ntip=Type 'map' to see where you stand\n" },
    npc: { name: "The Hermit",
      lines: ["Peace be with you. Are you seeking the gems?",
              "The Red one is just above, at the summit.",
              "When you have all three, return to the Nexus and open the Final Chest."] },
  },
  "/montagne/grotte": {
    name: "❄️ The Frozen Cave",
    desc: "A cave of ice. A frozen chest holds a potion.",
    lockedMsg: "🔒 The frozen padlock requires the silver key.",
    files: {
      "glace.txt": "The biting cold grips you.",
      ".potion": "🧪 Frost Potion obtained! (+30 XP)",
    },
    item: { name: "Frost Potion" },
  },

  "/coffre_final": {
    name: "🏆 The Final Chest",
    desc: "A door sealed by three gem sockets.",
    requiresMsg: "🔒 The chest requires the 3 GEMS (💚 Green, 💙 Blue, ❤️ Red).",
    files: {
      "victoire.txt": "🎉 CONGRATULATIONS! 🎉\n\nYou gathered the three gems and opened the Final Chest.\nYou are now a MASTER EXPLORER of the Linux World.\n\n\"Everything is a file. Everything can be navigated.\"\n\n(+200 XP)",
    },
  },
};

if (typeof overlayWorld === "function") overlayWorld(WORLD_EN);
