var Types = require('mongoose').Schema.Types;
var bcrypt = require('bcrypt');

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

    password: {
      type: String,
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

    accessTokens: [ ],

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
    // @from http://stackoverflow.com/questions/14588032/mongoose-password-hashing
    comparePassword: function(candidatePassword, cb) {
      return bcrypt.compareSync(candidatePassword, this.password);
    }
  },

  // List of statics accessibles
  statics: {
  },

  // List of middleware
  // @see http://mongoosejs.com/docs/middleware.html
  middleware: {
    pre: {
      init: [],
      validate: [],
      save: [
        // @from http://stackoverflow.com/questions/14588032/mongoose-password-hashing
        function(next) {
          var user = this;

          if (! user.isModified('password')) {
            return next();
          }

          var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(user.password, salt);
          user.password = hash;
          next();

        }
      ],
      remove: [],
      count: [],
      find: [],
      // ... see complete list at http://mongoosejs.com/docs/middleware.html
    },
    post: { /** you can create post middleware here too */}
  }

};