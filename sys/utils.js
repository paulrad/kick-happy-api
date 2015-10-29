/**
 * KH/A
 * @author Paul Rad <paul@paulrad.com>
 * @homepage https://github.com/paulrad/kick-happy-api
 * @copyright 2015 Paul Rad
 * MIT Licence (MIT)
 */

var fs = require('fs');

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
    dependencies = require('./package.json')[dependencies];
  }

  var formatName = function(name) {
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
 * getFiles(string: path)
 * Retourne une liste de fichiers présents dans `path`
 * @return
 * Tableau de fichiers en chemin absolu
 */
var getFiles = function(path) {
  path = path[path.length-1] !== '/' ? path + '/' : path;
  var files = [];
  var directories = [];

  try {
    files = fs.readdirSync(__dirname + '/' + path);
  } catch (e) {
    console.error(e);
    process.exit();
  }

  files = files.map(function(file) {
    if (path[0] === '/') {
      path = path.substr(1);
    }
    return __dirname + '/' + path + file;
  });

  files.forEach(function(file) {
    if (fs.lstatSync(file).isDirectory()) {
      var subfiles = [];
      var relpath = file.replace(__dirname, '');

      getFiles(relpath).forEach(function(subfile) {
        subfiles.push(subfile);
      });

      if (subfiles.length) {
        files = files.concat(subfiles);
      }
      directories.push(file);
    }
  });

  directories.forEach(function(directory) {
    files.splice(files.indexOf(directory), 1);
  });

  return files;
};

/**
 * loadFiles(string: path)
 * Charge le contenu des fichiers présent dans 'path'
 * @returnsType {Object}
 * @returns A object which contains each files contents
 */
var loadFiles = function(path) {
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
var isFile = function(path) {
  try {
    var check = fs.lstatSync(path).isFile();
  } catch(e) {
    console.error(e);
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
var isDirectory = function(path) {
  return !isFile(path);
};


module.exports = {
  getDependencies: getDependencies,
  getFiles: getFiles,
  loadFiles: loadFiles,
  isFile: isFile,
  isDirectory: isDirectory
};
