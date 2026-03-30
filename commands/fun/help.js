const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h", "commands"],
  description: "All WOW Bot commands",
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor("#C9A84C")
      .setTitle("🏺 WOW Bot — Ancient Relic Hunter")
      .setDescription(
        "*The spirits of ancient relics guide your path...*\n\n**Prefix:** `wow!`"
      )
      .addFields(
        {
          name: "🏺 __Relic Commands__",
          value: [
            "`wow!hunt` — Hunt for ancient relics",
            "`wow!relics` — View your relic collection",
            "`wow!equip <id>` — Equip a relic for power",
            "`wow!sell <id>` — Sell a relic for coins",
            "`wow!inspect <id>` — Inspect a relic's details",
          ].join("\n"),
        },
        {
          name: "💰 __Economy Commands__",
          value: [
            "`wow!balance` — Check your Ancient Coins",
            "`wow!daily` — Claim daily reward",
            "`wow!leaderboard` — Top hunters",
            "`wow!give <@user> <amount>` — Gift coins",
          ].join("\n"),
        },
        {
          name: "⚔️ __RPG Commands__",
          value: [
            "`wow!profile` — Your hunter profile",
            "`wow!level` — Check XP and level",
            "`wow!duel <@user>` — Challenge someone",
          ].join("\n"),
        },
        {
          name: "😄 __Fun Commands__",
          value: [
            "`wow!wow` — WOW reaction",
            "`wow!pat <@user>` — Pat someone",
            "`wow!hug <@user>` — Hug someone",
            "`wow!8ball <question>` — Ask the relic oracle",
            "`wow!roll <NdN>` — Roll dice",
          ].join("\n"),
        }
      )
      .setFooter({ text: "WOW Bot • Ancient Relic System" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
