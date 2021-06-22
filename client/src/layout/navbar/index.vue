<template>
  <a-layout-header
    :style="{ background: '#fff', paddingTop: '0px', paddingRight: '20px' }"
  >
    <a-row type="flex" justify="end">
      <div class="space-align-container">
        <div class="space-align-block">
          <a-space align="center">
            <a-dropdown placement="bottomRight">
              <a-avatar
                shape="circle"
                size="medium"
                :style="{ backgroundColor: '#7265e6', verticalAlign: 'middle' }">
                U
              </a-avatar>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="logout">
                    <a rel="noopener noreferrer">
                      Logout
                    </a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </div>
    </a-row>
  </a-layout-header>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    }
  }
}
</script>
<style>
#components-dropdown-demo-placement .ant-btn {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>