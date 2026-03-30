const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "hug",
  description: "Hug someone!",
  async execute(message, args) {
    const target = message.mentions.users.first();
    if (!target) return message.reply("🤗 Mention someone to hug! `wow!hug @user`");
    if (target.id === message.author.id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF69B4")
            .setDescription("🫂 *You hug yourself... The Void Gem feels your loneliness and glows warmly*"),
        ],
      });
    }

    const msgs = [
      `🫂 **${message.author.username}** gives **${target.username}** a warm hug!\n*The Phoenix Feather warms both your hearts~*`,
      `💕 **${message.author.username}** wraps **${target.username}** in an ancient embrace!\n*The spirits of the relics approve*`,
      `🌸 **${message.author.username}** hugs **${target.username}**!\n*Even the Dragon Tooth feels the warmth*`,
    ];

    const embed = new EmbedBuilder()
      .setColor("#FF69B4")
      .setDescription(msgs[Math.floor(Math.random() * msgs.length)])
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
