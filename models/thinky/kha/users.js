var type = require('thinky').type;

module.exports = {

  database: 'kha',

  name: 'users',

  schema: {
    
    id: type.string(),

    name: type.string()
    
  }
};
