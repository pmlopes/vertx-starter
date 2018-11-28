<navigation>
  <li each={ opts.buildtools } class="nav-item"><a href="#{ id }" onclick={closeMenu}>&nbsp;&nbsp;{ id }</a></li>
  <li class="nav-item">&nbsp;</li>
  <li class="nav-item"><a href="https://github.com/pmlopes/vertx-starter/blob/master/dist/webdocs/OpenAPI_Server_With_Services.md" target="_blank"><i>&nbsp;&nbsp;OpenAPI docs</i></a></li>
  <script>
  this.closeMenu = function (e) {
    document.getElementById('nav-trigger').checked = false;
  }.bind(this);
  </script>
</navigation>
