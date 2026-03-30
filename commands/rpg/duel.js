const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");
const { getRelicById } = require("../../utils/relics");

module.exports = {
  name: "duel",
  aliases: ["battle", "fight"],
  description: "Duel another relic hunter!",
  async execute(message, args) {
    const target = message.mentions.users.first();
    if (!target || target.bot || target.id === message.author.id)
      return message.reply("⚔️ Mention a valid user to duel! `duel @user`");

    const userData = getUser(message.author.id);
    const targetData = getUser(target.id);

    const equippedA = userData.equipped ? getRelicById(userData.equipped) : null;
    const equippedB = targetData.equipped ? getRelicById(targetData.equipped) : null;

    const aPower = (userData.level || 1) * 10 + (equippedA?.power || 0) + Math.floor(Math.random() * 30);
    const bPower = (targetData.level || 1) * 10 + (equippedB?.power || 0) + Math.floor(Math.random() * 30);

    const aWins = aPower >= bPower;
    const winner = aWins ? message.author : target;
    const loser = aWins ? target : message.author;
    const winnerData = aWins ? userData : targetData;
    const loserData = aWins ? targetData : userData;

    const prize = Math.min(Math.floor((loserData.coins || 0) * 0.1) + 50, 1000);
    winnerData.coins = (winnerData.coins || 0) + prize;
    winnerData.xp = (winnerData.xp || 0) + 20;
    saveUser(winner.id, winnerData);

    const embed = new EmbedBuilder()
      .setColor("#FF4444")
      .setTitle("⚔️ Ancient Relic Duel!")
      .setDescription(
        `**${message.author.username}** *(${aPower} power)* ⚔️ **${target.username}** *(${bPower} power)*\n\n` +
        `🏆 **${winner.username}** wins and claims **${prize} coins** from ${loser.username}!\n` +
        `*The ancient relics have spoken!*`
      )
      .addFields(
        equippedA ? { name: `${message.author.username}'s Relic`, value: `${equippedA.emoji} ${equippedA.name}`, inline: true } : { name: `${message.author.username}`, value: "No relic equipped", inline: true },
        equippedB ? { name: `${target.username}'s Relic`, value: `${equippedB.emoji} ${equippedB.name}`, inline: true } : { name: `${target.username}`, value: "No relic equipped", inline: true },
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
