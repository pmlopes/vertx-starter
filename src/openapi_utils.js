let SwaggerParser = require('swagger-parser');
let YAML = SwaggerParser.YAML;

let isBrowser = new Function("try {return this===window;}catch(e){ return false;}");

function loadOpenAPIAndValidate(file) {
  if (isBrowser()) {
    let parsedOpenapiObject = YAML.parse(file);
    return SwaggerParser
      .resolve(parsedOpenapiObject, {
        external: false
      })
      .then(refs => {
        return Promise.resolve({
          original: parsedOpenapiObject,
          refs: refs
        })
      });
  } else {
    return SwaggerParser
      .parse(file)
      .then(api => {
        return SwaggerParser
          .resolve(api)
          .then(refs => {
            return Promise.resolve({
              original: api,
              refs: refs
            })
          });
      });
  }
}

exports.loadOpenAPIAndValidate = loadOpenAPIAndValidate;
