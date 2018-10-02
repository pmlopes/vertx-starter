let inquirer = require('inquirer')

let buildTools = require('../metadata/buildtools.json')
let components = require('../metadata/components.json')
let presets = require('../metadata/presets.json')
let util = require('util')

let _ = require('lodash')

let generationEngine = require('./engine.js')

function mapFieldsToPrompt(fields) {
    return fields.map(f => ({
        "name": f.key,
        "message": f.label,
        "type": f.checkbox ? "confirm" : "input",
        "default": f.prefill
    }))
}

function generateDepsPrompt(requiredDeps) {
    return [{
        "name": "dependencies",
        "message":  "Choose your dependencies",
        "type": "checkbox",
        "choices": components.map(c => {
            if (requiredDeps.find(el => el === ((c.classifier) ? c.groupId + ":" + c.artifactId + ":" + c.classifier : c.groupId + ":" + c.artifactId))) {
                return {
                    "name": (c.classifier) ? c.groupId + ":" + c.artifactId + ":" + c.classifier : c.groupId + ":" + c.artifactId,
                    "value": c,
                    "checked": true,
                    "disabled": "Required"
                }          
            } else {
                return {
                    "name": (c.classifier) ? c.groupId + ":" + c.artifactId + ":" + c.classifier : c.groupId + ":" + c.artifactId,
                    "value": c
                }
            }
        })
    }]
}

let tool
let language
let preset
let deps

inquirer.prompt([
    {
        "name": "tool",
        "message": "Choose the build tool",
        "type": "list",
        "choices": buildTools.map(t => ({"name": t.id, "value": t}))
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
        choices: tool.languages.map(l => ({"name":  l.id, "value": l}))
    }])
}).then(answers => {
    language = answers.language
    return inquirer.prompt([{
        "name": "preset",
        "message": "Choose the project type",
        "type": "list",
        choices: presets.map(p => ({"name":  p.id, "value": p}))
    }])
}).then(answers => {
    preset = answers.preset
    if (preset.fields) {
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
}).then(() => inquirer.prompt(generateDepsPrompt(tool.defaults.concat(preset.dependencies))))
.then(answers => {
    deps = answers.dependencies
    console.log(util.inspect(tool))
    console.log(util.inspect(language))
    console.log(util.inspect(preset))
    console.log(util.inspect(deps))
    generationEngine.compileProject({
        "buildtool": tool,
        "dependencies": deps,
        "language": language,
        "preset": preset,
        "components": components
    }, (err, res) => {
        if (err)
            console.log(utils.inspect(err))
        else
            console.log(util.inspect(res))
    })
});