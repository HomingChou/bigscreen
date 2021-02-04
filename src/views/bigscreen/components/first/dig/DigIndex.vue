<template>
  <div class="wh100">
    <!-- <%--风险挖掘--%> -->
    <div class="xpanel-wrapper xpanel-wrapper-50">
      <div class="xpanel xpanel-right-ag">
        <div class="title right">风险挖掘</div>
        <div class="xpanel-box">
          <div
            class="flex-center-center"
            style="width: 100%; height: 100%; padding: 0 1%; overflow: hidden"
          >
            <template v-for="(dig, digIdx) in carourseDigs">
              <transition name="el-zoom-in-center">
                <ul
                  class="honeycomb-container"
                  v-show="digIdx == carouseDigIndex"
                >
                  <li
                    v-for="(item, index) in list"
                    class="hex-box"
                    :class="getDigClass(index)"
                    @click="handleItem(index)"
                  >
                    <div class="hex">
                      <a
                        href="javascript:void(0);"
                        class="flex-center-center"
                        >{{ getDigName(index) }}</a
                      >
                      <div class="corner-1"></div>
                      <div class="corner-2"></div>
                    </div>
                    <div class="light top"></div>
                    <div class="light bottom"></div>
                    <div class="arrow"></div>
                  </li>
                </ul>
              </transition>
            </template>
            <div class="dig-triggle left" @click="triggleDig('left')"></div>
            <div class="dig-triggle right" @click="triggleDig('right')"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- <%--风险挖掘 子模块--%> -->
    <div class="xpanel-wrapper xpanel-wrapper-50">
      <div class="xpanel xpanel-left-ag-no">
        <div class="title left">{{ digMapActive.titleName }}</div>
        <div class="xpanel-look-more" @click="pageChange('dig')"></div>
        <div class="xpanel-box">
          <!-- <%--<transition name="el-zoom-in-top"></transition>--%> -->
          <template v-if="digMapActive.graphType === 101">
            <dig-template-a
              :config-map="digMapActive"
              :config-list="topicConfList"
            ></dig-template-a>
          </template>
          <template v-else-if="digMapActive.graphType === 102">
            <dig-template-b
              :config-map="digMapActive"
              :config-list="topicConfList"
            ></dig-template-b>
          </template>
         <template v-else-if="digMapActive.graphType === 103">
            <dig-template-c
              :config-map="digMapActive"
              :config-list="topicConfList"
            ></dig-template-c>
          </template>
           <template v-else-if="digMapActive.graphType === 7">
            <dig-template-D
              :config-map="digMapActive"
              :config-list="topicConfList"
            ></dig-template-D>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import indexMixin from "@/views/bigscreen/mixins/indexMixin.js";
import digMixin from "./mixins/digMixin.js";
import DigTemplateA from "@/views/bigscreen/components/first/dig/template/DigTemplateA";
import DigTemplateB from "@/views/bigscreen/components/first/dig/template/DigTemplateB";
import DigTemplateC from "@/views/bigscreen/components/first/dig/template/DigTemplateC";
import DigTemplateD from "@/views/bigscreen/components/first/dig/template/DigTemplateD";

export default {
  name: "DigIndex",
  mixins: [indexMixin, digMixin],
  components: {
   DigTemplateA,
   DigTemplateB,
   DigTemplateC,
   DigTemplateD
  },
  data() {
    return {
      digMapActive: {
        topicId: "",
        titleName: "",
      },
      timer: null, //定时器
      intervalTime: 5000,
      list: new Array(14),
      activeIndex: "",
      riskDigMap: {},
      //六边形轮播
      carouselItemIndex: 0,
      carouselItems: [],
      //风险挖掘轮播
      carouseDigIndex: 0,
      carourseDigs: [],
      topicConfList: []
    };
  },
  mounted() {
    this.init();
  },
  //组件注销
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    //初始化
    init() {
      //获取专题列表
      let topicList = [
        {topicId: '1001', titleName: '风险挖掘1'},
        {topicId: '1002', titleName: '风险挖掘2'},
        {topicId: '1003', titleName: '风险挖掘3'},
        {topicId: '1004', titleName: '风险挖掘4'},
        {topicId: '1005', titleName: '风险挖掘5'},
        {topicId: '1006', titleName: '风险挖掘6'},
        {topicId: '1007', titleName: '风险挖掘7'},
        {topicId: '1008', titleName: '风险挖掘8'},
        {topicId: '1009', titleName: '风险挖掘9'}
      ];
      //初始化
      let carouselItemsTmp = [9, 1, 11, 3, 13];
      this.carourseDigs = this.formatTopicHoneycomb(
        topicList,
        carouselItemsTmp
      );

      let carouseDigIndex = 0;
      let carouselItemIndex = 0;
      this.carouseDigIndex = carouseDigIndex;
      this.$set(
        this,
        "riskDigMap",
        this.carourseDigs[this.carouseDigIndex].carouseMap
      );
      this.$set(
        this,
        "carouselItems",
        this.carourseDigs[this.carouseDigIndex].carouselItems
      );
      this.carouselItemIndex = carouselItemIndex;
      this.activeIndex = this.carouselItems[this.carouselItemIndex];
      this.emitDigChange();
      this.timer = setInterval(this.nextItem, this.intervalTime);
    },
    nextItem() {
      let index = this.carouselItemIndex;
      if (index == this.carouselItems.length - 1) {
        let digIndex = this.carouseDigIndex;
        if (digIndex == this.carourseDigs.length - 1) {
          digIndex = 0;
        } else {
          digIndex++;
        }
        this.$set(this, "riskDigMap", this.carourseDigs[digIndex].carouseMap);
        this.carouseDigIndex = digIndex;
        this.$set(
          this,
          "carouselItems",
          this.carourseDigs[digIndex].carouselItems
        );
        index = 0;
      } else {
        index++;
      }
      this.activeIndex = this.carouselItems[index];
      this.carouselItemIndex = index;
      this.emitDigChange();
    },
    //获取蜂窝名称
    getDigName(index) {
      let map = this.riskDigMap ? this.riskDigMap["dig" + index] : null;
      if (map && map.id) {
        return map.name;
      }
    },
    //获取蜂窝样式
    getDigClass(index) {
      let obj = {};
      let map = this.riskDigMap ? this.riskDigMap["dig" + index] : null;
      if (index == 5) {
        obj["hex-gap"] = true;
      }
      if (this.activeIndex == index && this.carouselItems.indexOf(index) > -1) {
        obj.active = true;
      }
      if (map) {
        obj["isDig"] = true;
        if (map["style"]) {
          obj[map["style"]] = true;
        }
        if (map["arrow"]) {
          obj[map["arrow"]] = true;
        }
      }
      return obj;
    },
    //点击挖掘点
    handleItem(index) {
      let idx = 0;
      let flag = false;
      $.each(this.carouselItems, (k, v) => {
        if (index == v) {
          idx = k;
          flag = true;
          return false;
        }
      });
      if (!flag) return;
      this.activeIndex = index;
      this.carouselItemIndex = idx;
      this.emitDigChange();
      clearInterval(this.timer);
      this.timer = setInterval(this.nextItem, this.intervalTime);
    },
    triggleDig(type) {
      let digIndex = this.carouseDigIndex;
      if (type == "left") {
        if (digIndex == 0) {
          digIndex = this.carourseDigs.length - 1;
        } else {
          digIndex--;
        }
      } else if (type == "right") {
        if (digIndex == this.carourseDigs.length - 1) {
          digIndex = 0;
        } else {
          digIndex++;
        }
      }
      this.carouseDigIndex = digIndex;
      this.$set(
        this,
        "riskDigMap",
        this.carourseDigs[this.carouseDigIndex].carouseMap
      );
      this.$set(
        this,
        "carouselItems",
        this.carourseDigs[this.carouseDigIndex].carouselItems
      );
      this.carouselItemIndex = 0;
      this.activeIndex = this.carouselItems[this.carouselItemIndex];
      this.emitDigChange();
      clearInterval(this.timer);
      this.timer = setInterval(this.nextItem, this.intervalTime);
    },
    emitDigChange() {
      let digData = this.carourseDigs[this.carouseDigIndex]["carouseMap"][
        "dig" + this.activeIndex
      ];
      if (!digData) return;
      let id = digData.id;
      let name = digData.name;
      this.$set(this, "digMapActive", {
        topicId: id,
        titleName: name,
      });
      //获取专题配置
      let map = {
        1001: 101,
        1002: 102,
        1003: 103,
        1004: 7,
        1005: 101,
        1006: 102,
        1007: 103,
        1008: 7,
        1009: 101
      }
      this.$set(this.digMapActive, "graphType", map[id]);
    },
    pageChange() {
      this.$emit("page-change", {
        key: "dig",
        activeDigKey: this.digMapActive.topicId
      });
    }
  }
};
</script>