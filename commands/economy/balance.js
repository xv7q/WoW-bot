const { EmbedBuilder } = require("discord.js");
const { getUser } = require("../../utils/database");
const { getRelicById, RARITY_EMOJI } = require("../../utils/relics");

function coinBar(coins) {
  const max = 10000;
  const filled = Math.min(Math.floor((coins / max) * 12), 12);
  return "█".repeat(filled) + "░".repeat(12 - filled);
}

function tier(coins) {
  if (coins >= 100000) return { name: "🌍 World Shard Tycoon", color: "#FF4444" };
  if (coins >= 50000)  return { name: "👑 Crown Bearer",       color: "#FFD700" };
  if (coins >= 20000)  return { name: "🐉 Dragon Hoarder",     color: "#2196F3" };
  if (coins >= 10000)  return { name: "🔮 Orb Keeper",         color: "#9C27B0" };
  if (coins >= 5000)   return { name: "🗿 Idol Collector",     color: "#4CAF50" };
  if (coins >= 1000)   return { name: "🪙 Coin Hunter",        color: "#C9A84C" };
  return                      { name: "🪨 Stone Seeker",       color: "#9E9E9E" };
}

module.exports = {
  name: "balance",
  aliases: ["bal", "wb", "coins", "wallet", "cash", "ocash"],
  description: "Check your Ancient Coins",
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const user = getUser(target.id);
    const coins = user.coins || 0;
    const t = tier(coins);
    const equipped = user.equipped ? getRelicById(user.equipped) : null;

    const bar = coinBar(coins);

    const embed = new EmbedBuilder()
      .setColor(t.color)
      .setTitle(`💰 ${target.username}'s Ancient Treasury`)
      .setThumbnail(target.displayAvatarURL())
      .setDescription(
        `> ${t.name}\n\n` +
        `\`\`\`\n[${bar}]\n${coins.toLocaleString()} / 10,000 shown\`\`\``
      )
      .addFields(
        { name: "🪙 Ancient Coins",  value: `**${coins.toLocaleString()}**`,               inline: true },
        { name: "📦 Relics Owned",   value: `**${(user.relics || []).length}**`,            inline: true },
        { name: "⚔️ Level",          value: `**${user.level || 1}**`,                       inline: true },
        { name: "🔮 Equipped Relic", value: equipped
            ? `${equipped.emoji} **${equipped.name}** ${RARITY_EMOJI[equipped.rarity]}`
            : "*Nothing equipped*",                                                          inline: true },
        { name: "🔥 Daily Streak",   value: `**${user.dailyStreak || 0}** days`,            inline: true },
      )
      .setFooter({ text: "wow!daily to earn more • wow!hunt to find relics" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
