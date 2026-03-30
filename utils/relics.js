const RELICS = [
  // Common
  { id: "broken_shard", name: "Broken Shard", emoji: "🪨", rarity: "common", power: 2, value: 50, desc: "A crumbled piece of forgotten stone." },
  { id: "old_coin", name: "Old Coin", emoji: "🪙", rarity: "common", power: 3, value: 60, desc: "Worn currency from a dead civilization." },
  { id: "clay_tablet", name: "Clay Tablet", emoji: "📜", rarity: "common", power: 4, value: 75, desc: "Ancient inscriptions, mostly illegible." },
  { id: "bone_needle", name: "Bone Needle", emoji: "🦴", rarity: "common", power: 3, value: 55, desc: "A sewing needle made from animal bone." },
  { id: "iron_ring", name: "Iron Ring", emoji: "💍", rarity: "common", power: 5, value: 80, desc: "A simple iron ring, tarnished with age." },

  // Uncommon
  { id: "jade_amulet", name: "Jade Amulet", emoji: "🟢", rarity: "uncommon", power: 10, value: 200, desc: "Carved jade that pulses with mild energy." },
  { id: "silver_dagger", name: "Silver Dagger", emoji: "🗡️", rarity: "uncommon", power: 12, value: 250, desc: "A ceremonial blade never meant for war." },
  { id: "obsidian_mirror", name: "Obsidian Mirror", emoji: "🪞", rarity: "uncommon", power: 14, value: 300, desc: "Shows reflections from another time." },
  { id: "carved_idol", name: "Carved Idol", emoji: "🗿", rarity: "uncommon", power: 11, value: 220, desc: "A deity forgotten by all but the earth." },
  { id: "runic_bracelet", name: "Runic Bracelet", emoji: "🔮", rarity: "uncommon", power: 13, value: 280, desc: "Runes that hum faintly at midnight." },

  // Rare
  { id: "crystal_skull", name: "Crystal Skull", emoji: "💀", rarity: "rare", power: 25, value: 700, desc: "Perfectly carved — no tool marks found." },
  { id: "golden_scarab", name: "Golden Scarab", emoji: "🪲", rarity: "rare", power: 22, value: 650, desc: "An Egyptian scarab encased in pure gold." },
  { id: "thunder_axe", name: "Thunder Axe Fragment", emoji: "⚡", rarity: "rare", power: 28, value: 800, desc: "A shard of the legendary Storm Breaker." },
  { id: "moonstone_orb", name: "Moonstone Orb", emoji: "🌕", rarity: "rare", power: 26, value: 750, desc: "Glows only under the full moon." },
  { id: "dragon_tooth", name: "Dragon Tooth", emoji: "🐉", rarity: "rare", power: 30, value: 900, desc: "From a creature thought to be myth." },

  // Epic
  { id: "infinity_compass", name: "Infinity Compass", emoji: "🧭", rarity: "epic", power: 50, value: 2000, desc: "Points not North — but toward destiny." },
  { id: "phoenix_feather", name: "Phoenix Feather", emoji: "🔥", rarity: "epic", power: 55, value: 2500, desc: "Still warm. Still alive somehow." },
  { id: "void_gem", name: "Void Gem", emoji: "🌌", rarity: "epic", power: 60, value: 3000, desc: "Looking into it shows only darkness looking back." },
  { id: "titan_shield", name: "Titan Shield Fragment", emoji: "🛡️", rarity: "epic", power: 52, value: 2200, desc: "Even broken, nothing can scratch it." },

  // Legendary
  { id: "eye_of_gods", name: "Eye of the Gods", emoji: "👁️", rarity: "legendary", power: 100, value: 10000, desc: "The actual eye of a fallen deity. It blinks." },
  { id: "crown_of_ages", name: "Crown of Ages", emoji: "👑", rarity: "legendary", power: 120, value: 15000, desc: "Whoever wears it remembers all past lives." },
  { id: "world_shard", name: "World Shard", emoji: "🌍", rarity: "legendary", power: 150, value: 20000, desc: "A fragment of the original universe." },
];

const RARITY_WEIGHTS = {
  common: 50,
  uncommon: 30,
  rare: 15,
  epic: 4,
  legendary: 1,
};

const RARITY_COLORS = {
  common: "#9E9E9E",
  uncommon: "#4CAF50",
  rare: "#2196F3",
  epic: "#9C27B0",
  legendary: "#FF9800",
};

const RARITY_EMOJI = {
  common: "⬜",
  uncommon: "🟩",
  rare: "🟦",
  epic: "🟪",
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

  const relicsOfRarity = RELICS.filter((r) => r.rarity === selectedRarity);
  return relicsOfRarity[Math.floor(Math.random() * relicsOfRarity.length)];
}

function getRelicById(id) {
  return RELICS.find((r) => r.id === id);
}

module.exports = { RELICS, RARITY_COLORS, RARITY_EMOJI, getRandomRelic, getRelicById };
