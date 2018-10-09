# Operations

Documentation of various operations by operationId:

{{#each operations}} * [{{@key}}](#{{toVariableName @key}})
{{/each}}


{{#each operations}}## <a name="{{toVariableName @key}}"></a>{{@key}} - {{capitalize method}} {{path}}{{#if description}}

{{description}}{{/if}}

{{#or (nonEmpty parsedParameters.path) (nonEmpty parsedParameters.cookie) (nonEmpty parsedParameters.query) (nonEmpty parsedParameters.header)}}### Parameters

{{#each ../parsedParameters.path}} * `{{solveOasType @root.project.language.id schema @root.modelsCache}} {{sanitizedName}}`: Parameter `{{name}}` inside path{{#if description}}. Description: {{description}}{{/if}}
{{/each}}{{#each ../parsedParameters.cookie}} * `{{solveOasType @root.project.language.id schema @root.modelsCache}} {{sanitizedName}}`: Parameter `{{name}}` inside cookie{{#if description}}. Description: {{description}}{{/if}}
{{/each}}{{#each ../parsedParameters.query}} * `{{solveOasType @root.project.language.id schema @root.modelsCache}} {{sanitizedName}}`: Parameter `{{name}}` inside query{{#if description}}. Description: {{description}}{{/if}}
{{/each}}{{#each ../parsedParameters.header}} * `{{solveOasType @root.project.language.id schema @root.modelsCache}} {{sanitizedName}}`: Parameter `{{name}}` inside header{{#if description}}. Description: {{description}}{{/if}}
{{/each}}

{{/or}}### Functions

{{#each functions}} * `{{name}}()`: Function that sends the request with {{#if json}}Json body{{else if form}}form {{contentType}} body{{else if stream}}{{contentType}} stream body{{else if buffer}}{{contentType}} buffer body{{else}}empty body{{/if}}
{{/each}}

{{#if security}}### Security Requirements

{{#each security}} * `{{@key}}` provided by `attach{{capitalize (sanitize @key)}}Security()`;
{{/each}}{{/if}}

{{/each}}