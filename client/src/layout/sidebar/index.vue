<template>
  <a-layout-sider
    breakpoint="lg"
    collapsed-width="0"
    @collapse="onCollapse"
    @breakpoint="onBreakpoint"
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
      <a-menu-item key="1">
        <a-sub-menu key="sub1">
          <template #title>
            <span class="nav-text">
              <AppstoreOutlined />
              Dashboard
            </span>
          </template>
          <a-menu-item key="1">Analysis</a-menu-item>
          <a-menu-item key="2">Monitor</a-menu-item>
          <a-menu-item key="3">option3</a-menu-item>
        </a-sub-menu>
      </a-menu-item>
      <a-menu-item key="2">
        <UserOutlined />
        <span>Account</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>
<script>
import { defineComponent, ref} from "vue";
import { AppstoreOutlined, UserOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  components: {
    AppstoreOutlined,
    UserOutlined,
  },

  setup() {
    const onCollapse = (collapsed, type) => {
      console.log(collapsed, type);
    };

    const onBreakpoint = (broken) => {
      console.log(broken);
    };

    return {
      selectedKeys: ref(["1"]),
      onCollapse,
      onBreakpoint,
    };
  }
});
</script>
