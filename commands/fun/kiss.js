const { EmbedBuilder } = require("discord.js");

function actionEmbed(color, text) {
  return { embeds: [new EmbedBuilder().setColor(color).setDescription(text).setTimestamp()] };
}

// KISS
module.exports = {
  name: "kiss",
  description: "Kiss someone!",
  async execute(message, args) {
    const t = message.mentions.users.first();
    if (!t) return message.reply("Usage: `kiss @user`");
    const msgs = [
      `💋 **${message.author.username}** gives **${t.username}** a gentle kiss!\n*The Phoenix Feather warms the moment~*`,
      `😘 **${message.author.username}** kisses **${t.username}**!\n*Ancient love magic activates!*`,
    ];
    message.reply(actionEmbed("#FF69B4", msgs[Math.floor(Math.random()*msgs.length)]));
  },
};
