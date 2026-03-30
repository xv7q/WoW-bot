const { EmbedBuilder } = require("discord.js");
const { getUser } = require("../../utils/database");
const { RELICS, RARITY_EMOJI, RARITY_COLORS } = require("../../utils/relics");

// Rarity order & labels like OWO zoo tiers
const TIERS = [
  { key: "legendary", label: "L", color: "🟧", bar: "```fix\nL```" },
  { key: "epic",      label: "E", color: "🟪", bar: "```fix\nE```" },
  { key: "rare",      label: "R", color: "🟦", bar: "```diff\nR```" },
  { key: "uncommon",  label: "U", color: "🟩", bar: "```css\nU```" },
  { key: "common",    label: "C", color: "⬜", bar: "```\nC```" },
];

module.exports = {
  name: "relics",
  aliases: ["collection", "wr", "bag", "inv", "inventory", "zoo", "oz"],
  description: "View your relic collection (OWO zoo style!)",
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const user = getUser(target.id);
    const owned = user.relics || [];

    if (owned.length === 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#666")
            .setDescription(
              `🕳️ **${target.username}** has no relics!\n` +
              `Use \`wow!hunt\` to start your collection!`
            ),
        ],
      });
    }

    // Count how many of each relic the user has
    const counts = {};
    for (const id of owned) counts[id] = (counts[id] || 0) + 1;

    // Build zoo display per rarity tier
    let zooLines = "";
    let totalPower = 0;
    const rarityStats = {};

    for (const tier of TIERS) {
      const relicsInTier = RELICS.filter(r => r.rarity === tier.key);
      const ownedInTier = relicsInTier.filter(r => counts[r.id]);
      rarityStats[tier.label] = owned.filter(id => {
        const r = RELICS.find(x => x.id === id);
        return r && r.rarity === tier.key;
      }).length;

      if (ownedInTier.length === 0) continue;

      // Build the row: emoji + count like OWO zoo
      const row = ownedInTier
        .map(r => {
          const c = counts[r.id];
          totalPower += r.power * c;
          return `${r.emoji}\`${String(c).padStart(2, "0")}\``;
        })
        .join(" ");

      zooLines += `${tier.color} **${tier.key.toUpperCase()}**\n${row}\n\n`;
    }

    // Rarity summary like OWO's G-2 L-2 M-8 etc
    const summaryParts = TIERS
      .map(t => `${t.label}-${rarityStats[t.label] || 0}`)
      .join(", ");

    // Equipped relic
    const equipped = user.equipped
      ? RELICS.find(r => r.id === user.equipped)
      : null;

    const embed = new EmbedBuilder()
      .setColor(RARITY_COLORS["legendary"])
      .setTitle(`🏺 ${target.username}'s Relic Collection`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `*🌿 🏺 ✨ **${target.username}'s Ancient Vault!** ✨ 🏺 🌿*\n\n` +
        zooLines +
        `**Relic Power: ${totalPower.toLocaleString()}**\n` +
        `> ${summaryParts}`
      )
      .addFields(
        {
          name: "📊 Collection Stats",
          value: [
            `🟧 Legendary: **${rarityStats["L"] || 0}**`,
            `🟪 Epic: **${rarityStats["E"] || 0}**`,
            `🟦 Rare: **${rarityStats["R"] || 0}**`,
            `🟩 Uncommon: **${rarityStats["U"] || 0}**`,
            `⬜ Common: **${rarityStats["C"] || 0}**`,
          ].join("  •  "),
          inline: false,
        },
        {
          name: "🔮 Equipped",
          value: equipped
            ? `${equipped.emoji} **${equipped.name}** ${RARITY_EMOJI[equipped.rarity]} (+${equipped.power} power)`
            : "*Nothing equipped — use `wow!equip <id>`*",
          inline: true,
        },
        {
          name: "📦 Total Relics",
          value: `**${owned.length}** collected`,
          inline: true,
        },
      )
      .setFooter({ text: "wow!hunt to find more • wow!inspect <id> for details • wow!sell <id> to sell" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
