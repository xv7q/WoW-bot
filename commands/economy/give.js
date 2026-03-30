const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");

module.exports = {
  name: "give",
  aliases: ["pay", "transfer"],
  description: "Give coins to someone",
  async execute(message, args) {
    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target || isNaN(amount) || amount <= 0) {
      return message.reply("Usage: `wow!give @user <amount>`");
    }
    if (target.id === message.author.id) {
      return message.reply("❌ You can't give yourself coins!");
    }
    if (target.bot) {
      return message.reply("❌ Bots don't need ancient coins!");
    }

    const sender = getUser(message.author.id);
    if ((sender.coins || 0) < amount) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#8B0000")
            .setDescription(`❌ Not enough coins! You have **${sender.coins || 0}** coins.`),
        ],
      });
    }

    const receiver = getUser(target.id);
    sender.coins -= amount;
    receiver.coins = (receiver.coins || 0) + amount;

    saveUser(message.author.id, sender);
    saveUser(target.id, receiver);

    const embed = new EmbedBuilder()
      .setColor("#4CAF50")
      .setTitle("💸 Ancient Coin Transfer")
      .setDescription(
        `**${message.author.username}** gifted **${amount} coins** to **${target.username}**!\n` +
        `*The spirits of generosity smile upon you*`
      )
      .addFields(
        { name: `${message.author.username}'s Balance`, value: `${sender.coins} coins`, inline: true },
        { name: `${target.username}'s Balance`, value: `${receiver.coins} coins`, inline: true },
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
