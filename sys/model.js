/**
 * modelDbInstaller
 *
 */

 var _ = require('lodash');

 var defaultsConfigurations = {};

 var modelDbInstaller = function(dbtype, configuration) {

  try {
    var ModelFunction = require('./db/' + dbtype + '.models.js').model;
  } catch (e) {
    throw new Error("I can't find a valid model constructor for the db system " + dbtype);
    return ;
  }

  var cacheKey = function() {
    return dbtype + '.' + configuration.name + '.' + configuration.database;
  }();

  if (KH.utils.isUndefined(defaultsConfigurations[cacheKey])) {
    defaultsConfigurations[cacheKey] = configuration;
  } else {
    defaultsConfigurations[cacheKey] = _.merge(defaultsConfigurations[cacheKey], configuration);
  }

  return ModelFunction(defaultsConfigurations[cacheKey]);
 };



/**
 * KH.model(modelName)
 * @params {String} modelName
 * @params {Object} modelObject
 *
 * @description
 * Getter / Setter of mongoose object
 *
 * @usage (getter)
 * KH.model('dbtype.database.collection');
 *
 * If the specified model doesn't exists, KH.model throw an exception
 *
 * @usage (setter) - used by the internal KH builtins
 * // for mongoose model
 * KH.model(DBTYPE, {
 *   database: 'kha',
 *   collection: 'users',
 *   schema: {}
 * });
 *
 * @returns {Function} register mongoose model
 * @returns {Object} KH if KH.model is used as setter
 */
var model = function model(model, configuration) {

  if (KH.utils.isDefined(model) && KH.utils.isDefined(configuration)) {
    return modelDbInstaller(model, configuration);
  }

  // getModel
  var getModel = function getModel() {
    var arrArg = model.split('.');

    if (! arrArg || arrArg.length !== 3) {
      throw new Error("KH.model need this parameter scheme : dbtype.database.collection");
      return false;
    }

    var dbtype = arrArg[0];
    var database = arrArg[1];
    var collection = arrArg[2];

    return KH.$getPromise('models', dbtype, database, collection);
  };

  return getModel();
};

KH.extend('model', model);