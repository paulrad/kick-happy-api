var Winston = require('winston');

var logger = new Winston.Logger({
  level: 'info',
  transports: [
    new (Winston.transports.Console)(KH.config('winston.console'))
  ]
});

KH.$store('logger', logger);

KH.log = logger.log.bind(logger);
KH.info = logger.info.bind(logger);