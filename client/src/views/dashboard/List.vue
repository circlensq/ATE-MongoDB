<template>
  <a-row type="flex" justify="end">
    <a-form-item>
      <a-checkbox-group v-model:value="autoRefresh">
        <a-checkbox value="auto" name="type">auto refresh every</a-checkbox>
      </a-checkbox-group>

      <a-input-number
        size="small"
        :min="1"
        :max="10000"
        :disabled="disabled"
        v-model:value="autoRefreshSeconds"
      />
      seconds
    </a-form-item>
  </a-row>
  <a-spin tip="Loading..." :spinning="spinning">
    <a-table
      :columns="columns"
      :data-source="data"
      :scroll="{ x: 1500, y: 300 }"
      :rowKey="data => data._id"
    >
      <template #result="{ text: result }">
        <span>
          <a-tag :color="result === 'PASS' ? '#0be881' : '#ff4d4f'">
            {{ result.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template #data_txt_filename="{ text: data_txt_filename }">
        <span v-if="data_txt_filename">
          <a :href="data_txt_filename" target="_blank">
            <EyeOutlined twoToneColor="#f39c12" />
          </a>
        </span>
        <span v-else>
          <EyeInvisibleOutlined />
        </span>
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
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons-vue";

const columns = [
  {
    width: 100,
    title: "Test Date",
    dataIndex: "test_date",
    key: "name",
    fixed: "left",
    slots: {
      title: "Test Time",
      customRender: "testTime"
    }
  },
  {
    title: "Serial Number",
    width: 150,
    dataIndex: "serial_number",
    key: "age",
    fixed: "left"
  },
  {
    title: "Mac Address",
    dataIndex: "mac_address",
    key: "1",
    width: 150
  },
  {
    title: "Test Part",
    dataIndex: "test_station",
    key: "2",
    width: 150
  },
  {
    title: "Test Time",
    dataIndex: "test_time_minutes",
    key: "test_time_minutes",

    width: 100
  },

  {
    title: "Data(.txt)",
    dataIndex: "data_txt_filename",
    key: "data_txt_filename",
    width: 150,
    slots: { customRender: "data_txt_filename" }
  },
  {
    title: "Log(.txt)",
    dataIndex: "log_txt_filename",
    key: "5",
    width: 150
  },
  {
    title: "Comport(.txt)",
    dataIndex: "comport_txt_filename",
    key: "6",
    width: 150
  },
  {
    title: "Telnet(.txt)",
    dataIndex: "telnet_txt_filename",
    key: "7",
    width: 150
  },
  {
    title: "Added Time",
    dataIndex: "added_time",
    key: "8"
  },
  {
    title: "Result",
    dataIndex: "result",
    key: "result",
    width: 100,
    fixed: "right",
    slots: { customRender: "result" }
  }

  // {
  //   title: "Test Time",
  //   key: "test_time_minutes",
  //   fixed: "right",
  //   width: 100,
  //   slots: {
  //     customRender: "action"
  //   }
  // }
];

export default defineComponent({
  components: {
    EyeOutlined,
    EyeInvisibleOutlined
  },
  data() {
    return {
      data: null,
      columns,
      autoRefreshSeconds: 5,
      autoRefresh: [],
      disabled: true,
      spinning: false,
      autoTimeout: null
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
        .then(res => {
          this.data = res.data.tests[0];
          this.spinning = false;
        })
        .catch(err => {
          console.log("error: ", err);
        });
    }
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
        console.log("masuk else");
        this.disabled = true;
      }
    },
    data() {
      if (this.autoRefresh[0] === "auto") {
        setTimeout(() => {
          this.fetchTests();
        }, this.autoRefreshSeconds * 1000);
      }
    }
  }
});
</script>

<style>
</style>