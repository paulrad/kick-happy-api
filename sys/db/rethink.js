var rethinkConnections = KH.config('dbs.rethink');

rethinkConnections.forEach(function(rethinkConnection) {

  var thinkyConnection = require('thinky')(rethinkConnection);

  thinkyConnection.dbReady().then(function() {
    KH.log("info", "Connected to the rethink database: %s", rethinkConnection.db);
  });

  thinkyConnection.dbReady().catch(function() {
    KH.log("error", "I can't perform this rethinkdb connection");
  });

  KH.$store('dbs', 'rethink', rethinkConnection.db, thinkyConnection);
});

// Load thinky models
require('./rethink.models.js').loader();
