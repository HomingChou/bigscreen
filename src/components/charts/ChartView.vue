<template>
  <div class="audit-chart-view" :id="elId" :style="styleObject"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'ChartView',
   //父组件参数
    props:{
        type: String, // 视图类型 bar:柱状图 line:折线图 pie：饼图 其他待更新
        options: Object, //默认配置 同echarts官网配置
        width: String, //宽度
        height: String, //高度
    },
  data () {
    return {
      elId: '',//元素id，以创建时间为准，保证唯一性
      myChart: '', //视图实例
      //默认配置，最终配置会结合外部传入和默认配置，重复项已外部为准
      defaultOptions: {}
    }
  },
  created () {
    this.elId = 'chartView' + new Date().getTime() + Math.random();
  },
  //组件注销
  beforeDestroy () {
      //释放资源
      if (this.myChart) {
          this.myChart.dispose();
          this.myChart = null;
      }
  },
  //计算属性
  computed: {
    //样式
    styleObject: function () {
        return {
            width: this.width || '100%',
            height: this.height || '100%',
        }
    }
  },
  //监听
  watch: {
      options: {
          handler: function(){
              this.initChart()
          },
          deep: true
      },
  },
  //方法集合
  methods: {
      //初始化视图
      initChart: function () {
          var myOption = {};
          //传入配置
          if(this.options){
              myOption = $.extend(myOption, this.options)
          }
          if (this.myChart) {
              this.myChart.dispose();
              this.myChart = null;
          }
          //渲染视图
          this.$nextTick( () => {
              //初始化
              this.myChart = echarts.init(document.getElementById(this.elId));
              this.myChart.setOption(myOption);
              //监听浏览器宽度的改变
              $(window).resize( () => {
                    this.myChart && this.myChart.resize();
                });
              //点击事件,根据点击
              this.myChart.off('click');
              this.myChart.on('click', (params) => {
                  this.$emit('map-click', params);
              });
          })
      }
  }
}
</script>
