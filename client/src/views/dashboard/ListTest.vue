<template>
  <a-modal
    cancel-text="Cancel"
    ok-text="Download"
    :visible="modalVisible"
    :title="modalTitle"
    @ok="downloadSingle"
    @cancel="toggleModal"
    width="800px"
  >
    <span class="pre-formatted" v-if="contentFile">
      <div style="overflow: auto">
        {{ contentFile }}
      </div>
    </span>
    <i v-else>Loading File...</i>
  </a-modal>
  <a-row style="margin-bottom: 10px">
    <a-col :span="6">
      <span style="margin-left: 8px">
        Project:
        <a-select
          v-model:value="selectedProjectId"
          style="width: 120px"
          ref="selectProject"
          @change="fetchTestsById"
          defaultActiveFirstOption
        >
          <a-select-option
            v-for="project in projects"
            :value="project._id"
            :key="project._id"
          >
            {{ project.name }}
          </a-select-option>
        </a-select>
      </span>
    </a-col>
  </a-row>
  <a-row style="margin-bottom: 10px">
    <a-col :span="6">
      <a-space align="center">
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="download_data" @click="download('data')"
                >Download Data(.txt)</a-menu-item
              >
              <a-menu-item key="download_log" @click="download('log')"
                >Download Log(.txt)</a-menu-item
              >
              <a-menu-item key="download_comport" @click="download('comport')"
                >Download Comport(.txt)</a-menu-item
              >
              <a-menu-item key="download_telnet" @click="download('telnet')"
                >Download Telnet(.txt)</a-menu-item
              >
              <a-tooltip title="Danger!" color="red" placement="right">
                <a-menu-item key="delete">Delete</a-menu-item>
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
          <a-form-item style="margin-bottom: 0">
            <a-button
              type="primary"
              :loading="loading"
              @click="refreshTable"
              size="small"
            >
              Refresh
            </a-button>
            <a-divider type="vertical" />
            <a-checkbox-group v-model:value="autoRefresh">
              <a-checkbox value="auto" name="type"
                >auto refresh every</a-checkbox
              >
            </a-checkbox-group>

            <a-input-number
              size="small"
              :min="1"
              :max="10000"
              :disabled="disabled"
              v-model:value="autoRefreshSeconds"
              @focus="onFocus"
              @blur="onBlur"
            />
            seconds
          </a-form-item>
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
      :scroll="{ x: 1500, y: 500 }"
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
        <template v-else-if="column.dataIndex == 'test_date'">
          {{ testDateFormatted(text) }}
        </template>
        <template v-else-if="column.dataIndex == 'error_code'">
          <span v-if="text === '0' ? '' : text">
            {{ text }}
          </span>
        </template>
        <template v-else-if="column.dataIndex == 'added_time'">
          {{ testDateFormatted(text) }}
        </template>
        <template
          v-else-if="
            column.dataIndex == 'data_txt_filename' ||
            column.dataIndex == 'log_txt_filename' ||
            column.dataIndex == 'comport_txt_filename' ||
            column.dataIndex == 'telnet_txt_filename'
          "
        >
          <span v-if="text">
            <a-button type="link" @click="toggleModal(text)">
              <EyeOutlined twoToneColor="#f39c12" />
            </a-button>
          </span>
          <span v-else>
            <a-button type="link" style="color: black; cursor: not-allowed">
              <EyeInvisibleOutlined />
            </a-button>
          </span>
        </template>
        <template v-else-if="column.dataIndex == 'result'">
          <span>
            <a-tag :color="text === 'PASS' ? '#0be881' : '#ff4d4f'">
              {{ text.toUpperCase() }}
            </a-tag>
          </span>
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
import debounce from "debounce";
import { defineComponent } from "vue";
import {
  DownOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import moment from "moment";
import b64ToBlob from "b64-to-blob";

export default defineComponent({
  components: {
    EyeOutlined,
    EyeInvisibleOutlined,
    DownOutlined,
    SearchOutlined,
  },
  data() {
    return {
      searchText: "",
      searchColumn: "",
      data: null,
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
      autoRefreshSeconds: 5,
      autoRefresh: [],
      disabled: true,
      spinning: false,
      autoTimeout: null,
      modalVisible: false,
      isOnFocus: false,
      selectedRowKeys: [],
      modalDownloadLink: null,
      modalTitle: null,
      contentFile: null,
      autoRefreshTimeout: null,
      searchInput: {},
      projects: [],
      selectedProjectId: null,
    };
  },
  mounted() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      await axios.get("/api/project/all").then((res) => {
        this.projects = res.data.projects[0];
        this.selectedProjectId = res.data.projects[0][0]._id;
        this.fetchTestsById();
      });
    },
    async refreshTable() {
      this.loading = true;
      await this.fetchTestsById().then(() => (this.loading = false));
    },
    async fetchTestsById() {
      if (this.selectedProjectId != null) {
        this.spinning = true;
        await axios
          .get(`/api/tests/${this.selectedProjectId}`)
          .then((res) => {
            if (this.data != null) {
              let difference = res.data.tests[0].length - this.data.length;
              this.data = res.data.tests[0];
              if (difference > 0) {
                let failedTests = res.data.tests[0]
                  .slice(0, difference)
                  .filter((row) => row.result == "FAIL");

                if (
                  failedTests.length > 0 &&
                  this.$store.state.notification.enableFailNotification &&
                  this.$store.state.notification.notificationAPIStatus
                ) {
                  // 建立通知
                  new Notification("ATE Dashboard", {
                    body:
                      failedTests.length > 1
                        ? `Fail tests (${failedTests.length}):` +
                          failedTests.map((test) => test.serial_number)
                        : "Fail test (1): " +
                          failedTests.map((test) => test.serial_number),
                  });
                } else if (
                  failedTests.length > 0 &&
                  this.$store.state.notification.enableFailNotification &&
                  !this.$store.state.notification.notificationAPIStatus
                ) {
                  this.openNotificationWithIcon("error", failedTests);
                }
                this.data = res.data.tests[0];
              }
            } else {
              this.data = res.data.tests[0];
            }
            this.spinning = false;
          })
          .catch((err) => {
            console.log("error: ", err);
          });
      }
    },
    async toggleModal(txt_filename) {
      this.modalVisible = !this.modalVisible;
      this.contentFile = null;

      if (this.modalVisible) {
        this.modalDownloadLink = txt_filename;
        let textFilenameSplit = txt_filename.split("/");
        this.modalTitle = textFilenameSplit[textFilenameSplit.length - 1];
      }

      let convertLink = this.modalDownloadLink
        .replace("/", "-")
        .replace("/", "-")
        .replace("/", "-")
        .replace("/", "-");
      // convertLink = docs-Data-Dotboard-2021_06_21-DB1111111111_202106210830.txt

      await axios({
        method: "get",
        url: "/api/file/download/" + convertLink,
        responseType: "blob",
      })
        .then((res) => {
          res.data.text().then((text) => (this.contentFile = text));
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    },
    openNotificationWithIcon(type, failedTests) {
      notification[type]({
        message: "Failed Test",
        description:
          failedTests.length > 1
            ? `Fail tests (${failedTests.length}):` +
              failedTests.map((test) => test.serial_number)
            : "Fail test (1): " + failedTests.map((test) => test.serial_number),
      });
    },
    onFocus() {
      this.isOnFocus = true;
    },
    onBlur() {
      this.isOnFocus = false;
    },
    testDateFormatted(test_date) {
      return moment(test_date).format("YYYY/MM/DD HH:mm:ss");
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    async download(dataType) {
      let dataUrl = "";

      if (dataType === "data") dataUrl = "data";
      else if (dataType === "log") dataUrl = "log";
      else if (dataType === "comport") dataUrl = "comport";
      else if (dataType === "telnet") dataUrl = "telnet";

      await axios({
        method: "post",
        url: `/api/file/download/${dataUrl}`,
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
          fileLink.setAttribute("download", `${dataUrl}_download.zip`);
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    },
    async downloadSingle() {
      // modalDownloadLink = docs/Data/Dotboard/2021_06_21/DB1111111111_202106210830.txt
      let convertLink = this.modalDownloadLink
        .replace("/", "-")
        .replace("/", "-")
        .replace("/", "-")
        .replace("/", "-");
      // convertLink = Data-Dotboard-2021_06_21-DB1111111111_202106210830.txt

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
    async searchTests(newValue) {
      this.spinning = true;
      await axios
        .get(`/api/tests/search/${newValue}`)
        .then((res) => {
          this.data = res.data.tests[0];
          this.spinning = false;
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
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.searchTests = debounce(this.searchTests, 700);
  },
  watch: {
    autoRefresh(newValue) {
      if (newValue.length === 1) {
        this.disabled = false;
        this.reRender = true;

        clearTimeout(this.autoRefreshTimeout);
        this.autoRefreshTimeout = setTimeout(() => {
          this.fetchTests();
        }, this.autoRefreshSeconds * 1000);
      } else {
        this.disabled = true;
        clearTimeout(this.autoRefreshTimeout);
        this.spinning = false;
      }
    },
    autoRefreshSeconds(newValue) {
      if (this.isOnFocus == false && newValue == null)
        this.autoRefreshSeconds = 5;
    },
    data() {
      if (this.autoRefresh[0] === "auto") {
        setTimeout(() => {
          this.fetchTests();
        }, this.autoRefreshSeconds * 1000);
      }
    },
  },
});
</script>

<style scoped>
.pre-formatted {
  white-space: pre;
}
</style>