riot.tag2('home', '<div class="container"><h1 class="text-center">Vert.x Starter</h1><h2 class="text-center">Quickly bootstrap your vert.x project</h2><div class="row"><h3>Get Started</h3><div><strong>Prepare your environment</strong><p>No mater what language you prefer to use you must have a valid <code>JDK8</code> installed in your environment.</p></div><div><strong>Choose your build tool</strong><ul><li><a href="#maven">maven</a></li><li><a href="#gradle">gradle</a></li><li><a href="#npm">npm</a></li></ul><p>It is expected that the build tool is already present in your environment. A special case should be handled with <code>npm</code> which will require that <code>maven</code> is also present in the environment.</p><p>To choose the tool, use the hamburger menu.</p></div></div><div class="row"><h3>Choose your dependencies</h3><div><strong>Defaults</strong><p>When selecting a programming language the default language specific module will be selected for you. This is optional and you can unselect at any moment.</p></div><div><strong>Good to know</strong><p>If you\'re planning to use <code>vert.x</code> to build distributed applications with the event bus you must select a cluster manager such as <code>hazelcast</code>, <code>ignite</code>, <code>zookeeper</code>.</p></div></div><div class="row"><h3>Starter applications</h3><div><strong>Don\'t start from scratch</strong><p>Some tools have already some template applications you can use. These templates will select a set of dependencies for you as well provide a base foundation for your application.</p></div></div><div class="row"><h3>Improve this tool</h3><div><strong>Want to help?</strong><p>This tool is open source and you can see it <a href="https://github.com/pmlopes/vertx-starter">here</a>. You can help adding more starters or more tools. See the documentation on how to do it. No code required!</p></div></div><div class="row"><div class="col-4 center"><a href="http://vertx.io/" class="pure-menu-link">About</a></div><div class="col-4 center"><a href="http://twitter.com/vertx_project/" class="pure-menu-link">Twitter</a></div><div class="col-4 center"><a href="http://github.com/eclipse/vert.x/" class="pure-menu-link">GitHub</a></div></div></div>', '', '', function(opts) {
});

riot.tag2('main', '<home if="{!tool}"></home><div if="{tool}" class="container"><h1>{tool.id}: {tool.file}</h1><form onsubmit="{generate}"><div each="{f, i in tool.fields}" class="row"><virtual if="{i % 2===0}"><div class="col-6"><input name="{tool.fields[i].key}" type="text" placeholder="{tool.fields[i].label + (tool.fields[i].prefill ? \' e.g.: \' + tool.fields[i].prefill : \'\')}" required="{tool.fields[i].required}"></div><div if="{tool.fields[i+1]}" class="col-6"><input name="{tool.fields[i+1].key}" type="text" placeholder="{tool.fields[i+1].label + (tool.fields[i+1].prefill ? \' e.g.: \' + tool.fields[i+1].prefill : \'\')}" required="{tool.fields[i+1].required}"></div></virtual></div><div if="{tool.languages || (presets && presets.length)}" class="row"><div if="{tool.languages}" class="col-6"><select id="language" onchange="{changeLanguage}"><option each="{tool.languages}" riot-value="{id}">{id}</option></select></div><div if="{presets && presets.length}" class="col-6"><select id="preset" onchange="{changePreset}"><option value="">Empty Project</option><option each="{presets}" riot-value="{id}">{id}</option></select></div></div><div class="row"><div class="col-6"><h1>Dependencies</h1></div><div class="col-6"><input type="text" class="pull-right" placeholder="Search dependency..." onkeyup="{search}"></div></div><div each="{c, i in idx}" class="row"><virtual if="{i % 2===0}"><div class="col-6 {components[idx[i]].checked?\'dependency\':\'\'}"><input name="dependencies" type="checkbox" riot-value="{idx[i]}" checked="{components[idx[i]].checked}" onclick="{toggleDependency}"><div><span if="{components[idx[i]].stack}" class="pull-right"><img src="img/stack.svg" width="16px"></span><strong>{components[idx[i]].artifactId}</strong><hr><p if="{components[idx[i]].description}">{components[idx[i]].description}</p></div><br></div><div if="{components[idx[i+1]]}" class="col-6 {components[idx[i+1]].checked?\'dependency\':\'\'}"><input name="dependencies" type="checkbox" riot-value="{idx[i+1]}" checked="{components[idx[i+1]].checked}" onclick="{toggleDependency}"><div><span if="{components[idx[i+1]].stack}" class="pull-right"><img src="img/stack.svg" width="16px"></span><strong>{components[idx[i+1]].artifactId}</strong><hr><p if="{components[idx[i+1]].description}">{components[idx[i+1]].description}</p></div><br></div></virtual></div><div class="row"><div class="col-4"><button name="submit" type="submit" onclick="{toggleGenerate}">Generate</button></div><div class="col-4"><div if="{generating}" class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div></div><div class="col-4"><a onclick="{clean}" href="#" show="{downloading}" ref="download" download="{name}.zip" class="btn pull-right">Download</a></div></div></form></div>', '', '', function(opts) {
    var self = this;

    self.components = opts.components;

    self.idx = self.components.map(function (el, index) {
      return index;
    });

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

    this.search = function (e) {

      var found = [];

      self.components.forEach(function (el, index) {
        if (el.artifactId.indexOf(e.target.value) !== -1 || (el.description && el.description.indexOf(e.target.value) !== -1)) {
          found.push(index);
        }
      });

      self.update({idx : found});
    }.bind(this)
});

riot.tag2('navigation', '<li each="{opts.buildtools}" class="nav-item"><a href="#{id}">{id}</a></li>', '', '', function(opts) {
});
