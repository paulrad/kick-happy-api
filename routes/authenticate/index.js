var joi = require('joi');
var Users = KH.model('mongo.kha.users');

/**
 *
 *
 */
module.exports = [
  {
    method: 'POST',
    path: '/authenticate',
    config: {
      validate: {
        payload: {
          email: joi.string().email().required(),
          password: joi.string().required()
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
  }
];
