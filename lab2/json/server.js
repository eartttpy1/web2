const express = require('express');
const BookSerializer = require('./serializers/book.serializer'); 
const UserSerializer = require('./serializers/user.serializer'); 
const app = express();
const port = 3000;

app.use(express.json());

// --- Mock Data ---
let books = [
    { id: "1", title: "The Great Gatsby", isbn: "978-0743273565", author: "F. Scott Fitzgerald" }
];

let users = [
    { id: "1", firstName: "John", lastName: "Doe", email: "john@example.com", occupation: "Software Engineer" },
    { id: "2", firstName: "Jane", lastName: "Smith", email: "jane@example.com", occupation: "Designer" }
];

// --- Books ---
app.get('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (!book) return res.status(404).json({ errors: [{ detail: "Book not found" }] });
    
    res.json(BookSerializer.serialize(book));
});

// --- Users ---
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            errors: [
                {
                    status: "404",
                    title: "User Not Found",
                    detail: `ไม่พบผู้ใช้งานรหัส ${id} ในระบบ`
                }
            ]
        });
    }
    const responseData = UserSerializer.serialize(user);
    res.json(responseData);
});

app.listen(port, () => {
    console.log(`JSON:API Server running at http://localhost:${port}`);
});