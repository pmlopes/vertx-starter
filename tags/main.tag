<main>
  <div if={tool} class="container">
    <h1>{tool.id}: {tool.file}</h1>
    <form onsubmit={generate}>
      <!-- Basic fields -->
      <div each={f, i in tool.fields} class="row">
        <!-- iterate 2 at a time -->
        <virtual if={i % 2 == 0}>
          <div class="col-6"><input name="{tool.fields[i].key}" type="text" placeholder="{tool.fields[i].label + (tool.fields[i].prefill ? ' e.g.: ' + tool.fields[i].prefill : '')}"
              required="{tool.fields[i].required}"></div>
          <!-- if there is a next one -->
          <div if={tool.fields[i+1]} class="col-6"><input name="{tool.fields[i+1].key}" type="text" placeholder="{tool.fields[i+1].label + (tool.fields[i+1].prefill ? ' e.g.: ' + tool.fields[i+1].prefill : '')}"
              required="{tool.fields[i+1].required}"></div>
          <!-- if there is a next one -->
          <div if={!tool.fields[i+1]} class="col-6"></div>
        </virtual>
      </div>

      <div if={tool.languages || (presets && presets.length)} class="row">
        <!-- language selection -->
        <div if={tool.languages} class="col-6">
          <select id="language" onchange={changeLanguage}>
              <option each={tool.languages} value="{id}">{id}</option>
            </select>
        </div>
        <!-- preset selection -->
        <div if={presets && presets.length} class="col-6">
          <select id="preset" onchange={changePreset}>
              <option value="">Empty Project</option>
              <option each={presets} value="{id}">{id}</option>
            </select>
        </div>
      </div>

      <div class="row">
        <div class="col-6">
          <h1>Dependencies</h1>
        </div>
        <div class="col-6">
          <input type="text" class="pull-right" placeholder="Search dependency..." onkeyup={search}>
        </div>
      </div>

      <div each={c, i in idx} class="row">
        <!-- iterate 2 at a time -->
        <virtual if={i % 2 == 0 }>
          <div class="col-6 {components[idx[i]].checked?'dependency':''}">
            <input name="dependencies" type="checkbox" value="{idx[i]}" checked={components[idx[i]].checked} onclick={toggleDependency}>
            <div>
              <span if={components[idx[i]].stack} class="pull-right"><img src="img/stack.svg" width="16px" /></span>
              <strong>{components[idx[i]].artifactId}</strong>
              <hr/>
              <p if={components[idx[i]].description}>{components[idx[i]].description}</p>
            </div>
            <br/>
          </div>
          <!-- if there is a next one -->
          <div if={components[idx[i+1]]} class="col-6 {components[idx[i+1]].checked?'dependency':''}">
            <input name="dependencies" type="checkbox" value="{idx[i+1]}" checked={components[idx[i+1]].checked} onclick={toggleDependency}>
            <div>
              <span if={components[idx[i+1]].stack} class="pull-right"><img src="img/stack.svg" width="16px" /></span>
              <strong>{components[idx[i+1]].artifactId}</strong>
              <hr/>
              <p if={components[idx[i+1]].description}>{components[idx[i+1]].description}</p>
            </div>
            <br/>
          </div>
          <!-- if there isn't a next one -->
          <div if={!components[idx[i+1]]} class="col-6"></div>
        </virtual>
      </div>

      <div class="row" id="interaction">
        <div class="col-8">
          <button name="submit" type="submit">Generate</button>
          &nbsp;
          <a id="download-btn" onclick={clean} href="#" show={downloading} ref="download" download="{name}.zip" style="padding: 1.1rem 3.5rem; margin: 1rem 0; background: #782b90; color: #f5f5f5; border-radius: 2px; border: none; font-size: 1.3rem; transition: all .2s ease">Download</a>
        </div>
        <div class="col-4">
          <div if={generating} class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
          </div>
        </div>
      </div>
    </form>

    <div class="row">
      <div class="center">
        <span>powered with <span style="color:#f00000">&lt;3</span> by <a href="https://github.com/pmlopes/vertx-starter/tree/gh-pages">github.com</a></span>
      </div>
    </div>
  </div>

  <script>
    var self = this;
    // immutable data
    self.components = opts.components;

    // create a filter index
    self.idx = [];

    var r = route.create();
    // bind to the right route
    self.opts.buildtools.forEach(function (el) {
      r(el.id + '..', show.bind(self, el));
    });

    // show default route
    r(show.bind(self, self.opts.buildtools[0]));

    function show(tool) {
      var q = route.query();
      // parse initial values
      var setup = {
        dependencies: (decodeURIComponent(q.dependencies) || '').split(',')
      };

      // state change, disable old download
      self.downloading = false;
      // carry on with the task...

      if (tool.languages) {
        // reset
        self.idx.length = 0;
        // reset the dependencies
        self.components.forEach(function (el, index) {
          // default not selected
          el.checked = false;
          // check if initial setup requested this dependency
          if (setup.dependencies.indexOf(el.groupId + ':' + el.artifactId + (el.classifier ? ':' + el.classifier : '')) !== -1) {
            el.checked = true;
          }
          // unless it is a default for the tool
          if (tool.defaults.indexOf(el.groupId + ':' + el.artifactId + (el.classifier ? ':' + el.classifier : '')) !== -1) {
            el.checked = true;
          }

          if (el.checked) {
            self.idx.push(index);
          }
        });

        self.update({
          tool: tool,
          // defaults to the first language of the list
          presets: filterPresets(tool.id, tool.languages[0].id),
          language: tool.languages[0],
          idx: self.idx
        });
      } else {
        self.update({
          tool: tool,
          idx: self.idx
        });
      }
    }

    function filterPresets(tool, lang) {
      return opts.presets.filter(function (el) {
        if (el.language) {
          if (el.buildtool) {
            return el.buildtool === tool && el.language === lang;
          } else {
            return el.language === lang;
          }
        } else {
          if (el.buildtool) {
            return el.buildtool === tool;
          } else {
            return false;
          }
        }
      });
    }

    //Finds y value of given object
    function findPos(obj) {
      var curtop = 0;
      if (obj.offsetParent) {
        do {
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curtop];
      }
    }

    this.changeLanguage = function (e) {
      // state change, disable old download
      self.downloading = false;
      // carry on with the task...
      e.preventDefault();
      var oldLang = self.language;
      var newLang = self.tool.languages.filter(function (el) {
        return el.id === e.target.value;
      })[0];

      // reset
      self.idx.length = 0;

      // check the default language dependency
      self.components.forEach(function (el, index) {
        if (oldLang) {
          if (el.groupId === 'io.vertx' && el.artifactId === ('vertx-lang-' + oldLang.id)) {
            el.checked = false;
          }
        }

        if (el.groupId === 'io.vertx' && el.artifactId === ('vertx-lang-' + newLang.id)) {
          el.checked = true;
        }

        if (el.checked) {
          self.idx.push(index);
        }
      });

      self.update({
        presets: filterPresets(self.tool.id, e.target.value),
        language: newLang,
        idx: self.idx
      });
    }.bind(this);

    this.changePreset = function (e) {
      // state change, disable old download
      self.downloading = false;
      // carry on with the task...
      e.preventDefault();
      var oldPreset = self.preset;
      var newPreset = self.presets.filter(function (el) {
        return el.id === e.target.value;
      })[0];

      console.log(newPreset);

      // reset
      self.idx.length = 0;

      // check the default language dependency
      self.components.forEach(function (el, index) {
        if (oldPreset) {
          if (oldPreset.dependencies.indexOf(el.groupId + ':' + el.artifactId + (el.classifier ? ':' + el.classifier : '')) !== -1) {
            el.checked = false;
          }
        }

        if (newPreset.dependencies.indexOf(el.groupId + ':' + el.artifactId + (el.classifier ? ':' + el.classifier : '')) !== -1) {
          el.checked = true;
        }

        if (el.checked) {
          self.idx.push(index);
        }
      });

      self.update({
        preset: newPreset,
        idx: self.idx
      });
    }.bind(this);

    this.toggleDependency = function (e) {
      // state change, disable old download
      self.downloading = false;
      // carry on with the task...
      self.components[e.target.value].checked = !self.components[e.target.value].checked;
      self.update();
    }.bind(this);

    this.generate = function (e) {
      e.preventDefault();

      // animate to avoid the perception of slowness
      window.scroll(0, findPos(document.getElementById("interaction")));

      var submit = e.target.submit;
      var a = self.refs.download;

      submit.disabled = true;
      self.generating = true;
      self.downloading = false;

      // the project name
      self.name = e.target.name.value;

      self.tool.fields.forEach(function (el) {
        el.value = e.target[el.key].value;
      });

      compileProject({buildtool: self.tool, dependencies: self.components, language: self.language, preset: self.preset}, function (err, zip) {
        if (err) {
          submit.disabled = false;
          self.generating = false;
          self.update();
          return alert(err);
        }

        if (JSZip.support.blob) {
          zip.generateAsync({ type: 'blob', platform: 'UNIX' }).then(function (blob) {
            if (a.href !== '#') {
              (window.webkitURL || window.URL).revokeObjectURL(a.href);
            }
            a.href = (window.webkitURL || window.URL).createObjectURL(blob);

            submit.disabled = false;
            self.generating = false;
            self.downloading = true;
            self.update();
            // at this moment the button should be visible
            try {
              document.getElementById('download-btn').focus();
            } catch (e) {
              // nevermind...
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
            self.generating = false;
            self.downloading = true;
            self.update();
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
      });

      self.update();
    }.bind(this);

    this.clean = function (e) {
      // disable the link after click
      setTimeout(function () {
        self.downloading = false;
        self.update();
      }, 500);
    }.bind(this);

    this.search = function (e) {
      // create a filter index
      var found = [];

      self.components.forEach(function (el, index) {
        if (el.checked) {
          found.push(index);
        } else {
          var needle = e.target.value;
          if (needle.length > 0) {
            if (el.artifactId.indexOf(needle) !== -1 || (el.description && el.description.indexOf(needle) !== -1)) {
              found.push(index);
            }
          }
        }
      });

      self.update({idx : found});
    }.bind(this);
  </script>
</main>
