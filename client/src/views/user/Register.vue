<template>
  <a-row
    justify="center"
    :style="{
      paddingTop: '100px',
      height: '100%',
      paddingLeft: '20px',
      paddingRight: '20px'
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
            @finish="handleFinish"
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
                padding: '0px'
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
                  <router-link :to="{ name: 'Login' }">
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
import { defineComponent, reactive, ref } from "vue";
import axios from "axios";
import router from "../../router/index";

export default defineComponent({
  setup() {
    const formState = reactive({
      layout: "vertical",
      email: "",
      username: "",
      password: "",
      confirmPassword: ""
    });
    const spinning = ref(false);

    const changeSpinning = () => {
      spinning.value = !spinning.value;
    };

    let checkUsername = async (rule, value) => {
      if (!value) {
        return Promise.reject("Please input the username");
      }

      await axios({
        method: "post",
        url: "/api/accounts/register/checkUsername",
        data: {
          username: formState.username
        }
      }).then(res => {
        if (res.data.error) {
          return Promise.reject(res.data.error);
        }
      });
    };

    let checkConfirmPassword = async (rule, value) => {
      const isValid = value === formState.password ? true : false;

      if (!value) {
        return Promise.reject("Please type password once again");
      }

      if (!isValid) {
        return Promise.reject("Password and Confirmation Password don't match");
      } else {
        return Promise.resolve();
      }
    };

    let checkEmailJazzHipster = async (rule, value) => {
      const re = /^[a-zA-Z0-9](\.?[a-zA-Z0-9]){1,}@jazzhipster\.com\.tw$/g;
      const isValid = re.test(String(value).toLowerCase());

      if (!value) {
        return Promise.reject("Please input the email");
      }

      await axios({
        method: "post",
        url: "/api/accounts/register/checkMaxEmailUsage",
        data: {
          email_address: formState.email
        }
      }).then(res => {
        if (res.data.error) {
          return Promise.reject(res.data.error);
        }
      });

      if (!isValid) {
        return Promise.reject("Please use jazzhipster email account");
      } else {
        return Promise.resolve();
      }
    };

    const handleFinish = () => {
      submitRegister();
    };

    const rules = {
      email: [
        {
          validator: checkEmailJazzHipster,
          trigger: ["change", "blur"]
        }
      ],
      username: [
        {
          validator: checkUsername,
          trigger: ["change", "blur"]
        }
      ],
      confirmPassword: [
        {
          validator: checkConfirmPassword,
          trigger: ["change", "blur"]
        }
      ]
    };

    const submitRegister = () => {
      let name = formState.email.split("@")[0];
      let firstName = name.split(".")[0];
      let lastName = name.split(".")[1];
      changeSpinning();
      axios({
        method: "post",
        url: "/api/accounts/register",
        data: {
          username: formState.username,
          password: formState.password,
          email_address: formState.email,
          first_name: firstName,
          last_name: lastName || "JS",
          is_active: true,
          is_staff: true,
          is_superuser: false
        }
      }).then(() => {
        changeSpinning();

        router.push({ name: "Login" });
      });
    };

    return {
      formState,
      rules,
      handleFinish,
      submitRegister,
      spinning,
      changeSpinning
    };
  }
});
</script>

<style scoped>
</style>
