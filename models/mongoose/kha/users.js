var Types = require('mongoose').Schema.Types;

module.exports = {

  // Is required only in the case where your use multiple mongodb connections
  database: 'kha',

  // The name of your collection
  name: 'users',

  // The mongoose schema
  schema: {

    email: {
      type: String,
      index: true,
      required: true
    },

    firstname: {
      type: String,
      required: true
    },

    lastname: {
      type: String,
      required: true
    },

    createdAt: {
      type: Date,
      default: function() {
        return Date.now();
      }
    }
  },

  // @see http://mongoosejs.com/docs/guide.html#options
  options: {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  },

  // @see http://mongoosejs.com/docs/guide.html#virtuals
  virtuals: {
    fullname: {
      get: function() {
        return this.firstname + ' ' + this.lastname;
      },
      set: function(name) {
        var split = name.split(' ');
        this.firstname = split[0];
        this.lastname = split[1];
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
  },

  // List of middleware
  // @see http://mongoosejs.com/docs/middleware.html
  middleware: {
    pre: {
      init: [],
      validate: [],
      save: [],
      remove: [],
      count: [],
      find: [],
      // ... see complete list at http://mongoosejs.com/docs/middleware.html
    },
    post: { /** you can create post middleware here too */}
  }

};