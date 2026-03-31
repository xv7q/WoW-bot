const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");

const SYMBOLS = [
  { emoji: "💀", name: "Skull",   weight: 25, mult: 0,   color: "#333333" },
  { emoji: "🪨", name: "Stone",   weight: 20, mult: 1.5, color: "#9E9E9E" },
  { emoji: "🪙", name: "Coin",    weight: 16, mult: 2,   color: "#FFD700" },
  { emoji: "🗿", name: "Idol",    weight: 12, mult: 3,   color: "#4CAF50" },
  { emoji: "🔮", name: "Orb",     weight: 9,  mult: 5,   color: "#9C27B0" },
  { emoji: "🐉", name: "Dragon",  weight: 5,  mult: 10,  color: "#2196F3" },
  { emoji: "👑", name: "Crown",   weight: 2,  mult: 25,  color: "#FFD700" },
  { emoji: "🌍", name: "World",   weight: 0.5,mult: 100, color: "#FF4444" },
];

function spin() {
  const total = SYMBOLS.reduce((a, s) => a + s.weight, 0);
  let r = Math.random() * total;
  for (const s of SYMBOLS) { r -= s.weight; if (r <= 0) return s; }
  return SYMBOLS[0];
}
function rs() { return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].emoji; }

function slotEmbed(r1, r2, r3, title, desc, color, fields = []) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(
      "```\n" +
      "┌─────────────────────┐\n" +
      `│   ${r1}   ${r2}   ${r3}   │\n` +
      "└─────────────────────┘```\n" + desc
    )
    .addFields(...fields)
    .setFooter({ text: "slots <bet> | slots all | slots max" });
}

const cooldowns = new Map();

module.exports = {
  name: "slots",
  aliases: ["slot", "ws", "spin", "os"],
  description: "Spin the Ancient Relic Slot Machine!",
  async execute(message, args) {
    const user = getUser(message.author.id);
    const now = Date.now();
    const cd = cooldowns.get(message.author.id) || 0;
    if (cd > now) {
      return message.reply(`⏳ Reels cooling... **${((cd - now)/1000).toFixed(1)}s**`);
    }

    const arg = (args[0] || "").toLowerCase();
    if (!arg) {
      return message.reply({
        embeds: [new EmbedBuilder().setColor("#C9A84C")
          .setTitle("🎰 Ancient Relic Slots — Paytable")
          .setDescription(
            "**Usage:** `slots <bet>` or `slots all`\n\n" +
            "```\n" +
            "SYMBOL   │ 3x     │ 2x\n" +
            "─────────┼────────┼────\n" +
            SYMBOLS.filter(s=>s.mult>0).map(s=>
              `${s.emoji} ${s.name.padEnd(7)} │ ${(s.mult+"x").padEnd(6)} │ ${(+(s.mult*0.4).toFixed(1))+"x"}`
            ).join("\n") +
            "\n💀 Skull  │  loss  │ loss\n```\n" +
            `💰 Balance: **${(user.coins||0).toLocaleString()} coins**`
          )],
      });
    }

    let bet;
    if (arg === "all" || arg === "max") bet = Math.min(user.coins || 0, 50000);
    else bet = parseInt(arg);

    if (isNaN(bet) || bet <= 0) return message.reply("❌ Use `slots 500` or `slots all`");
    if (bet > 50000) return message.reply("❌ Max bet: **50,000 coins**");
    if ((user.coins||0) < bet) return message.reply(`❌ Not enough coins! You have **${(user.coins||0).toLocaleString()}**`);

    cooldowns.set(message.author.id, now + 5000);

    // ── ANIMATION ──
    const msg = await message.reply({ embeds: [slotEmbed("🌀","🌀","🌀", "🎰 Ancient Slots", "*The reels begin to spin...*", "#444444")] });

    await new Promise(r => setTimeout(r, 550));
    await msg.edit({ embeds: [slotEmbed(rs(),rs(),rs(), "🎰 Ancient Slots", "*Reels spinning...*", "#555555")] });

    const f1 = spin();
    await new Promise(r => setTimeout(r, 650));
    await msg.edit({ embeds: [slotEmbed(f1.emoji,rs(),rs(), "🎰 Ancient Slots", `*${f1.emoji} First reel locks!*`, "#666666")] });

    const f2 = spin();
    await new Promise(r => setTimeout(r, 700));
    await msg.edit({ embeds: [slotEmbed(f1.emoji,f2.emoji,rs(), "🎰 Ancient Slots", `*${f2.emoji} Second reel locks!*`, "#777777")] });

    const f3 = spin();
    await new Promise(r => setTimeout(r, 750));

    // ── RESULT ──
    let mult = 0, resultLine = "";
    if (f1.emoji === f2.emoji && f2.emoji === f3.emoji) {
      mult = f1.mult;
      const jackpots = {
        "World":  `🌍 **✨ A N C I E N T   J A C K P O T !!! ✨**\n🌍 **100x** — THE WORLD SHARD AWAKENS!!!`,
        "Crown":  `👑 **LEGENDARY WIN! 25x!** The Crown of Ages blesses you!`,
        "Dragon": `🐉 **DRAGON WIN! 10x!** The beast roars with approval!`,
        "Orb":    `🔮 **MYSTIC WIN! 5x!** The orb pulses with power!`,
        "Idol":   `🗿 **IDOL WIN! 3x!** The ancient idol approves!`,
      };
      resultLine = jackpots[f1.name] || `✨ **3 OF A KIND! ${f1.mult}x!** The relics align!`;
    } else if (f1.emoji===f2.emoji || f2.emoji===f3.emoji || f1.emoji===f3.emoji) {
      const m = f1.emoji===f2.emoji ? f1 : f2.emoji===f3.emoji ? f2 : f1;
      mult = m.mult > 0 ? +(m.mult*0.4).toFixed(1) : 0;
      resultLine = mult > 0 ? `🎯 **2 of a kind!** Partial blessing! (${mult}x)` : `💀 **Skull pair... ancient curse!**`;
    } else {
      resultLine = `❌ **No match.** The relics remain silent...`;
    }

    const win = Math.floor(bet * mult);
    const net = win - bet;
    user.coins = (user.coins || 0) + net;
    saveUser(message.author.id, user);

    const won = net > 0;
    const isJackpot = mult >= 25;
    const finalColor = mult >= 100 ? "#FF4444" : isJackpot ? "#FFD700" : won ? "#00E676" : "#FF1744";
    const finalTitle = mult >= 100 ? "🌍 WORLD SHARD JACKPOT!!!" : isJackpot ? "👑 LEGENDARY WIN!" : won ? "🎰 Slots — WIN!" : "🎰 Slots — No Win";

    await msg.edit({
      embeds: [slotEmbed(f1.emoji, f2.emoji, f3.emoji, finalTitle, resultLine, finalColor, [
        { name: "💸 Bet",                  value: `${bet.toLocaleString()}`,          inline: true },
        { name: won?"✅ Won":"❌ Lost",     value: `${Math.abs(net).toLocaleString()}`,inline: true },
        { name: "📊 Multiplier",           value: mult > 0 ? `${mult}x` : "—",        inline: true },
        { name: "💰 New Balance",          value: `**${user.coins.toLocaleString()}**`,inline: true },
      ])],
    });
  },
};
