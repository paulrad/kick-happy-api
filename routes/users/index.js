/**
 *
 *
 */

var Joi = require('joi');

module.exports = [
  {
    method: 'GET',
    path: '/users',
    config: {
      auth: {
        strategy: 'simple',
        scope: 'admin'
      }
    },
    handler: function(req, reply) {
      var dbquery = KH.model('mongo.kha.users').find({}).lean().exec();

      dbquery.then(function(users) {
        reply(users).code(200);
      });

      dbquery.onReject(function(err) {
        reply(err).code(500);
      });
    }
  },
  
  {
    method: 'GET',
    path: '/users/{id}',
    handler: function(req, reply) {
      reply().code(200);
    }
  },
  
  {
    method: 'POST',
    path: '/users',
    config: {
      validate: {
        payload: {
          email: Joi.string().email().required(),
          password: Joi.string(),
          firstname: Joi.string().required(),
          lastname: Joi.string().required()
        }
      }
    },
    handler: function(req, reply) {
      var dbquery = KH.model('mongo.kha.users').create(req.payload);

      dbquery.then(function() {
        reply().code(201);
      });

      dbquery.onReject(function() {
        reply().code(500);
      });
    }
  },
  
  {
    method: 'PUT',
    path: '/users',
    handler: function(req, reply) {
      reply().code(200);
    }
  },
  
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: function(req, reply) {
      reply().code(200);
    }
  }
  
];
