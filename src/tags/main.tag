
<main>
  <div if={ tool } class="container">
    <div class="help-tip hide-phone">
      <p>
        The build tool can be changed using the hamburger menu on the left. For more information about this tool please visit <a href="{ tool.url }">{ tool.id }</a> website.<br><br>
        This is a progressive webapp, meaning that you can add it to your desktop and it can even run offline. You can boostrap your project even on the go without internet!
      </p>
    </div>
    <h1 class="box">{ tool.id }<img if={ tool.icon } src="img/{ tool.icon }" width="32px" />&nbsp;{ tool.file }</h1>
    <form onsubmit={ generate }>
      <!-- Basic fields -->
      <div each={ f, i in fields } class="row">
        <!-- iterate 2 at a time -->
        <virtual if={ i % 2 === 0 }>
          <div class="col-6">
            <input name="{ fields[i].key }" type={ parseFieldType(fields[i]) } placeholder="{ fields[i].label + (fields[i].prefill ? ' e.g.: ' + fields[i].prefill : '') }" required="{ fields[i].required }">
            <label if={ parseFieldType(fields[i]) == 'checkbox' || parseFieldType(fields[i]) == 'file' }><br><i>{ fields[i].label + (fields[i].prefill ? ' e.g.: ' + fields[i].prefill : '') }</i></label>
          </div>
          <div class="col-6">
            <!-- if there is a next one -->
            <input if={ fields[i+1] }  name="{ fields[i+1].key }" type={ parseFieldType(fields[i + 1]) } placeholder="{ fields[i+1].label + (fields[i+1].prefill ? ' e.g.: ' + fields[i+1].prefill : '') }" required="{ fields[i+1].required }">
            <label if={ fields[i+1] && (parseFieldType(fields[i + 1]) == 'checkbox' || parseFieldType(fields[i + 1]) == 'file') }><br><i>{ fields[i+1].label + (fields[i+1].prefill ? ' e.g.: ' + fields[i+1].prefill : '') }</i></label>
          </div>
        </virtual>
      </div>

      <div if={ tool.languages || presets } class="row">
        <!-- language selection -->
        <div class="col-6">
          <select id="language" disabled="{ !tool.languages || tool.languages.length == 0 }" onchange={ changeLanguage }>
            <option each={ tool.languages } value="{ id }">{ id }</option>
          </select>
        </div>
        <!-- preset selection -->
        <div class="col-6">
          <select id="preset" disabled="{ !presetGroups || presetGroups.length == 0 }" onchange={ changePreset }>
            <option value="">Empty Project</option>
            <optgroup each={ g, i in presetGroups } label="{ i }">
              <option each={ g } value="{ id }">{ id }</option>
            </optgroup>
          </select>
        </div>
      </div>

      <virtual if={ preset }>
        <div if={ preset.fields } class="row">
          <h5>Extra variables for { preset.id }:</h5>
        </div>

        <div each={ f, i in preset.fields } class="row">
          <!-- iterate 2 at a time -->
          <virtual if={ i % 2 === 0 }>
            <div class="col-6">
              <input name="{ preset.fields[i].key }" type={ parseFieldType(preset.fields[i]) } placeholder="{ preset.fields[i].label + (preset.fields[i].prefill ? ' e.g.: ' + preset.fields[i].prefill : '') }" required="{ preset.fields[i].required }">
              <label if={ parseFieldType(preset.fields[i]) == 'checkbox' || parseFieldType(preset.fields[i]) == 'file' }><br><i>{ preset.fields[i].label + (preset.fields[i].prefill ? ' e.g.: ' + preset.fields[i].prefill : '') }</i></label>
            </div>
            <div class="col-6">
              <!-- if there is a next one -->
              <input if={ preset.fields[i+1] }  name="{ preset.fields[i+1].key }" type={ parseFieldType(preset.fields[i+1]) } placeholder="{ preset.fields[i+1].label + (preset.fields[i+1].prefill ? ' e.g.: ' + preset.fields[i+1].prefill : '') }" required="{ preset.fields[i+1].required }">
              <label if={ preset.fields[i+1] && (parseFieldType(preset.fields[i + 1]) == 'checkbox' || parseFieldType(preset.fields[i + 1]) == 'file') }><br><i>{ preset.fields[i+1].label + (preset.fields[i+1].prefill ? ' e.g.: ' + preset.fields[i+1].prefill : '') }</i></label>
            </div>
          </virtual>
        </div>
      </virtual>

      <div class="row" id="interaction">
        <div class="col-8">
          <button name="submit" type="submit">Generate</button>
          &nbsp;
          <a id="download-btn" onclick={ clean } href="#" show={ downloading } ref="download" download="{ name }.zip" style="padding: 1.1rem 3.5rem; margin: 1rem 0; background: #782b90; color: #f5f5f5; border-radius: 2px; border: none; font-size: 1.3rem; transition: all .2s ease">Download</a>
        </div>
        <div class="col-4">
          <div if={ generating } class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-6">
          <h1>Your Dependencies</h1>
        </div>
        <div class="col-6">
          <div id="not-found-tip" class="help-tip hide-phone">
            <p>Use this box to search for dependencies to add to your application, if a dependency is not present, please <a href="https://github.com/pmlopes/vertx-starter/issues/new">open an issue</a> so we can add the missing metadata!</p>
          </div>
          <input type="text" class="pull-right" placeholder="Search dependency or 'group:artifact:version<space>' to add..." onkeyup={ search }>
        </div>
      </div>

      <div each={ c, i in dependencies } class="row">
        <!-- iterate 2 at a time -->
        <virtual if={ i % 2 == 0 }>
          <div class="col-6">
            <div class={ dependency: dependencies[i].checked }>
              <input name="dependencies" type="checkbox" value="{ i }" checked="{ dependencies[i].checked }" onclick={ toggleDependency }>
              <div>
                <span if={ dependencies[i].stack } class="pull-right">&nbsp;<img src="img/stack.svg" width="16px" /></span>
                <span if={ dependencies[i].npm } class="pull-right"><img src="img/npm.svg" width="16px" /></span>
                <strong>{ dependencies[i].artifactId }</strong>
                <hr/>
                <p if={ dependencies[i].deprecated }><strong>DEPRECATED!!!</strong></p>
                <p if={ dependencies[i].description }>{ dependencies[i].description }</p>
              </div>
              <br/>
            </div>
          </div>
          <div class="col-6">
            <!-- if there is a next one -->
            <div if={ dependencies[i+1] } class={ dependency: dependencies[i+1].checked }>
              <input name="dependencies" type="checkbox" value="{ i+1 }" checked="{ dependencies[i+1].checked }" onclick={ toggleDependency }>
              <div>
                <span if={ dependencies[i+1].stack } class="pull-right">&nbsp;<img src="img/stack.svg" width="16px" /></span>
                <span if={ dependencies[i+1].npm } class="pull-right"><img src="img/npm.svg" width="16px" /></span>
                <strong>{ dependencies[i+1].artifactId }</strong>
                <hr/>
                <p if={ dependencies[i+1].deprecated }><strong>DEPRECATED!!!</strong></p>
                <p if={ dependencies[i+1].description }>{ dependencies[i+1].description }</p>
              </div>
              <br/>
            </div>
          </div>
        </virtual>
      </div>
      <div if={ notfound } class="row center">
        <i>Sorry! Cannot find what you're looking for, please &nbsp;<a href="https://github.com/pmlopes/vertx-starter/issues/new">open an issue</a>&nbsp; so we know about the missing metadata!</i>
      </div>
    </form>

    <div class="row">
      <div class="center">
        <span>powered with <span style="color:#f00000">&lt;3</span> by <a href="https://github.com/pmlopes/vertx-starter/tree/gh-pages">github.com</a></span>
      </div>
    </div>
  </div>

  <script>

    let compileProject = require("../engine.js").compileProject;
    let utils = require("../utils");
    // if ga is not available don't crash
    let ga = window.ga || function () {};

    import route from 'riot-route'
    import * as _ from "lodash"
    import JSZip from "jszip"
    import JSZipUtils from "jszip-utils"

    this.show = tool => {
      const q = route.query();
      // parse initial values
      const setup = {
        dependencies: decodeURIComponent(q.dependencies || '').split(',')
      };

      if (tool.languages) {

        // track what project type is being generated
        ga('send', {
          hitType: 'event',
          eventCategory: tool.id + ':view',
          eventAction: tool.id + '/view',
          eventLabel: 'project'
        });

        const selection = [];

        // reset the dependencies
        opts.components.forEach(function (el, index) {
        let c;
        // check if initial setup requested this dependency
          if (setup.dependencies.indexOf(el.groupId + ':' + el.artifactId + (el.classifier ? ':' + el.classifier : '')) !== -1) {
            c = _.cloneDeep(el);
            c.checked = true;
            c.id = index;
            selection.push(c);
            return;
          }
          if (setup.dependencies.indexOf(el.groupId + ':' + el.artifactId) !== -1) {
            c = _.cloneDeep(el);
            c.checked = true;
            c.id = index;
            selection.push(c);
            return;
          }
          // unless it is a default for the tool
          if (tool.defaults.indexOf(el.groupId + ':' + el.artifactId + (el.classifier ? ':' + el.classifier : '')) !== -1) {
            c = _.cloneDeep(el);
            c.checked = true;
            c.id = index;
            selection.push(c);
            return;
          }
          if (tool.defaults.indexOf(el.groupId + ':' + el.artifactId) !== -1) {
            c = _.cloneDeep(el);
            c.checked = true;
            c.id = index;
            selection.push(c);

          }
        });

        const filteredPresets = this.filterPresets(tool.languages[0].id, tool.id);
        const filteredPresetsGroups = {};
        filteredPresets.forEach(function (el) {
          if (!filteredPresetsGroups[el.group]) {
            filteredPresetsGroups[el.group] = [];
          }
          filteredPresetsGroups[el.group].push(el);
        });

        this.update({
          // state change, disable old download
          downloading: false,
          tool: tool,
          fields: tool.fields,
          // defaults to the first language of the list
          presets: filteredPresets,
          presetGroups: filteredPresetsGroups,
          language: tool.languages[0],
          dependencies: selection
        });
      } else {
        this.update({
          // state change, disable old download
          downloading: false,
          tool: tool,
          fields: tool.fields,
          dependencies: []
        });
      }
    };

    this.filterPresets = utils.filterPresets(opts.presets);

    //Finds y value of given object
    this.findPos = (obj) =>  {
      let curtop = 0;
      if (obj.offsetParent) {
        do {
          curtop += obj.offsetTop;
          // go to child
          obj = obj.offsetParent;
        } while (obj);
        return [curtop];
      }
    };

    this.parseFieldType = (field) => {
      return (!field.type || field.type === 'input') ? 'text' : field.type
    };

    this.changeLanguage = (e) => {
      // carry on with the task...
      e.preventDefault();
      const oldLang = this.language;
      const newLang = this.tool.languages.filter(function (el) {
        return el.id === e.target.value;
      })[0];

      ga('send', {
        hitType: 'event',
        eventCategory: newLang.id + ':view',
        eventAction: newLang.id + '/view',
        eventLabel: 'project'
      });

      // reset
      const selection = [].concat(this.dependencies);

      // exclude old lang support
      if (oldLang && !oldLang.noLangSupport) {
        for (var index = 0; index < selection.length; index++) {
          var el = selection[index];
          if (el.groupId === 'io.vertx' && el.artifactId === ('vertx-lang-' + oldLang.id)) {
            selection.splice(index--, 1);
          }
        }
      }
      // add the default language dependency
      if (newLang && !newLang.noLangSupport) {
        opts.components.forEach(function (el, index) {
          if (el.groupId === 'io.vertx' && el.artifactId === ('vertx-lang-' + newLang.id)) {
            if (selection.filter(function (el2) { return el2.id === index; }).length === 0) {
              const c = _.cloneDeep(el);
              c.checked = true;
              c.id = index;
              selection.push(c);
            }
          }
        });
      }

      const filteredPresets = this.filterPresets(e.target.value, this.tool.id);
      const filteredPresetsGroups = {};
      filteredPresets.forEach(function (el) {
        if (!filteredPresetsGroups[el.group]) {
          filteredPresetsGroups[el.group] = [];
        }
        filteredPresetsGroups[el.group].push(el);
      });

      this.update({
        // state change, disable old download
        downloading: false,
        presets: filteredPresets,
        presetGroups: filteredPresetsGroups,
        preset: filteredPresets.indexOf(this.preset) === -1 ? null : this.preset,
        language: newLang,
        dependencies: selection,
        fields: this.tool.fields
      });
    };

    this.changePreset = (e) => {
      // carry on with the task...
      e.preventDefault();
      const oldPreset = this.preset;
      // virtual empty preset
      let newPreset = { dependencies : [
        "io.vertx:vertx-core"
      ]};

      if (e.target.value) {
        newPreset = this.presets.filter(function (el) {
          return el.id === e.target.value;
        })[0];

        ga('send', {
          hitType: 'event',
          eventCategory: newPreset.id + ':view',
          eventAction: newPreset.id + '/view',
          eventLabel: 'project'
        });
      }

      // reset
      const selection = [].concat(this.dependencies);
      if (oldPreset) {
        for (var index = 0; index < selection.length; index++) {
          var el = selection[index];
          // test with classifier
          if (oldPreset.dependencies.indexOf(el.groupId + ':' + el.artifactId + (el.classifier ? ':' + el.classifier : '')) !== -1) {
            selection.splice(index--, 1);
            continue;
          }
          // test without classifier
          if (oldPreset.dependencies.indexOf(el.groupId + ':' + el.artifactId) !== -1) {
            selection.splice(index--, 1);

          }
        }
      }

      // check the default language dependency
      opts.components.forEach(function (el, index) {
        let c;
        if (newPreset.dependencies.indexOf(el.groupId + ':' + el.artifactId + (el.classifier ? ':' + el.classifier : '')) !== -1) {
          if (selection.filter(function (el2) { return el2.id === index; }).length === 0) {
            c = _.cloneDeep(el);
            c.checked = true;
            c.id = index;
            selection.push(c);
            return;
          }
        }
        if (newPreset.dependencies.indexOf(el.groupId + ':' + el.artifactId) !== -1) {
          if (selection.filter(function (el2) { return el2.id === index; }).length === 0) {
            c = _.cloneDeep(el);
            c.checked = true;
            c.id = index;
            selection.push(c);
          }
        }
      });

      let fields = [].concat(this.tool.fields);
      // filter out the fields
      if (newPreset.ignoreFields) {
        // need to iterate and remove
        let index = fields.length - 1;

        while (index >= 0) {
          if (newPreset.ignoreFields.indexOf(fields[index].key) !== -1) {
            fields.splice(index, 1);
          }

          index -= 1;
        }
      }

      this.update({
        // state change, disable old download
        downloading: false,
        preset: newPreset,
        fields: fields,
        dependencies: selection
      });
    };

    this.toggleDependency = (e) => {
      // carry on with the task...
      this.dependencies[e.target.value].checked = !this.dependencies[e.target.value].checked;

      this.update({
        // state change, disable old download
        downloading: false,
        dependencies: this.dependencies
      });
    };

    this.setFieldValue = e => field => {

      if (e.target[field.key] === undefined) {
        // skip as it was ignored
        return Promise.resolve();
      }

      if (!field.type) field.type = "input";
      if (field.type === "file") {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onloadend = () => {
            if (reader.error) reject(reader.error);
            else {
              field.value = reader.result;
              resolve();
            }
          };
          reader.readAsText(e.target[field.key].files[0]);
        });
      } else if (field.type === "input") {
        field.value = e.target[field.key].value;
      } else {
        field.value = e.target[field.key].checked;
      }
      if (field.prefill && (!field.value || (typeof field.value === String && field.value.length === 0)))
        field.value = field.prefill;
      return Promise.resolve();
    };

    this.generate = (e) => {
      e.preventDefault();

      // animate to avoid the perception of slowness
      window.scroll(0, this.findPos(document.getElementById("interaction")));

      const submit = e.target.submit;
      const a = this.refs.download;

      submit.disabled = true;

      // we need to filter in case the user was looking for other dependencies
      const dependencies = this.dependencies.filter((el) => el.checked);

      const self = this;

      // Set field values
      let promises = this.tool.fields.map(this.setFieldValue(e));
      if (this.preset && this.preset.fields) {
        promises = promises.concat(this.preset.fields.map(this.setFieldValue(e)));
      }
      Promise
        .all(promises)
        .then(p => {
          return compileProject(
            {buildtool: this.tool, dependencies: dependencies, language: this.language, preset: this.preset, components: opts.components},
            (category, action, label) => { ga('send', {hitType: 'event', eventCategory: category, eventAction: action, eventLabel: label}) },
            (exception) => {
              alert("Exception during code generation" + exception.message);
              ga('send', 'exception', {'exDescription': exception.message, 'exFatal': true});
            },
            (blob) => { return new Promise((resolve, reject) => {
                JSZipUtils.getBinaryContent("blobs/" + blob, function (err, data) {
                  if (err)
                    reject(err);
                  else
                    resolve(data)
                })
              }) }
            )
        }).then(zip => {
        if (JSZip.support.blob) {
          zip.generateAsync({ type: 'blob', platform: 'UNIX' }).then(function (blob) {
            if (a.href !== '#') {
              (window.webkitURL || window.URL).revokeObjectURL(a.href);
            }
            a.href = (window.webkitURL || window.URL).createObjectURL(blob);

            submit.disabled = false;
            self.update({
              generating: false,
              downloading: true
            });
            // at this moment the button should be visible
            try {
              document.getElementById('download-btn').focus();
              // attempt to click, will fail on safari and IE
              document.getElementById('download-btn').click();
            } catch (e) {
              // never mind...
            }
          }, function (err) {
            ga('send', 'exception', {
              'exDescription': err.message,
              'exFatal': true
            });
            alert(err);
          });
        } else {
          // blob is not supported on this browser fall back to data uri...
          zip.generateAsync({ type: 'base64', platform: 'UNIX' }).then(function (base64) {
            submit.disabled = false;
            self.update({
              generating: false,
              downloading: true
            });
            // start downloading...
            window.location = 'data:application/zip;base64,' + base64;
          }, function (err) {
            ga('send', 'exception', {
              'exDescription': err.message,
              'exFatal': true
            });
            alert(err);
          });
        }
      }, err => {
          submit.disabled = false;
          self.update({
            generating: false
          });
          return alert(err);

      });

      this.update({
        generating: true,
        downloading: false,
        // the project name
        name: e.target.name.value
      });
    };

    this.clean = (e) => {
      // disable the link after click
      setTimeout(() => {
        this.downloading = false;
        this.update();
      }, 500);
    };

    this.search = (e) => {
      const idx = {};
      // create a filter index
      const found = [].concat(this.dependencies.filter(function (el) {
        if (el.checked) {
          idx[el.groupId + ':' + el.artifactId] = true;
        }
        return el.checked;
      }));

      const needle = e.target.value;
      let cnt = 0;
      let duplicate = false;
      if (needle.length > 0) {
        const lookup = needle.toUpperCase();
        opts.components.forEach(function (el, index) {

          const artifactMatch = el.artifactId.toUpperCase().indexOf(lookup) !== -1;
          const descriptionMatch = (el.description || '').toUpperCase().indexOf(lookup) !== -1;

          if (artifactMatch || descriptionMatch) {
            if (idx[el.groupId + ':' + el.artifactId]) {
              // already listed
              duplicate = true;
              return;
            }

            idx[el.groupId + ':' + el.artifactId] = true;

            const c = _.cloneDeep(el);
            c.checked = false;
            c.id = index;
            found.push(c);
            cnt++;
          }
        });

        if (cnt === 0) {

          var gavRegexp = /([a-zA-Z0-9._\-]+):([a-zA-Z0-9._\-]+):([a-zA-Z0-9._\-]+) /g;
          var match = gavRegexp.exec(needle);
          if (match) {
            let c = {
              groupId: match[1],
              artifactId: match[2],
              version: match[3],
              description: needle
            };
            // add it to the default list
            opts.components.push(c);

            idx[match[1] + ':' + match[2]] = true;

            c = _.cloneDeep(c);
            c.checked = false;
            c.id = opts.components.length;
            found.push(c);
            cnt++;
          }

          // track misses so we can improve metadata
          ga('send', {
            hitType: 'event',
            eventCategory: 'search:fail',
            eventAction: needle + '/fail',
            eventLabel: 'component'
          });
        }
      }

      this.update({
        notfound: needle.length > 0 && cnt === 0 && !duplicate,
        dependencies : found
      });
    };

    const r = route.create();
    const hash = window.location.hash.substr(1);
    let defTool = undefined;

    // bind to the right route
    for (let bt of opts.buildtools) {
      r(bt.id + '..', () => this.show(bt));
      if (bt.id === hash) {
        defTool = bt.id;
      }
    }

    // show default route
    route(defTool || opts.buildtools[0].id);

    route.start(true)
  </script>
</main>
