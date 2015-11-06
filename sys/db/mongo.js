var Q = require('bluebird');
var Mongoose = require('mongoose');

var mongoConnections = KH.config('dbs.mongo');

if (! KH.utils.isArray(mongoConnections)) {
  throw new Error("The mongodb configuration object should be an array of objects");
  return ;
}

var Promises = [];
mongoConnections.forEach(function(mongoConnection) {
  // create uri, remove double slaghes
  var uri = [ mongoConnection.uri, mongoConnection.database ].join('/').replace(/([^:]\/)\/+/g, '$1');

  var mongooseConnection = Mongoose.createConnection(uri, mongoConnection.options);

  var deferred = Q.defer();

  mongooseConnection.on('error', function(e) {
    KH.log('error', "I can't perform this mongodb connection");
    throw new Error(e);
    deferred.reject(e);
  });

  mongooseConnection.on('connected', function() {
    KH.log('info', "Connected on the mongodb database: %s", mongoConnection.database);
    deferred.resolve();
  });

  KH.$store('dbs', 'mongo', mongoConnection.database, mongooseConnection);

  Promises.push(deferred.promise);
});

// Load mongoose models
Q.all(Promises).then(function() {
  require('./mongo.models.js').loader();
});
