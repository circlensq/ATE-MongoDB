<template>
  <a-row type="flex" justify="start">
    <a-space align="center" size="small">
      <a-typography>Select Project:</a-typography>
      <a-select
        v-model:value="selectedProjectId"
        style="width: 120px"
        @focus="focus"
        ref="select"
        @change="handleChange"
      >
        <a-select-option
          v-for="project in projects"
          :value="project._id"
          :key="project._id"
          >{{ project.name }}</a-select-option
        >
      </a-select>
    </a-space>
  </a-row>
  <v-chart class="chart" :option="option" />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import axios from "axios";

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  GridComponent,
  TooltipComponent,
]);

export default {
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "light",
  },
  data() {
    return {
      projects: [],
      selectedProjectId: null,
      option: {
        title: {
          text: "Passed Percentages (%)",
          left: "center",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [],
            type: "bar",
            label: {
              show: true,
              position: "inside",
              formatter: "{@[2]}",
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.selectedProjectId = this.$route.params.id;
    this.fetchProjects();
    this.getProjectStations();
  },
  methods: {
    async fetchProjects() {
      await axios.get("/api/project/all").then((res) => {
        this.projects = res.data.projects[0];
      });
    },
    getProjectStations() {
      axios.get(`/api/project/${this.selectedProjectId}`).then(async (res) => {
        let stations = res.data.projects.stations;
        for (let station of stations) {
          await this.getPassedPercentages(
            this.selectedProjectId,
            station.value
          );
        }
      });
    },
    async getPassedPercentages(id, station) {
      await axios.get(`/api/tests/search/${id}/${station}`).then((res) => {
        this.option.xAxis.data.push(station);
        this.option.series[0].data.push(res.data.passed_percentages.toFixed(1));
      });
    },
    handleChange(value) {
      this.stations = [];
      this.option.xAxis.data = [];
      this.option.series[0].data = [];
      this.selectedProjectId = value;
      this.fetchProjects();
      this.getProjectStations();
    },
  },
};
</script>

<style>
.chart {
  height: 400px;
  width: 800px;
}
</style>