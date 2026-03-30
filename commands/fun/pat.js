const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "pat",
  description: "Pat someone!",
  async execute(message, args) {
    const target = message.mentions.users.first();
    if (!target) return message.reply("👋 Mention someone to pat! `wow!pat @user`");

    const msgs = [
      `🤝 **${message.author.username}** pats **${target.username}** gently\n*The ancient relic blesses this moment~*`,
      `✨ **${message.author.username}** gives **${target.username}** a wholesome pat!\n*The spirits smile upon you both*`,
      `🏺 **${message.author.username}** pats **${target.username}**\n*Even the Crystal Skull approves*`,
    ];

    const embed = new EmbedBuilder()
      .setColor("#FFB6C1")
      .setDescription(msgs[Math.floor(Math.random() * msgs.length)])
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
