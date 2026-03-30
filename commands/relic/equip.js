const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");
const { getRelicById, RARITY_COLORS, RARITY_EMOJI } = require("../../utils/relics");

module.exports = {
  name: "equip",
  description: "Equip a relic",
  async execute(message, args) {
    if (!args[0]) return message.reply("Usage: `wow!equip <relic_id>` or `wow!equip none` to unequip");

    const user = getUser(message.author.id);

    if (args[0].toLowerCase() === "none") {
      user.equipped = null;
      saveUser(message.author.id, user);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#666")
            .setDescription("🔓 Relic unequipped. Your power returns to baseline."),
        ],
      });
    }

    const relicId = args[0].toLowerCase();
    if (!(user.relics || []).includes(relicId)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#8B0000")
            .setDescription("❌ You don't own that relic! Check `wow!relics`"),
        ],
      });
    }

    const relic = getRelicById(relicId);
    if (!relic) return message.reply("❌ Unknown relic.");

    user.equipped = relicId;
    saveUser(message.author.id, user);

    const embed = new EmbedBuilder()
      .setColor(RARITY_COLORS[relic.rarity])
      .setTitle(`${relic.emoji} Relic Equipped!`)
      .setDescription(
        `You equipped **${relic.name}** ${RARITY_EMOJI[relic.rarity]}\n\n` +
        `*${relic.desc}*\n\n` +
        `⚡ Power granted: **+${relic.power}**`
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
