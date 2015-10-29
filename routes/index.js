module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function(req, reply) {
      reply().code(200);
    }
  }
];
