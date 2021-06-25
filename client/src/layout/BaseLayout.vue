<template>
  <a-layout>
    <Sidebar />
    <a-layout>
      <Navbar />
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
          <a-breadcrumb-item>List</a-breadcrumb-item>
        </a-breadcrumb>
        <div
          :style="{ padding: '24px', background: '#fff', minHeight: '360px' }"
        >
          <router-view></router-view>
        </div>
      </a-layout-content>
     <Footer />
    </a-layout>
  </a-layout>
</template>

<script>
import Footer from './footer/index.vue'
import Navbar from './navbar/index.vue'
import Sidebar from './sidebar/index.vue'

import { defineComponent, ref } from "vue";

import { authComputed } from '@/vuex/helpers'

export default defineComponent({
  components: {
    Footer,
    Navbar,
    Sidebar,

  },

  setup() {
    const onCollapse = (collapsed, type) => {
      console.log(collapsed, type);
    };

    const onBreakpoint = (broken) => {
      console.log(broken);
    };

    return {
      selectedKeys: ref(["4"]),
      onCollapse,
      onBreakpoint,
    };
  },
  computed: {
    ...authComputed
  }
});
</script>
<style>
#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

[data-theme="dark"] .site-layout-sub-header-background {
  background: #141414;
}
</style>