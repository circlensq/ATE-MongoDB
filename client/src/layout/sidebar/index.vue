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
        <a-menu-item key="project-list">
          <router-link :to="{ name: 'project-list' }">
            List
          </router-link>
        </a-menu-item>
        <a-menu-item key="project-analysis">
          <router-link :to="{ name: 'project-analysis',  params: { id: defaultProjectId } }">
            Analysis
          </router-link>
        </a-menu-item>
        <a-menu-item key="project-create">
          <router-link :to="{ name: 'project-create' }">
            Create New
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="upload">
        <template #title>
          <span class="nav-text">
            <UploadOutlined />
            Upload
          </span>
        </template>
        <a-menu-item key="upload-files">
          <router-link :to="{ name: 'upload-files' }"> Files </router-link>
        </a-menu-item>
        <a-menu-item key="upload-test">
          <router-link :to="{ name: 'upload-test' }"> Test </router-link>
        </a-menu-item>
      </a-sub-menu>

    </a-menu>
  </a-layout-sider>
</template>
<script>
import { AppstoreOutlined, ProfileOutlined, UploadOutlined } from "@ant-design/icons-vue";
import axios from 'axios'

export default {
  components: {
    AppstoreOutlined,
    ProfileOutlined,
    UploadOutlined
  }, 
  data() {
    return {
      defaultProjectId: null,
      selectedKeys: [this.$route.name],
      openKeys: [this.$route.name.split('-')[0]],
    };
  },
  mounted() {
    this.fetchProjects()
  },
  methods: {
    async fetchProjects() {
      await axios.get("/api/project/all").then((res) => {
        try {
          this.defaultProjectId = res.data.projects[0][0]._id
        } catch {
          console.log("ATE Dashboard doesn't have any project")
        }
      });
    }
  }
};
</script>
