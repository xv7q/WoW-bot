// Each relic has a unique themed emoji - grouped visually like OWO pets
const RELICS = [
  // ═══════════ COMMON ═══════════
  { id: "broken_shard",    name: "Broken Shard",       emoji: "🪨", rarity: "common",    power: 2,   value: 50    },
  { id: "old_coin",        name: "Old Coin",            emoji: "🪙", rarity: "common",    power: 3,   value: 60    },
  { id: "clay_tablet",     name: "Clay Tablet",         emoji: "📜", rarity: "common",    power: 4,   value: 75    },
  { id: "bone_needle",     name: "Bone Needle",         emoji: "🦴", rarity: "common",    power: 3,   value: 55    },
  { id: "iron_ring",       name: "Iron Ring",           emoji: "⭕", rarity: "common",    power: 5,   value: 80    },
  { id: "wooden_totem",    name: "Wooden Totem",        emoji: "🪵", rarity: "common",    power: 4,   value: 70    },
  { id: "crude_map",       name: "Crude Map",           emoji: "🗺️", rarity: "common",    power: 3,   value: 65    },
  { id: "old_lantern",     name: "Old Lantern",         emoji: "🏮", rarity: "common",    power: 5,   value: 85    },
  { id: "stone_dice",      name: "Stone Dice",          emoji: "🎲", rarity: "common",    power: 4,   value: 72    },
  { id: "dusty_scroll",    name: "Dusty Scroll",        emoji: "📋", rarity: "common",    power: 6,   value: 90    },

  // ═══════════ UNCOMMON ═══════════
  { id: "jade_amulet",     name: "Jade Amulet",         emoji: "💚", rarity: "uncommon",  power: 10,  value: 200   },
  { id: "silver_dagger",   name: "Silver Dagger",       emoji: "🗡️", rarity: "uncommon",  power: 12,  value: 250   },
  { id: "obsidian_mirror", name: "Obsidian Mirror",     emoji: "🪞", rarity: "uncommon",  power: 14,  value: 300   },
  { id: "carved_idol",     name: "Carved Idol",         emoji: "🗿", rarity: "uncommon",  power: 11,  value: 220   },
  { id: "runic_bracelet",  name: "Runic Bracelet",      emoji: "📿", rarity: "uncommon",  power: 13,  value: 280   },
  { id: "copper_mask",     name: "Copper Mask",         emoji: "🎭", rarity: "uncommon",  power: 12,  value: 260   },
  { id: "bone_staff",      name: "Bone Staff",          emoji: "🪄", rarity: "uncommon",  power: 15,  value: 320   },
  { id: "sand_hourglass",  name: "Sand Hourglass",      emoji: "⏳", rarity: "uncommon",  power: 11,  value: 240   },
  { id: "war_medal",       name: "Ancient War Medal",   emoji: "🎖️", rarity: "uncommon",  power: 14,  value: 310   },
  { id: "cursed_locket",   name: "Cursed Locket",       emoji: "🔒", rarity: "uncommon",  power: 16,  value: 350   },

  // ═══════════ RARE ═══════════
  { id: "crystal_skull",   name: "Crystal Skull",       emoji: "💀", rarity: "rare",      power: 25,  value: 700   },
  { id: "golden_scarab",   name: "Golden Scarab",       emoji: "🪲", rarity: "rare",      power: 22,  value: 650   },
  { id: "thunder_axe",     name: "Thunder Axe Frag",    emoji: "⚡", rarity: "rare",      power: 28,  value: 800   },
  { id: "moonstone_orb",   name: "Moonstone Orb",       emoji: "🌕", rarity: "rare",      power: 26,  value: 750   },
  { id: "dragon_tooth",    name: "Dragon Tooth",        emoji: "🦷", rarity: "rare",      power: 30,  value: 900   },
  { id: "sunken_crown",    name: "Sunken Crown",        emoji: "👑", rarity: "rare",      power: 28,  value: 850   },
  { id: "volcanic_gem",    name: "Volcanic Gem",        emoji: "💎", rarity: "rare",      power: 24,  value: 720   },
  { id: "iron_gauntlet",   name: "Iron Gauntlet",       emoji: "🥊", rarity: "rare",      power: 27,  value: 780   },
  { id: "serpent_ring",    name: "Serpent Ring",        emoji: "🐍", rarity: "rare",      power: 23,  value: 660   },
  { id: "storm_bottle",    name: "Bottled Storm",       emoji: "🌪️", rarity: "rare",      power: 29,  value: 870   },

  // ═══════════ EPIC ═══════════
  { id: "infinity_compass",name: "Infinity Compass",    emoji: "🧭", rarity: "epic",      power: 50,  value: 2000  },
  { id: "phoenix_feather", name: "Phoenix Feather",     emoji: "🪶", rarity: "epic",      power: 55,  value: 2500  },
  { id: "void_gem",        name: "Void Gem",            emoji: "🌌", rarity: "epic",      power: 60,  value: 3000  },
  { id: "titan_shield",    name: "Titan Shield Frag",   emoji: "🛡️", rarity: "epic",      power: 52,  value: 2200  },
  { id: "soul_lantern",    name: "Soul Lantern",        emoji: "🕯️", rarity: "epic",      power: 48,  value: 1900  },
  { id: "time_shard",      name: "Time Shard",          emoji: "🕰️", rarity: "epic",      power: 58,  value: 2800  },
  { id: "god_arrow",       name: "God's Arrow",         emoji: "🏹", rarity: "epic",      power: 54,  value: 2400  },
  { id: "abyss_key",       name: "Abyss Key",           emoji: "🗝️", rarity: "epic",      power: 62,  value: 3200  },

  // ═══════════ LEGENDARY ═══════════
  { id: "eye_of_gods",     name: "Eye of the Gods",     emoji: "👁️", rarity: "legendary", power: 100, value: 10000 },
  { id: "crown_of_ages",   name: "Crown of Ages",       emoji: "✨", rarity: "legendary", power: 120, value: 15000 },
  { id: "world_shard",     name: "World Shard",         emoji: "🌍", rarity: "legendary", power: 150, value: 20000 },
  { id: "death_scythe",    name: "Death's Scythe",      emoji: "☠️", rarity: "legendary", power: 130, value: 18000 },
  { id: "ancient_heart",   name: "Ancient Heart",       emoji: "❤️‍🔥", rarity: "legendary", power: 140, value: 17000 },
];

const RARITY_WEIGHTS = { common: 50, uncommon: 27, rare: 15, epic: 6, legendary: 2 };

const RARITY_COLORS = {
  common:    "#9E9E9E",
  uncommon:  "#4CAF50",
  rare:      "#2196F3",
  epic:      "#9C27B0",
  legendary: "#FF9800",
};

const RARITY_EMOJI = {
  common:    "⬜",
  uncommon:  "🟩",
  rare:      "🟦",
  epic:      "🟪",
  legendary: "🟧",
};

// Descriptions stored separately to keep above clean
const RELIC_DESC = {
  broken_shard:    "A crumbled piece of forgotten stone.",
  old_coin:        "Worn currency from a dead civilization.",
  clay_tablet:     "Ancient inscriptions, mostly illegible.",
  bone_needle:     "A sewing needle made from animal bone.",
  iron_ring:       "A simple iron ring, tarnished with age.",
  wooden_totem:    "A carved totem ward against bad spirits.",
  crude_map:       "Leads somewhere. Probably.",
  old_lantern:     "Burns with a flame that never dies.",
  stone_dice:      "Always rolls in your favor. Or does it?",
  dusty_scroll:    "Written in a language no one speaks anymore.",
  jade_amulet:     "Carved jade that pulses with mild energy.",
  silver_dagger:   "A ceremonial blade never meant for war.",
  obsidian_mirror: "Shows reflections from another time.",
  carved_idol:     "A deity forgotten by all but the earth.",
  runic_bracelet:  "Runes that hum faintly at midnight.",
  copper_mask:     "Whoever wears it sees the past.",
  bone_staff:      "Carved from the bones of a forgotten giant.",
  sand_hourglass:  "The sand inside never runs out.",
  war_medal:       "Given to warriors of a war no history recorded.",
  cursed_locket:   "Contains a portrait of someone you'll never meet.",
  crystal_skull:   "Perfectly carved — no tool marks found.",
  golden_scarab:   "An Egyptian scarab encased in pure gold.",
  thunder_axe:     "A shard of the legendary Storm Breaker.",
  moonstone_orb:   "Glows only under the full moon.",
  dragon_tooth:    "From a creature thought to be myth.",
  sunken_crown:    "Recovered from the depths of Atlantis.",
  volcanic_gem:    "Forged inside a volcano. Still warm.",
  iron_gauntlet:   "The fist of a fallen champion.",
  serpent_ring:    "Wraps around your finger like it's alive.",
  storm_bottle:    "A tiny tornado trapped in glass forever.",
  infinity_compass:"Points not North — but toward destiny.",
  phoenix_feather: "Still warm. Still alive somehow.",
  void_gem:        "Looking into it shows only darkness looking back.",
  titan_shield:    "Even broken, nothing can scratch it.",
  soul_lantern:    "Burns with the light of a thousand souls.",
  time_shard:      "A fragment of frozen time.",
  god_arrow:       "Never misses. Never has. Never will.",
  abyss_key:       "Opens a door that should never be opened.",
  eye_of_gods:     "The actual eye of a fallen deity. It blinks.",
  crown_of_ages:   "Whoever wears it remembers all past lives.",
  world_shard:     "A fragment of the original universe.",
  death_scythe:    "Borrowed from Death himself. Return date: never.",
  ancient_heart:   "The beating heart of the first civilization.",
};

function getRandomRelic() {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  let selectedRarity = "common";
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    rand -= weight;
    if (rand <= 0) { selectedRarity = rarity; break; }
  }
  const pool = RELICS.filter(r => r.rarity === selectedRarity);
  const relic = pool[Math.floor(Math.random() * pool.length)];
  return { ...relic, desc: RELIC_DESC[relic.id] || "" };
}

function getRelicById(id) {
  const r = RELICS.find(r => r.id === id);
  if (!r) return null;
  return { ...r, desc: RELIC_DESC[r.id] || "" };
}

module.exports = { RELICS, RELIC_DESC, RARITY_COLORS, RARITY_EMOJI, RARITY_WEIGHTS, getRandomRelic, getRelicById };
