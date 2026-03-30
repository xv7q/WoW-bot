const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "roll",
  description: "Roll dice (e.g. wow!roll 2d6)",
  async execute(message, args) {
    const input = args[0] || "1d6";
    const match = input.match(/^(\d+)d(\d+)$/i);

    if (!match) return message.reply("🎲 Format: `wow!roll 2d6` (max 10d100)");

    let count = parseInt(match[1]);
    let sides = parseInt(match[2]);

    if (count > 10) count = 10;
    if (sides > 100) sides = 100;
    if (sides < 2) sides = 2;

    const rolls = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    const total = rolls.reduce((a, b) => a + b, 0);

    const embed = new EmbedBuilder()
      .setColor("#C9A84C")
      .setTitle("🎲 Ancient Dice Roll")
      .setDescription(
        `Rolling **${count}d${sides}**...\n\n` +
        `🎯 Results: **${rolls.join(", ")}**\n` +
        `📊 Total: **${total}**`
      )
      .setFooter({ text: `Rolled by ${message.author.username}` });

    message.reply({ embeds: [embed] });
  },
};
