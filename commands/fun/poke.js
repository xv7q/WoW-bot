const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "poke",
  description: "Poke someone!",
  async execute(message, args) {
    const t = message.mentions.users.first();
    if (!t) return message.reply("Usage: `poke @user`");
    const msgs = [
      `👉 **${message.author.username}** pokes **${t.username}**!\n*Hey! The ancient spirits noticed!*`,
      `☝️ **${message.author.username}** pokes **${t.username}** repeatedly...\n*The Void Gem vibrates in annoyance*`,
    ];
    message.reply({ embeds: [new EmbedBuilder().setColor("#FFA726")
      .setDescription(msgs[Math.floor(Math.random()*msgs.length)]).setTimestamp()] });
  },
};
