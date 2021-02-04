<template>
  <div class="wh100">
    <div class="esb-wrapper-left-40">
      <div class="esb-wrapper-50">
        <div class="esb-top-chart xpanel xpanel-esb-bg-title">
          <p>{{ map1.titleName || "" }}</p>
        </div>
        <div class="esb-wrapper">
          <div class="esb-wrapper-left-30">
            <div class="xpanel xpanel-esb-bg-data esb-wrapper-left-30-div">
              <p class="span-red">{{ map1.num1 || 0 }}</p>
            </div>
          </div>
          <div class="esb-wrapper-left-40">
            <chart-view :options="options1"> </chart-view>
          </div>
          <div class="esb-wrapper-right-30">
            <div class="xpanel xpanel-esb-bg-data esb-wrapper-right-30-div">
              <p class="span-red">{{ map1.num2 || 0 }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="esb-wrapper-50">
        <div class="esb-top-chart xpanel xpanel-esb-bg-title">
          <p>{{ map3.titleName || "" }}</p>
        </div>
        <div class="esb-wrapper">
          <div class="esb-wrapper-left-30">
            <div class="xpanel xpanel-esb-bg-data esb-wrapper-left-30-div">
              <p class="span-yellow">{{ map3.num1 || 0 }}</p>
            </div>
          </div>

          <div class="esb-wrapper-left-40">
            <chart-view :options="options3"> </chart-view>
          </div>
          <div class="esb-wrapper-right-30">
            <div class="xpanel xpanel-esb-bg-data esb-wrapper-right-30-div">
              <p class="span-yellow">{{ map3.num2 || 0 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="esb-wrapper-right-60">
      <div class="esb-wrapper-radar">
        <chart-view type="pictorialBar" :options="options2"> </chart-view>
      </div>
    </div>
  </div>
</template>

<script>
import indexMixin from "@/views/bigscreen/mixins/indexMixin.js";
import digMixin from "./../mixins/digMixin.js";
import ChartView from "@/components/charts/ChartView";

export default {
  name: "DigTemplateA",
  mixins: [indexMixin, digMixin],
  components: { ChartView },
  props: {
    configMap: Object,
    configList: Array,
  },
  data() {
    return {
      map1: {},
      map2: {},
      map3: {},
      options1: {},
      options2: {},
      options3: {}
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getOptions1();
      this.getOptions2();
      this.getOptions3();
    },
    getOptions1() {
      this.map1["num1"] = 200;
      this.map1["num2"] = 300;
      this.map1["titleName"] = "标题1";
      let options = this.getCahrtSplitBarYOpts({
        main_color: "#FF2267",
        yAxis_max: 500,
        yAxis_data: [
          { name: "名称1", value: 500 },
          { name: "名称2", value: 500 },
        ],
        series_data: [
          { name: "名称1", value: 200 },
          { name: "名称2", value: 300 },
        ],
      });
      this.$set(this, "options1", options);
    },
    getOptions2() {
      let options = this.getCahrRadarOpts({
        main_color: "#0075E6",
        radar_Data: [
          { name: "名称1", value: 400, max: 500 },
          { name: "名称2", value: 200, max: 600 },
          { name: "名称3", value: 300, max: 800 },
          { name: "名称4", value: 400, max: 1000 },
          { name: "名称5", value: 1200, max: 2000 }
        ],
        series_data: [400, 200, 300, 400, 1200],
        //image: "/img/radar-blue.png",
        radius: "68%",
      });
      options.radar.name["formatter"] = (value, indicator) => {
        return this.splitStrBylength(value, 12).join("\n");
      };
      this.$set(this, "options2", options);
    },
    getOptions3() {
      this.map3["num1"] = 400;
      this.map3["num2"] = 500;
      this.map3["titleName"] = "标题2";
      let options = this.getCahrtSplitBarYOpts({
        main_color: "#FF2267",
        yAxis_max: 900,
        yAxis_data: [
          { name: "名称3", value: 900 },
          { name: "名称4", value: 900 },
        ],
        series_data: [
          { name: "名称3", value: 400 },
          { name: "名称4", value: 500 },
        ],
      });
      this.$set(this, "options3", options);
    },
  },
};
</script>
