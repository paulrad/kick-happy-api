
/**
 * Model setter configuration
 */
module.exports.model = function(modelConfiguration) {

  if (! KH.$get('dbs', 'rethink', modelConfiguration.database)) {
    throw new Error("The model database seems unregistered");
    return KH;
  }

  var thinkyDb = KH.$get('dbs', 'rethink', modelConfiguration.database);

  var registeredModel = thinkyDb.createModel(modelConfiguration.name, modelConfiguration.schema);

  KH.$store('models', 'rethink', modelConfiguration.database, modelConfiguration.name, registeredModel);

  KH.log("debug", "Registered rethink database.model: %s.%s", modelConfiguration.database, modelConfiguration.name);
};


/**
 * loader
 * Load models when invoked
 */
module.exports.loader = function() {
  var models = KH.utils.getFiles('models/thinky/**/*.js', true);

  if (models) {
    models.forEach(function(model) {

      var modelObject = require(model);

      if (KH.utils.isObject(modelObject)) {
        KH.model('rethink', modelObject);
      } else {
        KH.log("error", "I can't install this scheme, model is not valid");
      }

    });
  }
};