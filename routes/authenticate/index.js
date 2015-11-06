var Q = require('bluebird');
var Joi = require('joi');
var Users = KH.model('mongo.kha.users');

/**
 * POST /authenticate
 * @description
 * Check credentials and generate a new JWT accessToken
 */
module.exports = [
  {
    method: 'POST',
    path: '/authenticate',
    config: {
      validate: {
        payload: {
          email: Joi.string().email().required(),
          password: Joi.string().required()
        }
      }
    },
    handler: function(req, reply) {
      var dbquery = Users.authenticate(req.payload);

      dbquery.then(function(authToken) {
        if (! authToken) {
          reply().code(401);
        } else {
          reply({
            auth_token: authToken
          });
        }
      });

      dbquery.catch(function(err) {
        console.error(err);
        reply().code(500);
      });
    }
  },

  /**
   * POST /authenticate/refresh_token
   * @description
   * Revoke current token and create a new one
   */
  {
    method: 'POST',
    path: '/authenticate/refresh_token',
    config: {
      auth: {
        strategy: 'simple'
      }
    },
    handler: function(req, reply) {

      var accessToken = req.auth.credentials.createAccessToken();
      reply({
        access_token: accessToken
      }).code(201);

    }
  }
];
