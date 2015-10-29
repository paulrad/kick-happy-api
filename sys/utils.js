/**
 * KH/A
 * @author Paul Rad <paul@paulrad.com>
 * @homepage https://github.com/paulrad/kick-happy-api
 * @copyright 2015 Paul Rad
 * MIT Licence (MIT)
 */

var fs = require('fs');
var glob = require('glob');

/**
 * getDependencies(dependencies, setGlobal)
 * @params dependencies {String}
 * @params setGlobal {Boolean} default = false
 * @usage
 * getDependencies('dependencies') 
 * @returnsType {Array}
 * @returns Array of fetched dependencies
 */
var getDependencies = function getDependencies(dependencies, setGlobal /* false */) {

  if (typeof dependencies === 'string') {
    dependencies = require('../package.json')[dependencies];
  }

  var formatName = function formatName(name) {
    var hash = '';
    if (~name.indexOf('-')) {
      var namearr = name.split('-');

      if (name !== 'gulp' && name.substr(0, 4) === 'gulp') {
        hash = 'g' + (namearr.length > 2 ? 
            namearr.splice(0, 1) && namearr.join('') : 
            namearr[namearr.length - 1]
          );
      } else {
        hash = name.replace(/(\-\w)/g, function (m) {
          return m[1].toUpperCase();
        });
      }
    } else {
      hash = name;
    }
    return hash;
  };

  var outDependencies = {};

  for (var dependency in dependencies) {
    outDependencies[formatName(dependency)] = require(dependency);
  }

  if (setGlobal === true) {
    for (var dependency in outDependencies) {
      global[dependency] = outDependencies[dependency];
    }
    delete outDependencies;
    return true;
  }

  return outDependencies;
};

/**
 * getFiles(string: path, string: realpath)
 * @params {String} path
 * @params {String} extensions
 * @return
 * Tableau de fichiers en chemin absolu si realpath est à true
 */
var getFiles = function getFiles(path, realpath) {
  return glob.sync(path, {
    cwd: require('path').join(__dirname, '..'),
    nodir: true,
    realpath: realpath
  });
};

/**
 * loadFiles(string: path)
 * Charge le contenu des fichiers présent dans 'path'
 * @returnsType {Object}
 * @returns A object which contains each files contents
 */
var loadFiles = function loadFiles(path) {
  return getFiles(path).map(function(file) {
    return require(file);
  });
};

/**
 * isFile(string: path)
 * Is `path` is a file ?
 * @returnsType boolean
 * @returns `true` if the given file is a type file
 */
var isFile = function isFile(path) {
  try {
    var check = fs.lstatSync(path).isFile();
  } catch(e) {
    throw e;
    return false;
  }
  return check;
};

/**
 * isDirectory(string: path)
 * Is `path` is a directory ?
 * @returnsType boolean
 * @returns `true` if the given file is a type directory
 */
var isDirectory = function isDirectory(path) {
  return !isFile(path);
};

/**
 * isArray(string arg)
 * Is `arg` is an array ?
 * @returnsType boolean
 */
var isArray = function isArray(arg) {
  return Array.isArray(arg);
};

/**
 * isObject(argument)
 * Is `argument` is an object ?
 * @returnsType {Boolean}
 */
var isObject = function isObject(arg) {
  return typeof arg === 'object';
};

module.exports = {
  getDependencies: getDependencies,
  getFiles: getFiles,
  loadFiles: loadFiles,
  isFile: isFile,
  isDirectory: isDirectory,
  isArray: isArray,
  isObject: isObject
};
