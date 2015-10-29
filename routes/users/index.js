module.exports = [
  {
    method: 'GET',
    path: '/users',
    handler: function(req, reply) {
      reply().code(200);
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
      reply().code(200);
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
