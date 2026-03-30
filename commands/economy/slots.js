const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");

const SYMBOLS = [
  { emoji: "💀", name: "Skull",  weight: 28, mult: 0,   color: "#2C2C2C" },
  { emoji: "🪨", name: "Stone",  weight: 22, mult: 1.5, color: "#9E9E9E" },
  { emoji: "🪙", name: "Coin",   weight: 18, mult: 2,   color: "#FFD700" },
  { emoji: "🗿", name: "Idol",   weight: 12, mult: 3,   color: "#4CAF50" },
  { emoji: "🔮", name: "Orb",    weight: 8,  mult: 5,   color: "#9C27B0" },
  { emoji: "🐉", name: "Dragon", weight: 5,  mult: 10,  color: "#2196F3" },
  { emoji: "👑", name: "Crown",  weight: 2,  mult: 25,  color: "#FF9800" },
  { emoji: "🌍", name: "World",  weight: 0.5,mult: 100, color: "#FF4444" },
];

function spinReel() {
  const total = SYMBOLS.reduce((a, s) => a + s.weight, 0);
  let rand = Math.random() * total;
  for (const sym of SYMBOLS) { rand -= sym.weight; if (rand <= 0) return sym; }
  return SYMBOLS[0];
}
function rs() { return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].emoji; }

function slotEmbed(r1, r2, r3, title, desc, color, fields = []) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(
      "```\n╔═══════════════════╗\n" +
      `║   ${r1}  ║  ${r2}  ║  ${r3}   ║\n` +
      "╚═══════════════════╝```\n" + desc
    )
    .addFields(...fields)
    .setFooter({ text: "🏺 WOW Ancient Slots • wow!slots <bet> | wow!slots all" });
}

const cooldowns = new Map();

module.exports = {
  name: "slots",
  aliases: ["slot", "ws", "spin", "os"],
  description: "Spin the Ancient Relic Slot Machine!",
  async execute(message, args) {
    const user = getUser(message.author.id);
    const now = Date.now();
    if ((cooldowns.get(message.author.id) || 0) > now) {
      const s = ((cooldowns.get(message.author.id) - now) / 1000).toFixed(1);
      return message.reply(`⏳ Reels cooling down... **${s}s** remaining`);
    }

    let bet;
    const arg = (args[0] || "").toLowerCase();
    if (!arg) {
      return message.reply({
        embeds: [new EmbedBuilder().setColor("#C9A84C")
          .setTitle("🎰 Ancient Relic Slots — Payouts")
          .setDescription(
            "**Usage:** `slots <amount>` or `slots all`\n\n" +
            SYMBOLS.filter(s => s.mult > 0).map(s => `${s.emoji} **${s.name}** → \`${s.mult}x\``).join("\n") +
            `\n\n2 of a kind = 0.4x mult\n💀 Skull = cursed loss\n\n💰 **Balance: ${(user.coins||0).toLocaleString()} coins**`
          )],
      });
    }

    if (arg === "all" || arg === "max") bet = Math.min(user.coins || 0, 50000);
    else bet = parseInt(arg);

    if (isNaN(bet) || bet <= 0) return message.reply("❌ Invalid! Try `slots 500` or `slots all`");
    if (bet > 50000) return message.reply("❌ Max bet is **50,000 coins**!");
    if ((user.coins || 0) < bet) return message.reply(`❌ You only have **${user.coins || 0}** coins!`);

    cooldowns.set(message.author.id, now + 5000);

    // === SPIN ANIMATION (4 frames) ===
    const msg = await message.reply({
      embeds: [slotEmbed("🌀", "🌀", "🌀", "🎰 Spinning...", "*The ancient machine awakens...*", "#333333")],
    });

    await new Promise(r => setTimeout(r, 650));
    await msg.edit({ embeds: [slotEmbed(rs(), rs(), rs(), "🎰 Spinning...", "*Reels turning...*", "#444444")] });

    const f1 = spinReel();
    await new Promise(r => setTimeout(r, 700));
    await msg.edit({ embeds: [slotEmbed(f1.emoji, rs(), rs(), "🎰 Spinning...", `*First reel locked: ${f1.emoji}*`, "#555555")] });

    const f2 = spinReel();
    await new Promise(r => setTimeout(r, 750));
    await msg.edit({ embeds: [slotEmbed(f1.emoji, f2.emoji, rs(), "🎰 Spinning...", `*Second reel locked: ${f2.emoji}*`, "#666666")] });

    const f3 = spinReel();
    await new Promise(r => setTimeout(r, 800));

    // === RESULT ===
    let winMult = 0, resultLine = "";
    if (f1.emoji === f2.emoji && f2.emoji === f3.emoji) {
      winMult = f1.mult;
      const msgs = {
        "World":  "🌍 ✨ **A N C I E N T   J A C K P O T !!!** ✨ 🌍\n🌍 **100x!!!** THE WORLD SHARD HAS AWAKENED!!!",
        "Crown":  "👑 **LEGENDARY JACKPOT! 25x!**\nThe Crown of Ages has chosen you!",
        "Dragon": "🐉 **DRAGON JACKPOT! 10x!**\nThe ancient dragon roars with approval!",
        "Orb":    "🔮 **MYSTIC WIN! 5x!** The orb glows intensely!",
      };
      resultLine = msgs[f1.name] || `✨ **3 OF A KIND! ${f1.mult}x!** The relics align for you!`;
    } else if (f1.emoji === f2.emoji || f2.emoji === f3.emoji || f1.emoji === f3.emoji) {
      const m = f1.emoji === f2.emoji ? f1 : f2.emoji === f3.emoji ? f2 : f1;
      winMult = m.mult > 0 ? +(m.mult * 0.4).toFixed(1) : 0;
      resultLine = winMult > 0 ? `🎯 **2 of a kind!** Partial relic blessing! (${winMult}x)` : `💀 **Skull pair — ancient curse!**`;
    } else {
      resultLine = `❌ **No match.** The relics remain silent...`;
    }

    const winAmount = Math.floor(bet * winMult);
    const net = winAmount - bet;
    user.coins = (user.coins || 0) + net;
    saveUser(message.author.id, user);

    const won = net > 0;
    const isJackpot = winMult >= 25;
    const finalColor = winMult >= 100 ? "#FF4444" : isJackpot ? "#FFD700" : won ? "#4CAF50" : "#8B0000";
    const finalTitle = winMult >= 100 ? "🌍 WORLD SHARD JACKPOT!!!" : isJackpot ? "👑 LEGENDARY WIN!" : won ? "🎰 Ancient Slots — WIN!" : "🎰 Ancient Slots — No Win";

    await msg.edit({
      embeds: [slotEmbed(f1.emoji, f2.emoji, f3.emoji, finalTitle, resultLine, finalColor, [
        { name: "💸 Bet",       value: `${bet.toLocaleString()} coins`,            inline: true },
        { name: won ? "✅ Won" : "❌ Lost", value: `${Math.abs(net).toLocaleString()} coins`, inline: true },
        { name: "📊 Multiplier", value: winMult > 0 ? `${winMult}x` : "—",         inline: true },
        { name: "💰 New Balance", value: `**${user.coins.toLocaleString()} coins**`, inline: true },
      ])],
    });
  },
};
