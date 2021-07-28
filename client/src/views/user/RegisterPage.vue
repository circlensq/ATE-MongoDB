<template>
  <a-row
    justify="center"
    :style="{
      paddingTop: '100px',
      height: '100%',
      paddingLeft: '20px',
      paddingRight: '20px',
    }"
  >
    <a-col :xs="20" :sm="20" :md="8" :lg="8" :xl="8">
      <a-spin :spinning="spinning" tip="Loading...">
        <a-row type="flex" justify="center">
          <a-col>
            <a-typography-title :level="2">ATE-Dashboard</a-typography-title>
          </a-col>
        </a-row>
        <div class="main" :style="{ marginTop: '20px' }">
          <a-form
            :layout="formState.layout"
            id="formRegister"
            :rules="rules"
            ref="formRef"
            :model="formState"
            @finish="submitRegister"
          >
            <a-form-item required has-feedback name="email">
              <a-input
                v-model:value="formState.email"
                placeholder="type your Jazzhipster email"
                allow-clear
              />
            </a-form-item>

            <a-form-item required has-feedback name="username">
              <a-input
                v-model:value="formState.username"
                placeholder="username"
                allow-clear
              />
            </a-form-item>

            <a-form-item required has-feedback name="password">
              <a-input
                v-model:value="formState.password"
                placeholder="password"
                type="password"
                allow-clear
              />
            </a-form-item>

            <a-form-item required has-feedback name="confirmPassword">
              <a-input
                v-model:value="formState.confirmPassword"
                placeholder="type again your password"
                type="password"
                allow-clear
              />
            </a-form-item>
            <a-row
              :style="{
                textAlign: 'center',
                margin: '0px',
                padding: '0px',
              }"
              type="flex"
              justify="center"
            >
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <a-button
                  type="primary"
                  :style="{ marginRight: '10px', width: '100%' }"
                  html-type="submit"
                  >Register</a-button
                >
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <a-typography-link href="#" target="_blank">
                  <router-link :to="{ name: 'login' }">
                    Already have an account?
                  </router-link>
                </a-typography-link>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-spin>
    </a-col>
  </a-row>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  data() {
    return {
      formState: {
        layout: "vertical",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      },
      spinning: false,
      rules: {
        email: [
          {
            validator: this.checkEmailJazzHipster,
            trigger: ["change", "blur"],
          },
        ],
        username: [
          {
            validator: this.checkUsername,
            trigger: ["change", "blur"],
          },
        ],
        confirmPassword: [
          {
            validator: this.checkConfirmPassword,
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  methods: {
    changeSpinning() {
      this.spinning = !this.spinning;
    },
    async checkUsername() {
      const username = this.formState.username;
      if (!username) {
        return Promise.reject("Please input the username");
      }
      await axios
        .create({
          withCredentials: false,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": this.$store.getters.getCSRFToken,
          },
        })
        .post("/api/accounts/register/checkUsername", {
          username: this.formState.username,
        })
        .then((res) => {
          if (res.data.error) {
            return Promise.reject(res.data.error);
          }
        });
    },
    checkConfirmPassword() {
      const confirmPassword = this.formState.confirmPassword;
      const isValid =
        confirmPassword === this.formState.password ? true : false;

      if (!confirmPassword) {
        return Promise.reject("Please type password once again");
      }

      if (!isValid) {
        return Promise.reject("Password and Confirmation Password don't match");
      } else {
        return Promise.resolve();
      }
    },

    async checkEmailJazzHipster() {
      const email = this.formState.email;
      const re = /^[a-zA-Z0-9](\.?[a-zA-Z0-9]){1,}@jazzhipster\.com\.tw$/g;
      const isValid = re.test(String(email).toLowerCase());

      if (!email) {
        return Promise.reject("Please input the email");
      }

      await axios
        .create({
          withCredentials: false,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": this.$store.getters.getCSRFToken,
          },
        })
        .post("/api/accounts/register/checkMaxEmailUsage", {
          email_address: email,
        })
        .then((res) => {
          if (res.data.error) {
            return Promise.reject(res.data.error);
          }
        });

      if (!isValid) {
        return Promise.reject("Please use jazzhipster email account");
      } else {
        return Promise.resolve();
      }
    },
    submitRegister() {
      let name = this.formState.email.split("@")[0];
      let firstName = name.split(".")[0];
      let lastName = name.split(".")[1];
      this.changeSpinning();
      axios
        .create({
          withCredentials: false,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": this.$store.getters.getCSRFToken,
          },
        })
        .post("/api/accounts/register", {
          username: this.formState.username,
          password: this.formState.password,
          email_address: this.formState.email,
          first_name: firstName,
          last_name: lastName || "JS",
          is_active: true,
          is_staff: true,
          is_superuser: false,
        })
        .then(() => {
          this.changeSpinning();

          this.$router.push({ name: "login" });
        });
    },
  },
});
</script>

<style scoped>
</style>
