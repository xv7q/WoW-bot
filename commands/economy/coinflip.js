const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");

const FRAMES = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒"];

module.exports = {
  name: "coinflip",
  aliases: ["cf", "wcf", "flip", "ocf"],
  description: "Flip a coin — bet to win 2x!",
  async execute(message, args) {
    const user = getUser(message.author.id);

    // Parse: cf 500  OR  cf heads 500  OR  cf h 500  OR  cf all
    let pick = null;
    let betStr = null;

    if (!args[0]) {
      return message.reply({
        embeds: [new EmbedBuilder().setColor("#C9A84C")
          .setTitle("🪙 Ancient Coin Flip")
          .setDescription(
            "**Usage:**\n" +
            "`cf <bet>` — random side\n" +
            "`cf heads <bet>` or `cf h <bet>` — pick heads\n" +
            "`cf tails <bet>` or `cf t <bet>` — pick tails\n" +
            "`cf all` — bet everything!\n\n" +
            `💰 Balance: **${(user.coins||0).toLocaleString()} coins**`
          )],
      });
    }

    const a0 = args[0].toLowerCase();
    const a1 = (args[1] || "").toLowerCase();

    if (a0 === "heads" || a0 === "h") { pick = "heads"; betStr = a1; }
    else if (a0 === "tails" || a0 === "t") { pick = "tails"; betStr = a1; }
    else { betStr = a0; } // no side given → random

    let bet;
    if (betStr === "all" || betStr === "max") bet = Math.min(user.coins || 0, 100000);
    else bet = parseInt(betStr);

    if (isNaN(bet) || bet <= 0) return message.reply("❌ Invalid bet amount!");
    if (bet > 100000) return message.reply("❌ Max bet is **100,000 coins**!");
    if ((user.coins || 0) < bet) return message.reply(`❌ You only have **${(user.coins||0).toLocaleString()}** coins!`);

    // If no pick → random
    if (!pick) pick = Math.random() < 0.5 ? "heads" : "tails";

    const result = Math.random() < 0.5 ? "heads" : "tails";
    const won = pick === result;

    // ── ANIMATION ──
    const msg = await message.reply({
      embeds: [new EmbedBuilder().setColor("#555555")
        .setTitle("🪙 Flipping the Ancient Coin...")
        .setDescription(`> You chose: **${pick.toUpperCase()}**\n> Bet: **${bet.toLocaleString()} coins**\n\n${FRAMES[0]}  *spinning...*`)],
    });

    for (let i = 1; i < FRAMES.length; i++) {
      await new Promise(r => setTimeout(r, 160));
      const phrases = ["spinning..","turning..","ancient magic decides..","almost..","the relic gods choose..","final spin..","landing..","it falls..","nearly..","result!"];
      await msg.edit({
        embeds: [new EmbedBuilder().setColor("#777777")
          .setTitle("🪙 Flipping the Ancient Coin...")
          .setDescription(`> You chose: **${pick.toUpperCase()}**\n> Bet: **${bet.toLocaleString()} coins**\n\n${FRAMES[i]}  *${phrases[i]}*`)],
      });
    }

    await new Promise(r => setTimeout(r, 400));

    if (won) user.coins = (user.coins || 0) + bet;
    else user.coins = (user.coins || 0) - bet;
    saveUser(message.author.id, user);

    const resultEmoji = result === "heads" ? "🟡" : "⚫";
    const pickEmoji   = pick   === "heads" ? "🟡" : "⚫";
    const winMsgs = ["The ancient spirits bless you! 🙌", "Fortune favors the bold! ✨", "The relic gods smile upon you! 🏺"];
    const loseMsgs = ["The relics are displeased... 😔", "Ancient curse activated! 💀", "The coin laughs at your loss... :c"];

    await msg.edit({
      embeds: [new EmbedBuilder()
        .setColor(won ? "#00E676" : "#FF1744")
        .setTitle(won ? "🪙 ✅ YOU WIN!" : "🪙 ❌ You lose...")
        .setDescription(
          `${pickEmoji} You picked: **${pick.toUpperCase()}**\n` +
          `${resultEmoji} Result: **${result.toUpperCase()}**\n\n` +
          (won
            ? `### +${bet.toLocaleString()} coins!\n*${winMsgs[Math.floor(Math.random()*winMsgs.length)]}*`
            : `### -${bet.toLocaleString()} coins\n*${loseMsgs[Math.floor(Math.random()*loseMsgs.length)]}*`)
        )
        .addFields(
          { name: "💸 Bet",     value: `${bet.toLocaleString()}`,          inline: true },
          { name: won?"✅ Won":"❌ Lost", value: `${bet.toLocaleString()}`, inline: true },
          { name: "💰 Balance", value: `**${user.coins.toLocaleString()}**`,inline: true },
        )
        .setFooter({ text: `${message.author.username} • coinflip` })
        .setTimestamp()],
    });
  },
};
