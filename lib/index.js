var Joi = require('joi');

exports.register = function (server, options, next) {

  var schema = {
    ignoredKeys: Joi.array().includes(Joi.string()).optional(),
    defaultEnabled: Joi.boolean().optional()
  };

  options.ignoredKeys = options.ignoredKeys || [];

  try {
    Joi.assert(options, schema, 'Invalid Configuration Option');
  } catch (ex) {
    return next(ex);
  }

  server.ext('onPreHandler', function (request, reply) {
    var settings = request.route.settings.plugins.queryFilter;
    var filter = {};

    if (options.defaultEnabled || (settings && settings.enabled)) {
      // Concatenate route level ignoredKeys with server level
      if (settings && settings.ignoredKeys) {
        options.ignoredKeys = options.ignoredKeys.concat(settings.ignoredKeys);
      }

      if (settings && settings.params && settings.params.length > 0) {
        settings.params.forEach(function (param) {
          filter[param] = request.params[param];
        });
      }

      Object.keys(request.query).forEach(function (key) {
        if (options.ignoredKeys.indexOf(key) === -1) {
          filter[key] = request.query[key];
          delete request.query[key];
        }
      });

      request.query.filter = filter;
    }

    reply.continue();
  });

  next();
};

exports.register.attributes = {
  name: 'queryFilter',
  version: '1.0.0'
};
