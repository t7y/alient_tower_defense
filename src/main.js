"use strict";

const STORAGE_KEY = "starbase-robot-rush-v1";
const MAX_PARTICLES = 190;
const MAX_TOWER_LEVEL = 3;

const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const screens = {
  mainMenu: document.querySelector("#mainMenu"),
  levelSelect: document.querySelector("#levelSelect"),
  cosmeticsScreen: document.querySelector("#cosmeticsScreen"),
  settingsScreen: document.querySelector("#settingsScreen"),
  gameScreen: document.querySelector("#gameScreen"),
};

const modals = {
  pause: document.querySelector("#pauseScreen"),
  victory: document.querySelector("#victoryScreen"),
  defeat: document.querySelector("#defeatScreen"),
};

const ui = {
  continueButton: document.querySelector("#continueButton"),
  playButton: document.querySelector("#playButton"),
  settingsButton: document.querySelector("#settingsButton"),
  cosmeticsButton: document.querySelector("#cosmeticsButton"),
  levelCards: document.querySelector("#levelCards"),
  towerButtons: document.querySelector("#towerButtons"),
  levelName: document.querySelector("#levelName"),
  shieldStat: document.querySelector("#shieldStat"),
  waveStat: document.querySelector("#waveStat"),
  energyStat: document.querySelector("#energyStat"),
  scoreStat: document.querySelector("#scoreStat"),
  startWaveButton: document.querySelector("#startWaveButton"),
  fastButton: document.querySelector("#fastButton"),
  pauseButton: document.querySelector("#pauseButton"),
  selectedInfo: document.querySelector("#selectedInfo"),
  upgradeButton: document.querySelector("#upgradeButton"),
  sellButton: document.querySelector("#sellButton"),
  nextWaveInfo: document.querySelector("#nextWaveInfo"),
  gameBanner: document.querySelector("#gameBanner"),
  resumeButton: document.querySelector("#resumeButton"),
  restartButton: document.querySelector("#restartButton"),
  quitButton: document.querySelector("#quitButton"),
  victorySummary: document.querySelector("#victorySummary"),
  defeatSummary: document.querySelector("#defeatSummary"),
  nextLevelButton: document.querySelector("#nextLevelButton"),
  replayVictoryButton: document.querySelector("#replayVictoryButton"),
  victoryLevelsButton: document.querySelector("#victoryLevelsButton"),
  replayDefeatButton: document.querySelector("#replayDefeatButton"),
  defeatLevelsButton: document.querySelector("#defeatLevelsButton"),
  toast: document.querySelector("#toast"),
  earnedStarsLabel: document.querySelector("#earnedStarsLabel"),
  skinOptions: document.querySelector("#skinOptions"),
  effectOptions: document.querySelector("#effectOptions"),
  musicVolume: document.querySelector("#musicVolume"),
  sfxVolume: document.querySelector("#sfxVolume"),
  reducedMotion: document.querySelector("#reducedMotion"),
  screenShake: document.querySelector("#screenShake"),
  showRanges: document.querySelector("#showRanges"),
};

const DEFAULT_SETTINGS = {
  musicVolume: 0.15,
  sfxVolume: 0.55,
  reducedMotion: false,
  screenShake: true,
  showRanges: true,
};

const SKINS = [
  {
    id: "default",
    name: "Starbase Standard",
    cost: 0,
    colors: ["#18b7b4", "#ffc857", "#826aed"],
  },
  {
    id: "rainbow",
    name: "Rainbow Tech",
    cost: 2,
    colors: ["#ff6f61", "#ffc857", "#51b46d", "#44c8f5"],
  },
  {
    id: "candy",
    name: "Candy Chrome",
    cost: 2,
    colors: ["#ff8fd1", "#8ae9ff", "#fff07a"],
  },
  {
    id: "garden",
    name: "Space Garden",
    cost: 3,
    colors: ["#51b46d", "#b6e86f", "#18b7b4"],
  },
  {
    id: "neon",
    name: "Neon Stickers",
    cost: 3,
    colors: ["#826aed", "#24e8c8", "#ff6f61"],
  },
  {
    id: "cardboard",
    name: "Cardboard Defender",
    cost: 4,
    colors: ["#c78b55", "#65b2c7", "#f4cf74"],
  },
];

const EFFECTS = [
  { id: "stars", name: "Stars", cost: 0, color: "#ffc857" },
  { id: "bubbles", name: "Bubbles", cost: 2, color: "#67dff0" },
  { id: "sparks", name: "Sparks", cost: 2, color: "#ff6f61" },
  { id: "comets", name: "Comets", cost: 3, color: "#826aed" },
];

const TOWER_TYPES = {
  zap: {
    id: "zap",
    name: "Zap Tower",
    role: "Balanced single-target zaps.",
    cost: 55,
    upgrades: [45, 75],
    range: 142,
    damage: 24,
    cooldown: 0.68,
    projectileSpeed: 465,
    color: "#18b7b4",
    detail: "#fff07a",
  },
  bubble: {
    id: "bubble",
    name: "Bubble Cannon",
    role: "Slows robots with soft bubbles.",
    cost: 50,
    upgrades: [40, 70],
    range: 132,
    damage: 6,
    cooldown: 1.05,
    projectileSpeed: 355,
    slow: 0.54,
    slowDuration: 2.1,
    color: "#67dff0",
    detail: "#ffffff",
  },
  star: {
    id: "star",
    name: "Star Blaster",
    role: "Splash shots for robot groups.",
    cost: 85,
    upgrades: [65, 100],
    range: 130,
    damage: 30,
    cooldown: 1.28,
    projectileSpeed: 385,
    splash: 58,
    color: "#ffc857",
    detail: "#ff6f61",
  },
  laser: {
    id: "laser",
    name: "Laser Sprout",
    role: "Fast short-range light beam.",
    cost: 75,
    upgrades: [55, 90],
    range: 104,
    damage: 10,
    cooldown: 0.2,
    beam: true,
    color: "#51b46d",
    detail: "#826aed",
  },
};

const ENEMY_TYPES = {
  walker: {
    name: "Walker Bot",
    hp: 62,
    speed: 49,
    energy: 8,
    score: 50,
    size: 16,
    color: "#ff7b6e",
    detail: "#ffd166",
    shieldDamage: 1,
  },
  zoomer: {
    name: "Tiny Zoomer",
    hp: 34,
    speed: 88,
    energy: 7,
    score: 45,
    size: 12,
    color: "#44c8f5",
    detail: "#fff07a",
    shieldDamage: 1,
  },
  chunky: {
    name: "Chunky Bot",
    hp: 168,
    speed: 32,
    energy: 14,
    score: 95,
    size: 21,
    color: "#826aed",
    detail: "#c8f464",
    shieldDamage: 1,
  },
  shield: {
    name: "Shield Bot",
    hp: 92,
    speed: 42,
    energy: 12,
    score: 80,
    size: 17,
    color: "#f0a84f",
    detail: "#67dff0",
    shielded: true,
    shieldDamage: 1,
  },
  hover: {
    name: "Hover Bot",
    hp: 74,
    speed: 58,
    energy: 10,
    score: 70,
    size: 15,
    color: "#51b46d",
    detail: "#f7f1ff",
    hover: true,
    shieldDamage: 1,
  },
  roller: {
    name: "Roller Bot",
    hp: 104,
    speed: 70,
    energy: 11,
    score: 82,
    size: 16,
    color: "#ff5fb7",
    detail: "#fff07a",
    slowResist: 0.48,
    shieldDamage: 1,
  },
  splitter: {
    name: "Splitter Bot",
    hp: 88,
    speed: 54,
    energy: 13,
    score: 96,
    size: 17,
    color: "#2ac7a5",
    detail: "#fff07a",
    splitType: "zoomer",
    splitCount: 2,
    shieldDamage: 1,
  },
  repair: {
    name: "Repair Bot",
    hp: 92,
    speed: 43,
    energy: 14,
    score: 100,
    size: 17,
    color: "#f5a442",
    detail: "#44c8f5",
    healer: true,
    healRadius: 82,
    healAmount: 18,
    shieldDamage: 1,
  },
  blink: {
    name: "Blink Bot",
    hp: 78,
    speed: 64,
    energy: 13,
    score: 94,
    size: 15,
    color: "#8a63ff",
    detail: "#f7f1ff",
    blinkDistance: 54,
    blinkInterval: 2.7,
    shieldDamage: 1,
  },
  prism: {
    name: "Prism Bot",
    hp: 132,
    speed: 47,
    energy: 15,
    score: 110,
    size: 18,
    color: "#75ddff",
    detail: "#ff8fd1",
    splashResist: 0.58,
    beamResist: 0.82,
    shieldDamage: 1,
  },
};

const LEVELS = [
  {
    id: "moon",
    name: "Moon Meadow",
    description: "A gentle winding path, now with a few sneaky support robots in the late waves.",
    wavesLabel: "9 waves",
    startEnergy: 145,
    shields: 19,
    palette: {
      ground: "#dff7e7",
      groundAlt: "#c7efe7",
      path: "#ffe7a5",
      pathEdge: "#f4b95e",
      accent: "#7bdc86",
      base: "#18b7b4",
    },
    paths: [
      [
        { x: 0.04, y: 0.55 },
        { x: 0.23, y: 0.55 },
        { x: 0.23, y: 0.32 },
        { x: 0.43, y: 0.32 },
        { x: 0.43, y: 0.68 },
        { x: 0.66, y: 0.68 },
        { x: 0.66, y: 0.44 },
        { x: 0.92, y: 0.44 },
      ],
    ],
    buildPads: [
      { x: 0.16, y: 0.42 },
      { x: 0.31, y: 0.22 },
      { x: 0.35, y: 0.52 },
      { x: 0.55, y: 0.29 },
      { x: 0.55, y: 0.79 },
      { x: 0.76, y: 0.57 },
      { x: 0.82, y: 0.31 },
      { x: 0.71, y: 0.26 },
    ],
    waves: [
      wave(["walker", 7, 0.78]),
      wave(["walker", 9, 0.68], ["zoomer", 5, 0.46]),
      wave(["walker", 9, 0.58], ["chunky", 2, 1.0]),
      wave(["zoomer", 12, 0.34], ["walker", 8, 0.48]),
      wave(["shield", 5, 0.72], ["roller", 4, 0.48], ["walker", 8, 0.42]),
      wave(["hover", 6, 0.58], ["splitter", 4, 0.62], ["zoomer", 10, 0.28]),
      wave(["repair", 2, 1.05], ["shield", 7, 0.48], ["chunky", 4, 0.78]),
      wave(["roller", 10, 0.34], ["hover", 8, 0.44], ["splitter", 5, 0.5]),
      wave(["walker", 13, 0.26], ["shield", 7, 0.38], ["chunky", 1, 0.9, null, true]),
    ],
  },
  {
    id: "crystal",
    name: "Crystal Canyon",
    description: "Two glittering lanes split the rush while repair bots keep groups together.",
    wavesLabel: "11 waves",
    startEnergy: 155,
    shields: 21,
    palette: {
      ground: "#e9e2ff",
      groundAlt: "#d4f6ff",
      path: "#f7d9ff",
      pathEdge: "#a98cff",
      accent: "#5bd6d1",
      base: "#826aed",
    },
    paths: [
      [
        { x: 0.04, y: 0.28 },
        { x: 0.25, y: 0.28 },
        { x: 0.37, y: 0.47 },
        { x: 0.57, y: 0.47 },
        { x: 0.57, y: 0.22 },
        { x: 0.82, y: 0.22 },
        { x: 0.93, y: 0.5 },
      ],
      [
        { x: 0.04, y: 0.72 },
        { x: 0.24, y: 0.72 },
        { x: 0.37, y: 0.53 },
        { x: 0.55, y: 0.53 },
        { x: 0.55, y: 0.78 },
        { x: 0.82, y: 0.78 },
        { x: 0.93, y: 0.5 },
      ],
    ],
    buildPads: [
      { x: 0.16, y: 0.18 },
      { x: 0.16, y: 0.82 },
      { x: 0.34, y: 0.34 },
      { x: 0.34, y: 0.66 },
      { x: 0.49, y: 0.37 },
      { x: 0.49, y: 0.63 },
      { x: 0.68, y: 0.34 },
      { x: 0.68, y: 0.66 },
      { x: 0.82, y: 0.43 },
      { x: 0.82, y: 0.57 },
    ],
    waves: [
      wave(["walker", 9, 0.58]),
      wave(["zoomer", 10, 0.34], ["walker", 9, 0.48]),
      wave(["hover", 8, 0.54], ["roller", 5, 0.42]),
      wave(["walker", 12, 0.38], ["chunky", 4, 0.82], ["splitter", 4, 0.52]),
      wave(["shield", 7, 0.52], ["zoomer", 14, 0.26]),
      wave(["repair", 3, 0.9], ["hover", 9, 0.42], ["chunky", 5, 0.7]),
      wave(["walker", 14, 0.32], ["shield", 9, 0.42], ["roller", 8, 0.3]),
      wave(["splitter", 8, 0.38], ["hover", 9, 0.36], ["repair", 3, 0.75]),
      wave(["zoomer", 18, 0.2], ["prism", 4, 0.62], ["chunky", 6, 0.54]),
      wave(["roller", 14, 0.24], ["shield", 10, 0.34], ["splitter", 8, 0.34]),
      wave(["hover", 12, 0.32], ["repair", 4, 0.58], ["chunky", 1, 0.9, null, true]),
    ],
  },
  {
    id: "orbit",
    name: "Orbit Outpost",
    description: "A long orbital route with tight turns, blink jumps, and armored prism bots.",
    wavesLabel: "12 waves",
    startEnergy: 165,
    shields: 22,
    palette: {
      ground: "#dff2ff",
      groundAlt: "#fff4c7",
      path: "#d8f0ff",
      pathEdge: "#5aa3db",
      accent: "#ff8f70",
      base: "#ff6f61",
    },
    paths: [
      [
        { x: 0.05, y: 0.18 },
        { x: 0.2, y: 0.18 },
        { x: 0.2, y: 0.82 },
        { x: 0.38, y: 0.82 },
        { x: 0.38, y: 0.31 },
        { x: 0.55, y: 0.31 },
        { x: 0.55, y: 0.7 },
        { x: 0.72, y: 0.7 },
        { x: 0.72, y: 0.42 },
        { x: 0.92, y: 0.42 },
      ],
    ],
    buildPads: [
      { x: 0.12, y: 0.34 },
      { x: 0.12, y: 0.67 },
      { x: 0.29, y: 0.7 },
      { x: 0.29, y: 0.26 },
      { x: 0.47, y: 0.22 },
      { x: 0.47, y: 0.47 },
      { x: 0.47, y: 0.82 },
      { x: 0.64, y: 0.58 },
      { x: 0.64, y: 0.82 },
      { x: 0.81, y: 0.28 },
      { x: 0.82, y: 0.56 },
    ],
    waves: [
      wave(["walker", 10, 0.5]),
      wave(["walker", 12, 0.42], ["zoomer", 8, 0.3]),
      wave(["chunky", 4, 0.74], ["roller", 7, 0.34]),
      wave(["hover", 9, 0.48], ["zoomer", 10, 0.25], ["splitter", 4, 0.42]),
      wave(["shield", 8, 0.48], ["blink", 5, 0.58], ["walker", 12, 0.3]),
      wave(["repair", 3, 0.8], ["chunky", 6, 0.58], ["hover", 8, 0.34]),
      wave(["shield", 10, 0.4], ["prism", 4, 0.58], ["walker", 16, 0.25]),
      wave(["blink", 8, 0.38], ["hover", 12, 0.32], ["chunky", 6, 0.5]),
      wave(["splitter", 10, 0.32], ["repair", 3, 0.64], ["roller", 10, 0.25]),
      wave(["zoomer", 24, 0.16], ["prism", 6, 0.42], ["shield", 10, 0.32]),
      wave(["chunky", 9, 0.44], ["blink", 10, 0.28], ["repair", 4, 0.48]),
      wave(["walker", 18, 0.2], ["shield", 12, 0.28], ["prism", 6, 0.36], ["chunky", 1, 0.8, null, true]),
    ],
  },
  {
    id: "scrapfield",
    name: "Solar Scrapfield",
    description: "A sunlit junkyard route where splitters and rollers punish single-tower plans.",
    wavesLabel: "13 waves",
    startEnergy: 175,
    shields: 23,
    palette: {
      ground: "#fff0c9",
      groundAlt: "#d9f6ef",
      path: "#ffd6a0",
      pathEdge: "#ed9b59",
      accent: "#24b6a8",
      base: "#f46d43",
    },
    paths: [
      [
        { x: 0.05, y: 0.62 },
        { x: 0.2, y: 0.62 },
        { x: 0.2, y: 0.25 },
        { x: 0.42, y: 0.25 },
        { x: 0.42, y: 0.52 },
        { x: 0.61, y: 0.52 },
        { x: 0.61, y: 0.78 },
        { x: 0.83, y: 0.78 },
        { x: 0.93, y: 0.48 },
      ],
      [
        { x: 0.05, y: 0.33 },
        { x: 0.27, y: 0.33 },
        { x: 0.27, y: 0.68 },
        { x: 0.48, y: 0.68 },
        { x: 0.48, y: 0.38 },
        { x: 0.7, y: 0.38 },
        { x: 0.7, y: 0.62 },
        { x: 0.93, y: 0.48 },
      ],
    ],
    buildPads: [
      { x: 0.12, y: 0.48 },
      { x: 0.15, y: 0.2 },
      { x: 0.32, y: 0.2 },
      { x: 0.35, y: 0.49 },
      { x: 0.35, y: 0.81 },
      { x: 0.53, y: 0.28 },
      { x: 0.55, y: 0.64 },
      { x: 0.68, y: 0.75 },
      { x: 0.76, y: 0.28 },
      { x: 0.8, y: 0.62 },
      { x: 0.87, y: 0.39 },
    ],
    waves: [
      wave(["roller", 8, 0.38], ["walker", 8, 0.42]),
      wave(["splitter", 6, 0.46], ["zoomer", 12, 0.22]),
      wave(["shield", 8, 0.42], ["roller", 8, 0.28]),
      wave(["repair", 3, 0.66], ["walker", 16, 0.24], ["chunky", 4, 0.5]),
      wave(["hover", 12, 0.32], ["splitter", 8, 0.36]),
      wave(["blink", 7, 0.42], ["roller", 12, 0.24], ["shield", 8, 0.32]),
      wave(["prism", 5, 0.5], ["repair", 4, 0.58], ["walker", 18, 0.2]),
      wave(["chunky", 8, 0.42], ["splitter", 10, 0.28], ["zoomer", 18, 0.16]),
      wave(["hover", 14, 0.26], ["blink", 9, 0.3], ["repair", 4, 0.46]),
      wave(["roller", 18, 0.18], ["shield", 12, 0.25], ["prism", 6, 0.36]),
      wave(["splitter", 14, 0.24], ["chunky", 8, 0.34], ["repair", 5, 0.38]),
      wave(["blink", 12, 0.24], ["hover", 14, 0.24], ["shield", 12, 0.24]),
      wave(["roller", 20, 0.15], ["repair", 5, 0.34], ["prism", 7, 0.3], ["splitter", 1, 0.8, null, true]),
    ],
  },
  {
    id: "nebula",
    name: "Nebula Nursery",
    description: "Soft clouds hide three robot lanes with heavy healing and blink pressure.",
    wavesLabel: "14 waves",
    startEnergy: 190,
    shields: 24,
    palette: {
      ground: "#f6e7ff",
      groundAlt: "#d7fff1",
      path: "#d9edff",
      pathEdge: "#7bb5ef",
      accent: "#ff8fd1",
      base: "#24b6a8",
    },
    paths: [
      [
        { x: 0.04, y: 0.18 },
        { x: 0.22, y: 0.18 },
        { x: 0.31, y: 0.38 },
        { x: 0.48, y: 0.38 },
        { x: 0.61, y: 0.18 },
        { x: 0.83, y: 0.18 },
        { x: 0.94, y: 0.5 },
      ],
      [
        { x: 0.04, y: 0.5 },
        { x: 0.23, y: 0.5 },
        { x: 0.35, y: 0.6 },
        { x: 0.52, y: 0.6 },
        { x: 0.66, y: 0.5 },
        { x: 0.94, y: 0.5 },
      ],
      [
        { x: 0.04, y: 0.82 },
        { x: 0.22, y: 0.82 },
        { x: 0.31, y: 0.64 },
        { x: 0.48, y: 0.64 },
        { x: 0.61, y: 0.82 },
        { x: 0.83, y: 0.82 },
        { x: 0.94, y: 0.5 },
      ],
    ],
    buildPads: [
      { x: 0.13, y: 0.33 },
      { x: 0.13, y: 0.67 },
      { x: 0.28, y: 0.28 },
      { x: 0.28, y: 0.72 },
      { x: 0.42, y: 0.48 },
      { x: 0.52, y: 0.28 },
      { x: 0.52, y: 0.73 },
      { x: 0.67, y: 0.32 },
      { x: 0.67, y: 0.68 },
      { x: 0.79, y: 0.36 },
      { x: 0.79, y: 0.64 },
      { x: 0.86, y: 0.5 },
    ],
    waves: [
      wave(["walker", 12, 0.32], ["zoomer", 12, 0.22]),
      wave(["hover", 12, 0.3], ["roller", 10, 0.24]),
      wave(["splitter", 10, 0.3], ["shield", 8, 0.32]),
      wave(["repair", 4, 0.52], ["walker", 20, 0.18], ["chunky", 5, 0.4]),
      wave(["blink", 9, 0.32], ["zoomer", 20, 0.14], ["hover", 10, 0.25]),
      wave(["prism", 7, 0.38], ["shield", 10, 0.25], ["repair", 4, 0.42]),
      wave(["splitter", 14, 0.22], ["roller", 14, 0.18], ["chunky", 7, 0.3]),
      wave(["hover", 18, 0.2], ["blink", 12, 0.22], ["repair", 5, 0.34]),
      wave(["prism", 9, 0.3], ["shield", 14, 0.2], ["zoomer", 24, 0.12]),
      wave(["chunky", 10, 0.28], ["splitter", 16, 0.18], ["repair", 5, 0.3]),
      wave(["roller", 22, 0.12], ["blink", 14, 0.18], ["hover", 16, 0.16]),
      wave(["prism", 12, 0.24], ["repair", 6, 0.26], ["shield", 16, 0.16]),
      wave(["splitter", 20, 0.14], ["zoomer", 28, 0.09], ["chunky", 10, 0.22]),
      wave(["blink", 16, 0.16], ["repair", 6, 0.24], ["prism", 8, 0.22], ["hover", 1, 0.8, null, true]),
    ],
  },
  {
    id: "comet",
    name: "Comet Core",
    description: "The final route throws every robot trick through narrow comet turns.",
    wavesLabel: "15 waves",
    startEnergy: 205,
    shields: 25,
    palette: {
      ground: "#e5f2ff",
      groundAlt: "#ffe4df",
      path: "#f2f7ff",
      pathEdge: "#ff9e7a",
      accent: "#826aed",
      base: "#ff6f61",
    },
    paths: [
      [
        { x: 0.05, y: 0.5 },
        { x: 0.16, y: 0.5 },
        { x: 0.16, y: 0.2 },
        { x: 0.32, y: 0.2 },
        { x: 0.32, y: 0.8 },
        { x: 0.48, y: 0.8 },
        { x: 0.48, y: 0.28 },
        { x: 0.66, y: 0.28 },
        { x: 0.66, y: 0.72 },
        { x: 0.82, y: 0.72 },
        { x: 0.93, y: 0.5 },
      ],
      [
        { x: 0.05, y: 0.24 },
        { x: 0.24, y: 0.24 },
        { x: 0.24, y: 0.55 },
        { x: 0.42, y: 0.55 },
        { x: 0.42, y: 0.18 },
        { x: 0.6, y: 0.18 },
        { x: 0.6, y: 0.52 },
        { x: 0.79, y: 0.52 },
        { x: 0.93, y: 0.5 },
      ],
      [
        { x: 0.05, y: 0.76 },
        { x: 0.24, y: 0.76 },
        { x: 0.24, y: 0.45 },
        { x: 0.42, y: 0.45 },
        { x: 0.42, y: 0.82 },
        { x: 0.6, y: 0.82 },
        { x: 0.6, y: 0.48 },
        { x: 0.79, y: 0.48 },
        { x: 0.93, y: 0.5 },
      ],
    ],
    buildPads: [
      { x: 0.11, y: 0.35 },
      { x: 0.11, y: 0.65 },
      { x: 0.25, y: 0.36 },
      { x: 0.25, y: 0.64 },
      { x: 0.39, y: 0.3 },
      { x: 0.39, y: 0.7 },
      { x: 0.54, y: 0.36 },
      { x: 0.54, y: 0.64 },
      { x: 0.7, y: 0.42 },
      { x: 0.7, y: 0.58 },
      { x: 0.82, y: 0.34 },
      { x: 0.82, y: 0.66 },
      { x: 0.87, y: 0.5 },
    ],
    waves: [
      wave(["walker", 14, 0.26], ["roller", 10, 0.18]),
      wave(["zoomer", 24, 0.1], ["hover", 10, 0.2]),
      wave(["shield", 12, 0.22], ["splitter", 10, 0.22]),
      wave(["repair", 5, 0.38], ["chunky", 8, 0.3], ["walker", 20, 0.14]),
      wave(["blink", 12, 0.22], ["roller", 18, 0.12], ["hover", 12, 0.16]),
      wave(["prism", 10, 0.26], ["shield", 16, 0.14], ["repair", 5, 0.3]),
      wave(["splitter", 18, 0.14], ["zoomer", 30, 0.08], ["chunky", 8, 0.22]),
      wave(["blink", 16, 0.14], ["repair", 6, 0.22], ["hover", 18, 0.12]),
      wave(["prism", 14, 0.18], ["roller", 24, 0.08], ["shield", 18, 0.1]),
      wave(["chunky", 14, 0.18], ["splitter", 22, 0.1], ["repair", 7, 0.18]),
      wave(["blink", 20, 0.1], ["zoomer", 34, 0.06], ["hover", 20, 0.1]),
      wave(["prism", 16, 0.14], ["repair", 8, 0.16], ["shield", 20, 0.08]),
      wave(["roller", 30, 0.06], ["splitter", 24, 0.08], ["chunky", 12, 0.14]),
      wave(["blink", 24, 0.08], ["prism", 18, 0.1], ["repair", 8, 0.14]),
      wave(["shield", 24, 0.06], ["hover", 22, 0.08], ["splitter", 18, 0.08], ["prism", 1, 0.8, null, true]),
    ],
  },
];

let progress = loadProgress();
let game = null;
let selectedBuildType = null;
let lastTime = performance.now();
let animationFrame = 0;
let toastTimer = 0;
let pointer = { x: 0, y: 0, inside: false };
let audio;

function wave(...entries) {
  return entries.map(([type, count, spacing, pathIndex = null, boss = false]) => ({
    type,
    count,
    spacing,
    pathIndex,
    boss,
  }));
}

function loadProgress() {
  const fallback = {
    levels: {},
    unlockedSkins: ["default"],
    unlockedEffects: ["stars"],
    selectedSkin: "default",
    selectedEffect: "stars",
    lastCompletedLevelId: null,
    resumeLevelId: null,
    settings: { ...DEFAULT_SETTINGS },
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      unlockedSkins: Array.isArray(parsed.unlockedSkins) ? parsed.unlockedSkins : fallback.unlockedSkins,
      unlockedEffects: Array.isArray(parsed.unlockedEffects) ? parsed.unlockedEffects : fallback.unlockedEffects,
      levels: parsed.levels || {},
    };
  } catch {
    return fallback;
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    showToast("Progress could not be saved in this browser session.");
  }
}

function totalEarnedStars() {
  return Object.values(progress.levels).reduce((sum, entry) => sum + (entry.bestStars || 0), 0);
}

function completedLevelCount() {
  return LEVELS.filter((level) => progress.levels[level.id]?.bestStars > 0).length;
}

function getResumeLevel() {
  const stored = LEVELS.find((level) => level.id === progress.resumeLevelId);
  if (stored) return stored;
  const firstUnfinished = LEVELS.find((level) => !progress.levels[level.id]?.bestStars);
  if (firstUnfinished && completedLevelCount() > 0) return firstUnfinished;
  if (completedLevelCount() === LEVELS.length) return LEVELS[LEVELS.length - 1];
  return null;
}

function updateResumeButton() {
  const resumeLevel = getResumeLevel();
  if (!resumeLevel) {
    ui.continueButton.classList.add("hidden");
    ui.continueButton.textContent = "Continue";
    return;
  }
  ui.continueButton.classList.remove("hidden");
  ui.continueButton.textContent = `Continue: ${resumeLevel.name}`;
}

function spentStars() {
  const skinSpent = SKINS
    .filter((skin) => skin.cost > 0 && progress.unlockedSkins.includes(skin.id))
    .reduce((sum, skin) => sum + skin.cost, 0);
  const effectSpent = EFFECTS
    .filter((effect) => effect.cost > 0 && progress.unlockedEffects.includes(effect.id))
    .reduce((sum, effect) => sum + effect.cost, 0);
  return skinSpent + effectSpent;
}

function availableStars() {
  return Math.max(0, totalEarnedStars() - spentStars());
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function showScreen(name) {
  Object.entries(screens).forEach(([screenName, element]) => {
    element.classList.toggle("hidden", screenName !== name);
    element.classList.toggle("active", screenName === name);
  });
  hideModals();
  if (name === "levelSelect") renderLevelCards();
  if (name === "cosmeticsScreen") renderCosmetics();
  if (name === "settingsScreen") syncSettingsInputs();
  if (name === "gameScreen") resizeCanvas();
  if (name === "mainMenu") updateResumeButton();
}

function showModal(name) {
  Object.entries(modals).forEach(([modalName, element]) => {
    element.classList.toggle("hidden", modalName !== name);
  });
}

function hideModals() {
  Object.values(modals).forEach((element) => element.classList.add("hidden"));
}

function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ui.toast.classList.add("hidden"), 2100);
}

function banner(message) {
  ui.gameBanner.textContent = message;
  ui.gameBanner.classList.remove("hidden");
  setTimeout(() => {
    if (ui.gameBanner.textContent === message) ui.gameBanner.classList.add("hidden");
  }, 1800);
}

function renderLevelCards() {
  ui.levelCards.replaceChildren();
  const resumeLevel = getResumeLevel();
  LEVELS.forEach((level, index) => {
    const record = progress.levels[level.id] || { bestScore: 0, bestStars: 0 };
    const card = document.createElement("article");
    card.className = "level-card";
    if (resumeLevel?.id === level.id) card.classList.add("resume-card");
    card.style.setProperty("--preview-a", level.palette.ground);
    card.style.setProperty("--preview-b", level.palette.groundAlt);

    const preview = document.createElement("div");
    preview.className = "level-preview";
    const previewCanvas = document.createElement("canvas");
    previewCanvas.width = 420;
    previewCanvas.height = 170;
    preview.append(previewCanvas);

    const title = document.createElement("div");
    title.innerHTML = `
      <p class="eyebrow">Level ${index + 1}</p>
      <h3>${level.name}</h3>
      <p>${level.description}</p>
    `;

    const meta = document.createElement("div");
    meta.className = "level-meta";
    meta.innerHTML = `
      <span class="pill">${level.wavesLabel}</span>
      <span class="pill">Best: ${record.bestScore || 0}</span>
      <span class="pill">${record.bestStars || 0} stars</span>
      ${resumeLevel?.id === level.id ? '<span class="pill resume-pill">Resume</span>' : ""}
    `;

    const button = document.createElement("button");
    button.className = "primary-button";
    button.textContent = resumeLevel?.id === level.id ? "Resume Route" : record.bestStars ? "Replay Level" : "Start Level";
    button.addEventListener("click", () => startLevel(level.id));

    card.append(preview, title, meta, button);
    ui.levelCards.append(card);
    drawLevelPreview(previewCanvas, level);
  });
}

function drawLevelPreview(previewCanvas, level) {
  const previewCtx = previewCanvas.getContext("2d");
  const w = previewCanvas.width;
  const h = previewCanvas.height;
  previewCtx.clearRect(0, 0, w, h);
  const gradient = previewCtx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, level.palette.ground);
  gradient.addColorStop(1, level.palette.groundAlt);
  previewCtx.fillStyle = gradient;
  previewCtx.fillRect(0, 0, w, h);
  level.paths.forEach((path) => {
    previewCtx.lineJoin = "round";
    previewCtx.lineCap = "round";
    previewCtx.lineWidth = 24;
    previewCtx.strokeStyle = level.palette.pathEdge;
    previewCtx.beginPath();
    path.forEach((point, index) => {
      const x = point.x * w;
      const y = point.y * h;
      if (index === 0) previewCtx.moveTo(x, y);
      else previewCtx.lineTo(x, y);
    });
    previewCtx.stroke();
    previewCtx.lineWidth = 16;
    previewCtx.strokeStyle = level.palette.path;
    previewCtx.stroke();
  });
  level.buildPads.forEach((pad) => {
    previewCtx.beginPath();
    previewCtx.arc(pad.x * w, pad.y * h, 7, 0, Math.PI * 2);
    previewCtx.fillStyle = "#ffffff";
    previewCtx.fill();
    previewCtx.lineWidth = 3;
    previewCtx.strokeStyle = level.palette.accent;
    previewCtx.stroke();
  });
}

function renderTowerButtons() {
  ui.towerButtons.replaceChildren();
  Object.values(TOWER_TYPES).forEach((tower) => {
    const button = document.createElement("button");
    button.className = "tower-button";
    button.type = "button";
    button.title = tower.role;
    button.setAttribute("aria-pressed", selectedBuildType === tower.id ? "true" : "false");
    button.disabled = Boolean(game && game.energy < tower.cost && selectedBuildType !== tower.id);
    button.innerHTML = `
      <span class="tower-icon" style="background:${tower.color}"></span>
      <span class="tower-label">
        <strong>${tower.name}</strong>
        <span>${tower.role}</span>
      </span>
      <span class="tower-cost">${tower.cost}</span>
    `;
    button.addEventListener("click", () => {
      if (!game || game.status !== "playing") return;
      if (game.energy < tower.cost) {
        showToast(`Need ${tower.cost} energy for ${tower.name}.`);
        return;
      }
      selectedBuildType = selectedBuildType === tower.id ? null : tower.id;
      game.selectedTowerId = null;
      updateHud();
    });
    ui.towerButtons.append(button);
  });
}

function renderCosmetics() {
  const earned = totalEarnedStars();
  const available = availableStars();
  ui.earnedStarsLabel.textContent = `${earned} total, ${available} available`;
  renderCosmeticGroup(ui.skinOptions, SKINS, "skin");
  renderCosmeticGroup(ui.effectOptions, EFFECTS, "effect");
}

function renderCosmeticGroup(container, items, type) {
  container.replaceChildren();
  items.forEach((item) => {
    const unlocked = type === "skin"
      ? progress.unlockedSkins.includes(item.id)
      : progress.unlockedEffects.includes(item.id);
    const selected = type === "skin"
      ? progress.selectedSkin === item.id
      : progress.selectedEffect === item.id;
    const card = document.createElement("article");
    card.className = "cosmetic-card";

    const swatch = document.createElement("span");
    swatch.className = "swatch";
    if (type === "skin") {
      swatch.style.background = `linear-gradient(135deg, ${item.colors.join(", ")})`;
    } else {
      swatch.style.background = `radial-gradient(circle, #ffffff 0 16%, ${item.color} 18% 58%, #1f2440 61%)`;
    }

    const copy = document.createElement("div");
    copy.innerHTML = `<strong>${item.name}</strong><p>${item.cost ? `${item.cost} stars` : "Default"}</p>`;

    const button = document.createElement("button");
    if (selected) {
      button.textContent = "Selected";
      button.disabled = true;
    } else if (unlocked) {
      button.textContent = "Select";
    } else {
      button.textContent = `Unlock ${item.cost}`;
      button.disabled = availableStars() < item.cost;
    }
    button.addEventListener("click", () => {
      if (!unlocked) {
        if (availableStars() < item.cost) {
          showToast("Earn more stars by improving level ratings.");
          return;
        }
        if (type === "skin") progress.unlockedSkins.push(item.id);
        else progress.unlockedEffects.push(item.id);
      }
      if (type === "skin") progress.selectedSkin = item.id;
      else progress.selectedEffect = item.id;
      saveProgress();
      renderCosmetics();
    });

    card.append(swatch, copy, button);
    container.append(card);
  });
}

function syncSettingsInputs() {
  ui.musicVolume.value = progress.settings.musicVolume;
  ui.sfxVolume.value = progress.settings.sfxVolume;
  ui.reducedMotion.checked = progress.settings.reducedMotion;
  ui.screenShake.checked = progress.settings.screenShake;
  ui.showRanges.checked = progress.settings.showRanges;
}

function saveSettingsFromInputs() {
  progress.settings.musicVolume = Number(ui.musicVolume.value);
  progress.settings.sfxVolume = Number(ui.sfxVolume.value);
  progress.settings.reducedMotion = ui.reducedMotion.checked;
  progress.settings.screenShake = ui.screenShake.checked;
  progress.settings.showRanges = ui.showRanges.checked;
  saveProgress();
  audio.refreshMusic();
}

function startLevel(levelId) {
  const level = LEVELS.find((entry) => entry.id === levelId);
  if (!level) return;
  selectedBuildType = null;
  game = new Game(level);
  showScreen("gameScreen");
  resizeCanvas();
  updateHud();
  banner("Build on glowing pads, then start the wave.");
  audio.unlock();
  audio.refreshMusic();
}

function updateHud() {
  renderTowerButtons();
  if (!game) return;

  const totalWaves = game.level.waves.length;
  const waveNumber = Math.min(game.currentWaveIndex + 1, totalWaves);
  ui.levelName.textContent = game.level.name;
  ui.shieldStat.textContent = `${Math.max(0, game.shields)}/${game.maxShields}`;
  ui.waveStat.textContent = `${waveNumber}/${totalWaves}`;
  ui.energyStat.textContent = Math.floor(game.energy);
  ui.scoreStat.textContent = Math.floor(game.score);
  ui.fastButton.textContent = game.fastForward ? "2x" : "1x";
  ui.fastButton.setAttribute("aria-pressed", game.fastForward ? "true" : "false");

  const canStart = game.status === "playing" && !game.waveRunning && game.currentWaveIndex < totalWaves;
  ui.startWaveButton.disabled = !canStart;
  ui.startWaveButton.textContent = canStart ? `Start Wave ${game.currentWaveIndex + 1}` : "Wave Running";
  if (game.currentWaveIndex >= totalWaves && game.status === "playing") {
    ui.startWaveButton.textContent = "Final Robots";
  }

  const selectedTower = game.getSelectedTower();
  if (selectedTower) {
    const type = TOWER_TYPES[selectedTower.type];
    const stats = game.towerStats(selectedTower);
    const upgradeCost = game.upgradeCost(selectedTower);
    ui.selectedInfo.innerHTML = `
      <strong>${type.name} - Level ${selectedTower.level}</strong>
      ${type.role}<br>
      Range ${Math.round(stats.range)}, damage ${Math.round(stats.damage)}, speed ${stats.cooldown.toFixed(2)}s.
    `;
    ui.upgradeButton.disabled = upgradeCost === null || game.energy < upgradeCost;
    ui.upgradeButton.textContent = upgradeCost === null ? "Max Level" : `Upgrade ${upgradeCost}`;
    ui.sellButton.disabled = false;
    ui.sellButton.textContent = `Sell ${game.sellRefund(selectedTower)}`;
  } else if (selectedBuildType) {
    const type = TOWER_TYPES[selectedBuildType];
    ui.selectedInfo.innerHTML = `
      <strong>${type.name}</strong>
      ${type.role}<br>
      Cost ${type.cost}. Click an empty glowing pad to build.
    `;
    ui.upgradeButton.disabled = true;
    ui.upgradeButton.textContent = "Upgrade";
    ui.sellButton.disabled = true;
    ui.sellButton.textContent = "Sell";
  } else {
    ui.selectedInfo.textContent = "Choose a tower type, then click a glowing build pad.";
    ui.upgradeButton.disabled = true;
    ui.upgradeButton.textContent = "Upgrade";
    ui.sellButton.disabled = true;
    ui.sellButton.textContent = "Sell";
  }

  ui.nextWaveInfo.textContent = game.nextWaveDescription();
}

function pauseGame() {
  if (!game || game.status !== "playing") return;
  game.paused = true;
  showModal("pause");
}

function resumeGame() {
  if (!game) return;
  game.paused = false;
  hideModals();
}

function openLevelSelect() {
  if (game) game.paused = true;
  game = null;
  showScreen("levelSelect");
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (game) game.resize(rect.width, rect.height);
}

function animationLoop(now) {
  const rawDt = Math.min((now - lastTime) / 1000, 0.08);
  lastTime = now;
  if (game) {
    game.update(rawDt);
    game.render(ctx);
  }
  animationFrame = requestAnimationFrame(animationLoop);
}

class AudioEngine {
  constructor() {
    this.context = null;
    this.musicTimer = null;
    this.noteIndex = 0;
    this.notes = [392, 523, 587, 659, 523, 440];
  }

  unlock() {
    if (this.context) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.context = new AudioContext();
    this.refreshMusic();
  }

  refreshMusic() {
    clearInterval(this.musicTimer);
    this.musicTimer = null;
    if (!this.context || progress.settings.musicVolume <= 0 || progress.settings.reducedMotion) return;
    this.musicTimer = setInterval(() => {
      if (!game || game.paused || game.status !== "playing") return;
      this.playTone(this.notes[this.noteIndex % this.notes.length], 0.08, "triangle", progress.settings.musicVolume * 0.08);
      this.noteIndex += 1;
    }, 720);
  }

  play(name) {
    if (!this.context || progress.settings.sfxVolume <= 0) return;
    const presets = {
      build: [660, 0.08, "triangle", 0.18],
      upgrade: [880, 0.12, "sine", 0.2],
      sell: [330, 0.08, "square", 0.12],
      zap: [760, 0.05, "square", 0.12],
      bubble: [420, 0.08, "sine", 0.12],
      star: [620, 0.07, "triangle", 0.15],
      laser: [980, 0.035, "sawtooth", 0.09],
      pop: [520, 0.07, "triangle", 0.16],
      leak: [180, 0.12, "sine", 0.18],
      wave: [520, 0.12, "triangle", 0.2],
      victory: [740, 0.16, "triangle", 0.22],
      defeat: [260, 0.16, "sine", 0.17],
    };
    const preset = presets[name];
    if (!preset) return;
    this.playTone(preset[0], preset[1], preset[2], preset[3] * progress.settings.sfxVolume);
  }

  playTone(frequency, duration, type, volume) {
    if (!this.context) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + duration);
  }
}

audio = new AudioEngine();

class Game {
  constructor(level) {
    this.level = level;
    this.width = 960;
    this.height = 640;
    this.margin = 38;
    this.maxShields = level.shields;
    this.shields = level.shields;
    this.energy = level.startEnergy;
    this.score = 0;
    this.currentWaveIndex = 0;
    this.waveRunning = false;
    this.activeWave = null;
    this.waveStartShields = this.shields;
    this.fastTimeThisWave = 0;
    this.spawnCursor = 0;
    this.status = "playing";
    this.paused = false;
    this.fastForward = false;
    this.time = 0;
    this.shake = 0;
    this.pathCache = [];
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.beams = [];
    this.selectedTowerId = null;
    this.lastEnemyId = 1;
    this.lastTowerId = 1;
    this.resize(this.width, this.height);
  }

  resize(width, height) {
    const oldLengths = this.pathCache.map((cache) => cache.length);
    this.width = width;
    this.height = height;
    this.margin = clamp(Math.min(width, height) * 0.06, 24, 46);
    this.pathCache = this.level.paths.map((path) => this.precomputePath(path));
    this.enemies.forEach((enemy) => {
      const oldLength = oldLengths[enemy.pathIndex] || this.pathCache[enemy.pathIndex].length;
      const ratio = oldLength > 0 ? enemy.distance / oldLength : 0;
      enemy.distance = ratio * this.pathCache[enemy.pathIndex].length;
      const point = this.pointOnPath(enemy.pathIndex, enemy.distance);
      enemy.x = point.x;
      enemy.y = point.y;
    });
  }

  toScreen(point) {
    return {
      x: this.margin + point.x * (this.width - this.margin * 2),
      y: this.margin + point.y * (this.height - this.margin * 2),
    };
  }

  precomputePath(path) {
    const points = path.map((point) => this.toScreen(point));
    const segments = [];
    let length = 0;
    for (let index = 0; index < points.length - 1; index += 1) {
      const start = points[index];
      const end = points[index + 1];
      const segmentLength = distance(start, end);
      segments.push({ start, end, length: segmentLength, offset: length });
      length += segmentLength;
    }
    return { points, segments, length };
  }

  pointOnPath(pathIndex, distanceAlongPath) {
    const cache = this.pathCache[pathIndex];
    if (!cache || cache.segments.length === 0) return { x: 0, y: 0 };
    const clampedDistance = clamp(distanceAlongPath, 0, cache.length);
    const segment = cache.segments.find((entry) => clampedDistance <= entry.offset + entry.length) || cache.segments[cache.segments.length - 1];
    const t = segment.length > 0 ? (clampedDistance - segment.offset) / segment.length : 0;
    return {
      x: lerp(segment.start.x, segment.end.x, t),
      y: lerp(segment.start.y, segment.end.y, t),
    };
  }

  startWave() {
    if (this.status !== "playing" || this.waveRunning || this.currentWaveIndex >= this.level.waves.length) return;
    this.waveRunning = true;
    this.waveStartShields = this.shields;
    this.fastTimeThisWave = 0;
    this.activeWave = {
      entries: this.level.waves[this.currentWaveIndex],
      entryIndex: 0,
      spawnedInEntry: 0,
      timer: 0,
    };
    banner(`Wave ${this.currentWaveIndex + 1} rolling in.`);
    audio.play("wave");
    updateHud();
  }

  update(rawDt) {
    if (this.status !== "playing" || this.paused) return;
    const speed = this.fastForward ? 2 : 1;
    const dt = rawDt * speed;
    this.time += dt;
    if (this.shake > 0) this.shake = Math.max(0, this.shake - rawDt * 18);
    if (this.fastForward && this.waveRunning) this.fastTimeThisWave += rawDt;

    this.updateWave(dt);
    this.updateEnemies(dt);
    this.updateTowers(dt);
    this.updateProjectiles(dt);
    this.updateBeams(dt);
    this.updateParticles(dt);
    this.enemies = this.enemies.filter((enemy) => enemy.alive && !enemy.reached);
    this.projectiles = this.projectiles.filter((projectile) => projectile.active);
    this.beams = this.beams.filter((beam) => beam.life > 0);
    this.particles = this.particles.filter((particle) => particle.life > 0);

    if (this.waveRunning && !this.activeWave && this.enemies.length === 0) {
      this.completeWave();
    }
  }

  updateWave(dt) {
    if (!this.activeWave) return;
    const waveState = this.activeWave;
    waveState.timer -= dt;
    let guard = 0;
    while (waveState.timer <= 0 && guard < 8) {
      guard += 1;
      const entry = waveState.entries[waveState.entryIndex];
      if (!entry) {
        this.activeWave = null;
        return;
      }
      this.spawnEnemy(entry);
      waveState.spawnedInEntry += 1;
      if (waveState.spawnedInEntry >= entry.count) {
        waveState.entryIndex += 1;
        waveState.spawnedInEntry = 0;
        waveState.timer += 0.55;
      } else {
        waveState.timer += entry.spacing;
      }
    }
  }

  spawnEnemy(entry) {
    const pathIndex = entry.pathIndex !== null
      ? entry.pathIndex
      : this.spawnCursor % this.pathCache.length;
    this.spawnCursor += 1;
    this.addEnemy(entry.type, pathIndex, 0, entry.boss);
  }

  addEnemy(type, pathIndex, distanceAlongPath = 0, boss = false, overrides = {}) {
    const stats = ENEMY_TYPES[type];
    if (!stats) return null;
    const bossMultiplier = boss ? 2.8 : 1;
    const point = this.pointOnPath(pathIndex, distanceAlongPath);
    const enemy = {
      id: this.lastEnemyId,
      type,
      name: boss ? `Mini-Boss ${stats.name}` : stats.name,
      x: point.x,
      y: point.y,
      distance: distanceAlongPath,
      pathIndex,
      hp: stats.hp * bossMultiplier,
      maxHp: stats.hp * bossMultiplier,
      speed: stats.speed * (boss ? 0.82 : 1),
      energy: stats.energy * (boss ? 3.2 : 1),
      score: stats.score * (boss ? 4.2 : 1),
      size: stats.size * (boss ? 1.42 : 1),
      color: stats.color,
      detail: stats.detail,
      shielded: Boolean(stats.shielded),
      hover: Boolean(stats.hover),
      shieldDamage: stats.shieldDamage + (boss ? 1 : 0),
      slowResist: stats.slowResist || 1,
      splashResist: stats.splashResist || 1,
      beamResist: stats.beamResist || 1,
      splitType: stats.splitType || null,
      splitCount: stats.splitCount || 0,
      healer: Boolean(stats.healer),
      healRadius: stats.healRadius || 0,
      healAmount: stats.healAmount || 0,
      repairTimer: 0.65 + Math.random() * 0.4,
      blinkDistance: stats.blinkDistance || 0,
      blinkInterval: stats.blinkInterval || 0,
      blinkTimer: stats.blinkInterval ? 1.0 + Math.random() * 1.2 : 0,
      shieldPhase: Math.random() * Math.PI * 2,
      slowTimer: 0,
      slowFactor: 1,
      hitFlash: 0,
      alive: true,
      reached: false,
      boss,
      bob: Math.random() * Math.PI * 2,
      ...overrides,
    };
    this.enemies.push(enemy);
    this.lastEnemyId += 1;
    return enemy;
  }

  updateEnemies(dt) {
    this.enemies.forEach((enemy) => {
      enemy.shieldPhase += dt * 2.2;
      enemy.bob += dt * 4;
      enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
      if (enemy.slowTimer > 0) {
        enemy.slowTimer -= dt;
      } else {
        enemy.slowFactor = 1;
      }
      if (enemy.healer) this.updateRepairBot(enemy, dt);
      if (enemy.blinkDistance > 0) this.updateBlinkBot(enemy, dt);
      enemy.distance += enemy.speed * enemy.slowFactor * dt;
      const cache = this.pathCache[enemy.pathIndex];
      if (enemy.distance >= cache.length) {
        this.robotReachedBase(enemy);
      } else {
        const point = this.pointOnPath(enemy.pathIndex, enemy.distance);
        enemy.x = point.x;
        enemy.y = point.y + (enemy.hover ? Math.sin(enemy.bob) * 4 : 0);
      }
    });
  }

  updateRepairBot(enemy, dt) {
    enemy.repairTimer -= dt;
    if (enemy.repairTimer > 0) return;
    enemy.repairTimer = 1.25;
    let healed = 0;
    this.enemies.forEach((ally) => {
      if (!ally.alive || ally.id === enemy.id || ally.hp >= ally.maxHp) return;
      if (Math.hypot(ally.x - enemy.x, ally.y - enemy.y) > enemy.healRadius) return;
      ally.hp = Math.min(ally.maxHp, ally.hp + enemy.healAmount);
      ally.hitFlash = 0.06;
      healed += 1;
    });
    if (healed > 0) this.spawnParticles(enemy.x, enemy.y, 8, "bubble", enemy.detail);
  }

  updateBlinkBot(enemy, dt) {
    enemy.blinkTimer -= dt;
    if (enemy.blinkTimer > 0) return;
    enemy.blinkTimer = enemy.blinkInterval;
    enemy.distance += enemy.blinkDistance;
    this.spawnParticles(enemy.x, enemy.y, 10, "star", enemy.detail);
  }

  updateTowers(dt) {
    this.towers.forEach((tower) => {
      tower.cooldown = Math.max(0, tower.cooldown - dt);
      if (tower.cooldown > 0) return;
      const target = this.findTarget(tower);
      if (!target) return;
      this.fireTower(tower, target);
      const stats = this.towerStats(tower);
      tower.cooldown = stats.cooldown;
    });
  }

  updateProjectiles(dt) {
    this.projectiles.forEach((projectile) => {
      const target = this.enemies.find((enemy) => enemy.id === projectile.targetId && enemy.alive);
      if (!target) {
        projectile.active = false;
        return;
      }
      const dx = target.x - projectile.x;
      const dy = target.y - projectile.y;
      const dist = Math.hypot(dx, dy);
      const step = projectile.speed * dt;
      if (dist <= step || dist < 6) {
        projectile.x = target.x;
        projectile.y = target.y;
        this.impactProjectile(projectile, target);
        projectile.active = false;
      } else {
        projectile.x += (dx / dist) * step;
        projectile.y += (dy / dist) * step;
        projectile.spin += dt * 8;
      }
    });
  }

  updateBeams(dt) {
    this.beams.forEach((beam) => {
      beam.life -= dt;
    });
  }

  updateParticles(dt) {
    this.particles.forEach((particle) => {
      particle.life -= dt;
      if (progress.settings.reducedMotion) return;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += particle.gravity * dt;
      particle.spin += particle.turn * dt;
    });
  }

  fireTower(tower, target) {
    const stats = this.towerStats(tower);
    const origin = this.toScreen(this.level.buildPads[tower.padIndex]);
    tower.angle = Math.atan2(target.y - origin.y, target.x - origin.x);
    if (stats.beam) {
      this.applyDamage(target, stats.damage, "beam");
      this.beams.push({
        x1: origin.x,
        y1: origin.y,
        x2: target.x,
        y2: target.y,
        color: TOWER_TYPES[tower.type].detail,
        life: 0.12,
        maxLife: 0.12,
      });
      this.spawnParticles(target.x, target.y, 4, "spark", TOWER_TYPES[tower.type].detail);
      audio.play("laser");
      return;
    }

    this.projectiles.push({
      active: true,
      x: origin.x,
      y: origin.y,
      targetId: target.id,
      type: tower.type,
      effect: progress.selectedEffect,
      damage: stats.damage,
      speed: stats.projectileSpeed,
      splash: stats.splash || 0,
      slow: stats.slow || 0,
      slowDuration: stats.slowDuration || 0,
      color: projectileColor(tower.type),
      spin: 0,
      radius: tower.type === "star" ? 8 : 6,
    });
    audio.play(tower.type === "star" ? "star" : tower.type === "bubble" ? "bubble" : "zap");
  }

  impactProjectile(projectile, target) {
    if (projectile.splash > 0) {
      this.enemies.forEach((enemy) => {
        if (!enemy.alive) return;
        const dist = Math.hypot(enemy.x - projectile.x, enemy.y - projectile.y);
        if (dist <= projectile.splash) {
          const falloff = clamp(1 - dist / projectile.splash * 0.45, 0.45, 1);
          this.applyDamage(enemy, projectile.damage * falloff, "splash");
        }
      });
      this.spawnParticles(projectile.x, projectile.y, 18, "star", projectile.color);
      if (!progress.settings.reducedMotion && progress.settings.screenShake) this.shake = Math.max(this.shake, 3);
      return;
    }

    this.applyDamage(target, projectile.damage, "projectile");
    if (projectile.slow) {
      const baseSlow = target.hover ? Math.max(projectile.slow, 0.84) : projectile.slow;
      const slowFactor = 1 - (1 - baseSlow) * target.slowResist;
      target.slowFactor = Math.min(target.slowFactor, slowFactor);
      target.slowTimer = Math.max(target.slowTimer, projectile.slowDuration);
    }
    this.spawnParticles(projectile.x, projectile.y, projectile.type === "bubble" ? 8 : 6, projectile.type === "bubble" ? "bubble" : "spark", projectile.color);
  }

  applyDamage(enemy, damage, source = "projectile") {
    if (!enemy.alive) return;
    const shieldActive = enemy.shielded && Math.sin(enemy.shieldPhase) > 0.2;
    let adjusted = shieldActive ? damage * 0.55 : damage;
    if (source === "splash") adjusted *= enemy.splashResist;
    if (source === "beam") adjusted *= enemy.beamResist;
    enemy.hp -= adjusted;
    enemy.hitFlash = 0.1;
    if (enemy.hp <= 0) this.defeatEnemy(enemy);
  }

  defeatEnemy(enemy) {
    if (!enemy.alive) return;
    enemy.alive = false;
    this.energy += Math.round(enemy.energy);
    this.score += Math.round(enemy.score);
    this.spawnParticles(enemy.x, enemy.y, enemy.boss ? 34 : 20, "confetti", enemy.detail);
    if (enemy.splitType) this.spawnSplitChildren(enemy);
    if (!progress.settings.reducedMotion && progress.settings.screenShake) this.shake = Math.max(this.shake, enemy.boss ? 5 : 2);
    audio.play("pop");
    updateHud();
  }

  spawnSplitChildren(enemy) {
    const childCount = enemy.boss ? enemy.splitCount + 3 : enemy.splitCount;
    for (let index = 0; index < childCount; index += 1) {
      const offset = (index - (childCount - 1) / 2) * 10;
      const childDistance = clamp(enemy.distance + offset, 0, this.pathCache[enemy.pathIndex].length - 2);
      const child = this.addEnemy(enemy.splitType, enemy.pathIndex, childDistance, false, {
        hp: ENEMY_TYPES[enemy.splitType].hp * 0.75,
        maxHp: ENEMY_TYPES[enemy.splitType].hp * 0.75,
        energy: Math.max(2, Math.floor(ENEMY_TYPES[enemy.splitType].energy * 0.45)),
        score: Math.max(10, Math.floor(ENEMY_TYPES[enemy.splitType].score * 0.45)),
        size: ENEMY_TYPES[enemy.splitType].size * 0.86,
      });
      if (child) {
        child.x += (Math.random() - 0.5) * 12;
        child.y += (Math.random() - 0.5) * 12;
      }
    }
  }

  robotReachedBase(enemy) {
    if (enemy.reached || !enemy.alive) return;
    enemy.reached = true;
    enemy.alive = false;
    this.shields -= enemy.shieldDamage;
    this.spawnParticles(enemy.x, enemy.y, 14, "bubble", this.level.palette.base);
    if (!progress.settings.reducedMotion && progress.settings.screenShake) this.shake = Math.max(this.shake, 5);
    audio.play("leak");
    updateHud();
    if (this.shields <= 0) this.endDefeat();
  }

  completeWave() {
    const waveNumber = this.currentWaveIndex + 1;
    const noLeak = this.shields === this.waveStartShields;
    this.waveRunning = false;
    this.activeWave = null;
    this.score += waveNumber * 100;
    this.energy += 16 + waveNumber * 2;
    if (noLeak) {
      this.score += 80;
      this.energy += 6;
    }
    const fastBonus = Math.floor(this.fastTimeThisWave * 5);
    this.score += fastBonus;
    this.currentWaveIndex += 1;
    if (this.currentWaveIndex >= this.level.waves.length) {
      this.endVictory();
    } else {
      banner(noLeak ? "Wave cleared with perfect shields." : "Wave cleared.");
      updateHud();
    }
  }

  endVictory() {
    this.status = "victory";
    this.fastForward = false;
    const shieldRatio = this.shields / this.maxShields;
    const stars = 1 + (shieldRatio >= 0.5 ? 1 : 0) + (shieldRatio >= 0.8 ? 1 : 0);
    const shieldBonus = this.shields * 60;
    this.score += shieldBonus + stars * 200;

    const record = progress.levels[this.level.id] || { bestScore: 0, bestStars: 0 };
    progress.levels[this.level.id] = {
      bestScore: Math.max(record.bestScore || 0, Math.floor(this.score)),
      bestStars: Math.max(record.bestStars || 0, stars),
    };
    const levelIndex = LEVELS.findIndex((entry) => entry.id === this.level.id);
    const nextLevel = LEVELS[levelIndex + 1];
    progress.lastCompletedLevelId = this.level.id;
    progress.resumeLevelId = nextLevel ? nextLevel.id : this.level.id;
    saveProgress();
    updateResumeButton();
    ui.victorySummary.innerHTML = `
      <div><strong>${stars} stars</strong> earned for ${this.level.name}.</div>
      <div>Score: ${Math.floor(this.score)}</div>
      <div>Shields remaining: ${Math.max(0, this.shields)}/${this.maxShields}</div>
      <div>Resume point: ${nextLevel ? nextLevel.name : this.level.name}</div>
      <div>Total stars: ${totalEarnedStars()}</div>
    `;
    ui.nextLevelButton.disabled = levelIndex >= LEVELS.length - 1;
    ui.nextLevelButton.textContent = levelIndex >= LEVELS.length - 1 ? "All Levels Clear" : "Next Level";
    showModal("victory");
    audio.play("victory");
    updateHud();
  }

  endDefeat() {
    this.status = "defeat";
    this.fastForward = false;
    this.shields = 0;
    ui.defeatSummary.innerHTML = `
      <div>Score: ${Math.floor(this.score)}</div>
      <div>Reached wave ${Math.min(this.currentWaveIndex + 1, this.level.waves.length)} of ${this.level.waves.length}.</div>
      <div>Try mixing Bubble Cannons with Star Blasters near tight turns.</div>
    `;
    showModal("defeat");
    audio.play("defeat");
    updateHud();
  }

  findTarget(tower) {
    const origin = this.toScreen(this.level.buildPads[tower.padIndex]);
    const stats = this.towerStats(tower);
    let best = null;
    let bestProgress = -1;
    this.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      const dist = Math.hypot(enemy.x - origin.x, enemy.y - origin.y);
      if (dist > stats.range) return;
      const pathLength = this.pathCache[enemy.pathIndex].length || 1;
      const progressValue = enemy.distance / pathLength;
      if (progressValue > bestProgress) {
        best = enemy;
        bestProgress = progressValue;
      }
    });
    return best;
  }

  towerStats(tower) {
    const type = TOWER_TYPES[tower.type];
    const levelBoost = tower.level - 1;
    return {
      ...type,
      range: type.range + levelBoost * 18,
      damage: type.damage * (1 + levelBoost * 0.42),
      cooldown: type.cooldown * Math.pow(0.86, levelBoost),
      splash: type.splash ? type.splash + levelBoost * 13 : 0,
      slow: type.slow ? Math.max(0.3, type.slow - levelBoost * 0.08) : 0,
      slowDuration: type.slowDuration ? type.slowDuration + levelBoost * 0.35 : 0,
      projectileSpeed: type.projectileSpeed || 0,
      beam: Boolean(type.beam),
    };
  }

  upgradeCost(tower) {
    if (tower.level >= MAX_TOWER_LEVEL) return null;
    const type = TOWER_TYPES[tower.type];
    return type.upgrades[tower.level - 1];
  }

  sellRefund(tower) {
    return Math.floor(tower.spent * 0.55);
  }

  buildTower(typeId, padIndex) {
    const type = TOWER_TYPES[typeId];
    if (!type || this.energy < type.cost) {
      showToast("Not enough energy.");
      return false;
    }
    if (this.towers.some((tower) => tower.padIndex === padIndex)) {
      showToast("That pad already has a tower.");
      return false;
    }
    this.energy -= type.cost;
    const tower = {
      id: this.lastTowerId,
      type: typeId,
      padIndex,
      level: 1,
      cooldown: 0.15,
      spent: type.cost,
      angle: -Math.PI / 2,
    };
    this.lastTowerId += 1;
    this.towers.push(tower);
    this.selectedTowerId = tower.id;
    selectedBuildType = null;
    audio.play("build");
    this.spawnParticles(this.toScreen(this.level.buildPads[padIndex]).x, this.toScreen(this.level.buildPads[padIndex]).y, 12, "star", type.color);
    updateHud();
    return true;
  }

  upgradeSelectedTower() {
    const tower = this.getSelectedTower();
    if (!tower) return;
    const cost = this.upgradeCost(tower);
    if (cost === null) {
      showToast("This tower is already max level.");
      return;
    }
    if (this.energy < cost) {
      showToast(`Need ${cost} energy to upgrade.`);
      return;
    }
    this.energy -= cost;
    tower.level += 1;
    tower.spent += cost;
    tower.cooldown = 0;
    const point = this.toScreen(this.level.buildPads[tower.padIndex]);
    this.spawnParticles(point.x, point.y, 20, "star", TOWER_TYPES[tower.type].detail);
    audio.play("upgrade");
    updateHud();
  }

  sellSelectedTower() {
    const tower = this.getSelectedTower();
    if (!tower) return;
    const refund = this.sellRefund(tower);
    this.energy += refund;
    const point = this.toScreen(this.level.buildPads[tower.padIndex]);
    this.spawnParticles(point.x, point.y, 12, "bubble", TOWER_TYPES[tower.type].color);
    this.towers = this.towers.filter((entry) => entry.id !== tower.id);
    this.selectedTowerId = null;
    audio.play("sell");
    updateHud();
  }

  getSelectedTower() {
    return this.towers.find((tower) => tower.id === this.selectedTowerId) || null;
  }

  towerAt(x, y) {
    return this.towers.find((tower) => {
      const point = this.toScreen(this.level.buildPads[tower.padIndex]);
      return Math.hypot(point.x - x, point.y - y) <= 30;
    }) || null;
  }

  padAt(x, y) {
    let closest = null;
    let closestDistance = Infinity;
    this.level.buildPads.forEach((pad, index) => {
      const point = this.toScreen(pad);
      const dist = Math.hypot(point.x - x, point.y - y);
      if (dist < closestDistance) {
        closestDistance = dist;
        closest = { index, point };
      }
    });
    return closestDistance <= 34 ? closest : null;
  }

  isPadOccupied(index) {
    return this.towers.some((tower) => tower.padIndex === index);
  }

  nextWaveDescription() {
    if (this.currentWaveIndex >= this.level.waves.length) return "All waves launched.";
    const entries = this.level.waves[this.currentWaveIndex];
    const counts = new Map();
    entries.forEach((entry) => {
      const name = entry.boss ? `Mini-Boss ${ENEMY_TYPES[entry.type].name}` : ENEMY_TYPES[entry.type].name;
      counts.set(name, (counts.get(name) || 0) + entry.count);
    });
    return Array.from(counts.entries())
      .map(([name, count]) => `${count} ${name}`)
      .join(", ");
  }

  spawnParticles(x, y, count, kind, color) {
    const budget = Math.max(0, MAX_PARTICLES - this.particles.length);
    const total = Math.min(count, budget);
    for (let index = 0; index < total; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = kind === "bubble" ? 20 + Math.random() * 38 : 48 + Math.random() * 100;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (kind === "confetti" ? 30 : 0),
        gravity: kind === "confetti" ? 120 : 0,
        life: 0.45 + Math.random() * 0.55,
        maxLife: 1,
        kind,
        color,
        size: 3 + Math.random() * 5,
        spin: Math.random() * Math.PI,
        turn: -5 + Math.random() * 10,
      });
    }
  }

  render(renderCtx) {
    renderCtx.clearRect(0, 0, this.width, this.height);
    renderCtx.save();
    if (this.shake > 0 && progress.settings.screenShake && !progress.settings.reducedMotion) {
      renderCtx.translate((Math.random() - 0.5) * this.shake, (Math.random() - 0.5) * this.shake);
    }
    this.renderMap(renderCtx);
    if (progress.settings.showRanges) this.renderRanges(renderCtx);
    this.renderPads(renderCtx);
    this.renderProjectiles(renderCtx);
    this.renderTowers(renderCtx);
    this.renderEnemies(renderCtx);
    this.renderBeams(renderCtx);
    this.renderParticles(renderCtx);
    this.renderPointerHint(renderCtx);
    renderCtx.restore();
  }

  renderMap(renderCtx) {
    const gradient = renderCtx.createLinearGradient(0, 0, this.width, this.height);
    gradient.addColorStop(0, this.level.palette.ground);
    gradient.addColorStop(1, this.level.palette.groundAlt);
    renderCtx.fillStyle = gradient;
    renderCtx.fillRect(0, 0, this.width, this.height);

    renderCtx.save();
    renderCtx.globalAlpha = 0.25;
    renderCtx.strokeStyle = "#ffffff";
    renderCtx.lineWidth = 2;
    const spacing = 64;
    for (let x = -spacing; x < this.width + spacing; x += spacing) {
      renderCtx.beginPath();
      renderCtx.moveTo(x, 0);
      renderCtx.lineTo(x + this.height * 0.3, this.height);
      renderCtx.stroke();
    }
    renderCtx.restore();

    this.pathCache.forEach((cache) => {
      renderCtx.lineJoin = "round";
      renderCtx.lineCap = "round";
      renderCtx.lineWidth = 40;
      renderCtx.strokeStyle = this.level.palette.pathEdge;
      renderCtx.beginPath();
      cache.points.forEach((point, index) => {
        if (index === 0) renderCtx.moveTo(point.x, point.y);
        else renderCtx.lineTo(point.x, point.y);
      });
      renderCtx.stroke();

      renderCtx.lineWidth = 28;
      renderCtx.strokeStyle = this.level.palette.path;
      renderCtx.stroke();

      renderCtx.setLineDash([8, 18]);
      renderCtx.lineWidth = 3;
      renderCtx.strokeStyle = "rgba(31, 36, 64, 0.18)";
      renderCtx.stroke();
      renderCtx.setLineDash([]);
    });

    this.pathCache.forEach((cache) => {
      const start = cache.points[0];
      const end = cache.points[cache.points.length - 1];
      drawStartMarker(renderCtx, start.x, start.y, this.time);
      this.drawStarbase(renderCtx, end.x, end.y);
    });
  }

  drawStarbase(renderCtx, x, y) {
    const shieldRatio = Math.max(0, this.shields / this.maxShields);
    renderCtx.save();
    renderCtx.translate(x, y);
    renderCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
    renderCtx.beginPath();
    renderCtx.arc(0, 0, 42, 0, Math.PI * 2);
    renderCtx.fill();
    renderCtx.strokeStyle = this.level.palette.base;
    renderCtx.lineWidth = 4;
    renderCtx.globalAlpha = 0.45 + shieldRatio * 0.45;
    renderCtx.beginPath();
    renderCtx.arc(0, 0, 48, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * shieldRatio);
    renderCtx.stroke();
    renderCtx.globalAlpha = 1;
    renderCtx.fillStyle = "#ffffff";
    roundedRect(renderCtx, -24, -22, 48, 44, 8);
    renderCtx.fill();
    renderCtx.fillStyle = this.level.palette.base;
    roundedRect(renderCtx, -12, -32, 24, 20, 6);
    renderCtx.fill();
    renderCtx.fillStyle = "#ffc857";
    renderCtx.beginPath();
    renderCtx.arc(0, 0, 10, 0, Math.PI * 2);
    renderCtx.fill();
    renderCtx.fillStyle = "#1f2440";
    renderCtx.fillRect(-5, 17, 10, 8);
    renderCtx.restore();
  }

  renderPads(renderCtx) {
    this.level.buildPads.forEach((pad, index) => {
      const point = this.toScreen(pad);
      const occupied = this.isPadOccupied(index);
      renderCtx.save();
      renderCtx.translate(point.x, point.y);
      renderCtx.lineWidth = 3;
      renderCtx.fillStyle = occupied ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.82)";
      renderCtx.strokeStyle = occupied ? "rgba(31, 36, 64, 0.24)" : this.level.palette.accent;
      renderCtx.beginPath();
      renderCtx.arc(0, 0, 22, 0, Math.PI * 2);
      renderCtx.fill();
      renderCtx.stroke();
      if (!occupied && selectedBuildType) {
        renderCtx.globalAlpha = 0.28 + Math.sin(this.time * 5) * 0.08;
        renderCtx.fillStyle = TOWER_TYPES[selectedBuildType].color;
        renderCtx.beginPath();
        renderCtx.arc(0, 0, 30, 0, Math.PI * 2);
        renderCtx.fill();
      }
      renderCtx.restore();
    });
  }

  renderRanges(renderCtx) {
    const selectedTower = this.getSelectedTower();
    if (selectedTower) {
      const stats = this.towerStats(selectedTower);
      const point = this.toScreen(this.level.buildPads[selectedTower.padIndex]);
      drawRange(renderCtx, point.x, point.y, stats.range, TOWER_TYPES[selectedTower.type].color);
      return;
    }
    if (selectedBuildType && pointer.inside) {
      const pad = this.padAt(pointer.x, pointer.y);
      if (pad && !this.isPadOccupied(pad.index)) {
        drawRange(renderCtx, pad.point.x, pad.point.y, TOWER_TYPES[selectedBuildType].range, TOWER_TYPES[selectedBuildType].color);
      }
    }
  }

  renderTowers(renderCtx) {
    const skin = selectedSkin();
    this.towers.forEach((tower) => {
      const point = this.toScreen(this.level.buildPads[tower.padIndex]);
      const selected = tower.id === this.selectedTowerId;
      renderCtx.save();
      renderCtx.translate(point.x, point.y);
      renderCtx.rotate(tower.angle || 0);
      drawTower(renderCtx, tower, skin, selected);
      renderCtx.restore();
      if (tower.level > 1) {
        renderCtx.save();
        renderCtx.fillStyle = "#1f2440";
        renderCtx.font = "800 12px system-ui, sans-serif";
        renderCtx.textAlign = "center";
        renderCtx.fillText(`L${tower.level}`, point.x, point.y + 35);
        renderCtx.restore();
      }
    });
  }

  renderEnemies(renderCtx) {
    this.enemies.forEach((enemy) => {
      if (enemy.healer) {
        renderCtx.save();
        renderCtx.globalAlpha = 0.08 + Math.sin(enemy.bob * 1.6) * 0.025;
        renderCtx.fillStyle = enemy.detail;
        renderCtx.beginPath();
        renderCtx.arc(enemy.x, enemy.y, enemy.healRadius, 0, Math.PI * 2);
        renderCtx.fill();
        renderCtx.restore();
      }
      renderCtx.save();
      renderCtx.translate(enemy.x, enemy.y);
      drawEnemy(renderCtx, enemy);
      renderCtx.restore();
    });
  }

  renderProjectiles(renderCtx) {
    this.projectiles.forEach((projectile) => {
      renderCtx.save();
      renderCtx.translate(projectile.x, projectile.y);
      renderCtx.rotate(projectile.spin);
      drawProjectile(renderCtx, projectile);
      renderCtx.restore();
    });
  }

  renderBeams(renderCtx) {
    this.beams.forEach((beam) => {
      const alpha = clamp(beam.life / beam.maxLife, 0, 1);
      renderCtx.save();
      renderCtx.globalAlpha = alpha;
      renderCtx.strokeStyle = "#ffffff";
      renderCtx.lineWidth = 7;
      renderCtx.lineCap = "round";
      renderCtx.beginPath();
      renderCtx.moveTo(beam.x1, beam.y1);
      renderCtx.lineTo(beam.x2, beam.y2);
      renderCtx.stroke();
      renderCtx.strokeStyle = beam.color;
      renderCtx.lineWidth = 3;
      renderCtx.stroke();
      renderCtx.restore();
    });
  }

  renderParticles(renderCtx) {
    this.particles.forEach((particle) => {
      const alpha = clamp(particle.life / 0.7, 0, 1);
      renderCtx.save();
      renderCtx.globalAlpha = alpha;
      renderCtx.translate(particle.x, particle.y);
      renderCtx.rotate(particle.spin);
      renderCtx.fillStyle = particle.color;
      if (particle.kind === "bubble") {
        renderCtx.globalAlpha = alpha * 0.62;
        renderCtx.strokeStyle = particle.color;
        renderCtx.lineWidth = 2;
        renderCtx.beginPath();
        renderCtx.arc(0, 0, particle.size, 0, Math.PI * 2);
        renderCtx.stroke();
      } else if (particle.kind === "star") {
        drawStar(renderCtx, 0, 0, particle.size, particle.size * 0.45, 5);
        renderCtx.fill();
      } else {
        roundedRect(renderCtx, -particle.size / 2, -particle.size / 2, particle.size, particle.size, 2);
        renderCtx.fill();
      }
      renderCtx.restore();
    });
  }

  renderPointerHint(renderCtx) {
    if (!selectedBuildType || !pointer.inside) return;
    const pad = this.padAt(pointer.x, pointer.y);
    if (!pad || this.isPadOccupied(pad.index)) return;
    renderCtx.save();
    renderCtx.globalAlpha = 0.64;
    renderCtx.strokeStyle = "#ffffff";
    renderCtx.lineWidth = 3;
    renderCtx.beginPath();
    renderCtx.arc(pad.point.x, pad.point.y, 34, 0, Math.PI * 2);
    renderCtx.stroke();
    renderCtx.restore();
  }
}

function selectedSkin() {
  return SKINS.find((skin) => skin.id === progress.selectedSkin) || SKINS[0];
}

function selectedEffect() {
  return EFFECTS.find((effect) => effect.id === progress.selectedEffect) || EFFECTS[0];
}

function projectileColor(towerType) {
  if (progress.selectedEffect !== "stars") return selectedEffect().color;
  return TOWER_TYPES[towerType].detail || TOWER_TYPES[towerType].color;
}

function drawRange(renderCtx, x, y, radius, color) {
  renderCtx.save();
  renderCtx.globalAlpha = 0.15;
  renderCtx.fillStyle = color;
  renderCtx.beginPath();
  renderCtx.arc(x, y, radius, 0, Math.PI * 2);
  renderCtx.fill();
  renderCtx.globalAlpha = 0.45;
  renderCtx.strokeStyle = color;
  renderCtx.lineWidth = 2;
  renderCtx.setLineDash([7, 7]);
  renderCtx.stroke();
  renderCtx.restore();
}

function roundedRect(renderCtx, x, y, width, height, radius) {
  if (renderCtx.roundRect) {
    renderCtx.beginPath();
    renderCtx.roundRect(x, y, width, height, radius);
    return;
  }
  const r = Math.min(radius, width / 2, height / 2);
  renderCtx.beginPath();
  renderCtx.moveTo(x + r, y);
  renderCtx.arcTo(x + width, y, x + width, y + height, r);
  renderCtx.arcTo(x + width, y + height, x, y + height, r);
  renderCtx.arcTo(x, y + height, x, y, r);
  renderCtx.arcTo(x, y, x + width, y, r);
}

function drawStartMarker(renderCtx, x, y, time) {
  renderCtx.save();
  renderCtx.translate(x, y);
  renderCtx.fillStyle = "#ffffff";
  renderCtx.strokeStyle = "#1f2440";
  renderCtx.lineWidth = 3;
  roundedRect(renderCtx, -26, -18, 52, 36, 8);
  renderCtx.fill();
  renderCtx.stroke();
  renderCtx.fillStyle = "#ff6f61";
  renderCtx.beginPath();
  renderCtx.arc(Math.sin(time * 3) * 4, 0, 8, 0, Math.PI * 2);
  renderCtx.fill();
  renderCtx.restore();
}

function drawTower(renderCtx, tower, skin, selected) {
  const type = TOWER_TYPES[tower.type];
  const primary = skin.colors[0] || type.color;
  const secondary = skin.colors[1] || type.detail;
  const tertiary = skin.colors[2] || "#ffffff";
  renderCtx.save();
  renderCtx.lineWidth = selected ? 4 : 3;
  renderCtx.strokeStyle = selected ? "#1f2440" : "#ffffff";
  renderCtx.fillStyle = primary;
  renderCtx.beginPath();
  renderCtx.arc(0, 0, 20, 0, Math.PI * 2);
  renderCtx.fill();
  renderCtx.stroke();

  if (tower.type === "zap") {
    renderCtx.fillStyle = secondary;
    roundedRect(renderCtx, 5, -8, 22, 16, 6);
    renderCtx.fill();
    renderCtx.stroke();
    renderCtx.strokeStyle = tertiary;
    renderCtx.lineWidth = 3;
    renderCtx.beginPath();
    renderCtx.moveTo(-3, -18);
    renderCtx.lineTo(3, -28);
    renderCtx.lineTo(9, -18);
    renderCtx.stroke();
  } else if (tower.type === "bubble") {
    renderCtx.fillStyle = "#ffffff";
    renderCtx.globalAlpha = 0.78;
    renderCtx.beginPath();
    renderCtx.arc(8, 0, 14, 0, Math.PI * 2);
    renderCtx.fill();
    renderCtx.globalAlpha = 1;
    renderCtx.stroke();
    renderCtx.fillStyle = secondary;
    renderCtx.beginPath();
    renderCtx.arc(26, 0, 7, 0, Math.PI * 2);
    renderCtx.fill();
  } else if (tower.type === "star") {
    renderCtx.fillStyle = secondary;
    drawStar(renderCtx, 10, 0, 16, 7, 5);
    renderCtx.fill();
    renderCtx.stroke();
  } else if (tower.type === "laser") {
    renderCtx.fillStyle = secondary;
    roundedRect(renderCtx, 4, -7, 28, 14, 7);
    renderCtx.fill();
    renderCtx.stroke();
    renderCtx.fillStyle = tertiary;
    renderCtx.beginPath();
    renderCtx.ellipse(-8, -17, 7, 12, -0.6, 0, Math.PI * 2);
    renderCtx.fill();
    renderCtx.beginPath();
    renderCtx.ellipse(-8, 17, 7, 12, 0.6, 0, Math.PI * 2);
    renderCtx.fill();
  }
  renderCtx.restore();
}

function drawEnemy(renderCtx, enemy) {
  const size = enemy.size;
  const shieldActive = enemy.shielded && Math.sin(enemy.shieldPhase) > 0.2;
  if (shieldActive) {
    renderCtx.save();
    renderCtx.globalAlpha = 0.32;
    renderCtx.fillStyle = "#67dff0";
    renderCtx.beginPath();
    renderCtx.arc(0, 0, size + 12, 0, Math.PI * 2);
    renderCtx.fill();
    renderCtx.restore();
  }
  renderCtx.fillStyle = enemy.hitFlash > 0 ? "#ffffff" : enemy.color;
  renderCtx.strokeStyle = "#1f2440";
  renderCtx.lineWidth = enemy.boss ? 4 : 3;
  if (enemy.type === "zoomer") {
    renderCtx.beginPath();
    renderCtx.moveTo(size + 4, 0);
    renderCtx.lineTo(-size, -size * 0.85);
    renderCtx.lineTo(-size * 0.65, 0);
    renderCtx.lineTo(-size, size * 0.85);
    renderCtx.closePath();
    renderCtx.fill();
    renderCtx.stroke();
  } else if (enemy.type === "roller") {
    renderCtx.beginPath();
    renderCtx.arc(0, 0, size + 2, 0, Math.PI * 2);
    renderCtx.fill();
    renderCtx.stroke();
    renderCtx.strokeStyle = enemy.detail;
    renderCtx.lineWidth = 4;
    renderCtx.beginPath();
    renderCtx.arc(0, 0, size * 0.62, 0, Math.PI * 2);
    renderCtx.moveTo(-size * 0.75, 0);
    renderCtx.lineTo(size * 0.75, 0);
    renderCtx.moveTo(0, -size * 0.75);
    renderCtx.lineTo(0, size * 0.75);
    renderCtx.stroke();
  } else if (enemy.type === "splitter") {
    renderCtx.beginPath();
    renderCtx.moveTo(0, -size - 3);
    renderCtx.lineTo(size + 4, -size * 0.25);
    renderCtx.lineTo(size * 0.72, size);
    renderCtx.lineTo(-size * 0.72, size);
    renderCtx.lineTo(-size - 4, -size * 0.25);
    renderCtx.closePath();
    renderCtx.fill();
    renderCtx.stroke();
    renderCtx.fillStyle = enemy.detail;
    renderCtx.beginPath();
    renderCtx.arc(-size * 0.38, size * 0.25, size * 0.24, 0, Math.PI * 2);
    renderCtx.arc(size * 0.38, size * 0.25, size * 0.24, 0, Math.PI * 2);
    renderCtx.fill();
  } else if (enemy.type === "repair") {
    roundedRect(renderCtx, -size, -size, size * 2, size * 1.8, 8);
    renderCtx.fill();
    renderCtx.stroke();
    renderCtx.strokeStyle = enemy.detail;
    renderCtx.lineWidth = 4;
    renderCtx.beginPath();
    renderCtx.moveTo(0, -size * 0.72);
    renderCtx.lineTo(0, size * 0.52);
    renderCtx.moveTo(-size * 0.62, -size * 0.1);
    renderCtx.lineTo(size * 0.62, -size * 0.1);
    renderCtx.stroke();
  } else if (enemy.type === "blink") {
    renderCtx.beginPath();
    renderCtx.moveTo(0, -size - 5);
    renderCtx.lineTo(size + 5, 0);
    renderCtx.lineTo(0, size + 5);
    renderCtx.lineTo(-size - 5, 0);
    renderCtx.closePath();
    renderCtx.fill();
    renderCtx.stroke();
    renderCtx.strokeStyle = enemy.detail;
    renderCtx.lineWidth = 3;
    renderCtx.beginPath();
    renderCtx.arc(0, 0, size * 0.56 + Math.sin(enemy.bob) * 2, 0, Math.PI * 2);
    renderCtx.stroke();
  } else if (enemy.type === "prism") {
    renderCtx.beginPath();
    renderCtx.moveTo(0, -size - 5);
    renderCtx.lineTo(size + 6, -size * 0.18);
    renderCtx.lineTo(size * 0.55, size + 5);
    renderCtx.lineTo(-size * 0.55, size + 5);
    renderCtx.lineTo(-size - 6, -size * 0.18);
    renderCtx.closePath();
    renderCtx.fill();
    renderCtx.stroke();
    renderCtx.strokeStyle = "rgba(255, 255, 255, 0.82)";
    renderCtx.lineWidth = 2;
    renderCtx.beginPath();
    renderCtx.moveTo(0, -size - 3);
    renderCtx.lineTo(0, size + 3);
    renderCtx.moveTo(-size * 0.75, -size * 0.12);
    renderCtx.lineTo(size * 0.75, -size * 0.12);
    renderCtx.stroke();
  } else if (enemy.type === "hover") {
    renderCtx.beginPath();
    renderCtx.ellipse(0, 2, size + 7, size * 0.72, 0, 0, Math.PI * 2);
    renderCtx.fill();
    renderCtx.stroke();
    renderCtx.fillStyle = enemy.detail;
    renderCtx.beginPath();
    renderCtx.arc(0, -6, size * 0.55, Math.PI, 0);
    renderCtx.fill();
    renderCtx.stroke();
  } else {
    roundedRect(renderCtx, -size, -size, size * 2, size * 1.8, enemy.type === "chunky" ? 7 : 8);
    renderCtx.fill();
    renderCtx.stroke();
    renderCtx.strokeStyle = "#1f2440";
    renderCtx.lineWidth = 3;
    renderCtx.beginPath();
    renderCtx.moveTo(-size * 0.55, size * 0.86);
    renderCtx.lineTo(-size * 0.55, size * 1.22);
    renderCtx.moveTo(size * 0.55, size * 0.86);
    renderCtx.lineTo(size * 0.55, size * 1.22);
    renderCtx.stroke();
  }
  renderCtx.fillStyle = enemy.detail;
  renderCtx.beginPath();
  renderCtx.arc(-size * 0.35, -size * 0.22, Math.max(2.5, size * 0.16), 0, Math.PI * 2);
  renderCtx.arc(size * 0.35, -size * 0.22, Math.max(2.5, size * 0.16), 0, Math.PI * 2);
  renderCtx.fill();

  const barWidth = size * 2.2;
  renderCtx.fillStyle = "rgba(31, 36, 64, 0.2)";
  roundedRect(renderCtx, -barWidth / 2, -size - 12, barWidth, 5, 3);
  renderCtx.fill();
  renderCtx.fillStyle = enemy.hp / enemy.maxHp > 0.45 ? "#51b46d" : "#ff6f61";
  roundedRect(renderCtx, -barWidth / 2, -size - 12, barWidth * clamp(enemy.hp / enemy.maxHp, 0, 1), 5, 3);
  renderCtx.fill();
}

function drawProjectile(renderCtx, projectile) {
  const effect = projectile.effect;
  renderCtx.fillStyle = projectile.color;
  renderCtx.strokeStyle = "#ffffff";
  renderCtx.lineWidth = 2;
  if (effect === "bubbles" || projectile.type === "bubble") {
    renderCtx.globalAlpha = 0.72;
    renderCtx.beginPath();
    renderCtx.arc(0, 0, projectile.radius + 4, 0, Math.PI * 2);
    renderCtx.fill();
    renderCtx.stroke();
  } else if (effect === "sparks") {
    renderCtx.beginPath();
    renderCtx.moveTo(-9, 0);
    renderCtx.lineTo(0, -4);
    renderCtx.lineTo(9, 0);
    renderCtx.lineTo(0, 4);
    renderCtx.closePath();
    renderCtx.fill();
    renderCtx.stroke();
  } else if (effect === "comets") {
    renderCtx.beginPath();
    renderCtx.ellipse(0, 0, projectile.radius + 5, projectile.radius * 0.8, 0, 0, Math.PI * 2);
    renderCtx.fill();
    renderCtx.stroke();
    renderCtx.globalAlpha = 0.45;
    renderCtx.fillStyle = "#ffffff";
    renderCtx.fillRect(-18, -2, 16, 4);
  } else {
    drawStar(renderCtx, 0, 0, projectile.radius + 3, projectile.radius * 0.42, 5);
    renderCtx.fill();
    renderCtx.stroke();
  }
}

function drawStar(renderCtx, x, y, outerRadius, innerRadius, points) {
  renderCtx.beginPath();
  for (let index = 0; index < points * 2; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + index * Math.PI / points;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (index === 0) renderCtx.moveTo(px, py);
    else renderCtx.lineTo(px, py);
  }
  renderCtx.closePath();
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function handleCanvasClick(event) {
  if (!game || game.status !== "playing" || game.paused) return;
  audio.unlock();
  const point = canvasPoint(event);
  const tower = game.towerAt(point.x, point.y);
  if (selectedBuildType) {
    const pad = game.padAt(point.x, point.y);
    if (pad && !game.isPadOccupied(pad.index)) {
      game.buildTower(selectedBuildType, pad.index);
      return;
    }
    if (tower) {
      selectedBuildType = null;
      game.selectedTowerId = tower.id;
      updateHud();
      return;
    }
    showToast("Click an empty glowing build pad.");
    return;
  }
  if (tower) {
    game.selectedTowerId = tower.id;
    updateHud();
    return;
  }
  game.selectedTowerId = null;
  updateHud();
}

function cancelSelection() {
  selectedBuildType = null;
  if (game) game.selectedTowerId = null;
  updateHud();
}

function bindEvents() {
  ui.continueButton.addEventListener("click", () => {
    const resumeLevel = getResumeLevel();
    if (resumeLevel) startLevel(resumeLevel.id);
  });
  ui.playButton.addEventListener("click", () => showScreen("levelSelect"));
  ui.settingsButton.addEventListener("click", () => showScreen("settingsScreen"));
  ui.cosmeticsButton.addEventListener("click", () => showScreen("cosmeticsScreen"));
  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.screen));
  });

  ui.startWaveButton.addEventListener("click", () => {
    audio.unlock();
    if (game) game.startWave();
  });
  ui.fastButton.addEventListener("click", () => {
    if (!game) return;
    game.fastForward = !game.fastForward;
    updateHud();
  });
  ui.pauseButton.addEventListener("click", pauseGame);
  ui.resumeButton.addEventListener("click", resumeGame);
  ui.restartButton.addEventListener("click", () => {
    if (game) startLevel(game.level.id);
  });
  ui.quitButton.addEventListener("click", openLevelSelect);
  ui.upgradeButton.addEventListener("click", () => game?.upgradeSelectedTower());
  ui.sellButton.addEventListener("click", () => game?.sellSelectedTower());
  ui.replayVictoryButton.addEventListener("click", () => {
    if (game) startLevel(game.level.id);
  });
  ui.replayDefeatButton.addEventListener("click", () => {
    if (game) startLevel(game.level.id);
  });
  ui.victoryLevelsButton.addEventListener("click", openLevelSelect);
  ui.defeatLevelsButton.addEventListener("click", openLevelSelect);
  ui.nextLevelButton.addEventListener("click", () => {
    if (!game) return;
    const levelIndex = LEVELS.findIndex((entry) => entry.id === game.level.id);
    const nextLevel = LEVELS[levelIndex + 1];
    if (nextLevel) startLevel(nextLevel.id);
  });

  [ui.musicVolume, ui.sfxVolume, ui.reducedMotion, ui.screenShake, ui.showRanges].forEach((input) => {
    input.addEventListener("input", saveSettingsFromInputs);
    input.addEventListener("change", saveSettingsFromInputs);
  });

  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    cancelSelection();
  });
  canvas.addEventListener("mousemove", (event) => {
    pointer = { ...canvasPoint(event), inside: true };
  });
  canvas.addEventListener("mouseleave", () => {
    pointer.inside = false;
  });

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("keydown", (event) => {
    if (!game || screens.gameScreen.classList.contains("hidden")) return;
    if (event.code === "Space") {
      event.preventDefault();
      audio.unlock();
      game.startWave();
    } else if (event.key.toLowerCase() === "f") {
      game.fastForward = !game.fastForward;
      updateHud();
    } else if (event.key === "Escape") {
      event.preventDefault();
      if (!selectedBuildType && !game.selectedTowerId) {
        if (game.paused) resumeGame();
        else pauseGame();
      } else {
        cancelSelection();
      }
    }
  });

  document.addEventListener("pointerdown", () => audio.unlock(), { once: true });
}

function init() {
  bindEvents();
  syncSettingsInputs();
  updateResumeButton();
  renderTowerButtons();
  resizeCanvas();
  animationFrame = requestAnimationFrame(animationLoop);
}

init();

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationFrame);
});
