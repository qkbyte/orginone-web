<template>
  <div id="indexvisit">
    <div class="indexvisit-box">
      <h3>资产增长情况</h3>
      <p><span>总增加数:</span><span style="margin-left: 10px">{{ total.toFixed(2) }}</span></p>
      <div id="drawIndexvisit"></div>
    </div>
  </div>
</template>
<script>
import { getAssetsCard } from '@api/assetsCard.js'
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "Indexvisit",
  data() {
    return {
      total: 0,
      increaseMonth: ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份'],
      increaseNum: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
    };
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenantId"])
  },
  mounted() {
    this.requireIncrease()
  },
  methods: {
    requireIncrease() {
      console.log('this.curTenantId', this.curTenantId);
      let data = {orgId: this.curTenantId}
      getAssetsCard(data).then((res) => {
        if(res.data && res.data.data.rows.length) {
        this.increaseMonth = []
        this.increaseNum = []
          res.data.data.rows.forEach((item, index) => {
            this.total += item.SHUL
            this.increaseMonth.push(item.month)
            this.increaseNum.push(item.SHUL)
          })
        }
        this.drawLeftLine(this.increaseMonth, this.increaseNum);
      })
    },
    drawLeftLine(increaseMonth, increaseNum) {
      let drawLine = this.$echarts.init(
        document.getElementById("drawIndexvisit")
      );
      let option = null;
      option = {
        tooltip: {
          trigger: "axis",
        },
        color: ["#52F478", "#FFCD8B"],
        icon: "circle",
        legend: {},
        grid: {
          left: "0px",
          // right: '0px',
          bottom: "0px",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          nameGap: "15",
          show: true,
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: "#999",
            },
          },
          splitArea: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#BBF6FF",
            },
            symbol: ["none", "arrow"],
          },
          data: increaseMonth,
        },
        yAxis: {
          type: "value",
          show: true,
          axisLabel: {
            textStyle: {
              color: "#999",
            },
          },
          splitArea: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#EBEEF5",
            },
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#EBEEF5",
            },
            symbol: ["none"],
          },
        },
        series: [
          {
            type: "line",
            smooth: true,
            lineStyle: {
              normal: {
                color: "#2859DB",
                width: 2,
              },
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: "#FFFFFF",
                  },
                  {
                    offset: 1,
                    color: "#154AD8",
                  },
                ]),
              },
            },
            data: increaseNum,
          },
        ],
      };
      if (option && typeof option === "object") {
        drawLine.setOption(option);
        window.addEventListener("resize", function() {
          drawLine.resize();
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
#indexvisit {
  width: 49%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
}
#drawIndexvisit {
  width: 90%;
  height: 290px;
}
.indexvisit-box {
  h3 {
    font-size: 22px;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
  }
  p {
    margin-top: 13px;
    span{
      font-size: 18px;
      font-weight: 600;
      color: rgba(48, 49, 51, 1);
    }
  }
}
@media screen and (max-width: 1500px) {
  #indexvisit {
    height: 287px;
  }
  .indexvisit-box {
    h3 {
      font-size: 16px;
    }
    p {
      margin-top: 9px;
      font-size: 24px;
    }
  }
  #drawIndexvisit {
    height: 190px;
  }
}
</style>
