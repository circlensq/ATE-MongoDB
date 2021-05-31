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
        <a-form id="formForgotPassword">
          <a-input
            v-model:value="formState.email"
            placeholder="type your email, e.g. public@jazzhispter.com.tw"
            :style="{ marginBottom: '20px' }"
          />

          <a-button type="primary" :style="{ width: '100%' }"
            >Send your to your email</a-button
          >
          <a-row
            justify="center"
            :style="{ textAlign: 'center', marginTop: '10px' }"
          >
            <a-col>
              <a-typography-link href="#" target="_blank">
                <router-link :to="{ name: 'Login' }">
                  Back to login?
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
    });

    return {
      formState,
    };
  },
});
</script>

<style>
</style>