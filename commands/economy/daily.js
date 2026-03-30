const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");

module.exports = {
  name: "daily",
  aliases: ["wd", "claim"],
  description: "Claim your daily Ancient Coins",
  async execute(message) {
    const user = getUser(message.author.id);
    const now = Date.now();
    const COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

    if (user.lastDaily && now - user.lastDaily < COOLDOWN) {
      const remaining = COOLDOWN - (now - user.lastDaily);
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);

      const embed = new EmbedBuilder()
        .setColor("#FF9800")
        .setTitle("⏰ Daily Already Claimed!")
        .setDescription(`The ancient treasury needs time to refill.\nCome back in **${hours}h ${minutes}m**`);
      return message.reply({ embeds: [embed] });
    }

    // Streak bonus
    const lastDate = user.lastDaily ? new Date(user.lastDaily) : null;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let streak = user.dailyStreak || 0;
    if (lastDate && lastDate.toDateString() === yesterday.toDateString()) {
      streak++;
    } else if (!lastDate || lastDate.toDateString() !== today.toDateString()) {
      streak = 1;
    }

    const baseReward = 200;
    const streakBonus = Math.min(streak * 20, 500);
    const total = baseReward + streakBonus;

    user.coins = (user.coins || 0) + total;
    user.lastDaily = now;
    user.dailyStreak = streak;
    saveUser(message.author.id, user);

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("🎁 Daily Relic Blessing Received!")
      .setDescription(
        `The ancient spirits bless you with **${total} Ancient Coins**!\n\n` +
        `🪙 Base: **${baseReward}** coins\n` +
        `🔥 Streak Bonus: **+${streakBonus}** coins\n` +
        `📅 Streak: **${streak} days**\n\n` +
        `💰 Total Balance: **${user.coins}** coins`
      )
      .setFooter({ text: "Come back tomorrow for streak bonus!" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
