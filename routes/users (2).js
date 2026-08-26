const express = require('express');
const router = express.Router();

// เส้นทาง: /users/
router.get('/', (req, res) => {
  res.send(
    '<h1>รายชื่อผู้ใช้งานทั้งหมด</h1>'
  );
});

// เส้นทาง: /users/profile
router.get('/profile', (req, res) => {
  res.send(
    '<h1>โปรไฟล์ส่วนตัวของผู้ใช้</h1>'
  );
});

// ส่งออก Router เพื่อให้นำไปใช้ที่อื่นได้
module.exports = router;