# 🏺 WOW Bot — Ancient Relic Hunter

OwO-style Discord bot with a full Relic hunting system!

## Commands

| Command | Description |
|---|---|
| `wow!hunt` | Hunt for relics |
| `wow!relics` | View your collection |
| `wow!sell <id>` | Sell a relic |
| `wow!equip <id>` | Equip a relic |
| `wow!inspect <id>` | Relic details |
| `wow!profile` | Your hunter profile |
| `wow!balance` | Check coins |
| `wow!daily` | Daily reward |
| `wow!give @user <amount>` | Gift coins |
| `wow!leaderboard` | Top hunters |
| `wow!duel @user` | Battle someone |
| `wow!wow` | WOW! |
| `wow!pat @user` | Pat someone |
| `wow!hug @user` | Hug someone |
| `wow!8ball <q>` | Ask the oracle |
| `wow!roll 2d6` | Roll dice |

## Deploy on Railway

1. Push this folder to a GitHub repo
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your repo
4. Go to **Variables** tab and add:
   - `DISCORD_TOKEN` = your bot token
   - `PREFIX` = `wow!` (optional, default is wow!)
5. Railway auto-deploys. Done! ✅

## Get a Discord Bot Token

1. Go to https://discord.com/developers/applications
2. New Application → name it "WOW"
3. Bot → Add Bot → Copy Token
4. OAuth2 → URL Generator → check `bot` → permissions: Send Messages, Read Messages, Embed Links, Read Message History
5. Use the generated URL to invite the bot to your server
