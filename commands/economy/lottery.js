const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser, getAllUsers } = require("../../utils/database");
const fs = require("fs");
const path = require("path");

const LOTTERY_PATH = path.join(__dirname, "../../data/lottery.json");

function getLottery() {
  if (!fs.existsSync(LOTTERY_PATH)) return { pot: 0, tickets: {}, lastDraw: null };
  return JSON.parse(fs.readFileSync(LOTTERY_PATH, "utf8"));
}
function saveLottery(data) {
  const dir = path.dirname(LOTTERY_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LOTTERY_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "lottery",
  aliases: ["lot", "lotto"],
  description: "Buy lottery tickets for a chance at the pot!",
  async execute(message, args) {
    const user = getUser(message.author.id);
    const lottery = getLottery();
    const TICKET_PRICE = 500;

    if (!args[0] || args[0] === "info") {
      const totalTickets = Object.values(lottery.tickets).reduce((a, b) => a + b, 0);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF9800")
            .setTitle("🎟️ Ancient Relic Lottery")
            .setDescription(
              `**Ticket Price:** ${TICKET_PRICE.toLocaleString()} coins\n` +
              `**Current Pot:** 🏆 **${lottery.pot.toLocaleString()} coins**\n` +
              `**Total Tickets Sold:** ${totalTickets}\n` +
              `**Your Tickets:** ${lottery.tickets[message.author.id] || 0}\n\n` +
              `Use \`lottery buy <amount>\` to buy tickets!\n` +
              `Use \`lottery draw\` to draw a winner (if you have 5+ tickets)!\n\n` +
              `*More tickets = higher chance!*`
            ),
        ],
      });
    }

    if (args[0] === "buy") {
      const count = parseInt(args[1]) || 1;
      const cost = count * TICKET_PRICE;

      if (count < 1 || count > 100) return message.reply("❌ Buy 1-100 tickets at a time!");
      if ((user.coins || 0) < cost) return message.reply(`❌ Need **${cost.toLocaleString()} coins** for ${count} tickets. You have **${user.coins || 0}**.`);

      user.coins -= cost;
      lottery.pot += cost;
      lottery.tickets[message.author.id] = (lottery.tickets[message.author.id] || 0) + count;
      saveUser(message.author.id, user);
      saveLottery(lottery);

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF9800")
            .setTitle("🎟️ Tickets Purchased!")
            .setDescription(
              `Bought **${count} ticket${count > 1 ? "s" : ""}** for **${cost.toLocaleString()} coins**!\n` +
              `Your tickets: **${lottery.tickets[message.author.id]}**\n` +
              `Current pot: **${lottery.pot.toLocaleString()} coins**`
            ),
        ],
      });
    }

    if (args[0] === "draw") {
      const totalTickets = Object.values(lottery.tickets).reduce((a, b) => a + b, 0);
      if (totalTickets < 2) return message.reply("❌ Not enough tickets sold yet! Need at least 2 participants.");

      // Pick winner weighted by tickets
      const entries = [];
      for (const [uid, count] of Object.entries(lottery.tickets)) {
        for (let i = 0; i < count; i++) entries.push(uid);
      }
      const winnerId = entries[Math.floor(Math.random() * entries.length)];
      const winnerUser = getUser(winnerId);
      const prize = lottery.pot;

      winnerUser.coins = (winnerUser.coins || 0) + prize;
      saveUser(winnerId, winnerUser);

      // Reset lottery
      saveLottery({ pot: 0, tickets: {}, lastDraw: Date.now() });

      let winnerName = `<@${winnerId}>`;
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle("🏆 LOTTERY DRAW!")
            .setDescription(
              `**${totalTickets} total tickets** were in the pot!\n\n` +
              `🎉 **WINNER: ${winnerName}**\n` +
              `💰 **Prize: ${prize.toLocaleString()} coins!**\n\n` +
              `*The ancient relic gods have chosen!*`
            ),
        ],
      });
    }
  },
};
