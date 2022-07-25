<template>
  <div class="baseLayout">
    <div class="flex">
      <div class="title">图表模块</div>
      <div class="more">
        <el-button class="btn" size="mini" round>
          详细
        </el-button>
      </div>
    </div>
    <div id="main" class="chars"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      timer: null,
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  mounted() {
    this.timer = setInterval(() => {
      console.log("进入");
      this.getChars();
    }, 500);
  },
  methods: {
    getChars() {
      let drawLine = this.$echarts.init(document.getElementById("main"));
      let option = {
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [600, 400, 1000, 580, 280],
            type: "line",
            itemStyle: {
              normal: {
                color: "#5B8FF9",
                lineStyle: {
                  color: "#5B8FF9",
                },
              },
            },
          },
        ],
      };
      if (option && typeof option === "object") {
        drawLine.setOption(option);
        drawLine.resize();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.flex{
    position: relative;
}
.chars {
  width: 100%;
  height: 100%;
}
.baseLayout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}
.title {
  position: absolute;
  width: 88px;
  height: 22px;
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #303133;
  line-height: 22px;
  left: 6%;
  top: 16px;
}
::v-deep .el-button {
  color: $theme-color;
  border: 1px solid $theme-color;
  position: absolute;
  right: 10%;
  top: 16px;
  z-index: 999;
}
::v-deep .btn span{
    color: $theme-color;
    position: unset;
}
</style>
