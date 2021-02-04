<template>
  <div class="xpanel xpanel-left-ag-no">
    <div class="title left">风险总览</div>
    <div class="xpanel-look-more" @click="pageChange('overview')"></div>
    <div class="xpanel-box">
      <ul class="risk-over-box flex flex-wrap">
        <li v-for="(item, index) in riskList" class="flex-v flex-ai-center">
          <div :id="'riskOverView_' + index" class="risk-chart flex-grow-1">
            <chart-view type="gauge" :options="item.options"> </chart-view>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import indexMixin from "../../mixins/indexMixin.js";
import ChartView from "@/components/charts/ChartView";

export default {
  name: "RiskGauge",
  mixins: [indexMixin],
  components: { ChartView },
  data() {
    return {
      riskList: [
        { title: "总览模块1", id: "risk_user", unitName: "个" },
        { title: "总览模块2", id: "risk_amount", unitName: "元" },
        { title: "总览模块3", id: "risk_channel", unitName: "个" },
        { title: "总览模块4", id: "risk_number", unitName: "个" },
        { title: "总览模块5", id: "risk_interface", unitName: "个" }
      ],
      riskMap: {}
    }
  },
  mounted() {
    this.doQuery();
  },
  methods: {
    initChart() {
      const defaultOption = {
        title: {
          text: "",
          left: "center",
          top: this.calcPagePixel(-5),
          textStyle: {
            color: "#99ccff",
            fontSize: this.calcPagePixel(16)
          }
        },
        series: [
          {
            name: "业务指标",
            type: "gauge",
            data: [{ value: 50 }],
            min: 0,
            max: 100,
            radius: "90%",
            //splitNumber: 10,
            //仪表盘详情，用于显示数据
            detail: {
              padding: [this.calcPagePixel(60), 0, 0, 0],
              formatter: ["{c|}", "{a|(十万个)}", "{b|{value}}"].join("\n"),
              rich: {
                a: {
                  color: "#99CCFF",
                  fontSize: this.calcPagePixel(14),
                  lineHeight: this.calcPagePixel(16),
                },
                b: {
                  fontFamily: "DigitalB",
                  fontSize: this.calcPagePixel(35),
                  lineHeight: this.calcPagePixel(40),
                  color: "#F6D016",
                }
              }
            },
            //轴线
            axisLine: {
              show: false,
              lineStyle: {
                //每段的结束位置和颜色可以通过一个数组来表示
                color: [
                  [0.3, "#55B2BA"],
                  [0.7, "#E8A010"],
                  [1, "#FF2267"],
                ],
                width: this.calcPagePixel(5), //宽度
                opacity: 0,
              },
            },
            //分隔线样式
            splitLine: {
              length: "20%",
              lineStyle: {
                color: "auto",
                width: this.calcPagePixel(4),
              },
            },
            //刻度样式
            axisTick: {
              splitNumber: 5,
              length: "10%", //支持相对半径的百分比
              lineStyle: {
                color: "auto",
                width: this.calcPagePixel(2)
              }
            },
            pointer: {
              width: this.calcPagePixel(8)
            },
            //刻度标签
            axisLabel: {
              color: "auto",
              distance: this.calcPagePixel(10),
              fontSize: this.calcPagePixel(12),
              formatter: function (value) {
                return value ? value.toFixed() : "";
              }
            }
          }
        ]
      };
      $.each(this.riskList, (index, item) => {
        //初始化
        let option = JSON.parse(JSON.stringify(defaultOption));
        option.title.text = item.title;
        const map = this.riskMap[item.id] ? this.riskMap[item.id] : null;
        if (map) {
          //如果实际值大于最大值
          if (map.riskNum > map.riskHigh) {
            map.riskHigh = map.riskNum;
          }
          let minMap = this.numberFormat(map.riskLow || 0);
          let unitCode = minMap.unitCode;
          let riskNum = this.numberFormat(map.riskNum || 0, unitCode).value;
          let riskHigh = this.numberFormat(map.riskHigh || 0, unitCode).value;
          //金额单独处理 转为元
          if (item.id == "risk_amount") {
            minMap = this.numberFormat((map.riskLow / 100).toFixed(2));
            unitCode = minMap.unitcode;
            riskNum = this.numberFormat(
              (map.riskNum / 100).toFixed(2),
              unitCode
            ).value;
            riskHigh = this.numberFormat(
              (map.riskHigh / 100).toFixed(2),
              unitCode
            ).value;
          }
          //实际值
          option.series[0].data[0].value = riskNum;
          //最大值
          option.series[0].max = riskHigh || 100;
          //format
          option.series[0].detail.formatter = [
            "{a|(" + minMap.unitName + item.unitName + ")}",
            "{b|" + riskNum + "}",
          ].join("\n");
          //仪表盘的轴线每段定义 百分比
          let colorMin = (map.riskLow / map.riskHigh).toFixed(2);
          let colorMid = (map.riskMiddling / map.riskHigh).toFixed(2);
          option.series[0].axisLine.lineStyle.color = [
            [colorMin, "#55B2BA"],
            [colorMid, "#E8A010"],
            [1, "#FF2267"]
          ];
        }
        this.$set(this.riskList[index], "options", option);
      });
    },
    //查询
    doQuery() {
      const results = [
        {
          targetType: "risk_user",
          title: "总览模块1",
          riskNum: 2500,
          riskHigh: 3000,
          riskMiddling: 2000,
          riskLow: 1000
        },
        {
          targetType: "risk_amount",
          title: "总览模块2",
          riskNum: 25000,
          riskHigh: 30000,
          riskMiddling: 20000,
          riskLow: 10000
        },
        {
          targetType: "risk_channel",
          title: "总览模块3",
          riskNum: 250000,
          riskHigh: 300000,
          riskMiddling: 200000,
          riskLow: 100000
        },
        {
          targetType: "risk_number",
          title: "总览模块4",
          riskNum: 250,
          riskHigh: 300,
          riskMiddling: 200,
          riskLow: 100
        },
        {
          targetType: "risk_interface",
          title: "总览模块5",
          riskNum: 2500000,
          riskHigh: 3000000,
          riskMiddling: 2000000,
          riskLow: 1000000
        },
      ];
      this.riskMap = this.list2Map(results, "targetType");
      this.initChart();
    },
    pageChange: function (key) {
      this.$emit("page-change", key);
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.risk-over-box {
  width: 100%;
  height: 100%;
}
.risk-over-box > li {
  width: 33%;
  height: 50%;
}
.risk-over-box > li .title {
  font-size: 0.5rem;
  white-space: nowrap;
  color: #99ccff;
}
.risk-chart {
  width: 100%;
}
</style>
