const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");
const { getRelicById, RARITY_COLORS, RARITY_EMOJI } = require("../../utils/relics");

module.exports = {
  name: "equip",
  description: "Equip a relic for power bonuses",
  async execute(message, args) {
    if (!args[0]) return message.reply("Usage: `equip <relic_id>` or `equip none`");

    const user = getUser(message.author.id);

    if (args[0].toLowerCase() === "none") {
      const prev = user.equipped ? getRelicById(user.equipped) : null;
      user.equipped = null;
      saveUser(message.author.id, user);
      return message.reply({
        embeds: [new EmbedBuilder().setColor("#666666")
          .setDescription(`🔓 **Unequipped** ${prev ? `${prev.emoji} ${prev.name}` : "relic"}.\n*Power returned to baseline.*`)],
      });
    }

    const id = args[0].toLowerCase();
    if (!(user.relics || []).includes(id)) return message.reply({
      embeds: [new EmbedBuilder().setColor("#FF1744")
        .setDescription("❌ You don't own that relic! Use `relics info` for IDs.")],
    });

    const relic = getRelicById(id);
    if (!relic) return message.reply("❌ Unknown relic.");

    user.equipped = id;
    saveUser(message.author.id, user);

    message.reply({
      embeds: [new EmbedBuilder()
        .setColor(RARITY_COLORS[relic.rarity])
        .setTitle(`${relic.emoji} Relic Equipped!`)
        .setDescription(
          `### ${relic.name} ${RARITY_EMOJI[relic.rarity]}\n` +
          `> *"${relic.desc}"*\n\n` +
          `\`\`\`\nPower bonus : +${relic.power}\nRarity      : ${relic.rarity.toUpperCase()}\`\`\``
        )
        .setTimestamp()],
    });
  },
};
