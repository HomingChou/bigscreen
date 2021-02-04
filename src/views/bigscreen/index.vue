<template>
  <div class="main-content" v-cloak>
    <header class="header flex-center-center">
      <h3 class="header-title" @click="pageChange()">浙江省风险实况大屏视图</h3>
    </header>
    <!-- 首页 -->
    <keep-alive>
      <div class="wrapper" v-if="showPage == 'index'">
        <div class="content">
          <div class="col col-l">
            <!-- <%--左上角--%> -->
            <div class="xpanel-wrapper xpanel-wrapper-50">
              <risk-gauge ref="riskGauge" @page-change="pageChange">
              </risk-gauge>
            </div>
            <!-- <%--左下角--%> -->
            <div class="xpanel-wrapper xpanel-wrapper-50">
              <risk-operation ref="riskOperation"> </risk-operation>
            </div>
          </div>
          <div class="col col-c risk-map-body">
            <!-- <%--地图背景--%> -->
            <div class="risk-map-bg">
              <!-- <%--底盘--%> -->
              <div class="bottom-base-bg"><div class="bottom-base"></div></div>
              <!-- <%--流星线--%> -->
              <div class="map-star start1"></div>
              <div class="map-star start2"></div>
              <div class="map-star start3"></div>
              <div class="map-star start4"></div>
              <div class="map-star start5"></div>
              <div class="map-star start6"></div>
            </div>
            <div class="risk-map-box">
              <!-- <%--地图--%> -->
              <div class="xpanel-wrapper xpanel-wrapper-60">
                <div class="xpanel no-bg flex">
                  <!-- <%--地图左侧小模块--%> -->
                  <div class="map-risk-incident">
                    <div
                      class="map-top-chart flex-v-center-center xpanel xpanel-center-small"
                    >
                      <h3>累计发现风险事件</h3>
                      <p class="number-family-b">
                        {{ accumulativeRiskEventTotal }}
                      </p>
                    </div>
                    <div class="map-incident-info">
                      <ul>
                        <li class="flex-center" v-for="item in incidentList">
                          <span>{{ item.name }}：</span>
                          <span class="number">{{ item.value }}</span>
                          <span>{{ item.unit }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <!-- <%--地图--%> -->
                  <div class="risk-map-chart flex-grow-1">
                    <risk-map ref="riskMap"></risk-map>
                  </div>
                  <!-- <%--地图右侧部分--%> -->
                  <risk-unusual-channel></risk-unusual-channel>
                </div>
              </div>
              <!-- 地图下面 -->
              <div class="xpanel-wrapper xpanel-wrapper-40">
                <risk-data ref="riskDataTableCompnt" @page-change="pageChange">
                </risk-data>
              </div>
            </div>
          </div>
          <div class="col col-r">
            <!-- 右侧模块 -->
            <dig-index @page-change="digPageChange"></dig-index>
          </div>
        </div>
      </div>
    </keep-alive>
  </div>
</template>

<script>
import indexMixin from "./mixins/indexMixin";
import RiskGauge from "./components/first/RiskGauge";
import RiskOperation from "./components/first/RiskOperation";
import RiskMap from "./components/first/riskMap";
import RiskUnusualChannel from "./components/first/riskUnusualChannel";
import RiskData from "./components/first/RiskData";
import DigIndex from "./components/first/dig/DigIndex";

export default {
  components: {
    RiskGauge,
    RiskOperation,
    RiskMap,
    RiskUnusualChannel,
    RiskData,
    DigIndex,
  },
  name: "Bigscreen",
  mixins: [indexMixin],
  data() {
    return {
      //显示界面 index-首页,overview-风险总览,dig-风险挖掘,data-风险数据
      showPage: "index",
      isFullscreen: false, //是否全屏
      digPageUrl: "",
      accumulativeRiskEventTotal: 0,
      incidentList: [],
    };
  },
  mounted() {
    this.getAccumulativeRiskEventTotal();
    window.onresize = () => {
      // 全屏下监控是否按键了ESC
      if (!this.checkFull()) {
        // 全屏下按键esc后要执行的动作
        this.isFullscreen = false;
      }
    };
  },
  methods: {
    //切换页面
    pageChange(key) {
      //首页点击标题，全屏展示
      // if (!key && this.showPage == "index") {
      //   this.screenfull();
      // }
      // this.showPage = key || "index";
    },
    digPageChange(param) {
      this.digPageUrl =
        contextPath +
        "/risk/bigscreen/config/dig/digConfig.jsp?isShowPage=1&toSecondPageDigKey=" +
        param.activeDigKey;
      this.pageChange(param.key);
    },
    //全屏事件
    screenfull() {
      if (!screenfull.enabled) {
        console.log("Your browser does not support!");
      }
      screenfull.toggle();
      this.isFullscreen = true;
    },
    //是否全屏并按键ESC键的方法
    checkFull() {
      var isFull =
        document.fullscreenEnabled ||
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled;
      // to fix : false || undefined == undefined
      if (isFull === undefined) {
        isFull = false;
      }
      return isFull;
    },
    //获取累计发现风险事件
    getAccumulativeRiskEventTotal: function () {
      this.accumulativeRiskEventTotal = 487603;
      var map = this.list2Map(this.regionList_mixin, "code");
      var list = [
        { regionId: 570, riskNum: 90000 },
        { regionId: 571, riskNum: 80000 },
        { regionId: 572, riskNum: 70000 },
        { regionId: 573, riskNum: 60000 },
        { regionId: 574, riskNum: 50000 }
      ];
      this.incidentList = $.map(list, function (item) {
        return {
          name: map[item.regionId] ? map[item.regionId].name : "",
          value: item.riskNum,
          unit: "个",
        };
      });
    }
  }
};
</script>
