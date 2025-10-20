const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ✅ ชี้ไปยัง path ที่ถูกต้อง (database/sqlite/agents.db)
const dbPath = path.resolve(__dirname, '../../../database/sqlite/agents.db');
console.log('📂 Using database file:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('❌ Database connection error:', err.message);
  else console.log('✅ Connected to database at', dbPath);
});

// ✅ GET ทั้งหมด
router.get('/', (req, res) => {
  db.all('SELECT * FROM agents', [], (err, rows) => {
    if (err) {
      console.error('Error reading agents:', err);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// ✅ POST เพิ่ม agent
router.post('/', (req, res) => {
  const { code, name, status } = req.body;
  db.run(
    'INSERT INTO agents (code, name, status) VALUES (?, ?, ?)',
    [code, name, status],
    function (err) {
      if (err) {
        console.error('Error adding agent:', err);
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, code, name, status });
      }
    }
  );
});

// ✅ DELETE ลบ agent
router.delete('/:code', (req, res) => {
  const { code } = req.params;
  db.run('DELETE FROM agents WHERE code = ?', code, function (err) {
    if (err) {
      console.error('Error deleting agent:', err);
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Agent deleted' });
    }
  });
});

module.exports = router;
