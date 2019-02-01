<navigation>
  <li class="nav-item" style="color: #fff"><b>Build tool</b></li>
  <li each={ opts.buildtools } class="nav-item">
    <a href="#{ id }" onclick={closeMenu}>&nbsp;&nbsp;<img if={ icon } src="img/{ icon }" width="16px"> { id }</a>
  </li>
  <li class="nav-item" style="color: #fff"><b>Docs</b></li>
  <li class="nav-item"><a href="https://github.com/pmlopes/vertx-starter/blob/master/dist/webdocs/OpenAPI_Server_With_Services.md" target="_blank"><i>&nbsp;&nbsp;OpenAPI docs</i></a></li>
  <script>
  this.closeMenu = function (e) {
    document.getElementById('nav-trigger').checked = false;
  }.bind(this);
  </script>
</navigation>
