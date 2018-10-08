let _ = require('lodash')

let generators = {
    default: require('./default').generate
}

exports.resolveGenerator = (presetId) => _.get(generators, presetId, generators.default)