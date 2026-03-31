const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "slap",
  description: "Slap someone!",
  async execute(message, args) {
    const t = message.mentions.users.first();
    if (!t) return message.reply("Usage: `slap @user`");
    if (t.id === message.author.id) return message.reply({ embeds: [new EmbedBuilder().setColor("#FF1744").setDescription("💀 Why are you slapping yourself..?")] });
    const msgs = [
      `👋 **${message.author.username}** SLAPS **${t.username}** with the Thunder Axe Fragment!\n*CRACK! The ruins echo!*`,
      `🥊 **${message.author.username}** delivers an ancient smackdown to **${t.username}**!\n*The Crystal Skull rattles!*`,
    ];
    message.reply({ embeds: [new EmbedBuilder().setColor("#FF1744")
      .setDescription(msgs[Math.floor(Math.random()*msgs.length)]).setTimestamp()] });
  },
};
