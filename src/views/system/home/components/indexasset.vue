<template>
  <div id="indexasset">
    <div class="indexasset-box">
      <h3>资产结构分布</h3>
      <p>
        ￥
        <span>{{ total.toFixed(2) }}</span>
      </p>
      <div id="mainCanvas"></div>
    </div>
  </div>
</template>
<script>
import { getAssetsCard } from '@api/assetsCard.js'
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "Indexasset",
  data() {
    return {
      left: 500,
      fontSize: 14,
      fontSize1: 12,
      Top: 0,
      paddingTop: 0,
      total: 0,
      fixedAssetsName: ["长期股权投资", "在建工程", "图书、档案", "专用设备", "家具、用具、装具及动植物", "文物和陈列品", "车辆", "通用设备", "房屋及构筑物", "无形资产"],
      fixedAssets: [{name: "长期股权投资", value: 0},{name: "在建工程", value: 0},{name: "图书、档案", value: 0},{name: "专用设备", value: 0},{name: "家具、用具、装具及动植物", value: 0},{name: "文物和陈列品", value: 0},{name: "车辆", value: 0},{name: "通用设备", value: 0},{name: "房屋及构筑物", value: 0},{name: "无形资产", value: 0}]
    };
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"])
  },
  mounted() {
    this.requireFixed()
    // this.drawLine();
  },
  methods: {
    requireFixed() {
      let data = {tenantCode: this.curTenantCode, orderName: 'SHUL'}
      getAssetsCard(data).then((res) => {
        if(res.data && res.data.data.rows.length) {
            this.fixedAssetsName = []
            this.fixedAssets = []
          res.data.data.rows.forEach((item) => {
            this.total += item.SHUL
            this.fixedAssets.push({name: item.NAME, value: item.SHUL})
            this.fixedAssetsName.push(item.NAME)
          })
          this.fixedAssetsName.reverse()
        }
        if (document.body.clientWidth <= 1600) {
          this.left = 260;
          this.fontSize = 12;
          this.fontSize1 = 12;
          this.Top = 10;
          this.paddingTop = 3;
          this.drawLine(this.fixedAssets, this.fixedAssetsName);
        }
        if (document.body.clientWidth > 1600) {
          this.left = '70%';
          this.fontSize = 12;
          this.fontSize1 = 17;
          this.Top = 10;
          this.paddingTop = 5;
          this.drawLine(this.fixedAssets, this.fixedAssetsName);
        }
      })
    },
    drawLine(fixedAssets, fixedAssetsName) {
      var myChart = this.$echarts.init(document.getElementById("mainCanvas"));
      let option = null;
      var data = fixedAssets;
      option = {
        tooltip: {
          //提示框，可以在全局也可以在
          trigger: "item", //提示框的样式
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          color: "#000", //提示框的背景色
          textStyle: {
            //提示的字体样式
            color: "black",
          },
        },
        legend: {
          //图例
          left: this.left,
          top: this.Top,
          itemHeight: 9,
          icon: "circle",
          orient: "vertical", //图例的布局，竖直    horizontal为水平
          x: "right", //图例显示在右边
          data: fixedAssetsName,
          formatter: function(name) {
            let target;
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                target = data[i].value;
              }
            }
            let arr = ["{a|" + name + "}", "{b|" + target + "}"];
            return arr.join("\n");
          },
          textStyle: {
            //图例文字的样式
            rich: {
              a: {
                top: 10,
                left: 100,
                fontSize: this.fontSize,
                color: "#303133",
              },
              b: {
                padding: this.paddingTop,
                fontSize: this.fontSize1,
                color: "#909399",
              },
            },
          },
        },
        series: [
          {
            left: -200,
            top: 10,
            name: "访问来源",
            type: "pie", //环形图的type和饼图相同
            radius: ["50%", "70%"], //饼图的半径，第一个为内半径，第二个为外半径
            avoidLabelOverlap: false,
            color: ["#64DBFD", "#6377FA", "#00DDA0", "#FFA64D", '#d48265', '#ff0000','#00ff00', '#0000ff', '#d48265', '#91c7ae'],
            label: {
              normal: {
                //正常的样式
                show: false,
                position: "center",
              },
              emphasis: {
                //选中时候的样式
                show: true,
                textStyle: {
                  fontSize: "20",
                  fontWeight: "bold",
                },
              },
            }, //提示文字
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: fixedAssets,
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
#indexasset {
  width: 49%;
  height: 403px;
  background: rgba(255, 255, 255, 1);
}
.indexasset-box {
  h3 {
    font-size: 34px;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
  }
  p {
    margin-top: 11px;
    font-size: 34px;
    font-weight: 600;
    color: rgba(48, 49, 51, 1);
  }
}
#mainCanvas {
  height: 290px;
}
@media screen and (max-width: 1600px) {
  #indexasset {
    height: 287px;
  }
  .indexasset-box {
    h3 {
      font-size: 16px;
    }
    p {
      margin-top: 8px;
      font-size: 24px;
    }
  }
  #mainCanvas {
    height: 220px;
  }
}
</style>
