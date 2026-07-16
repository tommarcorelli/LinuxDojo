// i18n/objectives.en.js — Traductions anglaises des objectifs (objectives.js).
// Chargé juste après js/objectives.js. Indexé par id (string) : { title, desc }.
// icon, xp, target, cur() restent partagés. overlayArray() applique si LANG=en.

const OBJECTIVES_EN = {
  first:      { title: "First step",           desc: "Complete your 1st mission" },
  scenario1:  { title: "Scenario 1 done",       desc: "Complete the 6 missions of scenario 1" },
  scenario8:  { title: "Git Belt",              desc: "Complete the 6 missions of the Git scenario" },
  scenario9:  { title: "Network Belt",          desc: "Complete the 6 missions of the SSH scenario" },
  scenario10: { title: "Docker Belt",           desc: "Complete the 6 missions of the Docker scenario" },
  scenario11: { title: "Services Belt",         desc: "Complete the 6 missions of the services & logs scenario" },
  typist:     { title: "Shell pianist",         desc: "Type 50 commands in total" },
  toolbox:    { title: "Toolbox",               desc: "Use ls, cat and grep at least once" },
  quiz1:      { title: "Serious student",       desc: "Pass an end-of-chapter quiz" },
  review:     { title: "Active memory",         desc: "Complete 3 reviews (spaced repetition)" },
  daily:      { title: "Diligent",              desc: "Complete a daily challenge" },
  bandit1:    { title: "Infiltration",          desc: "Pass the 1st Infiltration level" },
  challenge:  { title: "Cool head",             desc: "Reach a 60-pt record in Challenge mode" },
  badges3:    { title: "Collector",             desc: "Unlock 3 badges" },
  hacker:     { title: "On the Hacker's path",  desc: "Reach the Hacker rank (800 XP)" },
  boss1:      { title: "First trophy",          desc: "Defeat your first boss" },
  bossall:    { title: "Dungeon cleaner",       desc: "Defeat the 6 bosses (Sensei included)" },
  rtfm:       { title: "RTFM",                  desc: "Read 3 manual pages (man cmd)" },
  eggs:       { title: "Egg hunter",            desc: "Find 3 easter eggs (cowsay, sl, fortune…)" },
  kata:       { title: "Muscle memory",         desc: "Reach a 70-pt score on a Kata" },
};

if (typeof overlayArray === "function") overlayArray(OBJECTIVES, OBJECTIVES_EN, ["title", "desc"]);
