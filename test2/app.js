const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let books = [
  { id: 1, name: "Clean Code", price: 500 },
  { id: 2, name: "Design Patterns", price: 650 }
];

counter = 3;

app.get('/books', (req,res) =>{
    let result = [...books];
    const {name, minPrice, maxPrice} = req.query;
    if(name){
        result = result.filter(b => b.name,toLowerCase().includes(name.toLowerCase()));
    }
    if(minPrice){
        result = result.filter(b => b.price >= parseFloat(minPrice));
    }
    if(maxPrice){
        result = result.filter(b => b.price <= parseFloat(maxPrice));
    }
    res.status(200).json(result);
});

app.get('/books/:id', (req,res) =>{
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);

    if(!book){
        return res.status(404).json({message: "Book not found"})
    }
    res.status(200).json(book);
});

app.post('/books', (req,res) => {
    let newBook = req.body;
    if(!newBook.name && !newBook.price){
        return res.status(400).json({message: "Invalid input"})
    }

    newBook.id = counter++;
    books.push(newBook);

    res.status(201).json(newBook);
});

app.patch('/books/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    const index = updateData.findIndex(b => b.id === id);

    if(index === -1){
        return res.status(404).json({message: "Book not found"})
    }

    books[index].name = updateData.name ||  books[index].name;
    books[index].price = updateData.price ||  books[index].price;
    res.status(200).json(books[index]);
});

app.delete('/book/:id', (res,req) => {
    const id = parseInt(req.params.id);
    const index = updateData.findIndex(b => b.id === id);

    if(index === -1){
        return res.status(404).json({message: "Book not found"});
    }

    books.splice(index,1);
    res.status(204).send();

});

app.listen(port, () =>{
    console.log(`Book Store API & Docs is running:`);
    console.log(`- API: http://localhost:${port}`);
});