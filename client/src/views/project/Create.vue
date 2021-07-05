<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    @finish="onSubmit"
  >
    <a-form-item label="Project Name" name="name">
      <a-input
        v-model:value="formState.name"
        placeholder="Example: MS1830_S2S"
      />
    </a-form-item>
    <a-form-item label="Project Stage" name="stage">
      <a-input
        v-model:value="formState.stage"
        placeholder="Example: If new project, please type 'EVT'"
      />
    </a-form-item>
    <a-form-item label="Project Status" name="status">
      <a-select v-model:value="formState.status">
        <a-select-option value="testing">Testing</a-select-option>
        <a-select-option value="finished">Finished</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Project Description" name="description">
      <a-input v-model:value="formState.description" type="textarea" />
    </a-form-item>

    <a-form-item
      required
      v-for="(station, index) in formState.stations"
      :key="station.key"
      v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
      :label="index === 0 ? 'Stations' : ''"
      :name="['stations', index, 'value']"
    >
      <a-input
        v-model:value="station.value"
        placeholder="please input station"
        style="width: 58%"
      />
      <MinusCircleOutlined
        v-if="formState.stations.length > 1"
        class="dynamic-delete-button"
        :disabled="formState.stations.length === 1"
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

    <a-form-item :wrapper-col="{ span: 14, offset: 14 }">
      <a-button type="primary" html-type="submit">Create New Project</a-button>
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
            offset: 4,
          },
        },
      },
      rules: {
        name: [
          {
            type: "string",
            validator: this.checkProjectName,
            required: true,
            message: "Please input project name",
            trigger: "blur",
          },
        ],
        stage: [
          {
            type: "string",
            validator: this.checkProjectStage,
            required: true,
            message: "Please input project stage",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    addStation() {
      this.formState.stations.push({
        value: "",
        key: Date.now(),
      });
    },
    removeStation(item) {
      let index = this.formState.stations.indexOf(item);
      if (index !== -1) {
        this.formState.stations.splice(index, 1);
      }
    },
    openNotificationWithIcon(type, message, description) {
      notification[type]({
        message: message,
        description: description,
      });
    },
    async checkProjectName() {
      const name = this.formState.name;
      if (!name) {
        return Promise.reject("Please input the project name");
      }
    },
    async checkProjectStage() {
      const stage = this.formState.stage;
      if (!stage) {
        return Promise.reject("Please input the project stage");
      }
    },
    async onSubmit() {
      if (this.formState.stations.length == 0) {
        this.openNotificationWithIcon(
          "error",
          "Error",
          "Please input stations"
        );
      } else {
        const token = localStorage.getItem("user");
        await axios({
          method: "post",
          url: "/api/project/create",
          headers: {
            Authorization: `Token ${token}`,
          },
          data: {
            name: this.formState.name,
            status: this.formState.status,
            stage: this.formState.stage,
            description: this.formState.description,
            stations: this.formState.stations,
          },
        })
          .then((res) => {
            if (res.data.message) {
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
              this.formState.stations = [];
            }
          })
          .catch((err) => {
            console.log("Error: ", err);
          });
      }
    },
    resetForm() {
      this.formState.stations = [];
    },
  },
};
</script>

<style>
</style>