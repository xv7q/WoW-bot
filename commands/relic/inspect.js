const { EmbedBuilder } = require("discord.js");
const { getRelicById, RARITY_COLORS, RARITY_EMOJI } = require("../../utils/relics");

module.exports = {
  name: "inspect",
  aliases: ["info", "relic"],
  description: "Inspect a relic's details",
  async execute(message, args) {
    if (!args[0]) return message.reply("Usage: `wow!inspect <relic_id>`");

    const relic = getRelicById(args[0].toLowerCase());
    if (!relic) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#8B0000")
            .setDescription("❌ Unknown relic ID. Check `wow!relics` for valid IDs."),
        ],
      });
    }

    const embed = new EmbedBuilder()
      .setColor(RARITY_COLORS[relic.rarity])
      .setTitle(`${relic.emoji} ${relic.name}`)
      .setDescription(`*"${relic.desc}"*`)
      .addFields(
        { name: "✨ Rarity", value: `${RARITY_EMOJI[relic.rarity]} ${relic.rarity.toUpperCase()}`, inline: true },
        { name: "⚡ Power", value: `${relic.power}`, inline: true },
        { name: "💰 Sell Value", value: `${relic.value} coins`, inline: true },
        { name: "🔑 ID", value: `\`${relic.id}\``, inline: true },
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
