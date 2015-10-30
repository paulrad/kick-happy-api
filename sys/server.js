var Config = require('config');
var Hapi = require('hapi');

var server = new Hapi.Server();

server.connection( Config.get('server') );

server.start(function(err) {
  // @todo
  // present a verbosity... and some useful informations about the connection
  if (err) {
    KH.log("error", "Hum.. Something is wrong");
    throw err;
    return ;
  }
  KH.log("info", "Server is ready on %s:%s", server.info.host, server.info.port);
});

KH.$store('server', server);