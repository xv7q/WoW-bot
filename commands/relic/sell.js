const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");
const { getRelicById, RARITY_COLORS, RARITY_EMOJI } = require("../../utils/relics");

module.exports = {
  name: "sell",
  description: "Sell a relic for Ancient Coins",
  async execute(message, args) {
    if (!args[0]) return message.reply("Usage: `sell <relic_id>` — use `relics info` to see IDs");

    const user = getUser(message.author.id);
    const id = args[0].toLowerCase();
    const idx = (user.relics || []).indexOf(id);

    if (idx === -1) return message.reply({
      embeds: [new EmbedBuilder().setColor("#FF1744")
        .setDescription("❌ You don't own that relic!\nUse `relics info` to see your IDs.")],
    });

    const relic = getRelicById(id);
    if (!relic) return message.reply("❌ Unknown relic ID.");

    if (user.equipped === id) return message.reply({
      embeds: [new EmbedBuilder().setColor("#FF9800")
        .setDescription(`⚠️ Can't sell equipped relic! Unequip first: \`equip none\``)],
    });

    user.relics.splice(idx, 1);
    user.coins = (user.coins || 0) + relic.value;
    saveUser(message.author.id, user);

    message.reply({
      embeds: [new EmbedBuilder()
        .setColor(RARITY_COLORS[relic.rarity])
        .setTitle(`💰 Relic Sold!`)
        .setDescription(
          `${relic.emoji} **${relic.name}** ${RARITY_EMOJI[relic.rarity]}\n\n` +
          `\`\`\`\nSold for : ${relic.value.toLocaleString()} coins\nBalance  : ${user.coins.toLocaleString()} coins\`\`\``
        )
        .setTimestamp()],
    });
  },
};
