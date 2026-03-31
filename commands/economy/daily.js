const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");

module.exports = {
  name: "daily",
  aliases: ["wd", "claim"],
  description: "Claim your daily Ancient Coins",
  async execute(message) {
    const user = getUser(message.author.id);
    const now = Date.now();
    const CD = 24 * 60 * 60 * 1000;

    if (user.lastDaily && now - user.lastDaily < CD) {
      const rem = CD - (now - user.lastDaily);
      const h = Math.floor(rem / 3600000);
      const m = Math.floor((rem % 3600000) / 60000);
      const s = Math.floor((rem % 60000) / 1000);
      return message.reply({
        embeds: [new EmbedBuilder().setColor("#FF9800")
          .setTitle("⏰ Treasury is Refilling...")
          .setDescription(
            `Come back in **${h}h ${m}m ${s}s**\n\n` +
            `🔥 Current streak: **${user.dailyStreak || 0} days**`
          )],
      });
    }

    // Streak logic
    const lastDate = user.lastDaily ? new Date(user.lastDaily) : null;
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    let streak = user.dailyStreak || 0;
    if (lastDate && lastDate.toDateString() === yesterday.toDateString()) streak++;
    else streak = 1;

    const base = 200;
    const streakBonus = Math.min(streak * 25, 750);
    const weekBonus = streak % 7 === 0 ? 500 : 0;
    const total = base + streakBonus + weekBonus;

    user.coins = (user.coins || 0) + total;
    user.lastDaily = now;
    user.dailyStreak = streak;
    saveUser(message.author.id, user);

    // Streak fire display
    const fireBar = streak >= 30 ? "🔥".repeat(7) + " **LEGENDARY STREAK!**"
      : streak >= 14 ? "🔥".repeat(5) + ` ${streak} days!`
      : streak >= 7  ? "🔥".repeat(3) + ` ${streak} days`
      : "🔥".repeat(Math.min(streak, 5));

    const embed = new EmbedBuilder()
      .setColor(streak >= 7 ? "#FF4500" : "#FFD700")
      .setTitle("🎁 Daily Relic Blessing!")
      .setDescription(
        `### +${total.toLocaleString()} Ancient Coins!\n\n` +
        `${fireBar}\n\n` +
        "```\n" +
        `Base reward    : ${base} coins\n` +
        `Streak bonus   : +${streakBonus} coins\n` +
        (weekBonus ? `7-day bonus    : +${weekBonus} coins 🎉\n` : "") +
        `─────────────────────\n` +
        `Total          : ${total} coins\n` +
        "```"
      )
      .addFields(
        { name: "💰 New Balance", value: `**${user.coins.toLocaleString()} coins**`, inline: true },
        { name: "🔥 Streak",      value: `**${streak} days**`,                       inline: true },
        { name: "⏰ Next Daily",  value: "in 24 hours",                              inline: true },
      )
      .setFooter({ text: streak % 7 === 0 ? "🎉 Weekly streak bonus claimed!" : "Keep your streak for bigger bonuses!" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
