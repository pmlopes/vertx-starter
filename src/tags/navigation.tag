<navigation>
  <li each={ opts.buildtools } class="nav-item"><a href="#{ id }" onclick={closeMenu}>&nbsp;&nbsp;{ id }</a></li>
  <script>
  this.closeMenu = function (e) {
    document.getElementById('nav-trigger').checked = false;
  }.bind(this);
  </script>
</navigation>
