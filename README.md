# vertx-starter

This is a simple online generator for vert.x projects

The whole SPA is data driven, build tools can be added to the file [buildtools.json](buildtools.json).

# Data files

### buildtools.json

`buildtools.json` file is composed of several properties:

* `id` an unique id for the tool
* `file` just a placeholder to show on screen (has no side effects)
* `fields` a list of properties that will be available to the template engine
* `languages` supported languages
* `templates` simple templates that apply to all languages
* `defaults` default dependencies that are automatically selected for this tool
* `executables` list of template elements that should be marked as executable (required for unix OSes)
* `blob` a existing zip file that will be merged to the final zip

#### fields

A `field` can be seen as a variable that can be used later on the code generation.

It allows the following properties:

* `key` unique id
* `label` the label for the key
* `required` boolean
* `prefill` a default value for the key

#### languages

A language represents a programming language and has the following properties:

* `id` an unique id (should match the `vertx-lang-xxx`)
* `templates` a extra list of templates for this language

### components.json

Components represent all dependencies you can add to the project. Components can be added to the file [components.json](components.json)

Components have the following properties:

* `groupId`
* `artifactId`
* `version`
* `stack` is the component part of the official stack
* `description`

### presets.json

Preset projects can be added to the generator. They are listed in the file [presets.json](presets.json).

A preset has the following properties:

* `id` an unique id
* `description` a simple description
* `dependencies` a list of dependencies to be added by default
* `buildtool` the tool that this preset expect to be present
* `language` the language this preset requires
* `templates` a list of extra templates that are required for this preset (no file name translation will occurr)
* `executables` a list of extra executable templates that are required for this preset
* `blob` a existing zip file that will be merged to the final zip (will override build tool one)

## Templates

The generated project comes from the handlebars templates under `templ` for each build tools there should be a folder. In this folder all files will be handled as handlebars templates.

When dealing with templates that need to live in a specific package name the following rules apply:

1. The metadata should refer to the file using the following pattern: `some-dir/{packageName}/File.extension`
2. The file should be saved excluding any package e.g.: `some-dir/File.extension`

Important to note that extra packages after the `{packageName}` are allowed e.g.: `some-dir/{packageName}/impl/File.extension`.

## Build process

There is no build process except if templates are added/modified. In this case handlebars needs to precompile the templates.

This can be done using `NPM`, start by installing the required dependencies:

```
npm install
```

And then compile the templates:

```
npm run build
```
