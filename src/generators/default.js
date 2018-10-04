let _ = require('lodash')

let utils = require('../utils.js')
let templateFunctions = require('../gen/templates.js')

let generate = (project, templates, zip) => {
    return new Promise((resolve, reject) => {
        // merge all templates to be processed
        templates = templates.concat(project.buildtool.templates);
        // merge language specific templates
        if (project.language.templates) {
            templates = templates.concat(project.language.templates);
        }
        // merge preset templates
        if (project.preset) {
            templates = templates.concat(project.preset.templates || []);
            // merge preset language specific templates
            if (project.preset.languages) {
                var presetLanguages = project.preset.languages.filter(function (el) {
                    return el.id === project.language.id;
                });

                if (presetLanguages.length === 1) {
                    templates = templates.concat(presetLanguages[0].templates || []);
                }
            }
        }
        // merge dependency specific templates
        project.dependencies.forEach(function (el) {
            templates = templates.concat(el.templates || []);
            templates = templates.concat(el[project.language.id + 'Templates'] || []);
        });

        // build tool specific templates
        for (let i = 0; i < templates.length; i++) {
            try {
            compile(project, templates[i], project.executables.indexOf(templates[i]) !== -1, zip);
            } catch(e) {
                reject(e)
            }
        }
        resolve(zip)
    });
}

function compile(project, templatePath, exec, zip) {

    // Write inside metadata dirName and fileName
    utils.writeFileAndDirMetadata(project, templatePath)

    let zfile = utils.solveZipDir(project, templatePath);

    // locate handlebars template
    let fn = _.get(templateFunctions, templatePath)
    if (!fn)
        throw new Error("Cannot find template for " + templatePath)

    // Compile with fn and add to zip
    utils.compileAndAddToZip(project, zfile, fn, exec, zip)
}

exports.generate = generate
