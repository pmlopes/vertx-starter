riot.tag2('home', '<div class="container"><h1 class="text-center">Vert.x Starter</h1><h2 class="text-center">Quickly bootstrap your vert.x project</h2></div>', '', '', function(opts) {
});

riot.tag2('main', '<home if="{!tool}"></home><div if="{tool}" class="container"><h1>{tool.id}: {tool.file}</h1><form onsubmit="{generate}"><div each="{f, i in tool.fields}" class="row"><virtual if="{i % 2===0}"><div class="col-6"><input name="{tool.fields[i].key}" type="text" placeholder="{tool.fields[i].label + (tool.fields[i].prefill ? \' e.g.: \' + tool.fields[i].prefill : \'\')}" required="{tool.fields[i].required}"></div><div if="{tool.fields[i+1]}" class="col-6"><input name="{tool.fields[i+1].key}" type="text" placeholder="{tool.fields[i+1].label + (tool.fields[i+1].prefill ? \' e.g.: \' + tool.fields[i+1].prefill : \'\')}" required="{tool.fields[i+1].required}"></div></virtual></div><div if="{tool.languages || (presets && presets.length)}" class="row"><div if="{tool.languages}" class="col-6"><select id="language" onchange="{changeLanguage}"><option each="{tool.languages}" riot-value="{id}">{id}</option></select></div><div if="{presets && presets.length}" class="col-6"><select id="preset" onchange="{changePreset}"><option value="">Empty Project</option><option each="{presets}" riot-value="{id}">{id}</option></select></div></div><h1>Dependencies</h1><div each="{c, i in components}" class="row"><virtual if="{i % 2===0}"><div class="col-6 {components[i].checked?\'dependency\':\'\'}"><input name="dependencies" type="checkbox" riot-value="{i}" checked="{components[i].checked}" onclick="{toggleDependency}"><div><span if="{components[i].stack}" class="pull-right"><img src="img/stack.svg" width="16px"></span><strong>{components[i].artifactId}</strong><p if="{components[i].description}">{components[i].description}</p></div><hr><br></div><div if="{components[i+1]}" class="col-6 {components[i+1].checked?\'dependency\':\'\'}"><input name="dependencies" type="checkbox" riot-value="{i+1}" checked="{components[i+1].checked}" onclick="{toggleDependency}"><div><span if="{components[i+1].stack}" class="pull-right"><img src="img/stack.svg" width="16px"></span><strong>{components[i+1].artifactId}</strong><p if="{components[i+1].description}">{components[i+1].description}</p></div><hr><br></div></virtual></div><div class="row"><div class="col-4"><button name="submit" type="submit" onclick="{toggleGenerate}">Generate</button></div><div class="col-4"><div if="{generating}" class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div></div><div class="col-4"><a onclick="{clean}" href="#" show="{downloading}" ref="download" download="{name}.zip" class="btn pull-right">Download</a></div></div></form></div>', '', '', function(opts) {
    var self = this;

    self.components = opts.components;

    var r = route.create()

    opts.buildtools.forEach(function (el) {
      r(el.id, show.bind(self, el));
    });

    r(show);

    function show(tool) {
      if (tool) {
        if (tool.languages) {

          self.components.forEach(function (el) {

            el.checked = false;

            if (tool.defaults.indexOf(el.groupId + ':' + el.artifactId) != -1) {
              el.checked = true;
            }
          });

          self.update({
            tool: tool,

            presets: filterPresets(tool.id, tool.languages[0].id),
            language: tool.languages[0]
          });
        } else {
          self.update({ tool: tool });
        }
      }
    }

    function filterPresets(tool, lang) {
      return opts.presets.filter(function (el) {
        return el.buildtool == tool && el.language == lang;
      });
    }

    this.changeLanguage = function(e) {
      e.preventDefault();
      var oldLang = self.language;
      var newLang = self.tool.languages.filter(function (el) {
        return el.id === e.target.value;
      })[0];

      self.components.forEach(function (el) {
        if (oldLang) {
          if (el.groupId == 'io.vertx' && el.artifactId == ('vertx-lang-' + oldLang.id)) {
            el.checked = false;
          }
        }

        if (el.groupId == 'io.vertx' && el.artifactId == ('vertx-lang-' + newLang.id)) {
          el.checked = true;
        }
      });

      self.update({
        presets: filterPresets(self.tool.id, e.target.value),
        language: newLang
      });
    }.bind(this)

    this.changePreset = function(e) {
      e.preventDefault();
      var oldPreset = self.preset;
      var newPreset = self.presets.filter(function (el) {
        return el.id === e.target.value;
      })[0];

      self.components.forEach(function (el) {
        if (oldPreset) {
          if (oldPreset.dependencies.indexOf(el.groupId + ':' + el.artifactId) != -1) {
            el.checked = false;
          }
        }

        if (newPreset.dependencies.indexOf(el.groupId + ':' + el.artifactId) != -1) {
          el.checked = true;
        }
      });

      self.update({
        preset: newPreset
      });
    }.bind(this)

    this.toggleDependency = function(e) {
      self.components[e.target.value].checked = !self.components[e.target.value].checked;
      self.update();
    }.bind(this)

    this.generate = function(e) {
      e.preventDefault();

      var submit = e.target.submit;
      var a = self.refs.download;

      submit.disabled = true;
      self.generating = true;
      self.downloading = false;

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
            if (a.href != '#') {
              (window.webkitURL || window.URL).revokeObjectURL(a.href);
            }
            a.href = (window.webkitURL || window.URL).createObjectURL(blob);

            submit.disabled = false;
            self.generating = false;
            self.downloading = true;
            self.update();

          }, function (err) {
            ga('send', 'exception', {
              'exDescription': err.message,
              'exFatal': true
            });
            alert(err);
          });
        } else {

          zip.generateAsync({ type: 'base64', platform: 'UNIX' }).then(function (base64) {
            submit.disabled = false;
            self.generating = false;
            self.downloading = true;
            self.update();

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
    }.bind(this)

    this.clean = function (e) {

      setTimeout(function () {
        self.downloading = false;
        self.update();
      }, 500);
    }.bind(this)
});

riot.tag2('navigation', '<li each="{opts.buildtools}" class="nav-item"><a href="#{id}">{id}</a></li>', '', '', function(opts) {
});
