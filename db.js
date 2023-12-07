// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database('./logindb.db');

// const dbPath = path.join(__dirname, 'logindb.db');

module.exports = db;