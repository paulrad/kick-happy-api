module.exports = [
  {
    method: 'GET',
    path: '/users',
    handler: function(req, reply) {
      var dbquery = KH.model('kha.users').find({}).exec();

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
    handler: function(req, reply) {
      var dbquery = KH.model('kha.users').create(req.payload);

      dbquery.then(function() {
        reply().code(201);
      });

      dbquery.onReject(function(err) {
        reply(err).code(500);
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
