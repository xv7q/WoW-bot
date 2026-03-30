const RELICS = [
  // ═══════════════ COMMON (10) ═══════════════
  { id: "broken_shard",   name: "Broken Shard",     emoji: "🪨", rarity: "common",    power: 2,   value: 50,    desc: "A crumbled piece of forgotten stone." },
  { id: "old_coin",       name: "Old Coin",          emoji: "🪙", rarity: "common",    power: 3,   value: 60,    desc: "Worn currency from a dead civilization." },
  { id: "clay_tablet",    name: "Clay Tablet",       emoji: "📜", rarity: "common",    power: 4,   value: 75,    desc: "Ancient inscriptions, mostly illegible." },
  { id: "bone_needle",    name: "Bone Needle",       emoji: "🦴", rarity: "common",    power: 3,   value: 55,    desc: "A sewing needle made from animal bone." },
  { id: "iron_ring",      name: "Iron Ring",         emoji: "💍", rarity: "common",    power: 5,   value: 80,    desc: "A simple iron ring, tarnished with age." },
  { id: "wooden_totem",   name: "Wooden Totem",      emoji: "🪵", rarity: "common",    power: 4,   value: 70,    desc: "A carved totem ward against bad spirits." },
  { id: "crude_map",      name: "Crude Map",         emoji: "🗺️", rarity: "common",    power: 3,   value: 65,    desc: "Leads somewhere. Probably." },
  { id: "old_lantern",    name: "Old Lantern",       emoji: "🏮", rarity: "common",    power: 5,   value: 85,    desc: "Burns with a flame that never dies." },
  { id: "stone_dice",     name: "Stone Dice",        emoji: "🎲", rarity: "common",    power: 4,   value: 72,    desc: "Always rolls in your favor. Or does it?" },
  { id: "dusty_scroll",   name: "Dusty Scroll",      emoji: "📋", rarity: "common",    power: 6,   value: 90,    desc: "Written in a language no one speaks anymore." },

  // ═══════════════ UNCOMMON (10) ═══════════════
  { id: "jade_amulet",    name: "Jade Amulet",       emoji: "🟢", rarity: "uncommon",  power: 10,  value: 200,   desc: "Carved jade that pulses with mild energy." },
  { id: "silver_dagger",  name: "Silver Dagger",     emoji: "🗡️", rarity: "uncommon",  power: 12,  value: 250,   desc: "A ceremonial blade never meant for war." },
  { id: "obsidian_mirror",name: "Obsidian Mirror",   emoji: "🪞", rarity: "uncommon",  power: 14,  value: 300,   desc: "Shows reflections from another time." },
  { id: "carved_idol",    name: "Carved Idol",       emoji: "🗿", rarity: "uncommon",  power: 11,  value: 220,   desc: "A deity forgotten by all but the earth." },
  { id: "runic_bracelet", name: "Runic Bracelet",    emoji: "🔮", rarity: "uncommon",  power: 13,  value: 280,   desc: "Runes that hum faintly at midnight." },
  { id: "copper_mask",    name: "Copper Mask",       emoji: "🎭", rarity: "uncommon",  power: 12,  value: 260,   desc: "Whoever wears it sees the past." },
  { id: "bone_staff",     name: "Bone Staff",        emoji: "🪄", rarity: "uncommon",  power: 15,  value: 320,   desc: "Carved from the bones of a forgotten giant." },
  { id: "sand_hourglass", name: "Sand Hourglass",    emoji: "⏳", rarity: "uncommon",  power: 11,  value: 240,   desc: "The sand inside never runs out." },
  { id: "cursed_locket",  name: "Cursed Locket",     emoji: "📿", rarity: "uncommon",  power: 16,  value: 350,   desc: "Contains a portrait of someone you'll never meet." },
  { id: "war_medal",      name: "Ancient War Medal", emoji: "🎖️", rarity: "uncommon",  power: 14,  value: 310,   desc: "Given to warriors of a war no history recorded." },

  // ═══════════════ RARE (10) ═══════════════
  { id: "crystal_skull",  name: "Crystal Skull",     emoji: "💀", rarity: "rare",      power: 25,  value: 700,   desc: "Perfectly carved — no tool marks found." },
  { id: "golden_scarab",  name: "Golden Scarab",     emoji: "🪲", rarity: "rare",      power: 22,  value: 650,   desc: "An Egyptian scarab encased in pure gold." },
  { id: "thunder_axe",    name: "Thunder Axe Frag",  emoji: "⚡", rarity: "rare",      power: 28,  value: 800,   desc: "A shard of the legendary Storm Breaker." },
  { id: "moonstone_orb",  name: "Moonstone Orb",     emoji: "🌕", rarity: "rare",      power: 26,  value: 750,   desc: "Glows only under the full moon." },
  { id: "dragon_tooth",   name: "Dragon Tooth",      emoji: "🐉", rarity: "rare",      power: 30,  value: 900,   desc: "From a creature thought to be myth." },
  { id: "sunken_crown",   name: "Sunken Crown",      emoji: "👑", rarity: "rare",      power: 28,  value: 850,   desc: "Recovered from the depths of Atlantis." },
  { id: "volcanic_gem",   name: "Volcanic Gem",      emoji: "💎", rarity: "rare",      power: 24,  value: 720,   desc: "Forged inside a volcano. Still warm." },
  { id: "iron_gauntlet",  name: "Iron Gauntlet",     emoji: "🥊", rarity: "rare",      power: 27,  value: 780,   desc: "The fist of a fallen champion." },
  { id: "serpent_ring",   name: "Serpent Ring",      emoji: "🐍", rarity: "rare",      power: 23,  value: 660,   desc: "Wraps around your finger like it's alive." },
  { id: "storm_bottle",   name: "Bottled Storm",     emoji: "🌪️", rarity: "rare",      power: 29,  value: 870,   desc: "A tiny tornado trapped in glass forever." },

  // ═══════════════ EPIC (8) ═══════════════
  { id: "infinity_compass",name: "Infinity Compass", emoji: "🧭", rarity: "epic",      power: 50,  value: 2000,  desc: "Points not North — but toward destiny." },
  { id: "phoenix_feather", name: "Phoenix Feather",  emoji: "🔥", rarity: "epic",      power: 55,  value: 2500,  desc: "Still warm. Still alive somehow." },
  { id: "void_gem",        name: "Void Gem",          emoji: "🌌", rarity: "epic",      power: 60,  value: 3000,  desc: "Looking into it shows only darkness looking back." },
  { id: "titan_shield",    name: "Titan Shield Frag", emoji: "🛡️", rarity: "epic",      power: 52,  value: 2200,  desc: "Even broken, nothing can scratch it." },
  { id: "soul_lantern",    name: "Soul Lantern",      emoji: "🕯️", rarity: "epic",      power: 48,  value: 1900,  desc: "Burns with the light of a thousand souls." },
  { id: "time_shard",      name: "Time Shard",        emoji: "🕰️", rarity: "epic",      power: 58,  value: 2800,  desc: "A fragment of frozen time." },
  { id: "god_arrow",       name: "God's Arrow",       emoji: "🏹", rarity: "epic",      power: 54,  value: 2400,  desc: "Never misses. Never has. Never will." },
  { id: "abyss_key",       name: "Abyss Key",         emoji: "🗝️", rarity: "epic",      power: 62,  value: 3200,  desc: "Opens a door that should never be opened." },

  // ═══════════════ LEGENDARY (5) ═══════════════
  { id: "eye_of_gods",     name: "Eye of the Gods",   emoji: "👁️", rarity: "legendary", power: 100, value: 10000, desc: "The actual eye of a fallen deity. It blinks." },
  { id: "crown_of_ages",   name: "Crown of Ages",     emoji: "✨", rarity: "legendary", power: 120, value: 15000, desc: "Whoever wears it remembers all past lives." },
  { id: "world_shard",     name: "World Shard",        emoji: "🌍", rarity: "legendary", power: 150, value: 20000, desc: "A fragment of the original universe." },
  { id: "death_scythe",    name: "Death's Scythe",    emoji: "☠️", rarity: "legendary", power: 130, value: 18000, desc: "Borrowed from Death himself. Return date: never." },
  { id: "ancient_heart",   name: "Ancient Heart",     emoji: "❤️‍🔥", rarity: "legendary", power: 140, value: 17000, desc: "The beating heart of the first civilization." },
];

const RARITY_WEIGHTS = {
  common:    50,
  uncommon:  27,
  rare:      15,
  epic:       6,
  legendary:  2,
};

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

function getRandomRelic() {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  let selectedRarity = "common";
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    rand -= weight;
    if (rand <= 0) { selectedRarity = rarity; break; }
  }
  const pool = RELICS.filter(r => r.rarity === selectedRarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

function getRelicById(id) {
  return RELICS.find(r => r.id === id);
}

module.exports = { RELICS, RARITY_COLORS, RARITY_EMOJI, RARITY_WEIGHTS, getRandomRelic, getRelicById };
