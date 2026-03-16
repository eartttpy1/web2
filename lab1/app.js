/* This code snippet is setting up a basic Express server in Node.js. Here's a breakdown of what the
code is doing: */
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const app = express();
const port = 8000;

app.use(express.json()); 
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let books = [
    { id: 1, name: "The Great Gatsby", category: "Classic Fiction", price: 320, stock: 15 },
    { id: 2, name: "Atomic Habits", category: "Self-Improvement", price: 285, stock: 20 },
    { id: 3, name: "Dune", category: "Sci-Fi", price: 450, stock: 8 },
    { id: 4, name: "The Silent Patient", category: "Psychological Thriller", price: 350, stock: 12 },
    { id: 5, name: "Sapiens: A Brief History of Humankind", category: "History", price: 590, stock: 5 },
    { id: 6, name: "Harry Potter and the Sorcerer's Stone", category: "Fantasy", price: 395, stock: 25 },
    { id: 7, name: "Thinking, Fast and Slow", category: "Psychology", price: 420, stock: 10 },
    { id: 8, name: "The Alchemist", category: "Philosophy", price: 250, stock: 18 },
    { id: 9, name: "Steve Jobs", category: "Biography", price: 550, stock: 4 },
    { id: 10, name: "Zero to One", category: "Business", price: 300, stock: 14 }
];

let counter = 11; 

app.get('/books', (req, res) => {
    let { name, category, sortBy, order } = req.query;
    let result = [...books];

    if (name) {
        result = result.filter(b => b.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (category) {
        result = result.filter(b => b.category.toLowerCase() === category.toLowerCase());
    }

    if (sortBy && result.length > 0 && result[0].hasOwnProperty(sortBy)) {
        const sortOrder = order === 'desc' ? -1 : 1;
        result.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 * sortOrder : 1 * sortOrder));
    }

    const formattedResult = result.map(book => ({
        id: book.id,
        name: book.name,
        category: book.category,
        price: book.price,
        priceDisplay: `฿${book.price}`,
        stock: book.stock
    }));

    res.status(200).json(formattedResult);
});

app.post('/books', (req, res) => {
    let newBook = req.body;

    if (!newBook.name || !newBook.price) {
        return res.status(400).json({ message: "Name and Price are required" });
    }

    newBook.id = counter++;
    books.push(newBook);

    res.status(201).json({
        message: "Book added to inventory",
        data: newBook
    });
});

app.get('/books/:id', (req, res) => {
    let id = Number(req.params.id);
    let book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
});

app.put('/books/:id', (req, res) => {
    let id = Number(req.params.id);
    let updateData = req.body;
    let index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[index].name = updateData.name || books[index].name;
    books[index].category = updateData.category || books[index].category;
    books[index].price = updateData.price || books[index].price;
    books[index].stock = updateData.stock || books[index].stock;

    res.json({
        message: "Update book complete",
        data: books[index]
    });
});a

app.delete('/books/:id', (req, res) => {
    let id = Number(req.params.id);
    let index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Deleted book from inventory successfully",
        indexDeleted: index
    });
});

app.listen(port, () => {
    console.log(`Book Store API & Docs is running:`);
    console.log(`- API: http://localhost:${port}`);
    console.log(`- Docs: http://localhost:${port}/api-docs`);
});