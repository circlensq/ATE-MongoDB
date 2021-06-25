<template>
  <a-modal
    cancel-text="Cancel"
    ok-text="Download"
    :visible="modalVisible"
    :title="modalTitle"
    @ok="downloadSingle"
    @cancel="toggleModal"
  >
    <span class="pre-formatted" v-if="contentFile">
      {{ contentFile }}
    </span>
    <i v-else>Loading File...</i>
  </a-modal>
  <a-row>
    <a-col :span="12">
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
    <a-col :span="12">
      <a-row type="flex" justify="end">
        <a-space align="center">
          <a-form-item>
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
      :scroll="{ x: 1500, y: 300 }"
      :rowKey="(data) => data._id"
    >
      <template #test_date="{ text: test_date }">
        {{ testDateFormatted(test_date) }}
      </template>
      <template #result="{ text: result }">
        <span>
          <a-tag :color="result === 'PASS' ? '#0be881' : '#ff4d4f'">
            {{ result.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template #data_txt_filename="{ text: data_txt_filename }">
        <span v-if="data_txt_filename">
          <a-button type="link" @click="toggleModal(data_txt_filename)">
            <EyeOutlined twoToneColor="#f39c12" />
          </a-button>
        </span>
        <span v-else>
          <a-button type="link" style="color: black; cursor: not-allowed">
            <EyeInvisibleOutlined />
          </a-button>
        </span>
      </template>
      <template #log_txt_filename="{ text: log_txt_filename }">
        <span v-if="log_txt_filename">
          <a-button type="link" @click="toggleModal(log_txt_filename)">
            <EyeOutlined twoToneColor="#f39c12" />
          </a-button>
        </span>
        <span v-else>
          <a-button type="link" style="color: black; cursor: not-allowed">
            <EyeInvisibleOutlined />
          </a-button>
        </span>
      </template>
      <template #comport_txt_filename="{ text: comport_txt_filename }">
        <span v-if="comport_txt_filename">
          <a-button type="link" @click="toggleModal(comport_txt_filename)">
            <EyeOutlined twoToneColor="#f39c12" />
          </a-button>
        </span>
        <span v-else>
          <a-button type="link" style="color: black; cursor: not-allowed">
            <EyeInvisibleOutlined />
          </a-button>
        </span>
      </template>
      <template #telnet_txt_filename="{ text: telnet_txt_filename }">
        <span v-if="telnet_txt_filename">
          <a-button type="link" @click="toggleModal(telnet_txt_filename)">
            <EyeOutlined twoToneColor="#f39c12" />
          </a-button>
        </span>
        <span v-else>
          <a-button type="link" style="color: black; cursor: not-allowed">
            <EyeInvisibleOutlined />
          </a-button>
        </span>
      </template>
      <template #added_time="{ text: added_time }">
        {{ testDateFormatted(added_time) }}
      </template>
      <template #action>
        <a>action</a>
      </template>
    </a-table>
  </a-spin>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
import moment from "moment";
import b64ToBlob from "b64-to-blob";
// import fileSaver from "file-saver";

export default defineComponent({
  components: {
    EyeOutlined,
    EyeInvisibleOutlined,
    DownOutlined,
  },
  data() {
    return {
      data: null,
      columns,
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
    };
  },
  mounted() {
    this.fetchTests();
  },
  methods: {
    async fetchTests() {
      this.spinning = true;
      await axios
        .get("/api/tests/all")
        .then((res) => {
          this.data = res.data.tests[0];
          this.spinning = false;
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    },
    async toggleModal(txt_filename) {
      this.modalVisible = !this.modalVisible;
      this.contentFile = null;

      if (this.modalVisible) {
        this.modalDownloadLink = txt_filename;
        let textFilenameSplit = txt_filename.split("\\");
        this.modalTitle = textFilenameSplit[textFilenameSplit.length - 1];
      }

      let convertLink = this.modalDownloadLink
        .replace(".\\\\", "")
        .replace("\\\\", "-")
        .replace(/\\/g, "-");
      // convertLink = Data-Dotboard-2021_06_21-DB1111111111_202106210830.txt

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
    onFocus() {
      this.isOnFocus = true;
    },
    onBlur() {
      this.isOnFocus = false;
    },
    testDateFormatted(test_date) {
      return moment(test_date).format("YYYY/MM/DD hh:mm:ss");
    },
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    async readFile() {
      // modalDownloadLink = .\\Data\\Dotboard\2021_06_21\DB1111111111_202106210830.txt
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
      // modalDownloadLink = .\\Data\\Dotboard\2021_06_21\DB1111111111_202106210830.txt
      let convertLink = this.modalDownloadLink
        .replace(".\\\\", "")
        .replace("\\\\", "-")
        .replace(/\\/g, "-");
      // convertLink = Data-Dotboard-2021_06_21-DB1111111111_202106210830.txt

      let convertLinkSplit = convertLink.split("-");
      let fileName = convertLinkSplit[convertLinkSplit.length - 1];

      await axios({
        method: "get",
        url: "/api/file/download/" + convertLink,
        responseType: "blob",
      })
        .then((res) => {
          console.log(res.data.text);
          res.data.text().then((text) => console.log(text));

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
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  watch: {
    autoRefresh(newValue) {
      if (newValue.length === 1) {
        this.disabled = false;
        this.reRender = true;

        setTimeout(() => {
          this.fetchTests();
        }, this.autoRefreshSeconds * 1000);
      } else {
        this.disabled = true;
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

const columns = [
  {
    width: 120,
    title: "Test Date",
    dataIndex: "test_date",
    key: "test_date",
    fixed: "left",
    slots: {
      title: "Test Date",
      customRender: "test_date",
    },
  },
  {
    title: "Serial Number",
    width: 150,
    dataIndex: "serial_number",
    key: "serial_number",
    fixed: "left",
  },
  {
    title: "Mac Address",
    dataIndex: "mac_address",
    key: "mac_address",
    width: 150,
  },
  {
    title: "Test Part",
    dataIndex: "test_station",
    key: "test_station",
    width: 150,
  },
  {
    title: "Test Time (minutes)",
    dataIndex: "test_time_minutes",
    key: "test_time_minutes",
    width: 100,
  },
  {
    title: "Data(.txt)",
    dataIndex: "data_txt_filename",
    key: "data_txt_filename",
    width: 150,
    slots: { customRender: "data_txt_filename" },
  },
  {
    title: "Log(.txt)",
    dataIndex: "log_txt_filename",
    key: "log_txt_filename",
    width: 150,
    slots: { customRender: "log_txt_filename" },
  },
  {
    title: "Comport(.txt)",
    dataIndex: "comport_txt_filename",
    key: "comport_txt_filename",
    width: 150,
    slots: { customRender: "comport_txt_filename" },
  },
  {
    title: "Telnet(.txt)",
    dataIndex: "telnet_txt_filename",
    key: "telnet_txt_filename",
    width: 150,
    slots: { customRender: "telnet_txt_filename" },
  },
  {
    title: "Added Time",
    dataIndex: "added_time",
    key: "added_time",
    width: 120,
    slots: { customRender: "added_time" },
  },
  {
    title: "Result",
    dataIndex: "result",
    key: "result",
    width: 100,
    fixed: "right",
    slots: { customRender: "result" },
  },
];
</script>

<style scoped>
.pre-formatted {
  white-space: pre;
}
</style>