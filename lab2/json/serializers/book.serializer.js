const JSONAPISerializer = require('jsonapi-serializer').Serializer;


const UserSerializer = new JSONAPISerializer('books', {

  attributes: ['title', 'isbn', 'author'],
  
  topLevelLinks: {
    self: 'http://localhost:3000/api/books'
  },
  dataLinks: {
    self: (data) => `http://localhost:3000/api/books/${data.id}`
  }
});

module.exports = UserSerializer;