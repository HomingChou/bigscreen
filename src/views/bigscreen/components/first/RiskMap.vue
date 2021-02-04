<template>
  <div style="width: 100%; height: 100%; position: relative">
    <div id="rsMapChart" style="width: 100%; height: 110%"></div>
    <!--弹窗-->
    <div
      id="mapLayer"
      class="layer"
      ref="layer"
      :style="layerStyles"
      v-if="layerShow"
    >
      <div class="content flex-center-center">
        <div class="wh100">
          <h3 class="layer-title">{{ activeName }}</h3>
          <ul class="layer-list">
            <li class="flex-center">
              <span>风险等级：</span>
              <h3>{{ layerData.riskLevel }}</h3>
            </li>
            <li class="flex-center">
              <span>风险评估模块1：</span>
              <h3>{{ layerData.user.value || 0 }}</h3>
              <span>{{ layerData.user.unitName }}个</span>
            </li>
            <li class="flex-center">
              <span>风险评估模块2：</span>
              <h3>{{ layerData.amount.value || 0 }}</h3>
              <span>{{ layerData.amount.unitName }}元</span>
            </li>
            <li class="flex-center">
              <span>风险评估模块3：</span>
              <h3>{{ layerData.channel.value || 0 }}</h3>
              <span>{{ layerData.channel.unitName }}个</span>
            </li>
            <li class="flex-center">
              <span>风险评估模块4：</span>
              <h3>{{ layerData.number.value || 0 }}</h3>
              <span>{{ layerData.number.unitName }}个</span>
            </li>
            <li class="flex-center">
              <span>风险评估模块5：</span>
              <h3>{{ layerData.interface.value || 0 }}</h3>
              <span>{{ layerData.interface.unitName }}个</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import indexMixin from "../../mixins/indexMixin.js";
import * as echarts from "echarts";
import echartsGL from "echarts-gl";

export default {
  name: "riskMap",
  mixins: [indexMixin],
  data() {
    return {
      myChart: null,
      options: {},
      layerShow: false,
      layerStyles: {},
      layerData: {},
      regionDataMap: {}, //地市数据
      regionList: [
        { name: "杭州市", code: 571, styles: { left: "40%", top: "25%" } },
        { name: "宁波市", code: 574, styles: { right: "40%", top: "30%" } },
        { name: "绍兴市", code: 575, styles: { left: "58%", top: "30%" } },
        { name: "温州市", code: 577, styles: { left: "56%", bottom: "25%" } },
        { name: "嘉兴市", code: 573, styles: { right: "40%", top: "20%" } },
        { name: "湖州市", code: 572, styles: { left: "20%", top: "20%" } },
        { name: "金华市", code: 579, styles: { left: "50%", top: "50%" } },
        { name: "衢州市", code: 570, styles: { left: "25%", bottom: "40%" } },
        { name: "台州市", code: 576, styles: { right: "48%", bottom: "38%" } },
        { name: "丽水市", code: 578, styles: { left: "30%", bottom: "40%" } },
        { name: "舟山市", code: 580, styles: { right: "10%", top: "28%" } }
      ],
      timer: null, //定时器
      activeIndex: 0,
      riskLevelMap: {
        1: {
          color: "#0075E6",
          name: "高风险"
        },
        2: {
          color: "#2290FA",
          name: "中风险"
        },
        3: {
          color: "#7ABEFF",
          name: "低风险"
        }
      }
    }
  },
  mounted() {
    this.initChart();
  },
  computed: {
    activeName() {
      return this.regionList[this.activeIndex].name
    },
  },
  //组件注销
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    //查询
    doQuery (cb) {
      let data = {
        resultSum_570: {
          risk_amount: 100000,
          risk_channel: 200,
          risk_interface: 300,
          risk_number: 400,
          risk_user: 23500,
          risk_level: 1,
        },
        resultSum_571: {
          risk_amount: 2010000,
          risk_channel: 200,
          risk_interface: 300,
          risk_number: 400,
          risk_user: 5000,
          risk_level: 2,
        },
        resultSum_572: {
          risk_amount: 3020000,
          risk_channel: 200,
          risk_interface: 300,
          risk_number: 400,
          risk_user: 1500,
          risk_level: 3,
        },
        resultSum_573: {
          risk_amount: 4030000,
          risk_channel: 200,
          risk_interface: 300,
          risk_number: 400,
          risk_user: 500,
          risk_level: 2,
        },
        resultSum_574: {
          risk_amount: 5049088,
          risk_channel: 200,
          risk_interface: 300,
          risk_number: 400,
          risk_user: 3500,
          risk_level: 1,
        },
        resultSum_575: {
          risk_amount: 1050000,
          risk_channel: 200,
          risk_interface: 300,
          risk_number: 400,
          risk_user: 4500,
          risk_level: 3,
        },
        resultSum_576: {
          risk_amount: 10623344,
          risk_channel: 200,
          risk_interface: 300,
          risk_number: 400,
          risk_user: 5500,
          risk_level: 2,
        },
        resultSum_577: {
          risk_amount: 107223456,
          risk_channel: 200,
          risk_interface: 300,
          risk_number: 400,
          risk_user: 500,
          risk_level: 1,
        },
        resultSum_578: {
          risk_amount: 1081111,
          risk_channel: 200,
          risk_interface: 300,
          risk_number: 400,
          risk_user: 500,
          risk_level: 2,
        }
      };
      let map = {};
      for (let k in data) {
        let value = data[k] || {};
        let risk_amount =
          value && value["risk_amount"] ? value["risk_amount"] : 0;
        let risk_channel =
          value && value["risk_channel"] ? value["risk_channel"] : 0;
        let risk_interface =
          value && value["risk_interface"] ? value["risk_interface"] : 0;
        let risk_number =
          value && value["risk_number"] ? value["risk_number"] : 0;
        let risk_user = value && value["risk_user"] ? value["risk_user"] : 0;
        let risk_level = value && value["risk_level"] ? value["risk_level"] : 3;
        map[k] = {
          amount: this.numberFormat((risk_amount / 100).toFixed(2)),
          channel: this.numberFormat(risk_channel),
          interface: this.numberFormat(risk_interface),
          number: this.numberFormat(risk_number),
          user: this.numberFormat(risk_user),
          riskLevel: risk_level,
        };
      }
      this.regionDataMap = map;
      typeof cb == "function" && cb();
    },
    initChart: function () {
      const mapJsonPath = "./static/echarts/util/map/json/province/zhejiang.json";
      const areaName = "浙江";
      const options = {
        series: [
          {
            type: "map3D",
            name: areaName,
            map: "浙江",
            selectedMode: "sigle", //单选
            boxWidth: 100,
            boxHeight: 20,
            boxDepth: 150, //地图倾斜度
            regionHeight: 3,
            viewControl: {
              //用于鼠标的旋转，缩放等视角控制
              projection: "orthographic", //投影方式，默认为透视投影'perspective'，也支持设置为正交投影'orthographic'。
              //distance: 100,
              orthographicSize: 100, //默认视角距离主体的距离
              panMouseButton: "left", //平移操作使用的鼠标按键
              rotateMouseButton: "right", //旋转操作使用的鼠标按键
              //alpha: 50, // 让canvas在x轴有一定的倾斜角度
              otateSensitivity: 0, //禁止旋转
              zoomSensitivity: 0, //禁止缩放
            },
            label: {
              show: true, //是否显示市
              distance: 0,
              textStyle: {
                color: "#F6D016", //文字颜色
                backgroundColor: "rgba(0,0,0,0)",
                fontSize: this.calcPagePixel(18), //文字大小
              },
            },
            itemStyle: {
              color: "#0075e6", //地图颜色
              borderWidth: 0.5, //分界线wdith
              borderColor: "#333", //分界线颜色
            },
            emphasis: {
              itemStyle: {
                color: "#58adff", //地图高亮颜色
              },
            },
            shading: "realistic",
            postEffect: {
              //为画面添加高光，景深，环境光遮蔽（SSAO），调色等效果
              enable: true, //是否开启
              SSAO: {
                //环境光遮蔽
                radius: 10, //环境光遮蔽的采样半径。半径越大效果越自然
                intensity: 10, //环境光遮蔽的强度
                enable: true,
              },
            },
            light: {
              main: {
                intensity: 1,
                shadow: true,
                shadowQuality: "high",
                alpha: 60,
                beta: 100,
              },
              ambient: {
                intensity: 0,
              },
            },
            temporalSuperSampling: {
              //分帧超采样。在开启 postEffect 后，WebGL 默认的 MSAA 会无法使用,分帧超采样用来解决锯齿的问题
              enable: true,
            },
          },
        ],
      };
      $.get(
        mapJsonPath,
        (mapJson) => {
          //自定义地图名称显示位置
          mapJson.features[0].properties.cp = [119.553576, 29.787459]; //杭州[120.153576,30.287459]
          mapJson.features[1].properties.cp = [121.449792, 29.568388]; //宁波市[121.549792, 29.868388]
          mapJson.features[2].properties.cp = [120.672111, 27.800575]; //温州市[120.672111, 28.000575]
          mapJson.features[3].properties.cp = [120.750865, 30.462653]; //嘉兴市[120.750865, 30.762653]
          mapJson.features[4].properties.cp = [120.002398, 30.567198]; //湖州市[120.102398, 30.867198]
          mapJson.features[5].properties.cp = [120.582112, 29.597117]; // 绍兴市[120.582112, 29.997117]
          mapJson.features[6].properties.cp = [120.049506, 28.989524]; //金华市[119.649506, 29.089524]
          mapJson.features[7].properties.cp = [118.87263, 28.741708]; //衢州市[118.87263, 28.941708]
          mapJson.features[9].properties.cp = [121.128599, 28.661378]; //台州市[121.428599, 28.661378]
          mapJson.features[10].properties.cp = [119.621786, 28.001993]; //丽水市[119.921786, 28.451993]
          //注册
          this.myChart = echarts.init(document.getElementById("rsMapChart"));
          echarts.registerMap(areaName, mapJson);

          this.myChart.setOption(options);
          this.options = options;

          //查询数据
          this.doQuery( () => {
            //启动定时器
            this.activeIndex = 0;
            this.mapHandle(0);
            this.timer = setInterval(this.mapInterval, 5000);
          });
          //适配
          $(window).resize(() => {
            this.myChart && this.myChart.resize();
          });
          //点击事件
          this.myChart.off("click");
          this.myChart.on("click", (e) => {
            //console.log(e);
            this.$emit("map-click", e);
            let name = e.name || "";
            if (name && name != this.regionList[this.activeIndex].name) {
              let index = 0;
              $.each(this.regionList, (k, v) => {
                if (v.name == name) {
                  index = k;
                  return;
                }
              });
              this.mapHandle(index);
              clearInterval(this.timer);
              this.timer = setInterval(this.mapInterval, 5000);
            }
          });
        },
        "json"
      );
    },
    //点击显示地图
    mapHandle: function (index) {
      let map = this.regionList[index] || {};
      let styles = map.styles;
      let name = map.name;
      let code = this.regionList[index].code;
      let dataMap = this.regionDataMap["resultSum_" + code] || {};
      let riskLevel = dataMap.riskLevel || "1";
      let data = $.map(this.regionList, (item) => {
        let regionMap = this.regionDataMap["resultSum_" + item.code] || {};
        let color = this.riskLevelMap[regionMap.riskLevel || "3"].color;
        let result = {
          name: item.name,
          height: item.name == name ? 8 : 3,
          itemStyle: {
            color: color,
          },
        };

        return result;
      });
      this.activeIndex = index;
      this.options.series[0].data = data;
      this.myChart.setOption(this.options);
      //获取地市数据
      let layerData = {
        amount: dataMap.amount || {},
        channel: dataMap.channel || {},
        interface: dataMap.interface || {},
        number: dataMap.number || {},
        user: dataMap.user || {},
        riskLevel: this.riskLevelMap[riskLevel].name,
      };
      this.$set(this, "layerData", layerData);
      this.$set(this, "layerStyles", styles);
      this.layerShow = true;
    },
    //定时器
    mapInterval: function () {
      let index = this.activeIndex;
      if (index == this.regionList.length - 1) {
        index = 0;
      } else {
        index++;
      }
      this.mapHandle(index);
    }
  }
};
</script>
