const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json()); // สำหรับอ่าน body ที่เป็น JSON

const SECRET_KEY = "my_super_secret_key"; // คีย์สำหรับเข้ารหัส (ในงานจริงควรเก็บใน .env)

// --- 1. POST /login route ---
app.post('/login', (req, res) => {
    const { username } = req.body;
    
    // กำหนด Role ตามเงื่อนไข
    let payload = { role: 'user' };
    if (username === "admin") {
        payload = { role: 'admin' };
    }

    // สร้าง Token (Sign)
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    
    res.json({ token });
});

// --- 2. Authentication Middleware ---
// ทำหน้าที่ "แกะซอง" ตรวจสอบว่า Token ถูกต้องไหม
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // แยก 'Bearer <token>'

    if (!token) return res.sendStatus(401); // ถ้าไม่มี Token ให้ส่ง 401 Unauthorized

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // ถ้า Token ปลอมหรือหมดอายุ ส่ง 403 Forbidden
        
        req.user = user; // เก็บข้อมูล payload (role) ลงใน req.user เพื่อใช้ต่อ
        next(); // ผ่านไปขั้นตอนถัดไป
    });
};

// --- 3. Authorization Middleware (checkAdmin) ---
// ทำหน้าที่ "ตรวจบัตร" ว่าเป็น Admin หรือเปล่า
const checkAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        next(); // ถ้าเป็น admin ให้ไปต่อ
    } else {
        res.status(403).send("Forbidden: Admins only"); // ถ้าไม่ใช่ admin ปฏิเสธการเข้าถึง
    }
};

// --- 4. Protected Route /admin-only ---
app.get('/admin-only', authenticateToken, checkAdmin, (req, res) => {
    res.send("Welcome, Admin! This is top secret information.");
});

app.listen(3000, () => console.log('Server running on port 3000'));