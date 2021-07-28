<template>
  <a-layout-header
    :style="{ background: '#fff', paddingTop: '0px', paddingRight: '20px' }"
  >
    <a-row>
      <a-col :span="12">
        <!-- <a-input-search
          v-model:value="searchBar"
          placeholder="Quick search (input with SN or MAC Address or 'PASS' and 'FAIL'"
        /> -->
      </a-col>
      <a-col :span="12">
        <a-row type="flex" justify="end">
          <div class="space-align-container">
            <div class="space-align-block">
              <a-space align="center">
                <a-tooltip placement="bottom">
                  <template #title>
                    <span>FAIL notification</span>
                  </template>
                  <a-switch
                    checked-children="开"
                    un-checked-children="关"
                    v-model:checked="enableFailNotification"
                    @change="switchFailNotification"
                  />
                </a-tooltip>
                <a-dropdown placement="bottomRight">
                  <a-avatar
                    shape="circle"
                    size="medium"
                    :style="{
                      backgroundColor: '#7265e6',
                      verticalAlign: 'middle',
                    }"
                  >
                    A
                  </a-avatar>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="logout">
                        <a rel="noopener noreferrer"> Logout </a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-space>
            </div>
          </div>
        </a-row>
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<script>
export default {
  data() {
    return {
      searchBar: null,
    };
  },
 
  mounted() {
    let store = this.$store

    let notifyConfig = {
      body: "Notification is enabled", // 設定內容
      // icon: '/images/favicon.ico', // 設定 icon
    };

    if (!("Notification" in window)) {
      console.log("This browser does not support notification");
      this.$store.dispatch("notification/setFalseNotificationAPIActions");
    }

    if (
      Notification.permission === "default" ||
      Notification.permission === "undefined"
    ) {
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          // 使用者同意授權
          new Notification("ATE Dashboard", notifyConfig); // 建立通知
          store.dispatch("notification/setTrueFailNotificationActions");
          store.dispatch("notification/setTrueNotificationAPIActions");
        } else {
          store.dispatch("notification/setFalseNotificationAPIActions");
        }
      });
    }
    else if (Notification.permission === "denied") {
      store.dispatch("notification/setFalseNotificationAPIActions");
    }
  },
  computed: {
    enableFailNotification() {
      return this.$store.state.notification.enableFailNotification
    }
  },
  methods: {
    switchFailNotification(){
      if (this.enableFailNotification == true)
        this.$store.dispatch("notification/setFalseFailNotificationActions");
      else
        this.$store.dispatch("notification/setTrueFailNotificationActions");
    },
    logout() {
      this.$store.dispatch("user/logout");
    },
    async QuickSearch(newValue) {
      if (newValue != "") {
        let capitalizeNewValue = null;
        // To search "LEDboard"
        if (newValue.slice(0, 2).toLowerCase() === "le") {
          capitalizeNewValue =
            newValue.slice(0, 2).toUpperCase() + "D" + newValue.slice(3);
        } else if (newValue.slice(0, 3).toLowerCase() === "led") {
          capitalizeNewValue =
            newValue.slice(0, 3).toUpperCase() + newValue.slice(3);
        } else
          capitalizeNewValue =
            newValue.charAt(0).toUpperCase() + newValue.slice(1);
        this.searchTests(capitalizeNewValue);
      } else {
        this.data = null;
        this.fetchTests();
      }
    },
  },
};
</script>
<style>
#components-dropdown-demo-placement .ant-btn {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>