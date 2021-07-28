<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  mounted() {
    this.getCSRFToken();
  },
  methods: {
    getCSRFToken() {
      axios.get("/api/getcsrftokensecre").then(
        (response) => {
          this.$store.dispatch(
            "security/setCSRFToken",
            response.data.csrfToken
          );
        },
        (err) => {
          console.log(err);
        }
      );
    },
  },
});
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
