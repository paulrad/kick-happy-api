var models = KH.utils.getFiles('models/mongoose/**/*.js', true);

if (models) {
  models.forEach(function(model) {

    var modelObject = require(model);

    if (KH.utils.isObject(modelObject)) {

      KH.model(modelObject);
    } else {
      // @todo
      // debug or trace - model is not a valid object
    }

  });
}