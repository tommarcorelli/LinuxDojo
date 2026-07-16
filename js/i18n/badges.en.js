// i18n/badges.en.js — Traductions anglaises des badges (BADGES de game.js).
// Chargé juste APRÈS js/game.js. Indexé par id de badge : { label } (emoji +
// nom ; l'emoji est conservé car le rendu fait label.split(" ")[0]).
// Les badges saisonniers, ajoutés dynamiquement, relèvent de seasonal (à part).
// overlayArray() (js/i18n.js) applique si LANG === "en".

const BADGES_EN = {
  first_blood: { label: "🩸 First Blood" },
  chapter1:    { label: "📁 Explorer" },
  chapter2:    { label: "✏️ Craftsman" },
  chapter3:    { label: "🔍 Detective" },
  chapter4:    { label: "🔐 Keeper" },
  chapter6:    { label: "🛡️ Defender" },
  chapter7:    { label: "🤖 Automator" },
  chapter8:    { label: "🌱 Committer" },
  chapter9:    { label: "🌐 Cyber-nomad" },
  chapter10:   { label: "🐳 Container Captain" },
  chapter11:   { label: "🚨 On-Call Firefighter" },
  chapter12:   { label: "👥 Account Keeper" },
  master:      { label: "⚡ Linux Master" },
  xp100:       { label: "💯 Centurion" },
  xp500:       { label: "🔥 Inferno" },
  xp1000:      { label: "👑 Legend" },
  boss1:       { label: "⚔️ Boss Slayer" },
  boss4:       { label: "🐉 Scourge of Monsters" },
  blackbelt:   { label: "🖤 Black Belt" },
  expert:      { label: "🎓 Weapons Master" },
  cowsay:      { label: "🐮 Cow Whisperer" },
  sl:          { label: "🚂 Distracted Engineer" },
  fortune:     { label: "🔮 Shell Oracle" },
  vim:         { label: "🥋 Vim Survivor" },
  konami:      { label: "🎮 Secret Code" },
  speedrun:    { label: "⚡ Lightning" },
};

if (typeof overlayArray === "function" && typeof BADGES !== "undefined") overlayArray(BADGES, BADGES_EN, ["label"]);
