<template>
  <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item label="Project Name">
      <a-input
        v-model:value="formState.name"
        placeholder="Example: MS1830_S2S"
      />
    </a-form-item>
    <a-form-item label="Project Stage">
      <a-input
        v-model:value="formState.stage"
        placeholder="Example: If new project, please type 'EVT'"
      />
    </a-form-item>
    <a-form-item label="Project Status">
      <a-select v-model:value="formState.status">
        <a-select-option value="testing">Testing</a-select-option>
        <a-select-option value="finished">Finished</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Project Description">
      <a-input v-model:value="formState.description" type="textarea" />
    </a-form-item>

    <a-form
      ref="formRef"
      :model="dynamicValidateForm"
      v-bind="formItemLayoutWithOutLabel"
    >
      <a-form-item
        v-for="(station, index) in dynamicValidateForm.stations"
        :key="station.key"
        v-bind="index === 0 ? formItemLayout : {}"
        :label="index === 0 ? 'Stations' : ''"
        :name="['stations', index, 'value']"
        :rules="{
          required: true,
          message: 'station can not be null',
          trigger: 'change',
        }"
      >
        <a-input
          v-model:value="station.value"
          placeholder="please input station"
          style="width: 58%; margin-right: 8px"
        />
        <MinusCircleOutlined
          v-if="dynamicValidateForm.stations.length > 1"
          class="dynamic-delete-button"
          :disabled="dynamicValidateForm.stations.length === 1"
          @click="removeStation(station)"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayoutWithOutLabel">
        <a-button type="dashed" style="width: 58%" @click="addStation">
          <PlusOutlined />
          Add stations
        </a-button>
      </a-form-item>
      <a-form-item v-bind="formItemLayoutWithOutLabel">
        <a-button @click="resetForm">Reset</a-button>
      </a-form-item>
    </a-form>

    <a-form-item :wrapper-col="{ span: 14, offset: 14 }">
      <a-button type="primary" @click="onSubmit">Create New Project</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import axios from "axios";

export default {
  components: {
    MinusCircleOutlined,
    PlusOutlined,
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      formRef: {},
      formState: {
        name: null,
        stage: "EVT",
        status: "Testing",
        description: null,
      },
      dynamicValidateForm: {
        stations: [],
      },
      formItemLayout: {
        labelCol: {
          xs: {
            span: 24,
          },
          sm: {
            span: 4,
          },
        },
        wrapperCol: {
          xs: {
            span: 24,
          },
          sm: {
            span: 20,
          },
        },
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 20,
            offset: 4,
          },
          md: {
            span: 24,
          },
        },
      },
    };
  },
  methods: {
    addStation() {
      this.dynamicValidateForm.stations.push({
        value: "",
        key: Date.now(),
      });
    },
    removeStation(item) {
      let index = this.dynamicValidateForm.stations.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.stations.splice(index, 1);
      }
    },
    openNotificationWithIcon(type, message, description) {
      notification[type]({
        message: message,
        description: description,
      });
    },
    async onSubmit() {
      await axios({
        method: "post",
        url: "/api/project/create",
        data: {
          name: this.formState.name,
          status: this.formState.status,
          stage: this.formState.stage,
          description: this.formState.description,
          stations: this.dynamicValidateForm.stations,
        },
      })
        .then((res) => {
          if (res.data.message)
            this.openNotificationWithIcon(
              "success",
              "Successful",
              `Project ${this.formState.name} has been created !`
            );
          this.formState = {
            name: null,
            status: "Testing",
            stage: "EVT",
            description: null,
          };
          this.dynamicValidateForm.stations = [];
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    },
    resetForm() {
      this.dynamicValidateForm.stations = [];
    },
  },
};
</script>

<style>
</style>