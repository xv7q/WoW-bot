const { EmbedBuilder } = require("discord.js");
const { getRelicById, RARITY_COLORS, RARITY_EMOJI } = require("../../utils/relics");

module.exports = {
  name: "inspect",
  aliases: ["info", "relic"],
  description: "Inspect a relic's full details",
  async execute(message, args) {
    if (!args[0]) return message.reply("Usage: `inspect <relic_id>` — use `relics info` to see IDs");

    const relic = getRelicById(args[0].toLowerCase());
    if (!relic) return message.reply({
      embeds: [new EmbedBuilder().setColor("#FF1744")
        .setDescription("❌ Unknown relic ID.\nUse `relics info` to see all valid IDs.")],
    });

    message.reply({
      embeds: [new EmbedBuilder()
        .setColor(RARITY_COLORS[relic.rarity])
        .setTitle(`${relic.emoji} ${relic.name}`)
        .setDescription(`> *"${relic.desc}"*`)
        .addFields(
          { name: "✨ Rarity",    value: `${RARITY_EMOJI[relic.rarity]} **${relic.rarity.toUpperCase()}**`, inline: true },
          { name: "⚡ Power",     value: `**${relic.power}**`,                                              inline: true },
          { name: "💰 Sell Value",value: `**${relic.value.toLocaleString()} coins**`,                       inline: true },
          { name: "🔑 Relic ID",  value: `\`${relic.id}\``,                                                inline: true },
        )
        .setFooter({ text: "equip <id> • sell <id>" })
        .setTimestamp()],
    });
  },
};
