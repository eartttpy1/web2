const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const app = express();
const prisma = new PrismaClient();
const port = 3000;
const SECRET_KEY = "kmutt_secret"; // คีย์ลับสำหรับ JWT

app.use(express.json());

// --- 1. JSON:API Serializer Configuration ---
const BookSerializer = new JSONAPISerializer('books', {
    attributes: ['title', 'price', 'categories'],
    keyForAttribute: 'camelCase',
    categories: {
        ref: 'id',
        attributes: ['name']
    }
});

// --- 2. Authentication & Authorization Middlewares ---

// ตรวจสอบว่ามี Token และถูกต้องหรือไม่ (Authentication)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ errors: [{ detail: "Unauthorized: Missing Token" }] });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ errors: [{ detail: "Forbidden: Invalid Token" }] });
        req.user = decoded; // เก็บข้อมูล user (เช่น id, role) ไว้ใน req
        next();
    });
};

// ตรวจสอบสิทธิ์ว่าเป็น Admin หรือไม่ (Authorization)
const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ errors: [{ detail: "Forbidden: Admins only" }] });
    }
};

// --- 3. Routes ---

// Route สำหรับ Login (เพื่อเอา Token ไปใช้ทดสอบ)
app.post('/api/login', (req, res) => {
    const { username } = req.body;
    let payload = { username, role: 'user' };
    
    if (username === 'admin') {
        payload.role = 'admin';
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Route: Get Book by ID (ต้อง Login ก่อน)
app.get('/api/books/:id', authenticateToken, async (req, res) => {
    try {
        const book = await prisma.book.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { categories: true }
        });

        if (!book) return res.status(404).json({ errors: [{ detail: "Book not found" }] });

        res.json(BookSerializer.serialize(book));
    } catch (error) {
        res.status(500).json({ errors: [{ detail: error.message }] });
    }
});

// Route: Create Book (ต้องเป็น Admin เท่านั้น)
app.post('/api/books', authenticateToken, checkAdmin, async (req, res) => {
    try {
        const { title, price, categoryIds } = req.body; // รับ ID ของหมวดหมู่มาเป็น Array
        const newBook = await prisma.book.create({
            data: {
                title,
                price: parseFloat(price),
                categories: {
                    connect: categoryIds.map(id => ({ id: parseInt(id) }))
                }
            },
            include: { categories: true }
        });

        res.status(201).json(BookSerializer.serialize(newBook));
    } catch (error) {
        res.status(400).json({ errors: [{ detail: error.message }] });
    }
});

app.listen(port, () => {
    console.log(`🚀 API Gateway running at http://localhost:${port}`);
});