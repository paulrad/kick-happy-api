/**
 * Default authentification strategy scheme using Hapi Auth JWT 2
 * @see https://www.npmjs.com/package/hapi-auth-jwt2
 */

// Validate Function
var validateFunc = function( decoded, request, callback ) {

  var request = this;

  console.log(decoded);

  var dbquery = KH.model('kha.users')
    .findOne({token: token})
    .lean()
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
        algorithms: KH.config('serverAuth.algorithms')
      },
      validateFunc: validateFunc
    });
  }
});

// @name KH.helpers.jwt
// @description Generate new JWT token based on configuration properties
KH.extend('helpers.jwt', function(data) {
  var jwt = require('jsonwebtoken');
  return jwt.sign(data, KH.config('serverAuth.key'), {
    algorithm: KH.config('serverAuth.algorithm')
  })
});
