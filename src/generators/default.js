let _ = require('lodash');

let utils = require('../utils.js');

let generate = (project, templates, zip) => {
    return new Promise((resolve, reject) => {
        // merge all templates to be processed
        templates = utils.mergeTemplates(project, templates);

        // build all templates
        for (let i = 0; i < templates.length; i++) {
            try {
            utils.compileAndAddToZip(project, templates[i], project.executables.indexOf(templates[i]) !== -1, zip);
            } catch(e) {
                reject(e)
            }
        }
        resolve(zip)
    });
};

exports.generate = generate;
