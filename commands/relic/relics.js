const { EmbedBuilder } = require("discord.js");
const { getUser } = require("../../utils/database");
const { RELICS, RARITY_EMOJI, RARITY_COLORS } = require("../../utils/relics");

const TIERS = [
  { key: "legendary", label: "L", icon: "🟧" },
  { key: "epic",      label: "E", icon: "🟪" },
  { key: "rare",      label: "R", icon: "🟦" },
  { key: "uncommon",  label: "U", icon: "🟩" },
  { key: "common",    label: "C", icon: "⬜" },
];

module.exports = {
  name: "relics",
  aliases: ["collection", "wr", "bag", "inv", "inventory", "zoo", "oz"],
  description: "View your relic collection. Use `relics info` to see all IDs!",
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const user = getUser(target.id);
    const owned = user.relics || [];

    // ── INFO MODE: relics info or wwr info ──
    // Shows every relic with emoji + name + id
    if (args[0] === "info" || args[0] === "list" || args[0] === "ids") {
      const pages = [];
      for (const tier of TIERS) {
        const inTier = RELICS.filter(r => r.rarity === tier.key);
        if (inTier.length === 0) continue;

        const counts = {};
        for (const id of owned) counts[id] = (counts[id] || 0) + 1;

        const rows = inTier.map(r => {
          const has = counts[r.id] || 0;
          const owned_mark = has > 0 ? `✅ x${has}` : "❌";
          return `${r.emoji} **${r.name}**\n> ID: \`${r.id}\`  •  ${owned_mark}  •  ⚡${r.power}  •  🪙${r.value.toLocaleString()}`;
        }).join("\n\n");

        pages.push({ tier, rows });
      }

      const embed = new EmbedBuilder()
        .setColor("#C9A84C")
        .setTitle("📖 All Relics — ID Reference")
        .setDescription(
          "*All relics in the game. ✅ = you own it.*\n\n" +
          pages.map(p => `${p.tier.icon} **${p.tier.key.toUpperCase()}**\n${p.rows}`).join("\n\n─────────────────\n\n")
        )
        .setFooter({ text: "sell <id> • equip <id> • inspect <id>" })
        .setTimestamp();

      // Discord 4096 char limit — split if needed
      const desc = embed.data.description;
      if (desc.length > 4000) {
        // Send legendary+epic first, then rest
        const part1 = pages.slice(0,2).map(p => `${p.tier.icon} **${p.tier.key.toUpperCase()}**\n${p.rows}`).join("\n\n─────────────────\n\n");
        const part2 = pages.slice(2).map(p => `${p.tier.icon} **${p.tier.key.toUpperCase()}**\n${p.rows}`).join("\n\n─────────────────\n\n");

        await message.reply({ embeds: [
          new EmbedBuilder().setColor("#FF9800").setTitle("📖 All Relics — Legendary & Epic").setDescription("*All relics. ✅ = you own it.*\n\n" + part1).setFooter({ text: "Part 1/2" })
        ]});
        return message.channel.send({ embeds: [
          new EmbedBuilder().setColor("#2196F3").setTitle("📖 All Relics — Rare, Uncommon & Common").setDescription(part2).setFooter({ text: "Part 2/2 • sell <id> • equip <id>" })
        ]});
      }

      return message.reply({ embeds: [embed] });
    }

    // ── ZOO MODE (default) ──
    if (owned.length === 0) {
      return message.reply({
        embeds: [new EmbedBuilder().setColor("#444444")
          .setTitle("🕳️ Empty Vault!")
          .setDescription(`**${target.username}** hasn't found any relics!\nUse \`hunt\` to start your collection!`)],
      });
    }

    const counts = {};
    for (const id of owned) counts[id] = (counts[id] || 0) + 1;

    let zooText = "", totalPower = 0;
    const stats = {};

    for (const tier of TIERS) {
      const inTier = RELICS.filter(r => r.rarity === tier.key && counts[r.id]);
      stats[tier.label] = owned.filter(id => {
        const r = RELICS.find(x => x.id === id);
        return r && r.rarity === tier.key;
      }).length;

      if (inTier.length === 0) continue;

      const row = inTier.map(r => {
        totalPower += r.power * counts[r.id];
        return `${r.emoji}\`${String(counts[r.id]).padStart(2,"0")}\``;
      }).join(" ");

      zooText += `${tier.icon} **${tier.key.toUpperCase()}**\n${row}\n\n`;
    }

    const summary = TIERS.map(t => `${t.label}-${stats[t.label]||0}`).join(", ");
    const equipped = user.equipped ? RELICS.find(r => r.id === user.equipped) : null;
    let embedColor = RARITY_COLORS["common"];
    for (const tier of TIERS) { if (stats[tier.label] > 0) { embedColor = RARITY_COLORS[tier.key]; break; } }

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle(`🏺 ${target.username}'s Ancient Vault`)
      .setThumbnail(target.displayAvatarURL())
      .setDescription(
        `🌿 🏺 ✨ **${target.username}'s Relic Collection!** ✨ 🏺 🌿\n\n` +
        zooText +
        `**Relic Power: ${totalPower.toLocaleString()}**\n` +
        `> ${summary}`
      )
      .addFields(
        {
          name: "📊 Stats",
          value: `🟧 \`${stats["L"]||0}\`  🟪 \`${stats["E"]||0}\`  🟦 \`${stats["R"]||0}\`  🟩 \`${stats["U"]||0}\`  ⬜ \`${stats["C"]||0}\`  📦 **${owned.length} total**`,
        },
        {
          name: "🔮 Equipped",
          value: equipped
            ? `${equipped.emoji} **${equipped.name}** ${RARITY_EMOJI[equipped.rarity]} *(+${equipped.power} power)*`
            : "*Nothing — use `equip <id>`*",
          inline: true,
        },
        {
          name: "💡 Tip",
          value: "`relics info` to see all relic IDs",
          inline: true,
        },
      )
      .setFooter({ text: "hunt • sell <id> • equip <id> • relics info" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
