<template>
  <a-layout-sider
    breakpoint="lg"
    collapsed-width="0"
  >
    <div class="logo" :style="{ textAlign: 'center', marginTop: '10px' }">
      <a-typography-title :style="{ color: 'white' }" :level="4"
        >ATE-Dashboard</a-typography-title
      >
    </div>
    <a-menu
      theme="dark"
      mode="inline"
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      :style="{ height: '100%', borderRight: 0 }"
    >
      <a-sub-menu key="dashboard">
      <template #title>
          <span class="nav-text">
            <AppstoreOutlined />
            Dashboard
          </span>
        </template>
        <a-menu-item key="dashboard-list">
          <router-link :to="{ name: 'List' }">
            List
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      
    </a-menu>
  </a-layout-sider>
</template>
<script>
import { defineComponent, ref } from "vue";
import { AppstoreOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  components: {
    AppstoreOutlined,
  },

  setup() {
    return {
      selectedKeys: ref(["dashboard-list"]),
      openKeys: ref(["dashboard"]),
    };
  }
});
</script>
