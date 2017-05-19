<navigation>
  <li class="nav-item"><a href="#"><b>Build tool:</b></a></li>

  <li each={ opts.buildtools } class="nav-item"><a href="#{ id }" onclick={closeMenu}>&nbsp;&nbsp;{ id }</a></li>

  <script>
  closeMenu(e) {
    document.getElementById('nav-trigger').checked = false;
  }
  </script>
</navigation>
