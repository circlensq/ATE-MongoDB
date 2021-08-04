<template>
  <a-row style="margin-bottom: 10px">
    <div id="app">
      <dashboard
        :uppy="uppy"
        :props="{ theme: 'light', width: 350, height: 350 }"
      />
    </div>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      @finish="onSubmit"
      style="width: 500px"
    >
      <a-form-item label="Project" name="project">
        <a-select
          v-model:value="formState.project"
          show-search
          placeholder="Select a project"
          option-filter-prop="label"
          :filter-option="filterOption"
          @change="getStations"
        >
          <a-select-option
            v-for="project in projects"
            :value="project.name"
            :key="project._id"
            >{{ project.name }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="Station" name="station">
        <a-select v-model:value="formState.station">
          <a-select-option
            v-for="(station, index) in projectStations"
            placeholder="Select a station"
            :selected="index == 0 ? true : false"
            :value="station.value"
            :key="station._id"
            >{{ station.value }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="Test" name="test">
        <a-select v-model:value="formState.test" placeholder="Select .txt type">
          <a-select-option value="data">Data</a-select-option>
          <a-select-option value="log">log</a-select-option>
          <a-select-option value="comport">ComportText</a-select-option>
          <a-select-option value="telnet">TelnetText</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-row>
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
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      formRef: {},
      formState: {
        project: null,
        station: null,
        test: null,
      },
      projectStations: [],
      searchText: "",
      searchColumn: "",
      selectedRowKeys: [],
      data: null,
      onComplete: false,
      loading: false,
      columns: [
        {
          title: "Result",
          dataIndex: "result",
          key: "result",
          width: 100,
          fixed: "left",
          slots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.result
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
          title: "Test Date",
          dataIndex: "test_date",
          key: "test_date",
          fixed: "left",
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
                  new Date(record.test_date) >= date1 &&
                  new Date(record.test_date) <=
                    new Date(date1).setDate(new Date(date1).getDate() + 1)
                );
              } else {
                return (
                  new Date(record.test_date) >= date1 &&
                  new Date(record.test_date) <= date2
                );
              }
            } else return record;
          },
        },
        {
          title: "Test Part",
          dataIndex: "test_station",
          key: "test_station",
          width: 150,
          fixed: "left",
          slots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.test_station
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
          title: "Serial Number",
          width: 150,
          dataIndex: "serial_number",
          key: "serial_number",
          fixed: "left",
          slots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.serial_number
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
          title: "Mac Address",
          dataIndex: "mac_address",
          key: "mac_address",
          width: 150,
          fixed: "left",
          slots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.mac_address
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
          title: "Error Code",
          dataIndex: "error_code",
          key: "error_code",
          width: 100,
          slots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.error_code
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
          title: "Test Time (minutes)",
          dataIndex: "test_time_minutes",
          key: "test_time_minutes",
          width: 100,
          slots: {
            customRender: "customRender",
          },
        },
        {
          title: "Data(.txt)",
          dataIndex: "data_txt_filename",
          key: "data_txt_filename",
          width: 150,
          slots: { customRender: "customRender" },
        },
        {
          title: "Log(.txt)",
          dataIndex: "log_txt_filename",
          key: "log_txt_filename",
          width: 150,
          slots: { customRender: "customRender" },
        },
        {
          title: "Comport(.txt)",
          dataIndex: "comport_txt_filename",
          key: "comport_txt_filename",
          width: 150,
          slots: { customRender: "customRender" },
        },
        {
          title: "Telnet(.txt)",
          dataIndex: "telnet_txt_filename",
          key: "telnet_txt_filename",
          width: 150,
          slots: { customRender: "customRender" },
        },
        {
          title: "Added Time",
          dataIndex: "added_time",
          key: "added_time",
          width: 120,
          slots: { customRender: "customRender" },
        },
      ],
      rules: {
        project: [
          {
            type: "string",
            validator: this.checkProjectName,
            required: true,
            trigger: ["change", "blur"],
          },
        ],
        station: [
          {
            type: "string",
            validator: this.checkProjectStation,
            required: true,
            trigger: "blur",
          },
        ],
        test: [
          {
            type: "string",
            validator: this.checkProjectFile,
            required: true,
            trigger: "blur",
          },
        ],
      },
      spinning: false,
      getUsername: null,
      projects: null,
    };
  },
  mounted() {
    this.getAllFiles();
    this.fetchProjects();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    uppy: () => {
      const token = localStorage.getItem("user");
      return new Uppy({
        restrictions: {
          maxFileSize: 1000000000, // 1000mb
        },
        meta: {
          user: token,
        },
      })
        .use(XHRUpload, {
          endpoint: "/api/file/converter/upload",
          fieldName: "files",
          formData: true,
          headers: {
            Authorization: `Token ${token}`,
          },
        })
    },
  },
  beforeUnmount() {
    this.uppy.close();
  },
  methods: {
    async getStations(value) {
      await axios.get(`/api/project/search/${value}`).then((res) => {
        this.projectStations = res.data.project.stations;
      });
    },
    filterOption(input, option) {
      return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    async fetchProjects() {
      this.spinning = true;
      await axios.get("/api/project/all").then((res) => {
        this.projects = res.data.projects[0];
      });
      this.spinning = false;
    },
    async refreshTable() {
      this.loading = true;
      await this.getAllFiles().then(() => (this.loading = false));
    },
    async checkProjectName() {
      const project = this.formState.project;
      if (!project) {
        return Promise.reject("Please input the project name");
      }
    },
    async checkProjectStation() {
      const station = this.formState.station;
      if (!station) {
        return Promise.reject("Please input the station");
      }
    },
    async checkProjectFile() {
      const file = this.formState.test;
      if (!file) {
        return Promise.reject("Please input the file");
      }
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
        console.log(res);
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
          fileLink.setAttribute("download", "bundle_download.zip");
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
      //   this.spinning = true;
      //   await axios.get("/api/file/universal/all").then((res) => {
      //     this.data = res.data.files;
      //     this.spinning = false;
      //   });
    },
  },
};
</script>