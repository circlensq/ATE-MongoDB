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
      <a-row type="flex" justify="center">
        <a-col>
          <a-typography-title :level="2">ATE-Dashboard</a-typography-title>
        </a-col>
      </a-row>
      <div class="main">
        <a-form id="formLogin">
          <a-input
            v-model:value="formState.email"
            placeholder="type your Jazzhipster email"
            :style="{ marginBottom: '20px' }"
          />

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
          <a-input
            v-model:value="formState.confirmPassword"
            placeholder="type again your password"
            type="password"
            :style="{ marginBottom: '20px' }"
          />
          <a-row
            :style="{
              textAlign: 'center',
              margin: '0px',
              marginTop: '10px',
              padding: '0px',
            }"
            type="flex"
            justify="center"
          >
            <a-col
              :xs="24"
              :sm="24"
              :md="12"
              :lg="12"
              :xl="12"
              :style="{ marginTop: '10px' }"
            >
              <a-button
                type="primary"
                :style="{ marginRight: '10px', width: '100%' }"
                >Register</a-button
              >
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="12"
              :lg="12"
              :xl="12"
              :style="{ marginTop: '10px' }"
            >
              <a-typography-link href="#" target="_blank">
                <router-link :to="{ name: 'Login' }">
                  Already have an account?
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
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });

    return {
      formState,
    };
  },
});
</script>

<style>
</style>