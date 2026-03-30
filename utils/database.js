const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "users.json");

function ensureDB() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "{}");
}

function loadDB() {
  ensureDB();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function saveDB(data) {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function getUser(userId) {
  const db = loadDB();
  if (!db[userId]) {
    db[userId] = {
      coins: 100,
      xp: 0,
      level: 1,
      relics: [],
      lastDaily: null,
      lastHunt: null,
      inventory: [],
      equipped: null,
    };
    saveDB(db);
  }
  return db[userId];
}

function saveUser(userId, data) {
  const db = loadDB();
  db[userId] = data;
  saveDB(db);
}

function getAllUsers() {
  return loadDB();
}

module.exports = { getUser, saveUser, getAllUsers };
