const { EmbedBuilder } = require("discord.js");
const { getUser } = require("../../utils/database");
const { getRelicById, RARITY_EMOJI, RARITY_COLORS } = require("../../utils/relics");

const TIERS = [
  { min: 0,      label: "🪨 Stone Seeker",        color: "#9E9E9E" },
  { min: 500,    label: "🪙 Coin Hoarder",         color: "#C9A84C" },
  { min: 2000,   label: "🗿 Idol Collector",       color: "#4CAF50" },
  { min: 5000,   label: "🔮 Orb Keeper",           color: "#9C27B0" },
  { min: 15000,  label: "🐉 Dragon Hoarder",       color: "#2196F3" },
  { min: 40000,  label: "👑 Crown Bearer",         color: "#FFD700" },
  { min: 100000, label: "🌍 World Shard Tycoon",   color: "#FF4444" },
];

function getTier(coins) {
  let t = TIERS[0];
  for (const tier of TIERS) { if (coins >= tier.min) t = tier; }
  return t;
}

function progressBar(val, max, len = 14) {
  const filled = Math.min(Math.floor((val / max) * len), len);
  return "▰".repeat(filled) + "▱".repeat(len - filled);
}

module.exports = {
  name: "balance",
  aliases: ["bal", "wb", "coins", "wallet", "cash", "ocash"],
  description: "Check your Ancient Coin treasury",
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const user = getUser(target.id);
    const coins = user.coins || 0;
    const tier = getTier(coins);
    const equipped = user.equipped ? getRelicById(user.equipped) : null;

    // Next tier progress
    const tierIdx = TIERS.findIndex(t => t.label === tier.label);
    const nextTier = TIERS[tierIdx + 1];
    const barMax = nextTier ? nextTier.min : coins;
    const barVal = nextTier ? Math.min(coins, nextTier.min) : coins;
    const bar = progressBar(barVal, barMax);
    const pct = nextTier ? Math.floor((coins / nextTier.min) * 100) : 100;

    const embed = new EmbedBuilder()
      .setColor(tier.color)
      .setAuthor({
        name: `${target.username} — Ancient Treasury`,
        iconURL: target.displayAvatarURL(),
      })
      .setDescription(
        `## ${tier.label}\n` +
        `\`\`\`\n${bar} ${pct}%\`\`\`` +
        (nextTier ? `*${(nextTier.min - coins).toLocaleString()} coins to **${nextTier.label}***` : `*MAX TIER ACHIEVED*`)
      )
      .addFields(
        { name: "🪙 Ancient Coins",  value: `\`\`\`fix\n${coins.toLocaleString()}\`\`\``,          inline: true },
        { name: "📦 Relics Owned",   value: `\`\`\`fix\n${(user.relics || []).length}\`\`\``,       inline: true },
        { name: "⚔️ Hunter Level",   value: `\`\`\`fix\nLv. ${user.level || 1}\`\`\``,             inline: true },
        { name: "🔮 Equipped Relic",
          value: equipped
            ? `${equipped.emoji} **${equipped.name}** ${RARITY_EMOJI[equipped.rarity]}\n*(+${equipped.power} power)*`
            : "*None — use `equip <id>`*",
          inline: true,
        },
        { name: "🔥 Daily Streak",   value: `**${user.dailyStreak || 0}** days 🗓️`, inline: true },
        { name: "💫 Total XP Earned",value: `**${((user.level||1) * 100 + (user.xp||0)).toLocaleString()}** xp`, inline: true },
      )
      .setFooter({ text: "daily • hunt • slots • coinflip • blackjack" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
