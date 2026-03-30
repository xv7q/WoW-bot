const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "setprefix",
  aliases: ["prefix"],
  description: "Change the bot prefix for this server",
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#8B0000")
            .setDescription("❌ You need **Manage Server** permission to change the prefix!"),
        ],
      });
    }

    const newPrefix = args[0];
    if (!newPrefix) {
      const current = client.getPrefix(message.guildId);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#C9A84C")
            .setDescription(`🏺 Current prefix: \`${current}\`\n\nUsage: \`${current}setprefix w\``),
        ],
      });
    }

    if (newPrefix.length > 5) {
      return message.reply("❌ Prefix must be 5 characters or less!");
    }

    client.savePrefix(message.guildId, newPrefix);

    const embed = new EmbedBuilder()
      .setColor("#4CAF50")
      .setTitle("✅ Prefix Updated!")
      .setDescription(
        `Bot prefix changed to \`${newPrefix}\`\n\n` +
        `Now use \`${newPrefix}help\` to see all commands!\n` +
        `Example hunt: \`${newPrefix}hunt\` or \`${newPrefix}h\``
      );

    message.reply({ embeds: [embed] });
  },
};
