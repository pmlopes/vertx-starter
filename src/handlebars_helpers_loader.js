let _ = require('lodash');
let OAS3Utils = require('./openapi_utils.js')

exports.load = Handlebars => {
  Handlebars.registerHelper('escape', function (variable) {
    return variable.replace(/(['"])/g, '\\$1');
  });
  Handlebars.registerHelper('raw-helper', function (options) {
    return options.fn();
  });

  Handlebars.registerHelper('stringify', function (obj, indent) {
    if (!_.isNumber(indent)) {
      indent = 0;
    }
    return JSON.stringify(obj, null, indent);
  });

  Handlebars.registerHelper('solveOasType', function(language, modelType, type, format) {
    if (modelType) {
      return modelType;
    } else
      return OAS3Utils.solveOasType(language, type, format);
  });

  Handlebars.registerHelper('sanitizeOasParameterName', OAS3Utils.sanitizeParameterName);

  Handlebars.registerHelper('firstUppercase', s => s.charAt(0).toUpperCase() + s.slice(1));

  Handlebars.registerHelper('eq', (p1, p2) => {
    return p1 === p2;
  })

  Handlebars.registerHelper('eqAny', (x, ...args) => {
    return _.reduce(args, (r, y) => r || (x === y), false);
  })

  Handlebars.registerHelper('and', (...args) => {
    return _.reduce(args, (r, y) => r && y, true);
  })

  Handlebars.registerHelper('or', (...args) => {
    return _.reduce(args, (r, y) => r || y, false);
  })

};
