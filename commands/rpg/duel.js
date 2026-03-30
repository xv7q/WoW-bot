const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");
const { getRelicById } = require("../../utils/relics");

module.exports = {
  name: "duel",
  aliases: ["battle", "fight"],
  description: "Duel another hunter!",
  async execute(message, args) {
    const target = message.mentions.users.first();
    if (!target || target.bot || target.id === message.author.id)
      return message.reply("⚔️ Mention a valid user to duel! `wow!duel @user`");

    const a = getUser(message.author.id);
    const b = getUser(target.id);

    const aPower = (a.level || 1) * 10 + (a.equipped ? (getRelicById(a.equipped)?.power || 0) : 0) + Math.floor(Math.random() * 30);
    const bPower = (b.level || 1) * 10 + (b.equipped ? (getRelicById(b.equipped)?.power || 0) : 0) + Math.floor(Math.random() * 30);

    const winner = aPower >= bPower ? message.author : target;
    const loser = aPower >= bPower ? target : message.author;
    const winnerData = aPower >= bPower ? a : b;
    const prize = Math.min(Math.floor((loserData => loserData.coins || 0)(aPower >= bPower ? b : a) * 0.1), 500) + 50;

    winnerData.coins = (winnerData.coins || 0) + prize;
    winnerData.xp = (winnerData.xp || 0) + 20;
    saveUser(winner.id, winnerData);

    const embed = new EmbedBuilder()
      .setColor("#FF4444")
      .setTitle("⚔️ Relic Duel!")
      .setDescription(
        `**${message.author.username}** (${aPower} power) ⚔️ **${target.username}** (${bPower} power)\n\n` +
        `🏆 **${winner.username}** wins and claims **${prize} coins**!\n` +
        `*The relics have spoken!*`
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
