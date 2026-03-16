const JSONAPISerializer = require('jsonapi-serializer').Serializer;


const UserSerializer = new JSONAPISerializer('users', {

  attributes: ['firstName', 'lastName', 'email', 'occupation'],
  
  topLevelLinks: {
    self: 'http://localhost:3000/api/users'
  },
  dataLinks: {
    self: (data) => `http://localhost:3000/api/users/${data.id}`
  }
});

module.exports = UserSerializer;