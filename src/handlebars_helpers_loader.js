let _ = require('lodash');

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

};
