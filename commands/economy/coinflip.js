const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");

module.exports = {
  name: "coinflip",
  aliases: ["cf", "wcf", "flip"],
  description: "Flip a coin and bet Ancient Coins!",
  async execute(message, args) {
    const user = getUser(message.author.id);

    // wow!cf heads 100
    const side = (args[0] || "").toLowerCase();
    const bet = parseInt(args[1]);

    const validSides = ["heads", "tails", "h", "t"];
    if (!validSides.includes(side) || isNaN(bet) || bet <= 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#C9A84C")
            .setTitle("🪙 Coin Flip")
            .setDescription(
              "**Usage:** `cf heads 100` or `cf tails 500`\n\n" +
              "Win = 2x your bet!\n" +
              `Your balance: **${user.coins || 0} coins**`
            ),
        ],
      });
    }

    if ((user.coins || 0) < bet) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#8B0000")
            .setDescription(`❌ Not enough coins! You have **${user.coins || 0}** coins.`),
        ],
      });
    }

    if (bet > 10000) {
      return message.reply("❌ Max bet is **10,000 coins** per flip!");
    }

    const userPick = side === "h" ? "heads" : side === "t" ? "tails" : side;
    const result = Math.random() < 0.5 ? "heads" : "tails";
    const won = userPick === result;

    if (won) {
      user.coins += bet;
    } else {
      user.coins -= bet;
    }
    saveUser(message.author.id, user);

    // Animated feel - show spinning first
    const coinEmoji = result === "heads" ? "🟡" : "⚫";
    const resultText = result === "heads" ? "🟡 HEADS" : "⚫ TAILS";

    const embed = new EmbedBuilder()
      .setColor(won ? "#FFD700" : "#8B0000")
      .setTitle(`${coinEmoji} Coin Flip!`)
      .setDescription(
        `You picked: **${userPick.toUpperCase()}**\n` +
        `Result: **${resultText}**\n\n` +
        (won
          ? `✅ **YOU WIN! +${bet} coins!**\n*The ancient spirits favor you!*`
          : `❌ **YOU LOSE! -${bet} coins!**\n*The relics are not pleased...*`)
      )
      .addFields(
        { name: "Bet", value: `${bet} coins`, inline: true },
        { name: won ? "Won" : "Lost", value: `${bet} coins`, inline: true },
        { name: "Balance", value: `**${user.coins} coins**`, inline: true },
      )
      .setFooter({ text: `${message.author.username} • coinflip` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
