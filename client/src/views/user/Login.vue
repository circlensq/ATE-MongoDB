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
        <transition name="toast">
          <a-alert
            v-if="showToastError"
            :message="errorLogin"
            type="error"
            show-icon
            :style="{ marginBottom: '10px' }"
            :class="{ giggle: needGiggle }"
          />
        </transition>
        <transition name="success">
          <a-alert
            v-if="showToastSuccess"
            message="Successfully Login"
            type="success"
            show-icon
            :style="{ marginBottom: '10px' }"
          />
        </transition>

        <a-row type="flex" justify="space-around" align="middle">
          <a-col>
            <a-typography-title :level="2">ATE-Dashboard</a-typography-title>
          </a-col>
        </a-row>
        <div class="main">
          <a-form id="formLogin">
            <a-input
              v-model:value="username"
              placeholder="username"
              :style="{ marginBottom: '20px' }"
              @keypress.enter="submitLogin"
            />

            <a-input
              v-model:value="password"
              placeholder="password"
              type="password"
              :style="{ marginBottom: '20px' }"
              @keypress.enter="submitLogin"
            />
            <a-row :style="{ textAlign: 'left', margin: '10px 0px 30px 0px' }">
              <a-col>
                <a-typography-link :style="{ cursor: 'not-allowed' }">
                  <!-- <router-link
                    :to="{ name: 'ForgotPassword' }"
                    tag="button"
                    :disabled="true"
                    
                  >
                    Forgot your Password?
                  </router-link> -->
                </a-typography-link>
              </a-col>
            </a-row>
            <a-button
              type="primary"
              :style="{ width: '100%' }"
              @click="submitLogin"
              >Login</a-button
            >
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
      </a-spin>
    </a-col>
  </a-row>
</template>

<script>
import { defineComponent } from "vue";
import axios from 'axios'

export default defineComponent({
  data() {
    return {
      username: '',
      password: '',
      spinning: false,
      showToastSuccess: false,
      errorLogin: '',
      needGiggle: false,
      showToastError: false,
    }
  },
  computed: {
    
  },
  methods: {
    changeSpinning () {
      this.spinning = !this.spinning;
    },
    triggerToast () {
      if (this.showToastError == false) this.showToastError = true;
      else {
        this.needGiggle = true;
        setTimeout(() => (this.needGiggle = false), 300);
      }
    },
    createFreshUserObject () {
      return {
        username: '',
        password: '',
      }
    },
    submitLogin () {
       axios({
        method: "post",
        url: "/api/accounts/login",
        data: {
          username: this.username,
          password: this.password
        }
      })
        .then(res => {
          this.showToastError = false;

          setTimeout(() => {
            this.showToastSuccess = true;
          }, 300);

          setTimeout(() => {
            this.changeSpinning();
            if (res.data.message) this.$router.push({ name: "Layout" });
          }, 1000);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            this.errorLogin = error.response.data.error;
            this.triggerToast();
          }
        });
    }
  }

    // const submitLogin = () => {
    //   axios({
    //     method: "post",
    //     url: "/api/accounts/login",
    //     data: {
    //       username: formState.username,
    //       password: formState.password
    //     }
    //   })
    //     .then(res => {
    //       showToastError.value = false;

    //       setTimeout(() => {
    //         showToastSuccess.value = true;
    //       }, 300);

    //       setTimeout(() => {
    //         changeSpinning();
    //         if (res.data.message) router.push({ name: "Layout" });
    //       }, 1000);
    //     })
    //     .catch(function(error) {
    //       if (error.response && error.response.status === 401) {
    //         errorLogin.value = error.response.data.error;
    //         triggerToast();
    //       }
    //     });
    // };

});
</script>

<style scoped>
.toast-enter-from {
  opacity: 0;
  transform: translateY(-60px);
}
.toast-enter-to {
  opacity: 1;
  transform: translateY(0px);
}
.toast-enter-active {
  /* transition: all 0.3s ease-in; */
  animation: wobble 0.5s ease;
}
.toast-leave-from {
  opacity: 1;
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-60px);
}
.toast-leave-active {
  transition: all 0.3s ease;
}

.success-enter-from {
  opacity: 0;
  transform: translateY(-60px);
}

.success-enter-to {
  opacity: 1;
  transform: translateY(0px);
}

.success-enter-active {
  transition: all 0.3 ease;
}

.giggle {
  animation: giggle 0.3s ease;
}

@keyframes giggle {
  0% {
    transform: translateX(8px);
  }
  25% {
    transform: translateX(-8px);
  }
  50% {
    transform: translateX(4px);
  }
  75% {
    transform: translateX(-4px);
  }
  100% {
    transform: translateX(0px);
  }
}

@keyframes wobble {
  0% {
    transform: translateY(-60px);
    opacity: 0;
  }
  50% {
    transform: translateY(0px);
    opacity: 1;
  }
  60% {
    transform: translateX(8px);
  }
  70% {
    transform: translateX(-8px);
  }
  80% {
    transform: translateX(4px);
  }
  90% {
    transform: translateX(-4px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>