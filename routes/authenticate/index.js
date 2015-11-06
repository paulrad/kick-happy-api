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
          username: joi.string().email().required(),
          password: joi.string().required()
        }
      }
    },
    handler: function(req, reply) {
      reply();
    }
  }
];
