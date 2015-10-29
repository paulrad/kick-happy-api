var Types = require('mongoose').Schema.Types;

module.exports = {

  // Is required only in the case where your use multiple mongodb connections
  database: 'kha',

  // The name of your collection
  name: 'users',

  // The mongoose schema
  schema: {

    email: {
      type: String
    },

    createdAt: {
      type: Date,
      default: function() {
        return Date.now();
      }
    }
  },

  // An array of the plugins automatically registered on this Schema
  plugins: [
    'lastModified' // will automatically link your plugin lastModified presents in the helpers/mongoose/ directory
  ],

  // List of methods accessibles
  methods: {
    'myMethod': function() {

    }
  },

  // List of statics accessibles
  statics: {
    'myStatic': function() {

    }
  }

};