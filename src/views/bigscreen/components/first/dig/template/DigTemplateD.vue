<template>
  <div class="wh100">
    <chart-view type="graph" :options="options1"> </chart-view>
  </div>
</template>

<script>
import indexMixin from "@/views/bigscreen/mixins/indexMixin.js";
import digMixin from "./../mixins/digMixin.js";
import ChartView from "@/components/charts/ChartView";

export default {
  name: "DigTemplateD",
  mixins: [indexMixin, digMixin],
  components: { ChartView },
  props: {
    configMap: Object,
    configList: Array,
  },
  data() {
    return {
      map1: {},
      options1: {}
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getOptions1();
    },
    getOptions1() {
      this.map1["titleName"] = "标题1";
      let data = {
        nodes: [
          {
            name: "操作系统集团",
            category: 0,
          },
          {
            name: "浏览器有限公司",
            category: 0,
          },
          {
            name: "HTML科技",
            category: 0,
          },
          {
            name: "JavaScript科技",
            category: 0,
          },
          {
            name: "CSS科技",
            category: 0,
          },
          {
            name: "Chrome",
            category: 1,
          },
          {
            name: "IE",
            category: 1,
          },
          {
            name: "Firefox",
            category: 1,
          },
          {
            name: "Safari",
            category: 1,
          },
        ],

        links: [
          {
            source: "浏览器有限公司",
            target: "操作系统集团",
            name: "参股",
          },
          {
            source: "HTML科技",
            target: "浏览器有限公司",
            name: "参股",
          },
          {
            source: "CSS科技",
            target: "浏览器有限公司",
            name: "参股",
          },
          {
            source: "JavaScript科技",
            target: "浏览器有限公司",
            name: "参股",
          },
          {
            source: "Chrome",
            target: "浏览器有限公司",
            name: "董事",
          },
          {
            source: "IE",
            target: "浏览器有限公司",
            name: "董事",
          },
          {
            source: "Firefox",
            target: "浏览器有限公司",
            name: "董事",
          },
          {
            source: "Safari",
            target: "浏览器有限公司",
            name: "董事",
          },
          {
            source: "Chrome",
            target: "JavaScript科技",
            name: "法人",
          },
        ],
      };

      const color1 = "#006acc";
      const color2 = "#ff7d18";
      const color3 = "#10a050";

      data.nodes.forEach((node) => {
        if (node.category === 0) {
          node.symbolSize = 18;
          node.itemStyle = {
            color: color1,
          };
        } else if (node.category === 1) {
          node.symbolSize = 18;
          node.itemStyle = {
            color: color2,
          };
        }
      });

      let categories = [
        {
          name: "公司",
        },
        {
          name: "董事",
        },
      ];
      let options = this.getCahrtGraphOpts({
        series_data: data.nodes,
        series_links: data.links,
        categories: categories,
      });
      this.$set(this, "options1", options);
    },
  },
};
</script>
