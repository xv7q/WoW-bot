const { EmbedBuilder } = require("discord.js");
const { getUser } = require("../../utils/database");
const { getRelicById, RARITY_EMOJI, RARITY_COLORS } = require("../../utils/relics");

module.exports = {
  name: "profile",
  aliases: ["p", "wp", "me"],
  description: "View your hunter profile",
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const user = getUser(target.id);
    const equipped = user.equipped ? getRelicById(user.equipped) : null;
    const xpNeeded = (user.level || 1) * 100 + 100;
    const xpBar = Math.floor(((user.xp || 0) / xpNeeded) * 10);
    const bar = "█".repeat(xpBar) + "░".repeat(10 - xpBar);

    const embed = new EmbedBuilder()
      .setColor(equipped ? RARITY_COLORS[equipped.rarity] : "#C9A84C")
      .setTitle(`🏺 ${target.username}'s Hunter Profile`)
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: "⚔️ Level", value: `**${user.level || 1}**`, inline: true },
        { name: "💰 Coins", value: `**${user.coins || 0}**`, inline: true },
        { name: "📦 Relics", value: `**${(user.relics || []).length}**`, inline: true },
        { name: "📊 XP Progress", value: `\`[${bar}]\` ${user.xp || 0}/${xpNeeded}` },
        { name: "🔮 Equipped Relic", value: equipped ? `${equipped.emoji} **${equipped.name}** ${RARITY_EMOJI[equipped.rarity]} (+${equipped.power} power)` : "*None equipped*" },
        { name: "🔥 Daily Streak", value: `**${user.dailyStreak || 0}** days`, inline: true },
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
