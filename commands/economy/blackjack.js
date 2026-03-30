const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");

const SUITS = ["♠️", "♥️", "♦️", "♣️"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function newDeck() {
  const deck = [];
  for (const s of SUITS) for (const v of VALUES) deck.push({ s, v });
  return deck.sort(() => Math.random() - 0.5);
}

function cardVal(card) {
  if (["J", "Q", "K"].includes(card.v)) return 10;
  if (card.v === "A") return 11;
  return parseInt(card.v);
}

function handTotal(hand) {
  let total = hand.reduce((a, c) => a + cardVal(c), 0);
  let aces = hand.filter(c => c.v === "A").length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

function showCards(hand, hideSecond = false) {
  return hand.map((c, i) => (hideSecond && i === 1) ? "`🂠`" : `\`${c.v}${c.s}\``).join(" ");
}

const activeGames = new Map();

module.exports = {
  name: "blackjack",
  aliases: ["bj", "wbj", "21"],
  description: "Play Blackjack against the dealer!",
  async execute(message, args) {
    if (activeGames.has(message.author.id)) {
      return message.reply("❌ You already have an active Blackjack game! Finish it first.");
    }

    const user = getUser(message.author.id);
    let bet;
    const arg = (args[0] || "").toLowerCase();
    if (arg === "all" || arg === "max") bet = Math.min(user.coins || 0, 20000);
    else bet = parseInt(arg);

    if (!arg) {
      return message.reply({
        embeds: [new EmbedBuilder().setColor("#C9A84C")
          .setTitle("🃏 Ancient Blackjack")
          .setDescription("**Usage:** `bj <amount>` or `bj all`\n\nGet closer to **21** than the dealer!\nBlackjack pays **1.5x**!\n\n💰 Balance: **" + (user.coins||0).toLocaleString() + " coins**")],
      });
    }

    if (isNaN(bet) || bet <= 0) return message.reply("❌ Invalid bet!");
    if (bet > 20000) return message.reply("❌ Max bet **20,000 coins**!");
    if ((user.coins || 0) < bet) return message.reply(`❌ You only have **${user.coins || 0}** coins!`);

    const deck = newDeck();
    const playerHand = [deck.pop(), deck.pop()];
    const dealerHand = [deck.pop(), deck.pop()];

    const game = { deck, playerHand, dealerHand, bet, userId: message.author.id };
    activeGames.set(message.author.id, game);

    const playerTotal = handTotal(playerHand);

    // Natural blackjack check
    if (playerTotal === 21) {
      const winAmount = Math.floor(bet * 1.5);
      user.coins = (user.coins || 0) + winAmount;
      saveUser(message.author.id, user);
      activeGames.delete(message.author.id);

      return message.reply({
        embeds: [new EmbedBuilder().setColor("#FFD700")
          .setTitle("🃏 BLACKJACK! NATURAL 21!")
          .setDescription(
            `**Your hand:** ${showCards(playerHand)} = **21**\n` +
            `**Dealer:** ${showCards(dealerHand)}\n\n` +
            `✨ **BLACKJACK! +${winAmount.toLocaleString()} coins (1.5x)!**\n` +
            `💰 Balance: **${user.coins.toLocaleString()} coins**`
          )],
      });
    }

    const embed = new EmbedBuilder()
      .setColor("#2196F3")
      .setTitle("🃏 Ancient Blackjack")
      .setDescription(
        `**Your Hand:** ${showCards(playerHand)} = **${playerTotal}**\n` +
        `**Dealer:** ${showCards(dealerHand, true)} = **?**\n\n` +
        `Bet: **${bet.toLocaleString()} coins**`
      )
      .setFooter({ text: "Hit = draw card • Stand = end your turn • Double = 2x bet + 1 card" });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`bj_hit_${message.author.id}`).setLabel("👊 Hit").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId(`bj_stand_${message.author.id}`).setLabel("🛑 Stand").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`bj_double_${message.author.id}`).setLabel("💸 Double").setStyle(ButtonStyle.Success),
    );

    const msg = await message.reply({ embeds: [embed], components: [row] });

    const collector = msg.createMessageComponentCollector({
      filter: i => i.user.id === message.author.id,
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      const g = activeGames.get(message.author.id);
      if (!g) return;

      const action = interaction.customId.split("_")[1];

      if (action === "hit" || action === "double") {
        if (action === "double") {
          const extraBet = Math.min(g.bet, user.coins - g.bet);
          g.bet += extraBet;
        }
        g.playerHand.push(g.deck.pop());
        const pt = handTotal(g.playerHand);

        if (pt > 21 || action === "double") {
          // Bust or double ends
          collector.stop(pt > 21 ? "bust" : "double");
          return;
        }

        const upEmbed = new EmbedBuilder()
          .setColor("#2196F3")
          .setTitle("🃏 Ancient Blackjack")
          .setDescription(
            `**Your Hand:** ${showCards(g.playerHand)} = **${pt}**\n` +
            `**Dealer:** ${showCards(g.dealerHand, true)} = **?**\n\n` +
            `Bet: **${g.bet.toLocaleString()} coins**`
          )
          .setFooter({ text: "Hit = draw card • Stand = end your turn" });

        await interaction.update({ embeds: [upEmbed], components: [row] });
      }

      if (action === "stand") {
        collector.stop("stand");
      }
    });

    collector.on("end", async (_, reason) => {
      const g = activeGames.get(message.author.id);
      if (!g) return;
      activeGames.delete(message.author.id);

      const freshUser = getUser(message.author.id);
      const pt = handTotal(g.playerHand);

      if (reason === "bust" && pt > 21) {
        freshUser.coins = (freshUser.coins || 0) - g.bet;
        saveUser(message.author.id, freshUser);
        const bustEmbed = new EmbedBuilder().setColor("#8B0000")
          .setTitle("🃏 BUST! Over 21!")
          .setDescription(
            `**Your Hand:** ${showCards(g.playerHand)} = **${pt}** 💥\n\n` +
            `❌ **-${g.bet.toLocaleString()} coins**\n💰 Balance: **${freshUser.coins.toLocaleString()} coins**`
          );
        return msg.edit({ embeds: [bustEmbed], components: [] });
      }

      // Dealer plays
      while (handTotal(g.dealerHand) < 17) g.dealerHand.push(g.deck.pop());
      const dt = handTotal(g.dealerHand);

      let result, color, net;
      if (dt > 21 || pt > dt) {
        result = `✅ **YOU WIN! +${g.bet.toLocaleString()} coins!**`; color = "#4CAF50"; net = g.bet;
      } else if (pt === dt) {
        result = `🤝 **PUSH! Bet returned.**`; color = "#888888"; net = 0;
      } else {
        result = `❌ **Dealer wins. -${g.bet.toLocaleString()} coins.**`; color = "#8B0000"; net = -g.bet;
      }

      freshUser.coins = (freshUser.coins || 0) + net;
      saveUser(message.author.id, freshUser);

      const finalEmbed = new EmbedBuilder().setColor(color)
        .setTitle("🃏 Ancient Blackjack — Result")
        .setDescription(
          `**Your Hand:** ${showCards(g.playerHand)} = **${pt}**\n` +
          `**Dealer:** ${showCards(g.dealerHand)} = **${dt}**\n\n` +
          result + `\n💰 Balance: **${freshUser.coins.toLocaleString()} coins**`
        );

      msg.edit({ embeds: [finalEmbed], components: [] });
    });
  },
};
