const { EmbedBuilder } = require("discord.js");

// ---- WOW ----
module.exports = {
  name: "wow",
  description: "WOW!",
  async execute(message) {
    const wows = [
      "✨ **W O W** ✨\n*The relics tremble at your amazement!*",
      "🏺 **WOW!** The ancient spirits are impressed!",
      "⚡ **WOW!** Even the legendary Crown of Ages bows!",
      "👁️ **W O W** — The Eye of Gods has seen your reaction!",
      "🌌 **WOW!!!** The Void Gem glows brighter!",
    ];
    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setDescription(wows[Math.floor(Math.random() * wows.length)])
      .setFooter({ text: `Wowed by ${message.author.username}` });
    message.reply({ embeds: [embed] });
  },
};
