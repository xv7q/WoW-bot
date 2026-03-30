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
        `*The spirits of ancient relics guide your path...*\n\n**Prefix:** \`${client.getPrefix(message.guildId)}\` (change with \`setprefix\`)`
      )
      .addFields(
        {
          name: "🏺 __Relic Commands__",
          value: [
            "`hunt` / `wh` — Hunt for ancient relics",
            "`relics` / `wr` — View your relic collection",
            "`equip <id>` — Equip a relic for power",
            "`sell <id>` — Sell a relic for coins",
            "`inspect <id>` — Inspect a relic's details",
          ].join("\n"),
        },
        {
          name: "💰 __Economy Commands__",
          value: [
            "`balance` / `wb` — Check your Ancient Coins",
            "`daily` / `wd` — Claim daily reward",
            "`coinflip` / `cf` `<h/t> <bet>` — Flip a coin!",
            "`slots` / `ws` `<bet>` — Spin the slot machine!",
            "`leaderboard` / `lb` — Top hunters",
            "`give <@user> <amount>` — Gift coins",
          ].join("\n"),
        },
        {
          name: "⚔️ __RPG Commands__",
          value: [
            "`profile` / `wp` — Your hunter profile",
            "`level` — Check XP and level",
            "`duel <@user>` — Challenge someone",
          ].join("\n"),
        },
        {
          name: "😄 __Fun Commands__",
          value: [
            "`wow` — WOW reaction",
            "`pat <@user>` — Pat someone",
            "`hug <@user>` — Hug someone",
            "`8ball <question>` — Ask the relic oracle",
            "`roll <NdN>` — Roll dice",
            "`setprefix <prefix>` — Change prefix (Admin)",
          ].join("\n"),
        }
      )
      .setFooter({ text: "WOW Bot • Ancient Relic System" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
