const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");

// Slot symbols with weights and multipliers
const SYMBOLS = [
  { emoji: "💀", name: "Skull",   weight: 30, mult: 0    }, // lose
  { emoji: "🪨", name: "Stone",   weight: 25, mult: 1.5  }, // small win
  { emoji: "🪙", name: "Coin",    weight: 20, mult: 2    },
  { emoji: "🗿", name: "Idol",    weight: 12, mult: 3    },
  { emoji: "🔮", name: "Orb",     weight: 8,  mult: 5    },
  { emoji: "🐉", name: "Dragon",  weight: 3,  mult: 10   },
  { emoji: "👑", name: "Crown",   weight: 1.5,mult: 25   },
  { emoji: "🌍", name: "World",   weight: 0.5,mult: 50   }, // jackpot
];

function spinReel() {
  const total = SYMBOLS.reduce((a, s) => a + s.weight, 0);
  let rand = Math.random() * total;
  for (const sym of SYMBOLS) {
    rand -= sym.weight;
    if (rand <= 0) return sym;
  }
  return SYMBOLS[0];
}

const SPIN_COOLDOWN = 5000; // 5 seconds
const cooldowns = new Map();

module.exports = {
  name: "slots",
  aliases: ["slot", "ws", "spin"],
  description: "Spin the Ancient Relic Slot Machine!",
  async execute(message, args) {
    const user = getUser(message.author.id);

    const now = Date.now();
    const last = cooldowns.get(message.author.id) || 0;
    if (now - last < SPIN_COOLDOWN) {
      const wait = ((SPIN_COOLDOWN - (now - last)) / 1000).toFixed(1);
      return message.reply(`⏳ The slots are still spinning... wait **${wait}s**`);
    }

    const bet = parseInt(args[0]);
    if (isNaN(bet) || bet <= 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#C9A84C")
            .setTitle("🎰 Ancient Slot Machine")
            .setDescription(
              "**Usage:** `slots 100`\n\n" +
              "**Payouts (3 of a kind):**\n" +
              SYMBOLS.filter(s => s.mult > 0).map(s =>
                `${s.emoji} ${s.name} — **${s.mult}x**`
              ).join("\n") +
              `\n\n💀 Skull = lose your bet\n` +
              `Your balance: **${user.coins || 0} coins**`
            ),
        ],
      });
    }

    if (bet > 5000) return message.reply("❌ Max bet is **5,000 coins** per spin!");
    if ((user.coins || 0) < bet) {
      return message.reply(`❌ Not enough coins! You have **${user.coins || 0}** coins.`);
    }

    cooldowns.set(message.author.id, now);

    const r1 = spinReel();
    const r2 = spinReel();
    const r3 = spinReel();

    const reels = `${r1.emoji} | ${r2.emoji} | ${r3.emoji}`;

    let winMult = 0;
    let resultText = "";

    if (r1.emoji === r2.emoji && r2.emoji === r3.emoji) {
      // Jackpot - 3 of a kind
      winMult = r1.mult;
      if (r1.name === "World") {
        resultText = "🌟 **ANCIENT JACKPOT!!!** The world shard activates!";
      } else if (r1.name === "Crown") {
        resultText = "👑 **LEGENDARY WIN!** The Crown of Ages blesses you!";
      } else {
        resultText = `✨ **3 OF A KIND!** ${r1.name} x3!`;
      }
    } else if (r1.emoji === r2.emoji || r2.emoji === r3.emoji || r1.emoji === r3.emoji) {
      // 2 of a kind - half mult of that symbol
      const matchSym = r1.emoji === r2.emoji ? r1 : r2.emoji === r3.emoji ? r2 : r1;
      winMult = matchSym.mult > 0 ? matchSym.mult * 0.4 : 0;
      if (winMult > 0) {
        resultText = `🎯 **2 of a kind!** Small win!`;
      } else {
        resultText = `💀 **Skull pair... cursed!**`;
      }
    } else {
      resultText = `❌ No match. The relics are silent.`;
    }

    const winAmount = Math.floor(bet * winMult);
    const netChange = winAmount - bet;

    user.coins = (user.coins || 0) + netChange;
    saveUser(message.author.id, user);

    const won = netChange > 0;
    const broke = netChange === -bet;

    const embed = new EmbedBuilder()
      .setColor(won ? "#FFD700" : broke ? "#8B0000" : "#666")
      .setTitle("🎰 Ancient Relic Slots")
      .setDescription(
        `┌─────────────┐\n` +
        `│  ${reels}  │\n` +
        `└─────────────┘\n\n` +
        resultText
      )
      .addFields(
        { name: "Bet", value: `${bet} coins`, inline: true },
        { name: won ? "Won" : "Lost", value: `${Math.abs(netChange)} coins`, inline: true },
        { name: "Multiplier", value: winMult > 0 ? `${winMult}x` : "—", inline: true },
        { name: "Balance", value: `**${user.coins} coins**`, inline: true },
      )
      .setFooter({ text: `${message.author.username} • slots` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
