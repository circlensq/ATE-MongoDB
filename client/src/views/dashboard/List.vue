<template>
  <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }">
    <template #action>
      <a>action</a>
    </template>
  </a-table>
</template>

<script>
import axios from "axios";

import { defineComponent } from "vue";
const columns = [
  {
    width: 100,
    dataIndex: "test_date",
    key: "name",
    fixed: "left",
    slots: {
      title: 'Test Time',
      customRender: 'testTime'
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
    title: "Result",
    dataIndex: "result",
    key: "3",
    width: 100
  },
  {
    title: "Data(.txt)",
    dataIndex: "data_txt_filename",
    key: "4",
    width: 150
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
    title: "Test Time",
    dataIndex: "test_time_minutes",
    key:"9",
    fixed: "right",
    width: 100,
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
  data() {
    return {
      data: null,
      columns
    };
  },
  mounted() {
    axios
      .get("/api/tests/all")
      .then(res => {
        this.data =  res.data.tests[0];
      })
      .catch(err => {
        console.log("error: ", err);
      });
  }
});
</script>

<style>
</style>