const mysql = require("mysql2");
require("dotenv").config();
// สร้าง Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ตรวจสอบการเชื่อมต่อเบื้องต้น
pool.getConnection((err, connection) => {
  if (err) {
    console.error("เกิดข้อผิดพลาด:", err.message);
  } else {
    console.log("เชื่อมต่อฐานข้อมูล MySQL สําเร็จ!");
    connection.release();
  }
});
module.exports = pool.promise();
