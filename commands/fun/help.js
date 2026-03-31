const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h", "commands", "cmds", "whelp"],
  description: "All WOW Bot commands",
  async execute(message, args, client) {
    const p = client.getPrefix(message.guildId);

    if (args[0]) {
      const cmd = client.commands.get(args[0].toLowerCase());
      if (!cmd) return message.reply({ embeds: [new EmbedBuilder().setColor("#FF1744")
        .setDescription(`❌ Unknown command: \`${args[0]}\`\nUse \`${p}help\` for full list.`)] });
      const aliases = [...new Set(cmd.aliases || [])];
      return message.reply({ embeds: [new EmbedBuilder().setColor("#C9A84C")
        .setTitle(`🏺 ${p}${cmd.name}`)
        .setDescription(cmd.description || "No description.")
        .addFields(
          { name: "📝 Usage",   value: `\`${p}${cmd.name}\``,                                      inline: true },
          { name: "🔗 Aliases", value: aliases.length ? aliases.map(a=>`\`${a}\``).join(" ") : "—", inline: true },
        )
        .setFooter({ text: `${p}help for full list` })] });
    }

    message.reply({
      embeds: [new EmbedBuilder()
        .setColor("#C9A84C")
        .setAuthor({ name: "WOW Bot — Ancient Relic Hunter", iconURL: message.client.user.displayAvatarURL() })
        .setDescription(
          `✨ **Here is the list of commands!**\nFor more info: \`${p}help <command>\`\n\n` +
          `**Prefix:** \`${p}\`  *(change: \`${p}setprefix <new>\`)*`
        )
        .addFields(
          { name: "🏅 Rankings",
            value: "`top` `leaderboard` `lb` `rankings`" },
          { name: "💰 Economy",
            value: "`balance` `bal` `wb` `ocash`\n`daily` `wd` `claim`\n`give` `pay` `transfer`" },
          { name: "🏺 Relics",
            value: "`hunt` `wh` `h` `search` `dig`\n`relics` `wr` `zoo` `oz` `inv` `bag`\n`relics info` — see all IDs!\n`sell` • `equip` • `inspect` `info`" },
          { name: "🎲 Gambling",
            value: "`slots` `ws` `spin` `os`\n`coinflip` `cf` `ocf` `flip`\n`blackjack` `bj` `wbj` `21`\n`lottery` `lot` `lotto`" },
          { name: "⚔️ RPG",
            value: "`profile` `wp` `p` `me`\n`duel` `battle` `fight`" },
          { name: "😄 Fun & Social",
            value: "`wow` • `pat` • `hug` • `kiss`\n`poke` • `slap`\n`8ball` `oracle` `ask`\n`roll`" },
          { name: "🔧 Utility",
            value: "`setprefix` • `help` `h` `cmds` `whelp`" },
          { name: "⚡ Quick Aliases",
            value: "```\nwh=hunt  wr=relics  wb=balance\nwp=profile  wd=daily  ws=slots\ncf=coinflip  bj=blackjack  lb=leaderboard```" },
        )
        .setFooter({ text: `WOW Bot • ${p}help <cmd> for details • Prefix: ${p}`, iconURL: message.client.user.displayAvatarURL() })
        .setTimestamp()],
    });
  },
};
