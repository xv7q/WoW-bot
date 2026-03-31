const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
client.defaultPrefix = process.env.PREFIX || "wow!";

// Per-guild prefix storage
const PREFIX_DB = path.join(__dirname, "data", "prefixes.json");
function loadPrefixes() {
  if (!fs.existsSync(PREFIX_DB)) return {};
  return JSON.parse(fs.readFileSync(PREFIX_DB, "utf8"));
}
function savePrefix(guildId, prefix) {
  const data = loadPrefixes();
  data[guildId] = prefix;
  if (!fs.existsSync(path.dirname(PREFIX_DB))) fs.mkdirSync(path.dirname(PREFIX_DB), { recursive: true });
  fs.writeFileSync(PREFIX_DB, JSON.stringify(data, null, 2));
}
function getPrefix(guildId) {
  const data = loadPrefixes();
  return data[guildId] || client.defaultPrefix;
}
client.getPrefix = getPrefix;
client.savePrefix = savePrefix;

// Load commands
const commandFolders = ["fun", "economy", "relic", "rpg"];
for (const folder of commandFolders) {
  const folderPath = path.join(__dirname, "commands", folder);
  if (!fs.existsSync(folderPath)) continue;
  const commandFiles = fs
    .readdirSync(folderPath)
    .filter((f) => f.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(path.join(folderPath, file));
    client.commands.set(command.name, command);
    if (command.aliases) {
      command.aliases.forEach((alias) => client.commands.set(alias, command));
    }
  }
}

client.once("ready", () => {
  console.log(`✨ WOW Bot is online as ${client.user.tag}!`);
  client.user.setActivity("wow!help | Hunting Relics 🏺", { type: 0 });
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  const prefix = getPrefix(message.guildId);
  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (err) {
    console.error(err);
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#8B0000")
          .setDescription(`⚠️ **Ancient curse activated!** Something went wrong...`),
      ],
    });
  }
});

// XP on message (level system)
const { getUser, saveUser } = require("./utils/database");
const xpCooldowns = new Map();

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  const pfx = getPrefix(message.guildId);
  if (message.content.startsWith(pfx)) return;

  const cooldown = xpCooldowns.get(message.author.id);
  if (cooldown && Date.now() - cooldown < 60000) return;

  xpCooldowns.set(message.author.id, Date.now());

  const user = getUser(message.author.id);
  const xpGain = Math.floor(Math.random() * 10) + 5;
  user.xp = (user.xp || 0) + xpGain;

  const xpNeeded = user.level * 100 + 100;
  if (user.xp >= xpNeeded) {
    user.level = (user.level || 1) + 1;
    user.xp = 0;
    user.coins = (user.coins || 0) + user.level * 50;

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("⚡ LEVEL UP! THE RELIC POWER GROWS!")
      .setDescription(
        `**${message.author.username}** has ascended to **Level ${user.level}**!\n🪙 Rewarded **${user.level * 50} Ancient Coins**`
      )
      .setThumbnail(message.author.displayAvatarURL());

    message.channel.send({ embeds: [embed] });
  }

  saveUser(message.author.id, user);
});

client.login(process.env.DISCORD_TOKEN);
