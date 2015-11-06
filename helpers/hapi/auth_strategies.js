/**
 * Default authentification strategy scheme using Hapi Auth JWT 2
 * @see https://www.npmjs.com/package/hapi-auth-jwt2
 */
var EXPIRATION_TIME = '1h'; // one hour

var Q = require('bluebird');
var Mongoose = require('mongoose');

// Validate Function
var validateFunc = function( decoded, options, callback ) {

  var request = this;

  var dbquery = KH.model('mongo.kha.users')
    .findOne({
      _id: decoded.id,
      email: decoded.email
    })
    .exec();

  dbquery.then(function(user) {
    if (user) {
      callback(null, true, user);
    } else {
      callback(null, false);
    }
  });

  dbquery.onReject(function(error) {
    KH.log('error', error);
    callback(null, false);
  });

};

// Plugin registration and configuration
KH.server().register(require('hapi-auth-jwt2'), function(error) {
  if (error) {
    KH.log('error', error);
  } else {
    KH.log('debug', 'Registering auth strategy');
    KH.server().auth.strategy('simple', 'jwt', {
      key: KH.config('serverAuth.key'),
      verifyOptions: {
        algorithms: KH.config('serverAuth.algorithms'),
        expiresIn: EXPIRATION_TIME
      },
      validateFunc: validateFunc
    });
  }
});

// Overriding the users model by adding a new helpers: 
// methods.createAccessToken
// static.authenticate
KH.model('mongo', {
  database: 'kha',
  name: 'users',

  methods: {

    // createAccessToken()
    // @description
    // Create new access token
    //
    // @usage
    // model.createAccessToken()
    //
    // @returns {String} accessToken string
    createAccessToken: function() {
      var user = this;
      
      return KH.helpers.jwt.sign({
        id: user._id,
        email: user.email
      });
    }

  },

  statics: {
    // authenticate(payload)
    // @description
    // Check email / password credentials and then...
    // Create a new access_token
    //
    // @usage
    // KH.model('mongo.kha.users').authenticate(req.payload)
    //
    // @returns {Promise} fulfiled with accessToken string
    authenticate: function(payload) {
      return new Q.Promise(function(resolve, reject) {
        var dbquery = KH.model('mongo.kha.users').findOne({ email: payload.email }).exec();

        var createAccess = function(user) {
          if (user && user.comparePassword(payload.password) === true) {
            var accessToken = user.createAccessToken();
            resolve(accessToken);
          } else {
            resolve(null);
          }
        };

        dbquery.then(createAccess);
        dbquery.onReject(function(error) {
          reject();
        });
      });
    }
  }
});

var JWT = require('jsonwebtoken');

// @name KH.helpers.jwt.sign
// @description Generate new JWT token based on configuration properties
KH.extend('helpers.jwt.sign', function(data) {
  return JWT.sign(data, KH.config('serverAuth.key'), {
    algorithm: KH.config('serverAuth.algorithm'),
    expiresIn: EXPIRATION_TIME
  })
});

// @name KH.helpers.jwt.verify
KH.extend('helpers.jwt.verify', function(token) {
  return JWT.verify(token, KH.config('serverAuth.key'));
});
