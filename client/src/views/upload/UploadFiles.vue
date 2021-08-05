<template>
    <div id="app">
      <dashboard :uppy="uppy" :props="{ theme: 'light', height: 350 }" />
    </div>
  <a-row style="margin-bottom: 10px">
    <a-col :span="6">
      <a-space align="center">
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="download" @click="download"
                >Download Selected</a-menu-item
              >
              <a-tooltip title="Danger!" color="red" placement="right">
                <a-menu-item key="delete" @click="deleteFile"
                  >Delete</a-menu-item
                >
              </a-tooltip>
            </a-menu>
          </template>
          <a-button v-if="hasSelected" :disabled="!hasSelected">
            Actions
            <DownOutlined />
          </a-button>
        </a-dropdown>
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `Selected ${selectedRowKeys.length} items` }}
          </template>
        </span>
      </a-space>
    </a-col>
    <a-col :span="18">
      <a-row type="flex" justify="end">
        <a-space align="center" size="small">
          Click 'Refresh' to see uploaded files 
          <a-button type="primary" :loading="loading" @click="refreshTable">
            Refresh
          </a-button>
        </a-space>
      </a-row>
    </a-col>
  </a-row>
  <a-spin tip="Loading..." :spinning="spinning">
    <a-table
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :columns="columns"
      :data-source="data"
      :rowKey="(data) => data._id"
      :pagination="{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
      }"
    >
      <template
        #filterDropdownDateRange="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
      >
        <div style="padding: 8px">
          <a-range-picker
            allowClear="true"
            v-model:value="dateRange"
            style="width: 250px; margin-bottom: 8px; display: block"
            @change="(e) => setSelectedKeys(dateRange ? [dateRange] : [])"
            @pressEnter="
              handleSearchDateRange(selectedKeys, confirm, column.dataIndex)
            "
          />
          <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="
              handleSearchDateRange(selectedKeys, confirm, column.dataIndex)
            "
          >
            <template #icon><SearchOutlined /></template>
            Search
          </a-button>
          <a-button
            size="small"
            style="width: 90px"
            @click="handleResetDateRange(clearFilters)"
          >
            Reset
          </a-button>
        </div>
      </template>
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
        <template v-else-if="column.dataIndex == 'filepath'">
          <span v-if="text">
            <a-button type="link" @click="downloadSingle(text)">
              <DownloadOutlined twoToneColor="#f39c12" />
            </a-button>
          </span>
        </template>
        <template v-else-if="column.dataIndex == 'added_time'">
          {{ testDateFormatted(text) }}
        </template>
        <template v-else>
          {{ text }}
        </template>
      </template>
    </a-table>
  </a-spin>
</template>

<script>
import { Dashboard } from "@uppy/vue";
import { notification } from "ant-design-vue";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons-vue";
import axios from "axios";
import moment from "moment";
import b64ToBlob from "b64-to-blob";

export default {
  name: "App",
  components: {
    Dashboard,
    SearchOutlined,
    DownloadOutlined,
  },
  data() {
    return {
      searchText: "",
      searchColumn: "",
      selectedRowKeys: [],
      data: null,
      onComplete: false,
      loading: false,
      columns: [
        {
          width: 100,
          title: "Date",
          dataIndex: "added_time",
          key: "added_time",
          slots: {
            filterDropdown: "filterDropdownDateRange",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) => {
            if (
              this.dateRange[0] != undefined &&
              this.dateRange[1] != undefined
            ) {
              let date1 = new Date(this.dateRange[0]).setHours(0, 0, 0, 0);
              let date2 = new Date(this.dateRange[1]).setHours(23, 59, 59, 0);
              if (date1 == date2) {
                return (
                  new Date(record.added_time) >= date1 &&
                  new Date(record.added_time) <=
                    new Date(date1).setDate(new Date(date1).getDate() + 1)
                );
              } else {
                return (
                  new Date(record.added_time) >= date1 &&
                  new Date(record.added_time) <= date2
                );
              }
            } else return record;
          },
        },
        {
          title: "Filename",
          width: 150,
          dataIndex: "filename",
          key: "filename",
          slots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.filename
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
        },
        {
          title: "Download",
          dataIndex: "filepath",
          key: "filepath",
          width: 100,
          slots: {
            customRender: "customRender",
          },
        },
        {
          title: "Uploader",
          width: 120,
          dataIndex: "user[0].username",
          key: "user_id",
          slots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.user[0].username
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
        },
      ],
      spinning: false,
      getUsername: null,
    };
  },
  mounted() {
    this.getAllFiles();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    uppy: () =>{
      const token = localStorage.getItem('user')
      return new Uppy({
        restrictions: {
          maxFileSize: 1000000000, // 1000mb = 1GB
        },
        meta: { user: localStorage.getItem("user") },
      }).use(XHRUpload, {
        endpoint: "/api/file/universal/upload",
        fieldName: "files",
        timeout: 0,
        headers: {
          Authorization: `Token ${token}`,
        }
      }).on('upload-error', (file, error, response) => {
        console.log('response', response)
        if (error.isNetworkError) {
          // Let your users know that file upload could have failed
          // due to firewall or ISP issues
          console.log('err', error)
        }
      })
    }
  },
  beforeUnmount() {
    this.uppy.close();
  },
  methods: {
    async refreshTable(){
      this.loading = true
      await this.getAllFiles().then(() => this.loading = false);
    },
    openNotificationWithIcon(type, message, description) {
      notification[type]({
        message: message,
        description: description,
      });
    },
    async deleteFile() {
      const token = localStorage.getItem("user");

      axios({
        method: "post",
        url: "/api/file/universal/delete",
        headers: {
          Authorization: `Token ${token}`,
        },
        data: {
          deleteId: this.selectedRowKeys,
        },
      }).then((res) => {
        if (res.data.message) {
          this.getAllFiles();
        } else if (res.data.error) {
          this.openNotificationWithIcon(
            "error",
            "Error",
            `Error delete file !`
          );
        }
      });
    },
    async downloadSingle(filepath) {
      // modalDownloadLink = storage/2021_07_19/WIN_20210703_20_01_31_Pro.jpg
      let convertLink = filepath.replace("/", "-").replace("/", "-");
      // convertLink = storage-2021_07_19-WIN_20210703_20_01_31_Pro.jpg

      let convertLinkSplit = convertLink.split("-");
      let fileName = convertLinkSplit[convertLinkSplit.length - 1];

      await axios({
        method: "get",
        url: "/api/file/download/" + convertLink,
        responseType: "blob",
      })
        .then((res) => {
          let fileUrl = window.URL.createObjectURL(new Blob([res.data]));
          let fileLink = document.createElement("a");
          fileLink.href = fileUrl;
          fileLink.setAttribute("download", fileName);
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    },
    async download() {
      await axios({
        method: "post",
        url: `/api/file/universal/download`,
        data: {
          files: this.selectedRowKeys,
        },
      })
        .then((res) => {
          const zipAsBase64 = res.data.zip64;
          const blob = b64ToBlob(zipAsBase64, "application/zip");
          let fileUrl = window.URL.createObjectURL(new Blob([blob]));
          let fileLink = document.createElement("a");
          fileLink.href = fileUrl;
          fileLink.setAttribute("download", 'bundle_download.zip');
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    handleSearchDateRange(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchedColumn = dataIndex;
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },
    handleResetDateRange(clearFilters) {
      clearFilters();
      this.dateRange = "";
    },
    testDateFormatted(test_date) {
      return moment(test_date).format("YYYY/MM/DD HH:mm:ss");
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    async getAllFiles() {
      this.spinning = true;

      await axios.get("/api/file/universal/all").then((res) => {
        this.data = res.data.files;
        this.spinning = false;
      });
    },
  },
};
</script>