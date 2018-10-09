let _ = require('lodash')

let sanitizeRegex = /([-\/.,_]+.)/g;
let sanitize = (s) => s.replace(sanitizeRegex, v => v.slice(v.length - 1, v.length).toUpperCase());

function toVariableName(oasName) {
    oasName = sanitize(oasName.trim())
    return oasName.charAt(0).toLowerCase() + oasName.slice(1);
}
  
function toClassName(modelName) {
  let class_name = sanitize(modelName);
  class_name = class_name.charAt(0).toUpperCase() + class_name.slice(1);
  return class_name;
}

function sanitizeContentType(contentType) {
  contentType = contentType.trim();
  let i = contentType.indexOf("application/");
  if (i == 0) {
      contentType = sanitize(contentType.slice(12 /* "application/".length */));
      return contentType.charAt(0).toUpperCase() + contentType.slice(1);
  } else {
      contentType = sanitize(contentType);
      return contentType.charAt(0).toUpperCase() + contentType.slice(1);
  }
}

function toPascalCase(str) {
  return str.match(/[a-z]+/gi)
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    })
    .join('')
}

function generateOperationId(method, path) {
  return method.toLowerCase() + toPascalCase(path.split("?")[0]);
}

exports.sanitize = sanitize
exports.toVariableName = toVariableName
exports.toClassName = toClassName
exports.sanitizeContentType = sanitizeContentType
exports.generateOperationId = generateOperationId