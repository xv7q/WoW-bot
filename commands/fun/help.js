const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h", "commands", "cmds", "whelp"],
  description: "All WOW Bot commands",
  async execute(message, args, client) {
    const p = client.getPrefix(message.guildId);

    // Specific command help
    if (args[0]) {
      const cmd = client.commands.get(args[0].toLowerCase());
      if (!cmd) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#8B0000")
              .setDescription(`❌ Unknown command: \`${args[0]}\`\nUse \`${p}help\` to see all commands.`),
          ],
        });
      }
      const aliases = [...new Set(cmd.aliases || [])];
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#C9A84C")
            .setTitle(`🏺 Command Info: ${p}${cmd.name}`)
            .setDescription(cmd.description || "No description.")
            .addFields(
              { name: "Usage", value: `\`${p}${cmd.name}\``, inline: true },
              aliases.length
                ? { name: "Aliases", value: aliases.map(a => `\`${p}${a}\``).join(" "), inline: true }
                : { name: "\u200b", value: "\u200b", inline: true }
            )
            .setFooter({ text: `Prefix: ${p} • ${p}help for full list` }),
        ],
      });
    }

    // Full command list — OWO style
    const embed = new EmbedBuilder()
      .setColor("#C9A84C")
      .setAuthor({
        name: "WOW Bot — Ancient Relic Hunter",
        iconURL: message.client.user.displayAvatarURL(),
      })
      .setDescription(
        `✨ Here is the list of commands!\n` +
        `For more info: \`${p}help <command>\`\n\n` +
        `**Prefix:** \`${p}\` *(change: \`${p}setprefix <new>\`)*`
      )
      .addFields(
        {
          name: "🏅 Rankings",
          value: "`top` `leaderboard` `lb` `rankings`",
        },
        {
          name: "💰 Economy",
          value:
            "`balance` `bal` `wb` `ocash` `cash`\n" +
            "`daily` `wd` `claim`\n" +
            "`give` `pay` `transfer`",
        },
        {
          name: "🏺 Relics (like OWO Animals!)",
          value:
            "`hunt` `wh` `h` `search` `dig`\n" +
            "`relics` `wr` `zoo` `oz` `inv` `bag`\n" +
            "`sell` • `equip` • `inspect` `info`",
        },
        {
          name: "🎲 Gambling",
          value:
            "`slots` `ws` `spin` `os`\n" +
            "`coinflip` `cf` `ocf` `flip`\n" +
            "`blackjack` `bj` `wbj` `21`\n" +
            "`lottery` `lot` `lotto`",
        },
        {
          name: "⚔️ RPG",
          value:
            "`profile` `wp` `p` `me`\n" +
            "`duel` `battle` `fight`",
        },
        {
          name: "😄 Fun",
          value:
            "`wow`\n" +
            "`pat` • `hug` • `kiss` *(coming soon)*\n" +
            "`8ball` `oracle` `ask`\n" +
            "`roll`",
        },
        {
          name: "🔧 Utility",
          value:
            "`setprefix` `prefix`\n" +
            "`help` `h` `cmds` `whelp`",
        },
        {
          name: "⚡ Quick Aliases Sheet",
          value:
            "```\n" +
            "wh  = hunt      wr  = relics    wb  = balance\n" +
            "wp  = profile   wd  = daily     ws  = slots\n" +
            "cf  = coinflip  bj  = blackjack lb  = leaderboard\n" +
            "oz  = zoo/relics  ocash = balance  ocf = coinflip\n" +
            "```",
        }
      )
      .setFooter({
        text: `WOW Bot • ${p}help <cmd> for details • Prefix: ${p}`,
        iconURL: message.client.user.displayAvatarURL(),
      })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
