/**
 * KH/A
 * @author Paul Rad <paul@paulrad.com>
 * @homepage https://github.com/paulrad/kick-happy-api
 * @copyright 2015 Paul Rad
 * MIT Licence (MIT)
 */

require('./sys/kh.js');

console.log(KH);


process.on('uncaughtException', function(internalError) {
  console.error(internalError);
});
