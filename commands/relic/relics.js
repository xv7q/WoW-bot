const { EmbedBuilder } = require("discord.js");
const { getUser } = require("../../utils/database");
const { getRelicById, RARITY_EMOJI, RARITY_COLORS } = require("../../utils/relics");

module.exports = {
  name: "relics",
  aliases: ["collection", "bag", "inv", "inventory"],
  description: "View your relic collection",
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const user = getUser(target.id);

    const relics = user.relics || [];

    if (relics.length === 0) {
      const embed = new EmbedBuilder()
        .setColor("#666")
        .setDescription(`🕳️ **${target.username}** has no relics yet!\nUse \`wow!hunt\` to start collecting!`);
      return message.reply({ embeds: [embed] });
    }

    // Count relics by rarity
    const countByRarity = { legendary: 0, epic: 0, rare: 0, uncommon: 0, common: 0 };
    const relicDetails = relics.map((id) => getRelicById(id)).filter(Boolean);

    relicDetails.forEach((r) => {
      if (r) countByRarity[r.rarity]++;
    });

    // Show last 15 relics
    const display = relicDetails.slice(-15).map((r) => {
      const equipped = user.equipped === r.id ? " *(equipped)*" : "";
      return `${RARITY_EMOJI[r.rarity]} ${r.emoji} **${r.name}**${equipped} — \`${r.id}\``;
    });

    const embed = new EmbedBuilder()
      .setColor("#C9A84C")
      .setTitle(`🏺 ${target.username}'s Relic Collection`)
      .setThumbnail(target.displayAvatarURL())
      .setDescription(display.join("\n") || "*Empty...*")
      .addFields(
        {
          name: "📊 Collection Stats",
          value: [
            `🟧 Legendary: **${countByRarity.legendary}**`,
            `🟪 Epic: **${countByRarity.epic}**`,
            `🟦 Rare: **${countByRarity.rare}**`,
            `🟩 Uncommon: **${countByRarity.uncommon}**`,
            `⬜ Common: **${countByRarity.common}**`,
            `\n📦 Total: **${relics.length}** relics`,
          ].join("  "),
        }
      )
      .setFooter({ text: `Showing last 15 of ${relics.length} relics` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
