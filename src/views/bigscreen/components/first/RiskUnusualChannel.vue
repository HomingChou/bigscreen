<template>
  <div class="map-unusual-channel">
    <div class="map-top-chart flex-v-center-center xpanel xpanel-center-small">
      <h3>高危地区数量</h3>
      <p class="number-family-b">{{ total }}</p>
    </div>
    <div class="unusual-channel-classify-box">
      <div class="unusual-channel-classify-bg">
        <div class="chart-div">
          <div class="chart-loader"><div class="loader"></div></div>
        </div>
      </div>
      <div class="unusual-channel-classify-chart">
        <chart-view type="pie" :options="options"> </chart-view>
      </div>
    </div>
    <h3 class="unusual-channel-classify-title">高危地区分类</h3>
  </div>
</template>

<script>
import indexMixin from "../../mixins/indexMixin.js";
import ChartView from "@/components/charts/ChartView";

export default {
  name: "riskUnusualChannel",
  mixins: [indexMixin],
  components: {
    "chart-view": ChartView,
  },
  data() {
    return {
      options: {},
      total: 0,
    };
  },
  mounted() {
    this.doQuery();
  },
  methods: {
    doQuery() {
      //异常渠道分类和有高危渠道数量：getRiskChannelSort
      this.initChart([
        { titleName: "分类1", riskNum: 400 },
        { titleName: "分类2", riskNum: 300 },
        { titleName: "分类3", riskNum: 200 },
        { titleName: "其他", riskNum: 100 }
      ])
    },
    initChart(results) {
      let data = [];
      let total = 0;
      $.each(results, (index, item) => {
        var value = item.riskNum || 0;
        data.push({
          name: item.titleName,
          value: value,
        });
        total += value;
      });
      this.total = total;
      this.options = {
        color: ["#057DF0", "#2290FA", "#47A5FF", "#7ABEFF"],
        series: [
          {
            name: "异常渠道分类",
            type: "pie",
            radius: ["30%", "40%"],
            //center: ['75%', '50%'],
            clockwise: false,
            startAngle: 270,
            avoidLabelOverlap: true,
            hoverOffset: this.calcPagePixel(16),
            minAngle: 30,
            label: {
              normal: {
                show: true,
                formatter: ["{a|{b}}", "{b|{d}%}"].join("\n"),
                rich: {
                  a: {
                    color: "#99CCFF",
                    fontSize: this.calcPagePixel(14),
                    lineHeight: this.calcPagePixel(20)
                  },
                  b: {
                    color: "#F6D016",
                    fontSize: this.calcPagePixel(24),
                    lineHeight: this.calcPagePixel(30)
                  },
                },
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: this.calcPagePixel(18),
                  fontWeight: "bold",
                },
              },
            },
            labelLine: {
              normal: {
                show: true,
                length: 4,
                //length2:  this.calcPagePixel(2)
              },
            },
            data: data,
          },
        ],
      };
    }
  }
};
</script>
