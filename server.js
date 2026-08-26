const express = require("express");
require("dotenv").config();
const db = require("./config/db");

const app = express();

// รับข้อมูลจาก Form
app.use(express.urlencoded({ extended: true }));

// รับข้อมูล JSON
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ตั้งค่า Static
app.use(express.static("public"));

// ตั้งค่า EJS
app.set("views", "./views");
app.set("view engine", "ejs");

// =============================
// หน้าแรก
// =============================
app.get("/", (req, res) => {
  res.render("index", {
    title: "หน้าแรก - เว็บแอปพลิเคชันของฉัน",
    username: "นักศึกษา ปวส.3",
  });
});

// =============================
// รายชื่อผู้ใช้งาน
// =============================
app.get('/users', async (req, res) => {
  try {
    const sql = `
      SELECT id, username, email, created_at
      FROM users
      ORDER BY id DESC
    `;

    const [rows] = await db.query(sql);

    res.render('users', {
      title: 'รายชื่อผู้ใช้งาน',
      users_data: rows
    });

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
  }
});

// =============================
// หน้า About
// =============================
app.get("/about", (req, res) => {
  res.render("about", {
    title: "เกี่ยวกับเรา",
    username: "นักศึกษา ปวส.3",
  });
});

// =============================
// หน้า Register
// =============================
app.get("/register", (req, res) => {
  res.render("register", {
    title: "สมัครสมาชิก",
    message: null,
    messageType: null,
  });
});

// =============================
// สมัครสมาชิก
// =============================
app.post("/register", async (req, res) => {

  // ดึงข้อมูลจาก Form
  const { username, email, password } = req.body;

  // ตรวจสอบข้อมูล
  if (!username || !email || !password) {
    return res.render("register", {
      title: "สมัครสมาชิก",
      message: "กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง!",
      messageType: "danger",
    });
  }

  // ตรวจสอบความยาว Password
  if (password.length < 6) {
    return res.render("register", {
      title: "สมัครสมาชิก",
      message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
      messageType: "warning",
    });
  }

  try {

    // เพิ่มข้อมูลสมาชิกลง Database
    const sql = `
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `;

    const values = [username, email, password];

    await db.query(sql, values);

    // สมัครสำเร็จ ให้ไปหน้ารายชื่อสมาชิก
    res.redirect("/users");

  } catch (error) {

    console.error(
      "เกิดข้อผิดพลาดในการบันทึกข้อมูล:",
      error
    );

    // ตรวจสอบ Email ซ้ำ
    if (error.code === "ER_DUP_ENTRY") {
      return res.render("register", {
        title: "สมัครสมาชิก",
        message: "อีเมลนี้มีในระบบแล้ว กรุณาใช้อีเมลอื่น",
        messageType: "warning",
      });
    }

    res
      .status(500)
      .send("เกิดข้อผิดพลาดในการสมัครสมาชิก");
  }
});

// =============================
// Contact
// =============================
app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "ติดต่อเรา",
    username: "นักศึกษา ปวส.3",
  });
});

// =============================
// Product
// =============================
app.get("/product", async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        id,
        product_name,
        description,
        price,
        stock,
        created_at
      FROM product
    `);

    res.render("product", {
      title: "รายชื่อสินค้า",
      product_data: rows,
    });

  } catch (error) {

    console.error(error);

    res
      .status(500)
      .send("เกิดข้อผิดพลาดในการดึงข้อมูล");

  }
});

// =============================
// Start Server
// =============================
app.listen(PORT, () => {
  console.log(`Server is running strongly on http://localhost:${PORT}`);
});