const { EmbedBuilder } = require("discord.js");
const { getAllUsers } = require("../../utils/database");

module.exports = {
  name: "leaderboard",
  aliases: ["lb", "top", "rankings"],
  description: "Top relic hunters",
  async execute(message, args) {
    const type = args[0] || "coins";
    const allUsers = getAllUsers();

    let sorted;
    let title;

    if (type === "relics" || type === "r") {
      sorted = Object.entries(allUsers)
        .map(([id, u]) => ({ id, value: (u.relics || []).length, coins: u.coins || 0 }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
      title = "🏺 Top Relic Collectors";
    } else if (type === "level" || type === "l" || type === "xp") {
      sorted = Object.entries(allUsers)
        .map(([id, u]) => ({ id, value: u.level || 1, xp: u.xp || 0 }))
        .sort((a, b) => b.value - a.value || b.xp - a.xp)
        .slice(0, 10);
      title = "⚔️ Top Relic Hunters by Level";
    } else {
      sorted = Object.entries(allUsers)
        .map(([id, u]) => ({ id, value: u.coins || 0 }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
      title = "💰 Wealthiest Ancient Collectors";
    }

    const medals = ["🥇", "🥈", "🥉"];
    const lines = await Promise.all(
      sorted.map(async (entry, i) => {
        let name = `<@${entry.id}>`;
        const medal = medals[i] || `**${i + 1}.**`;
        const val =
          type === "relics" || type === "r"
            ? `${entry.value} relics`
            : type === "level" || type === "l" || type === "xp"
            ? `Level ${entry.value}`
            : `${entry.value} coins`;
        return `${medal} ${name} — ${val}`;
      })
    );

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle(title)
      .setDescription(lines.join("\n") || "*No data yet!*")
      .setFooter({ text: "wow!lb coins | wow!lb relics | wow!lb level" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
