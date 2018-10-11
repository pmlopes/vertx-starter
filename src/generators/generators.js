let _ = require('lodash')

let generators = {
  default: require('./default').generate,
  "OpenAPI Client": require('./OpenAPI_Client').generate,
  "OpenAPI Server": require('./OpenAPI_Server').generate
}

exports.resolveGenerator = (presetId) => _.get(generators, presetId, generators.default)
