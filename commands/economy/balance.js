const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser, getAllUsers } = require("../../utils/database");

module.exports = {
  name: "balance",
  aliases: ["bal", "coins", "wallet"],
  description: "Check your Ancient Coins",
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const user = getUser(target.id);

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("💰 Ancient Treasury")
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: "👤 Hunter", value: target.username, inline: true },
        { name: "🪙 Ancient Coins", value: `**${user.coins || 0}**`, inline: true },
        { name: "📦 Relics Owned", value: `**${(user.relics || []).length}**`, inline: true },
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
