<template>
  <div class="sidebar-overlay" onclick="halfmoon.toggleSidebar()"></div>

  <nav class="navbar">
    <div class="navbar-content">
      <!-- Navbar brand -->
      <button
        id="toggle-sidebar-btn"
        class="btn btn-action"
        type="button"
        onclick="halfmoon.toggleSidebar()"
      >
        <i class="fa fa-bars" aria-hidden="true"></i>
      </button>
      <a href="#" class="navbar-brand">
        <img src="../../../assets/images/favicon.ico" alt="JS Logo" />
        <span class="d-none d-md-block d-lg-block">ATE-Server</span>
      </a>
    </div>
    <div class="navbar-content ml-auto">
      <button
        class="btn btn-action mr-5 hidden-dm"
        type="button"
        @click="toggleDarkMode"
        aria-label="Toggle dark mode"
      >
        <i class="far fa-moon" aria-hidden="true"></i>
      </button>
      <button
        class="btn btn-action mr-5 hidden-lm"
        type="button"
        @click="toggleDarkMode"
        aria-label="Toggle dark mode"
      >
        <i class="fas fa-sun" aria-hidden="true"></i>
      </button>
      <a href="#" class="btn btn-danger mr-5" type="button" aria-label="Logout">
        <i class="fas fa-sign-out-alt"></i> Log Out
      </a>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  methods: {
    toggleDarkMode() {
      if (document.body.classList.contains("dark-mode")) {
        document.body.classList.remove("dark-mode");

        // Custom toggle for Uppy File Uploader
        // document
        //   .getElementsByClassName("Uppy-Dashboard")[0]
        //   .setAttribute("data-uppy-theme", "light");

        this.darkModeOn = false;
        this.createCookie("halfmoon_preferredMode", "light-mode", 365);
      } else {
        document.body.classList.add("dark-mode");

        // Custom toggle for Uppy File Uploader
        // document
        //   .getElementsByClassName("Uppy-Dashboard")[0]
        //   .setAttribute("data-uppy-theme", "dark");

        this.darkModeOn = true;
        this.createCookie("halfmoon_preferredMode", "dark-mode", 365);
      }
    },
    createCookie(name, value, days) {
      var expires;
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toGMTString();
      } else {
        expires = "";
      }
      document.cookie = name + "=" + value + expires + "; path=/";
    },
  },
};
</script>

<style>
</style>