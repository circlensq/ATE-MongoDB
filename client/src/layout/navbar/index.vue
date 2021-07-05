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
    return{
      searchBar: null,
    }
  },
  methods: {
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