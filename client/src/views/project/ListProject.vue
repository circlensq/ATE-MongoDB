<template>
  <a-spin tip="Loading..." :spinning="spinning">
    <a-table
      :columns="columns"
      :data-source="data"
      :scroll="{ y: 500 }"
      :rowKey="(data) => data._id"
      :pagination="{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
      }"
    >
      <template
        #filterDropdown="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
      >
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="
              (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
            "
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            <template #icon><SearchOutlined /></template>
            Search
          </a-button>
          <a-button
            size="small"
            style="width: 90px"
            @click="handleReset(clearFilters)"
          >
            Reset
          </a-button>
        </div>
      </template>
      <template #filterIcon="filtered">
        <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>
      <template #customRender="{ text, column }">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text
              .toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              class="highlight"
              :key="i"
            >
              {{ fragment }}
            </mark>
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-else-if="column.dataIndex == 'name'">
          {{ text }}
        </template>
        <template v-else-if="column.dataIndex == 'stations'">
          <a-tag v-for="station in text" :key="station.key">{{
            station.value
          }}</a-tag>
        </template>
        <template v-else-if="column.className == 'action'">
          <router-link :to="{ name: 'project-edit', params: { id: text } }">
            Edit
          </router-link>
        </template>
        <template v-else-if="column.dataIndex == '_id'">
          <router-link :to="{ name: 'project-analysis', params: { id: text } }">
            Graph
          </router-link>
        </template>
        <template v-else>
          {{ text }}
        </template>
      </template>
    </a-table>
  </a-spin>
</template>

<script>
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    SearchOutlined,
  },
  data() {
    return {
      data: [],
      spinning: false,
      selectedRowKeys: [],
      columns: [
        {
          width: 120,
          title: "Name",
          dataIndex: "name",
          key: "name",
          fixed: "left",
          slots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.name.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              console.log(visible);
            }
          },
        },
        {
          width: 120,
          title: "Status",
          dataIndex: "status",
          key: "status",
          slots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.status
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              console.log(visible);
            }
          },
        },
        {
          width: 120,
          title: "Stage",
          dataIndex: "stage",
          key: "stage",
          slots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.stage.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              console.log(visible);
            }
          },
        },
        {
          width: 120,
          title: "Stations",
          dataIndex: "stations",
          key: "stations",
          slots: {
            customRender: "customRender",
          },
        },
        {
          width: 120,
          title: "Analysis",
          dataIndex: "_id",
          key: "_id",
          slots: { customRender: "customRender" },
        },
        {
          width: 120,
          title: "Action",
          dataIndex: "_id",
          key: "_id",
          slots: { customRender: "customRender" },
          className: "action"
        },
      ],
    };
  },
  mounted() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      this.spinning = true;
      await axios.get("/api/project/all").then((res) => {
        this.data = res.data.projects[0];
      });
      this.spinning = false;
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },
  },
};
</script>

<style>
</style>