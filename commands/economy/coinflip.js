const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");

const SPIN_FRAMES = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];

module.exports = {
  name: "coinflip",
  aliases: ["cf", "wcf", "flip", "ocf"],
  description: "Flip a coin and bet Ancient Coins!",
  async execute(message, args) {
    const user = getUser(message.author.id);

    const sideArg = (args[0] || "").toLowerCase();
    const betArg = args[1];

    const validSides = ["heads", "tails", "h", "t"];
    if (!validSides.includes(sideArg) || !betArg) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#C9A84C")
            .setTitle("🪙 Ancient Coin Flip")
            .setDescription(
              "**Usage:** `cf heads 500` or `cf tails all`\n\n" +
              "🟡 **Heads** or ⚫ **Tails**\n" +
              "Win = **2x** your bet!\n\n" +
              `💰 **Balance: ${(user.coins||0).toLocaleString()} coins**`
            ),
        ],
      });
    }

    let bet;
    if (betArg === "all" || betArg === "max") bet = Math.min(user.coins || 0, 100000);
    else bet = parseInt(betArg);

    if (isNaN(bet) || bet <= 0) return message.reply("❌ Invalid bet!");
    if (bet > 100000) return message.reply("❌ Max bet is **100,000 coins**!");
    if ((user.coins || 0) < bet) return message.reply(`❌ Not enough coins! You have **${user.coins || 0}** coins.`);

    const pick = sideArg === "h" ? "heads" : sideArg === "t" ? "tails" : sideArg;
    const result = Math.random() < 0.5 ? "heads" : "tails";
    const won = pick === result;

    // === ANIMATION ===
    const msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#888888")
          .setTitle("🪙 The Ancient Coin Spins...")
          .setDescription(`*${message.author.username}* bets **${bet.toLocaleString()} coins** on **${pick.toUpperCase()}**\n\n${SPIN_FRAMES[0]} *The coin flips into the air...*`),
      ],
    });

    // Spin frames
    for (let i = 1; i < SPIN_FRAMES.length; i++) {
      await new Promise(r => setTimeout(r, 180));
      const phrases = [
        "spinning...", "turning...", "flipping...", "the ancient magic decides...",
        "almost...", "nearly there...", "the relic gods choose...", "final moments..."
      ];
      await msg.edit({
        embeds: [
          new EmbedBuilder()
            .setColor("#999999")
            .setTitle("🪙 The Ancient Coin Spins...")
            .setDescription(`*${message.author.username}* bets **${bet.toLocaleString()} coins** on **${pick.toUpperCase()}**\n\n${SPIN_FRAMES[i]} *${phrases[i]}*`),
        ],
      });
    }

    await new Promise(r => setTimeout(r, 400));

    // Final result
    const resultEmoji = result === "heads" ? "🟡" : "⚫";
    const pickEmoji = pick === "heads" ? "🟡" : "⚫";

    if (won) {
      user.coins = (user.coins || 0) + bet;
    } else {
      user.coins = (user.coins || 0) - bet;
    }
    saveUser(message.author.id, user);

    const winLines = [
      "The ancient spirits favor your intuition!",
      "The relic gods smile upon you!",
      "Fortune blesses the worthy hunter!",
    ];
    const loseLines = [
      "The coin lands against you... :c",
      "The ancient curse claims your coins...",
      "The relics are not pleased with your choice.",
    ];

    await msg.edit({
      embeds: [
        new EmbedBuilder()
          .setColor(won ? "#FFD700" : "#8B0000")
          .setTitle(won ? "🪙 YOU WIN! The coin lands!" : "🪙 You lose... The coin has spoken.")
          .setDescription(
            `${pickEmoji} You chose: **${pick.toUpperCase()}**\n` +
            `${resultEmoji} Result: **${result.toUpperCase()}**\n\n` +
            (won
              ? `✅ **+${bet.toLocaleString()} coins!**\n*${winLines[Math.floor(Math.random()*winLines.length)]}*`
              : `❌ **-${bet.toLocaleString()} coins!**\n*${loseLines[Math.floor(Math.random()*loseLines.length)]}*`)
          )
          .addFields(
            { name: "💸 Bet",     value: `${bet.toLocaleString()} coins`,              inline: true },
            { name: won ? "✅ Won" : "❌ Lost", value: `${bet.toLocaleString()} coins`, inline: true },
            { name: "💰 Balance", value: `**${user.coins.toLocaleString()} coins**`,    inline: true },
          )
          .setFooter({ text: "🪙 wow!cf heads <bet> | wow!cf tails <bet>" })
          .setTimestamp(),
      ],
    });
  },
};
