const { EmbedBuilder } = require("discord.js");
const { getAllUsers } = require("../../utils/database");

module.exports = {
  name: "leaderboard",
  aliases: ["lb", "top", "rankings"],
  description: "Top ancient relic hunters",
  async execute(message, args) {
    const type = (args[0] || "coins").toLowerCase();
    const all = getAllUsers();

    let sorted, title, valueFn;
    if (type === "relics" || type === "r") {
      sorted = Object.entries(all).map(([id,u]) => ({ id, v: (u.relics||[]).length })).sort((a,b)=>b.v-a.v).slice(0,10);
      title = "🏺 Top Relic Collectors";
      valueFn = e => `${e.v} relics`;
    } else if (type === "level" || type === "l") {
      sorted = Object.entries(all).map(([id,u]) => ({ id, v: u.level||1, xp: u.xp||0 })).sort((a,b)=>b.v-a.v||b.xp-a.xp).slice(0,10);
      title = "⚔️ Top Hunters by Level";
      valueFn = e => `Level ${e.v}`;
    } else {
      sorted = Object.entries(all).map(([id,u]) => ({ id, v: u.coins||0 })).sort((a,b)=>b.v-a.v).slice(0,10);
      title = "💰 Wealthiest Ancient Collectors";
      valueFn = e => `${e.v.toLocaleString()} coins`;
    }

    const medals = ["🥇", "🥈", "🥉"];
    const ranks  = ["④","⑤","⑥","⑦","⑧","⑨","⑩"];
    const maxVal = sorted[0]?.v || 1;

    const lines = sorted.map((e, i) => {
      const medal = medals[i] || ranks[i-3] || `**${i+1}.**`;
      const bar = "▰".repeat(Math.max(1, Math.floor((e.v / maxVal) * 8)));
      return `${medal} <@${e.id}>\n> \`${bar}\` ${valueFn(e)}`;
    });

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle(title)
      .setDescription(lines.join("\n\n") || "*No data yet — start hunting!*")
      .setFooter({ text: "lb coins • lb relics • lb level" })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
