exports.load = Handlebars => {
  let _ = require('lodash');
  let utils = require('handlebars-utils')
  let OpenAPISanitizers = require('./openapi/OpenAPISanitizers')
  let OpenAPIMetadataHandler = require('./openapi/OpenAPIMetadataHandler')

  /**
   * Some code was taken from handlebars-helpers
   * https://github.com/helpers/handlebars-helpers
   * Released under the MIT License
   * Copyright (c) 2013-2015, 2017, Jon Schlinkert, Brian Woodward
   */

  function generateConditionalHelper(fnCondition) {
    return (...args) => {
      if (utils.isOptions(args[args.length - 2])) {
        return utils.value(fnCondition(args.slice(0, args.length - 2)), {}, args[args.length - 2]);
      }
      if (utils.isBlock(args[args.length - 1])) {
        return !!fnCondition(args.slice(0, args.length - 1)) ? args[args.length - 1].fn(args[args.length - 2]) : args[args.length - 1].inverse(args[args.length - 2]);
      }
      return fnCondition(args)
    }
  }

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

  Handlebars.registerHelper('split', function(str, splitter) {
    return str.split(splitter);
  })

  Handlebars.registerHelper('get', (obj, i, def) => _.get(obj, i, def))

  Handlebars.registerHelper('solveOasType', OpenAPIMetadataHandler.solveOasType);
  Handlebars.registerHelper('solveOasTypeForService', OpenAPIMetadataHandler.solveOasTypeForService);
  Handlebars.registerHelper('castIfNeeded', OpenAPIMetadataHandler.castIfNeeded);
  Handlebars.registerHelper('castBodyIfNeeded', OpenAPIMetadataHandler.castBodyIfNeeded);
  Handlebars.registerHelper('toVariableName', OpenAPISanitizers.toVariableName);
  Handlebars.registerHelper('toClassName', OpenAPISanitizers.toClassName);
  Handlebars.registerHelper('sanitize', OpenAPISanitizers.sanitize)

  Handlebars.registerHelper('capitalize', s => s.charAt(0).toUpperCase() + s.slice(1));

  Handlebars.registerHelper('not', (condition, options) => {
    return utils.value(!condition, this, options);
  })

  Handlebars.registerHelper('eq', (a, b, options) => {
    if (arguments.length === 2) {
      options = b;
      b = options.hash.compare;
    }
    return utils.value(a === b, this, options);
  })

  Handlebars.registerHelper('brace', s => "{" + s + "}");

  function orBooleanArray(arr) {
    return _.reduce(arr, (r, y) => r || y, false);
  }

  function andBooleanArray(arr) {
    return _.reduce(arr, (r, y) => r && y, true);
  }

  function eqAnyArray(arr) {
    let x = arr[0];
    arr = arr.slice(1);
    return _.reduce(arr, (r, y) => r || (x === y), false);
  }

  Handlebars.registerHelper('and', generateConditionalHelper(andBooleanArray))
  Handlebars.registerHelper('or', generateConditionalHelper(orBooleanArray))
  Handlebars.registerHelper('eqAny', generateConditionalHelper(eqAnyArray))
  Handlebars.registerHelper('nonEmpty', generateConditionalHelper(arr => !_.isEmpty(arr[0])))
  Handlebars.registerHelper('isEmpty', generateConditionalHelper(arr => _.isEmpty(arr[0])))
  Handlebars.registerHelper('size', _.size)
};
