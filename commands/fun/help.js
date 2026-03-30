const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h", "commands", "cmds"],
  description: "All WOW Bot commands",
  async execute(message, args, client) {
    const p = client.getPrefix(message.guildId);

    // Specific command help
    if (args[0]) {
      const cmd = client.commands.get(args[0].toLowerCase());
      if (!cmd) return message.reply(`❌ Unknown command: \`${args[0]}\``);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#C9A84C")
            .setTitle(`🏺 Command: ${p}${cmd.name}`)
            .setDescription(cmd.description || "No description.")
            .addFields(
              cmd.aliases?.length ? { name: "Aliases", value: cmd.aliases.map(a => `\`${p}${a}\``).join(", ") } : []
            )
            .setFooter({ text: `Prefix: ${p} • wow!help <command> for details` }),
        ],
      });
    }

    const embed = new EmbedBuilder()
      .setColor("#C9A84C")
      .setAuthor({ name: "WOW Bot — Ancient Relic Hunter", iconURL: message.client.user.displayAvatarURL() })
      .setDescription(
        `Here is the list of commands!\nFor more info: \`${p}help <command>\`\n\n` +
        `**Prefix:** \`${p}\` *(change with \`${p}setprefix\`)*`
      )
      .addFields(
        {
          name: "🏅 Rankings",
          value: "`top` `leaderboard` `lb`",
        },
        {
          name: "💰 Economy",
          value: "`balance` `wb` `ocash` • `daily` `wd` • `give` • `hunt` `wh`\n`relics` `wr` • `sell` • `equip` • `inspect`",
        },
        {
          name: "🎲 Gambling",
          value: "`slots` `ws` `spin` • `coinflip` `cf` `ocf` • `blackjack` `bj`",
        },
        {
          name: "⚔️ RPG",
          value: "`profile` `wp` • `level` • `duel`",
        },
        {
          name: "😄 Fun",
          value: "`wow` • `pat` • `hug` • `8ball` • `roll` • `setprefix`",
        },
        {
          name: "📖 Short Aliases (works after prefix change too!)",
          value: [
            "`wh` = hunt  •  `wr` = relics  •  `wb` = balance",
            "`wp` = profile  •  `wd` = daily  •  `ws` = slots",
            "`cf` = coinflip  •  `bj` = blackjack  •  `lb` = leaderboard",
          ].join("\n"),
        }
      )
      .setFooter({ text: `WOW Bot • ${p}help <cmd> for details • Prefix: ${p}` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
