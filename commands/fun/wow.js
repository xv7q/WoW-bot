const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "wow",
  description: "WOW!",
  async execute(message) {
    const wows = [
      { text: "# W • O • W\n*The ancient relics tremble at your amazement!*", color: "#FFD700" },
      { text: "# ✨ WOW! ✨\n*The Crystal Skull glows at your reaction!*",      color: "#9C27B0" },
      { text: "# 🌍 W O W 🌍\n*Even the World Shard is impressed!*",            color: "#FF4444" },
      { text: "# 👑 WOW!!!\n*The Crown of Ages bows before you!*",              color: "#FF9800" },
      { text: "# 🔮 wow...\n*The Void Gem pulses with your energy!*",           color: "#2196F3" },
    ];
    const w = wows[Math.floor(Math.random() * wows.length)];
    message.reply({
      embeds: [new EmbedBuilder().setColor(w.color).setDescription(w.text)
        .setFooter({ text: `Wowed by ${message.author.username}` })],
    });
  },
};
