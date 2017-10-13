riot.tag2('main', '<div if="{tool}" class="container"><div class="help-tip hide-phone"><p> The build tool can be changed using the hamburger menu on the left. For more information about this tool please visit <a href="{tool.url}">{tool.id}</a> website.<br><br> This is a progressive webapp, meaning that you can add it to your desktop and it can even run offline. You can boostrap your project even on the go without internet! </p></div><h1>{tool.id}: {tool.file}</h1><form onsubmit="{generate}"><div each="{f, i in tool.fields}" class="row"><virtual if="{i % 2 === 0}"><div class="col-6"><input name="{tool.fields[i].key}" type="text" placeholder="{tool.fields[i].label + (tool.fields[i].prefill ? \' e.g.: \' + tool.fields[i].prefill : \'\')}" required="{tool.fields[i].required}"></div><div class="col-6"><input if="{tool.fields[i+1]}" name="{tool.fields[i+1].key}" type="text" placeholder="{tool.fields[i+1].label + (tool.fields[i+1].prefill ? \' e.g.: \' + tool.fields[i+1].prefill : \'\')}" required="{tool.fields[i+1].required}"></div></virtual></div><div if="{tool.languages || presets}" class="row"><div class="col-6"><select id="language" disabled="{!tool.languages || tool.languages.length == 0}" onchange="{changeLanguage}"><option each="{tool.languages}" riot-value="{id}">{id}</option></select></div><div class="col-6"><select id="preset" disabled="{!presetGroups || presetGroups.length == 0}" onchange="{changePreset}"><option value="">Empty Project</option><optgroup each="{g, i in presetGroups}" label="{i}"><option each="{g}" riot-value="{id}">{id}</option></optgroup></select></div></div><div class="row"><div class="col-6"><h1>Dependencies</h1></div><div class="col-6"><div class="help-tip hide-phone"><p>Use this box to search for dependencies to add to your application, if a dependency is not present, please <a href="https://github.com/pmlopes/vertx-starter/issues/new">open an issue</a> so we can add the missing metadata!</p></div><input type="text" class="pull-right" placeholder="Search dependency..." onkeyup="{search}"></div></div><div each="{c, i in dependencies}" class="row"><virtual if="{i % 2 == 0}"><div class="col-6"><div class="{dependency: dependencies[i].checked}"><input name="dependencies" type="checkbox" riot-value="{i}" checked="{dependencies[i].checked}" onclick="{toggleDependency}"><div><span if="{dependencies[i].stack}" class="pull-right"><img src="img/stack.svg" width="16px"></span><strong>{dependencies[i].artifactId}</strong><hr><p if="{dependencies[i].description}">{dependencies[i].description}</p></div><br></div></div><div class="col-6"><div if="{dependencies[i+1]}" class="{dependency: dependencies[i+1].checked}"><input name="dependencies" type="checkbox" riot-value="{i+1}" checked="{dependencies[i+1].checked}" onclick="{toggleDependency}"><div><span if="{dependencies[i+1].stack}" class="pull-right"><img src="img/stack.svg" width="16px"></span><strong>{dependencies[i+1].artifactId}</strong><hr><p if="{dependencies[i+1].description}">{dependencies[i+1].description}</p></div><br></div></div></virtual></div><div class="row" id="interaction"><div class="col-8"><button name="submit" type="submit">Generate</button> &nbsp; <a id="download-btn" onclick="{clean}" href="#" show="{downloading}" ref="download" download="{name}.zip" style="padding: 1.1rem 3.5rem; margin: 1rem 0; background: #782b90; color: #f5f5f5; border-radius: 2px; border: none; font-size: 1.3rem; transition: all .2s ease">Download</a></div><div class="col-4"><div if="{generating}" class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div></div></div></form><div class="row"><div class="center"><span>powered with <span style="color:#f00000">&lt;3</span> by <a href="https://github.com/pmlopes/vertx-starter/tree/gh-pages">github.com</a></span></div></div></div>', '', '', function(opts) {
    var self = this;

    var r = route.create();

    opts.buildtools.forEach(function (el) {
      r(el.id + '..', show.bind(self, el));
    });

    r(show.bind(self, self.opts.buildtools[0]));

    function show(tool) {
      var q = route.query();

      var setup = {
        dependencies: decodeURIComponent(q.dependencies || '').split(',')
      };

      if (tool.languages) {

        ga('send', {
          hitType: 'event',
          eventCategory: tool.id + ':view',
          eventAction: tool.id + '/view',
          eventLabel: 'project'
        });

        var selection = [];

        opts.components.forEach(function (el, index) {
          var c;

          if (setup.dependencies.indexOf(el.groupId + ':' + el.artifactId + (el.classifier ? ':' + el.classifier : '')) !== -1) {
            c = clone(el);
            c.checked = true;
            c.id = index;
            selection.push(c);
            return;
          }
          if (setup.dependencies.indexOf(el.groupId + ':' + el.artifactId) !== -1) {
            c = clone(el);
            c.checked = true;
            c.id = index;
            selection.push(c);
            return;
          }

          if (tool.defaults.indexOf(el.groupId + ':' + el.artifactId + (el.classifier ? ':' + el.classifier : '')) !== -1) {
            c = clone(el);
            c.checked = true;
            c.id = index;
            selection.push(c);
            return;
          }
          if (tool.defaults.indexOf(el.groupId + ':' + el.artifactId) !== -1) {
            c = clone(el);
            c.checked = true;
            c.id = index;
            selection.push(c);
            return;
          }
        });

        var filteredPresets = filterPresets(tool.id, tool.languages[0].id);
        var filteredPresetsGroups = {};
        filteredPresets.forEach(function (el) {
          if (!filteredPresetsGroups[el.group]) {
            filteredPresetsGroups[el.group] = [];
          }
          filteredPresetsGroups[el.group].push(el);
        });

        self.update({

          downloading: false,
          tool: tool,

          presets: filteredPresets,
          presetGroups: filteredPresetsGroups,
          language: tool.languages[0],
          dependencies: selection
        });
      } else {
        self.update({

          downloading: false,
          tool: tool,
          dependencies: []
        });
      }
    }

    function filterPresets(tool, lang) {
      return opts.presets.filter(function (el) {
        if (el.languages) {
          var l = el.languages.filter(function (e) {
            return e.id === lang;
          });

          if (l.length === 0) {
            return false;
          }
          if (el.buildtool) {
            return el.buildtool === tool;
          }
        } else {
          if (el.buildtool) {
            return el.buildtool === tool;
          }
        }
        return true;
      });
    }

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

      e.preventDefault();
      var oldLang = self.language;
      var newLang = self.tool.languages.filter(function (el) {
        return el.id === e.target.value;
      })[0];

      ga('send', {
        hitType: 'event',
        eventCategory: newLang.id + ':view',
        eventAction: newLang.id + '/view',
        eventLabel: 'project'
      });

      var selection = [].concat(self.dependencies);

      if (oldLang) {
        for (var index = 0; index < selection.length; index++) {
          var el = selection[index];
          if (el.groupId === 'io.vertx' && el.artifactId === ('vertx-lang-' + oldLang.id)) {
            selection.splice(index--, 1);
          }
        }
      }

      opts.components.forEach(function (el, index) {
        if (el.groupId === 'io.vertx' && el.artifactId === ('vertx-lang-' + newLang.id)) {
          if (selection.filter(function (el2) { return el2.id === index; }).length === 0) {
            var c = clone(el);
            c.checked = true;
            c.id = index;
            selection.push(c);
          }
        }
      });

      var filteredPresets = filterPresets(self.tool.id, e.target.value);
      var filteredPresetsGroups = {};
      filteredPresets.forEach(function (el) {
        if (!filteredPresetsGroups[el.group]) {
          filteredPresetsGroups[el.group] = [];
        }
        filteredPresetsGroups[el.group].push(el);
      });

      self.update({

        downloading: false,
        presets: filteredPresets,
        presetGroups: filteredPresetsGroups,
        language: newLang,
        dependencies: selection
      });
    }.bind(this);

    this.changePreset = function (e) {

      e.preventDefault();
      var oldPreset = self.preset;
      var newPreset = self.presets.filter(function (el) {
        return el.id === e.target.value;
      })[0];

      ga('send', {
        hitType: 'event',
        eventCategory: newPreset.id + ':view',
        eventAction: newPreset.id + '/view',
        eventLabel: 'project'
      });

      var selection = [].concat(self.dependencies);
      if (oldPreset) {
        for (var index = 0; index < selection.length; index++) {
          var el = selection[index];

          if (oldPreset.dependencies.indexOf(el.groupId + ':' + el.artifactId + (el.classifier ? ':' + el.classifier : '')) !== -1) {
            selection.splice(index--, 1);
            continue;
          }

          if (oldPreset.dependencies.indexOf(el.groupId + ':' + el.artifactId) !== -1) {
            selection.splice(index--, 1);
            continue;
          }
        }
      }

      opts.components.forEach(function (el, index) {
        var c;
        if (newPreset.dependencies.indexOf(el.groupId + ':' + el.artifactId + (el.classifier ? ':' + el.classifier : '')) !== -1) {
          if (selection.filter(function (el2) { return el2.id === index; }).length === 0) {
            c = clone(el);
            c.checked = true;
            c.id = index;
            selection.push(c);
            return;
          }
        }
        if (newPreset.dependencies.indexOf(el.groupId + ':' + el.artifactId) !== -1) {
          if (selection.filter(function (el2) { return el2.id === index; }).length === 0) {
            c = clone(el);
            c.checked = true;
            c.id = index;
            selection.push(c);
            return;
          }
        }
      });

      self.update({

        downloading: false,
        preset: newPreset,
        dependencies: selection
      });
    }.bind(this);

    this.toggleDependency = function (e) {

      self.dependencies[e.target.value].checked = !self.dependencies[e.target.value].checked;

      self.update({

        downloading: false,
        dependencies: self.dependencies
      });
    }.bind(this);

    this.generate = function (e) {
      e.preventDefault();

      window.scroll(0, findPos(document.getElementById("interaction")));

      var submit = e.target.submit;
      var a = self.refs.download;

      submit.disabled = true;

      self.tool.fields.forEach(function (el) {
        el.value = e.target[el.key].value;
      });

      compileProject({buildtool: self.tool, dependencies: self.dependencies, language: self.language, preset: self.preset, components: opts.components}, function (err, zip) {
        if (err) {
          submit.disabled = false;
          self.update({
            generating: false
          });
          return alert(err);
        }

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

            try {
              document.getElementById('download-btn').focus();

              document.getElementById('download-btn').click();
            } catch (e) {

            }
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
            self.update({
              generating: false,
              downloading: true
            });

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

      self.update({
        generating: true,
        downloading: false,

        name: e.target.name.value
      });
    }.bind(this);

    this.clean = function (e) {

      setTimeout(function () {
        self.downloading = false;
        self.update();
      }, 500);
    }.bind(this);

    this.search = function (e) {

      var found = [].concat(self.dependencies.filter(function (el) {
        return el.checked;
      }));

      var needle = e.target.value;
      if (needle.length > 0) {
        var cnt = 0;
        opts.components.forEach(function (el, index) {
          if (el.artifactId.indexOf(needle) !== -1 || (el.description && el.description.indexOf(needle) !== -1)) {
            var c = clone(el);
            c.checked = false;
            c.id = index;
            found.push(c);
            cnt++;
          }
        });

        if (cnt === 0) {

          ga('send', {
            hitType: 'event',
            eventCategory: 'search:fail',
            eventAction: needle + '/fail',
            eventLabel: 'component'
          });
        }
      }

      self.update({
        dependencies : found
      });
    }.bind(this);
});

riot.tag2('navigation', '<li each="{opts.buildtools}" class="nav-item"><a href="#{id}" onclick="{closeMenu}">&nbsp;&nbsp;{id}</a></li>', '', '', function(opts) {
  this.closeMenu = function (e) {
    document.getElementById('nav-trigger').checked = false;
  }.bind(this);
});
