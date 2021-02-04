<template>
  <div class="xpanel xpanel-center-first">
    <div class="title left" style="height: 17.6%">风险数据</div>
    <div class="xpanel-look-more-text" @click="pageChange('data')">
      查看更多
    </div>
    <div class="xpanel-box-table">
      <div class="tablebox">
        <div class="tbl-header">
          <table border="0" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th>时间</th>
                <th>风险类型</th>
                <th>风险等级</th>
                <th>风险描述</th>
              </tr>
            </thead>
            <tbody style="opacity: 0"></tbody>
          </table>
        </div>

        <div class="tbl-body">
          <table id="mytable" border="0" cellspacing="0" cellpadding="0">
            <thead>
              <tr style="height: 20%">
                <th>时间</th>
                <th>风险类型</th>
                <th>风险等级</th>
                <th>风险描述</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import indexMixin from "../../mixins/indexMixin.js";

export default {
  name: "RiskData",
  mixins: [indexMixin],
  data() {
    return {
      MyMarhq: null,
      riskList: [
        {
          operTime: "2019-07-11 02:00：00",
          riskType: "ESB异常调用",
          riskRank: "高",
          content: "xxx工号连续查询200次",
        },
        {
          operTime: "2019-07-11 02:00：00",
          riskType: "ESB异常调用",
          riskRank: "高",
          content: "xxx工号连续查询201次",
        },
        {
          operTime: "2019-07-11 02:00：00",
          riskType: "ESB异常调用",
          riskRank: "高",
          content: "xxx工号连续查询202次",
        },
        {
          operTime: "2019-07-11 02:00：00",
          riskType: "ESB异常调用",
          riskRank: "高",
          content: "xxx工号连续查询202次",
        },
        {
          operTime: "2019-07-11 02:00：00",
          riskType: "ESB异常调用",
          riskRank: "高",
          content: "xxx工号连续查询203次",
        },
        {
          operTime: "2019-07-11 02:00：00",
          riskType: "ESB异常调用",
          riskRank: "高",
          content: "xxx工号连续查询204次",
        },
        {
          operTime: "2019-07-11 02:00：00",
          riskType: "ESB异常调用",
          riskRank: "高",
          content: "xxx工号连续查询205次",
        },
        {
          operTime: "2019-07-11 02:00：00",
          riskType: "ESB异常调用",
          riskRank: "高",
          content: "xxx工号连续查询206次",
        },
        {
          operTime: "2019-07-11 02:00：00",
          riskType: "ESB异常调用",
          riskRank: "高",
          content: "xxx工号连续查询207次",
        },
        {
          operTime: "2019-07-11 02:00：00",
          riskType: "ESB异常调用",
          riskRank: "高",
          content: "xxx工号连续查询208次",
        },
        {
          operTime: "2019-07-11 02:00：00",
          riskType: "ESB异常调用",
          riskRank: "高",
          content: "xxx工号连续查询209次",
        },
        {
          operTime: "2019-07-11 02:00：00",
          riskType: "ESB异常调用",
          riskRank: "高",
          content: "xxx工号连续查询210次",
        },
        {
          operTime: "2019-07-11 02:00：00",
          riskType: "ESB异常调用",
          riskRank: "高",
          content: "xxx工号连续查询211次",
        },
        {
          operTime: "2019-07-11 02:00：00",
          riskType: "ESB异常调用",
          riskRank: "高",
          content: "xxx工号连续查询212次",
        },
      ],
    };
  },
  mounted: function () {
    this.doQuery(true);
  },
  //组件注销
  beforeDestroy: function () {
    clearInterval(this.MyMarhq);
  },
  methods: {
    initChart: function () {
      var that = this;

      that.MyMarhq = null;
      clearInterval(that.MyMarhq);
      $(".tbl-body tbody").empty();
      $(".tbl-header tbody").empty();
      var str = "";
      $.each(that.riskList, function (i, item) {
        str =
          "<tr>" +
          "<td>" +
          item.operTime +
          "</td>" +
          "<td>" +
          item.riskType +
          "</td>" +
          "<td>" +
          item.riskRank +
          "</td>" +
          "<td>" +
          item.content +
          "</td>" +
          "</tr>";

        $(".tbl-body tbody").append(str);
        $(".tbl-header tbody").append(str);
      });

      if (that.riskList.length > 4) {
        $(".tbl-body tbody").html(
          $(".tbl-body tbody").html() + $(".tbl-body tbody").html()
        );
        $(".tbl-body").css("top", "0");
        var tblTop = 0;
        var speedhq = 80; // 数值越大越慢
        var outerHeight = $(".tbl-body tbody").find("tr").outerHeight();

        function Marqueehq() {
          if (tblTop <= -outerHeight * (that.riskList.length - 4)) {
            tblTop = 0;
            that.doQuery(false);
          } else {
            tblTop -= 1;
          }
          $(".tbl-body").css("top", tblTop + "px");
        }

        that.MyMarhq = setInterval(Marqueehq, speedhq);

        // 鼠标移上去取消事件
        $(".tbl-body tbody").hover(
          function () {
            clearInterval(that.MyMarhq);
          },
          function () {
            clearInterval(that.MyMarhq);
            that.MyMarhq = setInterval(Marqueehq, speedhq);

            $(this).parent().parent().find("tr").removeClass("selected"); //去除所有项的高亮形式
          }
        );
        $(document).ready(function () {
          $(".tbl-body tbody tr").click(function () {
            $(this).attr("title", $(this).context.cells[3].innerText);
            $(this)
              .addClass("selected") //为选中项添加高亮
              .siblings()
              .removeClass("selected") //去除其他项的高亮形式
              .end();
          });
        });
      }
    },

    //查询
    doQuery: function (flas) {
      var that = this;
      var results = [
        {
          operTime: "20210201",
          riskType: "类型1",
          riskRank: "高风险",
          content: "描述1",
        },
        {
          operTime: "20210202",
          riskType: "类型2",
          riskRank: "高风险",
          content: "描述2",
        },
        {
          operTime: "20210203",
          riskType: "类型3",
          riskRank: "高风险",
          content: "描述3",
        },
        {
          operTime: "20210204",
          riskType: "类型4",
          riskRank: "高风险",
          content: "描述4",
        },
        {
          operTime: "20210205",
          riskType: "类型5",
          riskRank: "高风险",
          content: "描述5",
        },
        {
          operTime: "20210206",
          riskType: "类型6",
          riskRank: "高风险",
          content: "描述6",
        },
        {
          operTime: "20210207",
          riskType: "类型7",
          riskRank: "高风险",
          content: "描述7",
        },
        {
          operTime: "20210208",
          riskType: "类型8",
          riskRank: "高风险",
          content: "描述8",
        },
      ];
      that.riskList = results;
      if (flas) {
        that.initChart();
      } else {
        $(".tbl-body tbody").empty();
        // $('.tbl-header tbody').empty();
        var str = "";
        $.each(that.riskList, function (i, item) {
          str =
            "<tr>" +
            "<td>" +
            item.operTime +
            "</td>" +
            "<td>" +
            item.riskType +
            "</td>" +
            "<td>" +
            item.riskRank +
            "</td>" +
            "<td>" +
            item.content +
            "</td>" +
            "</tr>";

          $(".tbl-body tbody").append(str);
          $(document).ready(function () {
            $(".tbl-body tbody tr").click(function () {
              $(this).attr("title", $(this).context.cells[3].innerText);
              $(this)
                .addClass("selected") //为选中项添加高亮
                .siblings()
                .removeClass("selected") //去除其他项的高亮形式
                .end();
            });
          });
          // $('.tbl-header tbody').append(str);
        });
      }
    },
    pageChange: function (key) {
      this.$emit("page-change", key);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
