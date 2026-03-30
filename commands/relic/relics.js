const { EmbedBuilder } = require("discord.js");
const { getUser } = require("../../utils/database");
const { RELICS, RARITY_EMOJI, RARITY_COLORS } = require("../../utils/relics");

const TIERS = [
  { key: "legendary", label: "L", icon: "🟧" },
  { key: "epic",      label: "E", icon: "🟪" },
  { key: "rare",      label: "R", icon: "🟦" },
  { key: "uncommon",  label: "U", icon: "🟩" },
  { key: "common",    label: "C", icon: "⬜" },
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
            .setColor("#666666")
            .setTitle("🕳️ Empty Vault!")
            .setDescription(
              `**${target.username}** hasn't found any relics yet!\n\n` +
              `Use \`hunt\` to start your collection!`
            ),
        ],
      });
    }

    // Count each relic
    const counts = {};
    for (const id of owned) counts[id] = (counts[id] || 0) + 1;

    // Build zoo rows per tier
    let zooText = "";
    let totalPower = 0;
    const stats = {};

    for (const tier of TIERS) {
      const inTier = RELICS.filter(r => r.rarity === tier.key && counts[r.id]);
      const total = owned.filter(id => {
        const r = RELICS.find(x => x.id === id);
        return r && r.rarity === tier.key;
      }).length;
      stats[tier.label] = total;

      if (inTier.length === 0) continue;

      // Each relic: emoji + padded count
      const row = inTier.map(r => {
        const c = counts[r.id];
        totalPower += r.power * c;
        return `${r.emoji}\`${String(c).padStart(2, "0")}\``;
      }).join(" ");

      zooText += `${tier.icon} **${tier.key.toUpperCase()}**\n${row}\n\n`;
    }

    // Summary line like OWO: L-1, E-3, R-5, U-8, C-12
    const summary = TIERS.map(t => `${t.label}-${stats[t.label] || 0}`).join(", ");

    // Equipped
    const equipped = user.equipped ? RELICS.find(r => r.id === user.equipped) : null;

    // Highest rarity owned - for embed color
    let embedColor = RARITY_COLORS["common"];
    for (const tier of TIERS) {
      if (stats[tier.label] > 0) { embedColor = RARITY_COLORS[tier.key]; break; }
    }

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle(`🏺 ${target.username}'s Ancient Vault`)
      .setThumbnail(target.displayAvatarURL())
      .setDescription(
        `🌿 🏺 ✨ **${target.username}'s Relic Collection!** ✨ 🏺 🌿\n\n` +
        zooText +
        `**Relic Power: ${totalPower.toLocaleString()}**\n` +
        `> ${summary}`
      )
      .addFields(
        {
          name: "📊 Stats",
          value:
            `🟧 Legendary: **${stats["L"] || 0}**  ` +
            `🟪 Epic: **${stats["E"] || 0}**  ` +
            `🟦 Rare: **${stats["R"] || 0}**  ` +
            `🟩 Uncommon: **${stats["U"] || 0}**  ` +
            `⬜ Common: **${stats["C"] || 0}**`,
        },
        {
          name: "🔮 Equipped Relic",
          value: equipped
            ? `${equipped.emoji} **${equipped.name}** ${RARITY_EMOJI[equipped.rarity]} *(+${equipped.power} power)*`
            : "*Nothing equipped — use `equip <id>`*",
          inline: true,
        },
        {
          name: "📦 Total",
          value: `**${owned.length}** relics collected`,
          inline: true,
        },
      )
      .setFooter({ text: "hunt • sell <id> • equip <id> • inspect <id>" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
