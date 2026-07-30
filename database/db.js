const mysql = require("mysql2");

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "smart_clinic_system",
    port: process.env.DB_PORT || 3306,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    dateStrings: true,
    timezone: "+00:00"
});

// اختبار الاتصال عند بدء التشغيل
db.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }

    console.log("Connected to MySQL Database ✅");
    connection.release();
});

module.exports = db;