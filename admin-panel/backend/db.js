const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./wallboard.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS agents (
      agent_code TEXT PRIMARY KEY,
      agent_name TEXT NOT NULL,
      team_id INTEGER,
      role TEXT,
      email TEXT,
      phone TEXT,
      hire_date TEXT
    )
  `);
});

module.exports = db;
