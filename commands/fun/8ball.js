const { EmbedBuilder } = require("discord.js");

const ANSWERS = [
  { text: "👁️ The Eye of Gods sees: **YES**",             color: "#4CAF50", type: "yes" },
  { text: "🏺 The Ancient Spirits confirm: **ABSOLUTELY**", color: "#4CAF50", type: "yes" },
  { text: "⚡ The Thunder Axe strikes: **DEFINITELY YES**", color: "#4CAF50", type: "yes" },
  { text: "👑 The Crown of Ages decrees: **IT IS SO**",     color: "#4CAF50", type: "yes" },
  { text: "✨ The relics sing: **WITHOUT A DOUBT**",        color: "#4CAF50", type: "yes" },
  { text: "🌌 The Void shows: **PERHAPS...**",              color: "#FF9800", type: "maybe" },
  { text: "🧭 The Compass spins: **UNCLEAR PATH**",         color: "#FF9800", type: "maybe" },
  { text: "⏳ The Hourglass says: **ASK AGAIN LATER**",    color: "#FF9800", type: "maybe" },
  { text: "🌀 The Oracle is clouded: **CANNOT TELL**",     color: "#FF9800", type: "maybe" },
  { text: "💀 The Crystal Skull rattles: **NO**",           color: "#FF1744", type: "no" },
  { text: "🌑 The shadows whisper: **DEFINITELY NOT**",    color: "#FF1744", type: "no" },
  { text: "☠️ The Scythe falls: **THE SPIRITS FORBID IT**", color: "#FF1744", type: "no" },
  { text: "🗿 The Idol is silent: **DON'T COUNT ON IT**",  color: "#FF1744", type: "no" },
];

module.exports = {
  name: "8ball",
  aliases: ["oracle", "ask"],
  description: "Ask the Ancient Relic Oracle anything!",
  async execute(message, args) {
    if (!args.length) return message.reply("🔮 Usage: `8ball <question>`");
    const q = args.join(" ");
    const a = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    const typeEmoji = { yes: "✅", maybe: "🤔", no: "❌" };

    message.reply({
      embeds: [new EmbedBuilder()
        .setColor(a.color)
        .setTitle("🔮 The Ancient Oracle Speaks")
        .addFields(
          { name: "❓ Question", value: q },
          { name: `${typeEmoji[a.type]} Oracle's Answer`, value: a.text },
        )
        .setFooter({ text: "The ancient relics never lie... mostly" })
        .setTimestamp()],
    });
  },
};
