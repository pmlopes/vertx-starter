#!/usr/bin/env node

let inquirer = require('inquirer')
let util = require('util')
let _ = require('lodash')
let fs = require('fs')
let path = require('path')
let program = require('commander');
let mkdirp = require('mkdirp');

let metadata = require('./gen/metadata.json')
let buildTools = metadata.buildtools
let components = metadata.components
let presets = metadata.presets
let compileProject = require('./engine.js').compileProject
let utils = require('./utils.js')

program
    .version('1.0.0')
    .option('-z, --zip', 'Produce zip as output')
    .parse(process.argv);

function mapFieldsToPrompt(fields) {
    return fields.map(f => {
    if (!f.type || f.type == 'input') {
        let obj = {
            "name": f.key,
            "message": f.label,
            "type": "input",
        };
        if (f.prefill)
            obj.default = f.prefill
        if (f.required)
            obj.validate = val => (val && val.length > 0) ? true : false
        else {
            obj.message = obj.message + " (Optional)"
            obj.filter = val => (val && val.length > 0) ? val : undefined
        }
        return obj;
    } else {
        return {
            "name": f.key,
            "message": f.label,
            "type": "confirm",
            "default": f.prefill ? f.prefill : false
        }
    }
});
}

function dependencyId(dep) {
    return ((dep.classifier) ? dep.groupId + ":" + dep.artifactId + ":" + dep.classifier : dep.groupId + ":" + dep.artifactId)
}

function generateDepsPrompt(requiredDeps) {
    return [{
        "name": "dependencies",
        "message": "Choose your additional dependencies",
        "type": "checkbox",
        "choices": components
            .filter(c => !requiredDeps.find(dep => dep == dependencyId(c)))
            .map(c => {
            return {
                "name": dependencyId(c),
                "value": c
            }
        })
    }]
}

let tool
let language
let preset
let requiredDepsStrings
let deps

inquirer.prompt([
    {
        "name": "tool",
        "message": "Choose the build tool",
        "type": "list",
        "choices": buildTools.map(t => ({ "name": t.id, "value": t }))
    }
]).then(answers => {
    tool = answers.tool
    return inquirer.prompt(mapFieldsToPrompt(tool.fields))
}).then(answers => {
    tool.fields.forEach(element => {
        element.value = answers[element.key]
    });
    return inquirer.prompt([{
        "name": "language",
        "message": "Choose your language",
        "type": "list",
        choices: tool.languages.map(l => ({ "name": l.id, "value": l }))
    }])
}).then(answers => {
    language = answers.language
    let presetChoices = utils.filterPresets(presets)(language.id, tool.id).map(p => ({ "name": p.id, "value": p }))
    presetChoices.push({ "name": "Empty project", "value": undefined })
    return inquirer.prompt([{
        "name": "preset",
        "message": "Choose the project type",
        "type": "list",
        choices: presetChoices
    }])
}).then(answers => {
    preset = answers.preset
    if (_.has(preset, "fields")) {
        return inquirer
            .prompt(mapFieldsToPrompt(preset.fields))
            .then(answers => {
                preset.fields.forEach(element => {
                    element.value = answers[element.key]
                });
                return Promise.resolve()
            })
    } else {
        return Promise.resolve()
    }
}).then(() => {
    requiredDepsStrings = tool.defaults.concat(_.get(preset, "dependencies", []));
    return inquirer.prompt(generateDepsPrompt(requiredDepsStrings))
}).then(answers => {
        deps = answers.dependencies.concat(
            components.filter(c => (requiredDepsStrings.find(dep => dep == dependencyId(c))) ? true : false)
        );
        compileProject(
            {
                "buildtool": tool,
                "dependencies": deps,
                "language": language,
                "preset": preset,
                "components": components
            },
            () => { },
            (ex) => console.error(ex.message),
            (blobName) => {
                return new Promise((resolve, reject) => {
                    fs.readFile(path.join(__dirname, "..", "blobs", blobName), (err, buffer) => {
                        if (err) reject(err);
                        else resolve(buffer)
                    });
                });
            }
        ).then(zip => {
            if (program.zip) {
                return new Promise((resolve, reject) => {
                    zip
                    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
                    .pipe(fs.createWriteStream('project.zip'))
                    .on('error', (err) => reject(err))
                    .on('finish', () => resolve());
                })
            } else {
                return Promise.all(zip.file(/.*/).map(file => {
                    return new Promise((resolve, reject) => {
                        mkdirp(path.dirname(file.name), (err) => {
                            if (err) {
                                reject(err)
                            }
                            file
                                .nodeStream()
                                .pipe(fs.createWriteStream(file.name))
                                .on('error', (err) => reject(err))
                                .on('finish', function () {
                                    console.log(file.name + " written");
                                    resolve()
                                });
                        });
                    })
                }))
            }
        }).then((res) => {
            console.log("Project generated")
            process.exit(0)
        }).catch(err => {
            console.log(err)
        });
    });
