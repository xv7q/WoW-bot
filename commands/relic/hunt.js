const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");
const { getRandomRelic, RARITY_COLORS, RARITY_EMOJI } = require("../../utils/relics");

const HUNT_COOLDOWN = 30 * 1000; // 30 seconds

const HUNT_LOCATIONS = [
  "🏜️ **Saharan Tomb** — The sand shifts to reveal something...",
  "🏔️ **Himalayan Cave** — Ice-cold walls hide ancient secrets...",
  "🌊 **Sunken Atlantis** — Diving deep into forgotten waters...",
  "🌿 **Amazon Ruins** — The jungle swallows everything but this...",
  "🏛️ **Roman Catacombs** — Beneath the city, history sleeps...",
  "🗾 **Feudal Japan Shrine** — The spirits part the mist for you...",
  "🏝️ **Lost Pacific Island** — A civilization that left no name...",
  "❄️ **Arctic Permafrost** — Frozen for ten thousand years...",
];

module.exports = {
  name: "hunt",
  aliases: ["h", "wh", "search", "dig"],
  description: "Hunt for ancient relics!",
  async execute(message, args, client) {
    const user = getUser(message.author.id);
    const now = Date.now();

    // Cooldown check
    if (user.lastHunt && now - user.lastHunt < HUNT_COOLDOWN) {
      const remaining = Math.ceil((HUNT_COOLDOWN - (now - user.lastHunt)) / 1000);
      const embed = new EmbedBuilder()
        .setColor("#8B0000")
        .setTitle("⏳ The Ancient Grounds Need Rest")
        .setDescription(`You must wait **${remaining}s** before hunting again.\n*The relics need time to surface...*`);
      return message.reply({ embeds: [embed] });
    }

    // Random chance to find nothing (10%)
    if (Math.random() < 0.1) {
      user.lastHunt = now;
      saveUser(message.author.id, user);

      const location = HUNT_LOCATIONS[Math.floor(Math.random() * HUNT_LOCATIONS.length)];
      const embed = new EmbedBuilder()
        .setColor("#666666")
        .setTitle("🕳️ Empty Handed...")
        .setDescription(`${location}\n\n*You searched but found nothing this time. The relics hide their secrets well.*`);
      return message.reply({ embeds: [embed] });
    }

    const relic = getRandomRelic();
    user.relics = user.relics || [];
    user.relics.push(relic.id);
    user.lastHunt = now;

    // Bonus XP for hunting
    user.xp = (user.xp || 0) + Math.floor(relic.power / 2);

    saveUser(message.author.id, user);

    const location = HUNT_LOCATIONS[Math.floor(Math.random() * HUNT_LOCATIONS.length)];

    const embed = new EmbedBuilder()
      .setColor(RARITY_COLORS[relic.rarity])
      .setTitle(`${RARITY_EMOJI[relic.rarity]} Relic Found! ${relic.emoji} ${relic.name}`)
      .setDescription(location)
      .addFields(
        { name: "📖 Description", value: relic.desc },
        { name: "⚡ Power", value: `${relic.power}`, inline: true },
        { name: "💰 Value", value: `${relic.value} coins`, inline: true },
        { name: "✨ Rarity", value: `${RARITY_EMOJI[relic.rarity]} ${relic.rarity.toUpperCase()}`, inline: true },
        { name: "📦 ID", value: `\`${relic.id}\``, inline: true },
      )
      .setFooter({ text: `Use "wow!sell ${relic.id}" to sell • "wow!equip ${relic.id}" to equip` })
      .setTimestamp();

    if (relic.rarity === "legendary") {
      embed.setTitle(`🌟 LEGENDARY RELIC DISCOVERED! ${relic.emoji} ${relic.name} 🌟`);
      message.channel.send(`✨ **${message.author.username}** just found a **LEGENDARY RELIC**: ${relic.emoji} **${relic.name}**! The earth shakes! 🌍`);
    } else if (relic.rarity === "epic") {
      message.channel.send(`💜 **${message.author.username}** unearthed an **EPIC RELIC**: ${relic.emoji} **${relic.name}**!`);
    }

    message.reply({ embeds: [embed] });
  },
};
