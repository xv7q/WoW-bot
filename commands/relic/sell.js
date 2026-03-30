const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");
const { getRelicById, RARITY_COLORS, RARITY_EMOJI } = require("../../utils/relics");

// SELL
module.exports = {
  name: "sell",
  description: "Sell a relic for coins",
  async execute(message, args) {
    if (!args[0]) return message.reply("Usage: `wow!sell <relic_id>`");

    const relicId = args[0].toLowerCase();
    const user = getUser(message.author.id);

    const idx = (user.relics || []).indexOf(relicId);
    if (idx === -1) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#8B0000")
            .setDescription("❌ You don't have that relic! Check `wow!relics` for your IDs."),
        ],
      });
    }

    const relic = getRelicById(relicId);
    if (!relic) return message.reply("❌ Unknown relic.");

    if (user.equipped === relicId) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF9800")
            .setDescription(`⚠️ You can't sell your equipped relic! Unequip it first with \`wow!equip none\``),
        ],
      });
    }

    user.relics.splice(idx, 1);
    user.coins = (user.coins || 0) + relic.value;
    saveUser(message.author.id, user);

    const embed = new EmbedBuilder()
      .setColor(RARITY_COLORS[relic.rarity])
      .setTitle("💰 Relic Sold!")
      .setDescription(
        `You sold ${relic.emoji} **${relic.name}** for **${relic.value} Ancient Coins**\n` +
        `💰 Balance: **${user.coins} coins**`
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
