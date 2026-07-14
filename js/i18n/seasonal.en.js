// i18n/seasonal.en.js — Traductions anglaises des événements saisonniers (seasonal.js).
// Chargé juste après js/seasonal.js. Indexé par id : { name, banner }.
// (Les libellés de badge saisonnier relèvent du système de badges global,
// traité à part.) overlayArray() applique si LANG === "en".

const SEASONAL_EVENTS_EN = {
  halloween: {
    name: "Halloween",
    banner: "The dojo dons pumpkins for Halloween. A ghost is said to roam the terminal...",
  },
  noel: {
    name: "Christmas",
    banner: "The dojo is covered in snow for the holidays. A tree twinkles somewhere in the terminal...",
  },
};

if (typeof overlayArray === "function") overlayArray(SEASONAL_EVENTS, SEASONAL_EVENTS_EN, ["name", "banner"]);
