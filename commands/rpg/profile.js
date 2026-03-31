const { EmbedBuilder } = require("discord.js");
const { getUser } = require("../../utils/database");
const { getRelicById, RARITY_COLORS, RARITY_EMOJI, RELICS } = require("../../utils/relics");

module.exports = {
  name: "profile",
  aliases: ["p", "wp", "me"],
  description: "View your hunter profile",
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const user = getUser(target.id);
    const equipped = user.equipped ? getRelicById(user.equipped) : null;
    const level = user.level || 1;
    const xp = user.xp || 0;
    const xpNeeded = level * 100 + 100;
    const pct = Math.floor((xp / xpNeeded) * 100);
    const filled = Math.floor((xp / xpNeeded) * 12);
    const bar = "▰".repeat(filled) + "▱".repeat(12 - filled);

    // Count rarities
    const owned = user.relics || [];
    const counts = { legendary: 0, epic: 0, rare: 0, uncommon: 0, common: 0 };
    for (const id of owned) {
      const r = RELICS.find(x => x.id === id);
      if (r) counts[r.rarity]++;
    }

    // Best relic
    const best = owned.reduce((best, id) => {
      const r = getRelicById(id);
      if (!r) return best;
      if (!best || r.power > best.power) return r;
      return best;
    }, null);

    const embedColor = equipped ? RARITY_COLORS[equipped.rarity] : "#C9A84C";

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setAuthor({ name: `${target.username} — Hunter Profile`, iconURL: target.displayAvatarURL() })
      .setThumbnail(target.displayAvatarURL())
      .setDescription(
        `\`\`\`\n` +
        `[${bar}] ${pct}%\n` +
        `XP: ${xp.toLocaleString()} / ${xpNeeded.toLocaleString()}\n` +
        `\`\`\``
      )
      .addFields(
        { name: "⚔️ Level",        value: `**${level}**`,                             inline: true },
        { name: "💰 Coins",        value: `**${(user.coins||0).toLocaleString()}**`,   inline: true },
        { name: "📦 Relics",       value: `**${owned.length}**`,                       inline: true },
        { name: "🔥 Daily Streak", value: `**${user.dailyStreak || 0}** days`,         inline: true },
        { name: "🟧 Legendary",    value: `**${counts.legendary}**`,                   inline: true },
        { name: "🟪 Epic",         value: `**${counts.epic}**`,                        inline: true },
        { name: "🔮 Equipped",
          value: equipped
            ? `${equipped.emoji} **${equipped.name}** ${RARITY_EMOJI[equipped.rarity]}\n*(+${equipped.power} power)*`
            : "*Nothing equipped*",
          inline: true,
        },
        { name: "🏆 Best Relic",
          value: best
            ? `${best.emoji} **${best.name}** *(⚡${best.power})*`
            : "*No relics yet*",
          inline: true,
        },
      )
      .setFooter({ text: "hunt • daily • relics info • equip <id>" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
