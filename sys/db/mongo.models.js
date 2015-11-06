var Mongoose = require('mongoose');

/**
 * Model setter configuration
 */
module.exports.model = function(model) {
  if (! KH.$get('dbs', 'mongo', model.database)) {
    throw new Error("The model database seems unregistered");
    return KH;
  }

  var schema = new Mongoose.Schema(model.schema, model.options || {});

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

  if (model.virtuals) {
    for (var modelVirtual in model.virtuals) {
      var getter = model.virtuals[modelVirtual].get;
      var setter = model.virtuals[modelVirtual].set;
      if (getter) {
        schema.virtual(modelVirtual).get(getter);
      }
      if (setter) {
        schema.virtual(modelVirtual).set(setter);
      }
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

  var registeredModel = KH.$getStrict('dbs', 'mongo', model.database).model(model.name, schema);

  KH.$store('models', 'mongo', model.database, model.name, registeredModel);

  KH.log("debug", "Registered mongoose database.model: %s.%s", model.database, model.name);

  return KH;
};


/**
 * loader
 * Load models when invoked
 */
module.exports.loader = function() {
  var models = KH.utils.getFiles('models/mongoose/**/*.js', true);

  if (models) {
    models.forEach(function(model) {

      var modelObject = require(model);

      if (KH.utils.isObject(modelObject)) {
        KH.model('mongo', modelObject);
      } else {
        KH.log("error", "I can't install this scheme, model is not valid");
      }

    });
  }
};
