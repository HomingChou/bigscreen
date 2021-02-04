<template>
  <div class="xpanel xpanel-right-ag">
    <div class="title right">风险运营</div>
    <div class="xpanel-box flex-center">
      <ul class="operation-ul risk-over-box flex flex-wrap">
        <li v-for="(item, index) in riskList">
          <div class="risk-chart flex-v flex-ai-center">
            <div class="xpanel operation-bg operation-box">
              <span :id="'risk_data_' + index" class="operation-span">{{
                item.data
              }}</span>
            </div>
            <div class="operation-title">
              <span :id="'risk_title_' + index" class="title"
                >{{ item.title }} ({{ item.unitName }})</span
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import indexMixin from "../../mixins/indexMixin.js";

export default {
  name: "RiskOperation",
  mixins: [indexMixin],
  data() {
    return {
      riskList: [
        { title: "运营模块1", id: "workloadSum", data: "0", unitName: "个" },
        { title: "运营模块2", id: "checkSum", data: "0", unitName: "个" },
        { title: "运营模块3", id: "unCheckSum", data: "0", unitName: "个" },
        {
          title: "运营模块4",
          id: "checkRiskAmount",
          data: "0",
          unitName: "元"
        },
        {
          title: "运营模块5",
          id: "checkRiskUser",
          data: "0",
          unitName: "个"
        },
        { title: "运营模块6", id: "redeemAmount", data: "0", unitName: "元" }
      ],
      riskMap: {},
    };
  },
  mounted() {
    this.doQuery();
  },
  methods: {
    initChart() {
      $.each(this.riskList, (index, item) => {
        //初始化
        let dataId = "risk_data_" + index;
        let titleId = "risk_title_" + index;
        let dataChart = document.getElementById(dataId);
        let titleChart = document.getElementById(titleId);

        let map =
          this.riskMap && this.riskMap[item.id] ? this.riskMap[item.id] : null;
        if (map) {
          let mydata = this.numberFormat(map || 0);

          if (item.id == "checkRiskAmount" || item.id == "redeemAmount") {
            mydata = this.numberFormat(map / 100 || 0);
          }
          dataChart.innerText = mydata.value;
          titleChart.innerText =
            item.title + "(" + mydata.unitName + item.unitName + ")";
        }
      });
    },
    //查询
    doQuery() {
      this.riskMap = {
        workloadSum: 10000000,
        checkSum: 200,
        unCheckSum: 300,
        checkRiskAmount: 4000000,
        checkRiskUser: 500,
        redeemAmount: 6000000000
      };
      this.initChart();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*风险运营*/
.operation-title {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.operation-box {
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.operation-box:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}
.operation-ul {
  width: 100%;
  height: 100%;
  /*padding: 7.77% 7.46% 7.77% 7.46%;*/
}
.operation-ul > li {
  width: 33%;
}
.operation-span {
  font-family: "DigitalB";
  font-size: 1.25rem;
  color: #f6d016;
}
.operation-title > .title {
  font-size: 0.6rem;
  color: #99ccff;
}
</style>
