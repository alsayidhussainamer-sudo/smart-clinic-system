const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smart_clinic_system',
    port: process.env.DB_PORT || 3306,
    dateStrings: true,  // Keep DATE/DATETIME as strings to avoid timezone issues
    timezone: '+00:00'   // Use UTC for all date/time operations
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database ✅');
});

module.exports = db;