const { EmbedBuilder } = require("discord.js");
const { getUser, saveUser } = require("../../utils/database");
const { getRandomRelic, RARITY_COLORS, RARITY_EMOJI } = require("../../utils/relics");

const HUNT_CD = 30000;
const LOCATIONS = [
  { name: "🏜️ Saharan Tomb",         dig: ["Brushing sand aside...", "A chamber revealed!", "Something gleams below..."] },
  { name: "🏔️ Himalayan Cave",       dig: ["Chipping through ice...", "Ancient frost cracks...", "The cold hides secrets..."] },
  { name: "🌊 Sunken Atlantis",       dig: ["Diving deeper...", "Ruins shimmer below...", "Barnacled chest found!"] },
  { name: "🌿 Amazon Ruins",          dig: ["Pushing through vines...", "Stone carvings appear...", "The jungle parts!"] },
  { name: "🏛️ Roman Catacombs",      dig: ["Torch flickering...", "Bones line the walls...", "A hidden alcove!"] },
  { name: "🗾 Feudal Japan Shrine",   dig: ["Incense fills the air...", "Spirits stir...", "The shrine door opens!"] },
  { name: "❄️ Arctic Permafrost",     dig: ["Ground frozen solid...", "Tools barely work...", "Ice cracks open!"] },
  { name: "🏝️ Lost Pacific Island",  dig: ["Sand gives way...", "Palm roots tangle...", "Buried treasure chest!"] },
];

module.exports = {
  name: "hunt",
  aliases: ["h", "wh", "search", "dig"],
  description: "Hunt for ancient relics!",
  async execute(message, args, client) {
    const user = getUser(message.author.id);
    const now = Date.now();

    if (user.lastHunt && now - user.lastHunt < HUNT_CD) {
      const rem = Math.ceil((HUNT_CD - (now - user.lastHunt)) / 1000);
      return message.reply({
        embeds: [new EmbedBuilder().setColor("#FF9800")
          .setTitle("⛏️ Still Digging...")
          .setDescription(`The excavation site needs **${rem}s** to reset.\n*Ancient grounds must be respected.*`)],
      });
    }

    const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

    // ── ANIMATION ──
    const msg = await message.reply({
      embeds: [new EmbedBuilder().setColor("#555555")
        .setTitle(`🔍 Hunting at ${loc.name}`)
        .setDescription(`*${loc.dig[0]}*\n\n⏳ Searching...`)],
    });

    await new Promise(r => setTimeout(r, 800));
    await msg.edit({ embeds: [new EmbedBuilder().setColor("#666666")
      .setTitle(`🔍 Hunting at ${loc.name}`)
      .setDescription(`*${loc.dig[1]}*\n\n⛏️ Almost there...`)] });

    await new Promise(r => setTimeout(r, 900));
    await msg.edit({ embeds: [new EmbedBuilder().setColor("#777777")
      .setTitle(`🔍 Hunting at ${loc.name}`)
      .setDescription(`*${loc.dig[2]}*\n\n✨ Found something!`)] });

    await new Promise(r => setTimeout(r, 600));

    // 10% nothing
    if (Math.random() < 0.1) {
      user.lastHunt = now;
      saveUser(message.author.id, user);
      return msg.edit({ embeds: [new EmbedBuilder().setColor("#444444")
        .setTitle(`🕳️ Nothing at ${loc.name}`)
        .setDescription(`*You searched thoroughly but the ancient grounds yielded nothing this time.*\n\nBetter luck next hunt! *(30s cooldown)*`)] });
    }

    const relic = getRandomRelic();
    user.relics = user.relics || [];
    user.relics.push(relic.id);
    user.lastHunt = now;
    user.xp = (user.xp || 0) + Math.floor(relic.power / 2);
    saveUser(message.author.id, user);

    const color = RARITY_COLORS[relic.rarity];
    const rarityEmoji = RARITY_EMOJI[relic.rarity];

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`${rarityEmoji} ${relic.emoji} ${relic.name} Discovered!`)
      .setDescription(
        `**Location:** ${loc.name}\n\n` +
        `> *"${relic.desc}"*\n\n` +
        `\`\`\`\n` +
        `Rarity   : ${rarityEmoji} ${relic.rarity.toUpperCase()}\n` +
        `Power    : ⚡ ${relic.power}\n` +
        `Value    : 🪙 ${relic.value.toLocaleString()} coins\n` +
        `ID       : ${relic.id}\n` +
        `\`\`\``
      )
      .addFields(
        { name: "📦 Total Relics", value: `**${user.relics.length}**`, inline: true },
        { name: "⚡ XP Gained",    value: `+${Math.floor(relic.power/2)}`,inline: true },
      )
      .setFooter({ text: `sell ${relic.id} • equip ${relic.id} • inspect ${relic.id}` })
      .setTimestamp();

    if (relic.rarity === "legendary") {
      message.channel.send(`🌟 **${message.author.username}** just unearthed a **LEGENDARY RELIC** — ${relic.emoji} **${relic.name}**! The earth trembles! 🌍`);
    } else if (relic.rarity === "epic") {
      message.channel.send(`💜 **${message.author.username}** found an **EPIC RELIC** — ${relic.emoji} **${relic.name}**!`);
    }

    msg.edit({ embeds: [embed] });
  },
};
