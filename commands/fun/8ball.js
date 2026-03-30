const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "8ball",
  aliases: ["oracle", "ask"],
  description: "Ask the Relic Oracle",
  async execute(message, args) {
    if (!args.length) return message.reply("🔮 Ask a question! `wow!8ball will I find a legendary relic?`");

    const question = args.join(" ");
    const answers = [
      { text: "👁️ The Eye of Gods says: **YES**", color: "#4CAF50" },
      { text: "🏺 The Ancient Spirits confirm: **ABSOLUTELY**", color: "#4CAF50" },
      { text: "⚡ The Thunder Axe strikes: **DEFINITELY YES**", color: "#4CAF50" },
      { text: "👑 The Crown of Ages decrees: **IT IS SO**", color: "#4CAF50" },
      { text: "🌌 The Void Gem shows: **PERHAPS...**", color: "#FF9800" },
      { text: "🧭 The Infinity Compass spins: **UNCERTAIN PATH**", color: "#FF9800" },
      { text: "🔮 The Oracle is clouded: **ASK AGAIN LATER**", color: "#FF9800" },
      { text: "💀 The Crystal Skull rattles: **NO**", color: "#F44336" },
      { text: "🌑 The shadows say: **DEFINITELY NOT**", color: "#F44336" },
      { text: "⚰️ The tomb echoes: **THE SPIRITS FORBID IT**", color: "#F44336" },
    ];

    const answer = answers[Math.floor(Math.random() * answers.length)];

    const embed = new EmbedBuilder()
      .setColor(answer.color)
      .setTitle("🔮 The Relic Oracle Speaks")
      .addFields(
        { name: "Your Question", value: question },
        { name: "Oracle's Answer", value: answer.text }
      )
      .setFooter({ text: "The ancient relics never lie... mostly" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
