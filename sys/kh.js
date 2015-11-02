/**
 * KH/A
 * @author Paul Rad <paul@paulrad.com>
 * @homepage https://github.com/paulrad/kick-happy-api
 * @copyright 2015 Paul Rad
 * MIT Licence (MIT)
 */
var Config = require('config');
var Mongoose = require('mongoose');
var KH = global['KH'] = {};

// the locals variables
var $$ = {
  'controllers': {},
  'helpers': {},
  'models': {},
  'mongooseConnections': {}
};

KH.utils = require('./utils.js');
KH.version = require('../package.json')['version'];

/**
 * KH.$store(key, value)
 * @visibility privacy
 *
 * @usages
 * KH.$store('key', 'value');
 * KH.$store('key', 'subkey', 'subsubkey', 'value')
 *
 * @returns KH
 * @todo description
 */

KH.$store = function $store(key, value /* infinite args where value is the last arg */) {
  if (arguments.length === 2) {
    $$[key] = value;
  } else {
    var args = Array.prototype.slice.call(arguments);
    value = args[args.length - 1];
    arguments = args.splice(args.length - 1, 1);
    var nestedKey = args.join('.');
    return KH.$store(nestedKey, value);
  }
  return KH;
};

/**
 * KH.$get(key)
 *
 * @usages
 * KH.$get('key')
 * KH.$get('key', 'subkey');
 * KH.$get('key', 'subkey', 'subsubkey');
 *
 * @visibility privacy
 * @returns KH
 * @todo {mixed} required object key
 */
KH.$get = function $get(key) {
  var args = Array.prototype.slice.call(arguments);
  if (args.length > 1) {
    var nestedKey = args.join('.');
    return KH.$get(nestedKey);
  };
  return $$[key];
};

// @alias wi throwable exception in case of undefined value
// @todo: undo the duplication... move the nestedKey generation away !
KH.$getStrict = function $getStrict(key) {
  var args = Array.prototype.slice.call(arguments);
  if (args.length > 1) {
    var nestedKey = args.join('.');
    return KH.$getStrict(nestedKey);
  };
  if (typeof $$[key] === 'undefined') {
    throw new Error("The required object isn't again ready");
    return undefined;
  }
  return $$[key];
}

/**
 * KH.config(property)
 * @params {String} property
 * @alias of require('config').get(property)
 */
KH.config = Config.get.bind(Config);

/**
 * KH.controller(path | route)
 * @params {String} route
 * @params {Object} route Hapi route object
 *
 * @description
 * Getter / Setter of hapi controller
 *
 * @usage (getter)
 * KH.controller('get.index');
 * KH.controller('get.users/{id?}');
 * KH.controller('delete.users/{id}');
 *
 * If the specified controller doesn't exists, KH.controller throw an exception
 *
 * @usage (setter) - used by the internal KH builtins
 * KH.controller({
 *   method: 'GET',
 *    path: '/index',
 *    handler: function(req, reply) {
 *      reply('hello world');
 *    }
 * });
 *
 * @returns {Function} if KH.controller is used as getter
 * @returns {Object} KH if KH.controller is used as setter
 */
KH.controller = function controller(route) {

  // KH.controller({String})
  var getController = function getController() {
    if (! $$.controllers[route]) {
      throw new Error("Undefined route reference");
    } else {
      return $$.controllers[route];
    }
  };

  // KH.controller({Object})
  var setController = function setController() {

    var routeObjectToString = function routeObjectToString() {
      var routepath = route.path.toLowerCase();

      if (routepath[0] === '/') {
        routepath = routepath.substr(1);
        if (routepath.length === 0) {
          routepath = 'index';
        }
      };

      if (routepath[routepath.length-1] === '/') {
        routepath = routepath.substr(0, routepath.length - 1);
      };

      return route.method.toLowerCase() + '.' + routepath;
    };

    $$.controllers[routeObjectToString()] = route.handler;
    KH.$get('server').route(route);
    return KH;
  };

  if (KH.utils.isObject(route)) {
    if (! route.method || ! route.path || ! route.handler) {
      throw new Error("The route object should contains method, path and handler properties");
      return KH;
    }
    return setController();
  } else {
    return getController();
  }
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
 * KH.model('database.collection');
 *
 * If the specified model doesn't exists, KH.model throw an exception
 *
 * @usage (setter) - used by the internal KH builtins
 * KH.model({
 *   database: 'kha',
 *   collection: 'users',
 *   schema: {}
 * });
 *
 * @returns {Function} register mongoose model
 * @returns {Object} KH if KH.model is used as setter
 */
KH.model = function model(model) {

  // setModel
  var setModel = function setModel() {

    if (! KH.$get('mongooseConnections', model.database)) {
      throw new Error("The model database seems unregistered");
      return KH;
    }

    var schema = new Mongoose.Schema(model.schema);

    if (model.statics) {
      for (var modelStatic in model.statics) {
        schema.statics[modelStatic] = model.statics[modelStatic];
      }
    }

    if (model.methods) {
      for (var modelMethod in model.methods) {
        schema.methods[modelMethod] = model.methods[modelMethod];
      }
    }

    if (model.middleware) {
      for (var middlewareMethod in model.middleware) {
        for (var middlewareActions in model.middleware[middlewareMethod]) {
          var actions = model.middleware[middlewareMethod][middlewareActions];
          actions.forEach(function(action) {
            var actionObject = {
              parallel: false,
              action: null
            };

            if (KH.utils.isObject(action)) {
              actionObject.parallel = action.parallel || actionObject.parallel;
              actionObject.action = action.action || actionObject.action;
            } else {
              actionObject.parallel = false;
              actionObject.action = action;
            }

            if (actionObject.parallel === true) {
              schema[middlewareMethod](middlewareActions, true, actionObject.action.bind(this));
            } else {
              schema[middlewareMethod](middlewareActions, actionObject.action.bind(this));
            }
          });
        }
      }
    }

    var registeredModel = KH.$getStrict('mongooseConnections', model.database).model(model.name, schema);

    KH.$store('models', model.database, model.name, registeredModel);

    return KH;
  };

  // getModel
  var getModel = function getModel() {

    var arrArg = model.split('.');

    if (! arrArg || arrArg.length !== 2) {
      throw new Error("KH.model need the database.collection argument");
      return false;
    }

    var database = arrArg[0];
    var collection = arrArg[1];

    return KH.$getStrict('models', database, collection);
  };

  if (KH.utils.isObject(model)) {
    return setModel();
  } else {
    return getModel();
  }
};

/**
 * KH.server()
 * @description
 * Get the current Hapi Server object
 * Defined in sys/server.js
 * @returns {Object} Hapi.Server instance
 */
KH.server = function server() {
  return KH.$get('server');
};
