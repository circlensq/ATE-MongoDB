<template>
  <a-row
    :type="flex"
    justify="center"
    :style="{
      paddingTop: '100px',
      height: '100%',
      paddingLeft: '20px',
      paddingRight: '20px',
    }"
  >
    <a-col :xs="20" :sm="20" :md="8" :lg="8" :xl="8">
      <a-row type="flex" justify="space-around" align="middle">
        <a-col>
          <a-typography-title :level="2">ATE-Dashboard</a-typography-title>
        </a-col>
      </a-row>
      <div class="main">
        <a-form id="formLogin">
          <a-input
            v-model:value="formState.username"
            placeholder="username"
            :style="{ marginBottom: '20px' }"
          />

          <a-input
            v-model:value="formState.password"
            placeholder="password"
            type="password"
            :style="{ marginBottom: '20px' }"
          />
          <a-row :style="{ textAlign: 'left', margin: '10px 0px 30px 0px' }">
            <a-col>
              <a-typography-link href="#" target="_blank">
                <router-link :to="{ name: 'ForgotPassword' }">
                  Forgot your Password?
                </router-link>
              </a-typography-link>
            </a-col>
          </a-row>
          <a-button type="primary" :style="{ width: '100%' }">Login</a-button>
          <a-row
            justify="center"
            :style="{ textAlign: 'center', marginTop: '10px' }"
          >
            <a-col>
              Don't have account?
              <a-typography-link href="#" target="_blank">
                <router-link :to="{ name: 'Register' }">
                  Register now
                </router-link>
              </a-typography-link>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  setup() {
    const formState = reactive({
      layout: "horizontal",
      username: "",
      password: "",
    });

    return {
      formState,
    };
  },
});
</script>

<style>
</style>