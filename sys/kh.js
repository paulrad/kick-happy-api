/**
 * KH/A
 * @author Paul Rad <paul@paulrad.com>
 * @homepage https://github.com/paulrad/kick-happy-api
 * @copyright 2015 Paul Rad
 * MIT Licence (MIT)
 */
var KH = global['KH'] = {};

// the locals variables
var $$ = {
  'controllers': {},
  'connections': {},
  'helpers': {},
  'models': {}
};

KH.utils = require('./utils.js');
KH.version = require('../package.json')['version'];

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
      throw new Error("Undefined controller reference");
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
      };

      if (routepath[routepath.length-1] === '/') {
        routepath = routepath.substr(0, routepath.length - 1);
      };

      return route.method.toLowerCase() + '.' + routepath;
    };

    $$.controllers[routeObjectToString()] = route.handler;
    return KH;
  };

  if (KH.utils.isObject(route)) {
    return setController();
  } else {
    return getController();
  }
};