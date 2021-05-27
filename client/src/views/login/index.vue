<template>
  <div class="content-wrapper">
    <div class="row">
      <div class="col-lg-3 col-md-2 col-sm-2"></div>
      <div class="card col-lg-6 col-md-8 col-sm-8 mw-full shadow-lg">
        <div class="row">
          <div class="position-absolute top-0 right-0 z-10 p-10">
            <button
              class="btn btn-action mr-5 hidden-dm"
              type="button"
              onclick="halfmoon.toggleDarkMode()"
              aria-label="Toggle dark mode"
            >
              <i class="far fa-moon" aria-hidden="true"></i>
            </button>
            <button
              class="btn btn-action mr-5 hidden-lm"
              type="button"
              onclick="halfmoon.toggleDarkMode()"
              aria-label="Toggle dark mode"
            >
              <i class="fas fa-sun" aria-hidden="true"></i>
            </button>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <div class="content">
              <div class="text-center align-middle">
                <img
                  src="../../assets/images/favicon.ico"
                  class="img-fluid"
                  alt="responsive image"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <h3 class="text-center">ATE</h3>
            <FormLogin />
            <p class="text-center text-danger font-size-16"></p>
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-2 col-sm-2"></div>
    </div>
  </div>
</template>

<script>
import FormLogin from "./components/FormLogin.vue";

export default {
  name: "Login",
  components: {
    FormLogin,
  },
};
</script>
