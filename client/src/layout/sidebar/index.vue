<template>
  <a-layout-sider breakpoint="lg" collapsed-width="0">
    <div class="logo" :style="{ textAlign: 'center', marginTop: '10px' }">
      <a-typography-title
        :style="{ color: 'white', marginBottom: '0px' }"
        :level="4"
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
          <router-link :to="{ name: 'dashboard-list' }"> List </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="project">
        <template #title>
          <span class="nav-text">
            <ProfileOutlined />
            Project
          </span>
        </template>
        <a-menu-item key="project-create">
          <router-link :to="{ name: 'project-create' }">
            Create New
          </router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>
<script>
import { defineComponent, ref } from "vue";
import { AppstoreOutlined, ProfileOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  components: {
    AppstoreOutlined,
    ProfileOutlined,
  },

  setup() {
    return {
      selectedKeys: ref(["dashboard-list"]),
      openKeys: ref(["dashboard"]),
    };
  },
});
</script>
