<template>
  <div class="monitor base-layout">
    <el-row :gutter="4">
      <el-col :span="8">
        <div class="content-box">
          <div class="box_title">
            <div class="title_left">在线用户</div>
          </div>
          <div class="box_body0">{{ onlineUser }}</div>
          <div class="box_line"></div>
          <div class="box_reg">{{ regUser }}人</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="content-box">
          <div class="box_top">
            <div class="top-left">
              <div class="title-left">集团</div>
              <div class="top-num">{{ createdGroup }}</div>
            </div>
            <div class="top-left top-right">
              <div class="box_title">
                <div class="title_left">注册单位</div>
              </div>
              <div class="box_body">{{ createdTenant }}</div>
            </div>
          </div>
          <div class="box_line"></div>
          <div class="month-up">{{ groupMonthUp }}个</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="content-box">
          <div class="title-app">应用</div>
          <div class="top-num">{{ appTotal }}</div>
          <div class="box_line"></div>
          <div class="box_distribution">{{ distribution }}人</div>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="content-box">
          <e-charts
            class="chartOne"
            :style="{ height: chartHeight + 'px' }"
            :autoresize="true"
            :options="userIncreaseOptions"
          ></e-charts>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DiyTitle from "@components/DiyTitle";
import { getTenantInfoMonitor } from "@api/tenant";
import { getGroupInfoMonitor } from "@api/group";
import { getUserInfoMonitor, getAllUserNum, getOnlineUserNum } from "@api/user";
import { getOnSaleAppNum, getDistributeUserNum } from "@api/market";
export default {
  data() {
    return {
      onlineUser: 0,
      rate: 2.1,
      regUser: 0,
      createdTenant: 0,
      createdGroup: 0,
      tenantMonthUp: 0,
      groupMonthUp: 0,
      joinRate: 87,
      appTotal: 0,
      distribution: 0,
      userIncreaseOptions: {
        title: {
          text: "用户增长趋势图",
          textStyle: {
            color: "#303133",
            fontWight: "normal",
            fontSize: 16,
          },
          padding: [5, 0, 0, 0],
          top: 0,
        },
        color: ["#154AD8"],
        grid: {
          left: 30,
          top: "25%",
          bottom: 20,
          right: 10,
        },
        tooltip: {},
        xAxis: {
          type: "category",
          data: [],
          axisLine: {
            lineStyle: {
              color: "#E1E1E1",
              width: "2",
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#E1E1E1",
              width: "2",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            interval: "auto",
          },
          splitLine: {
            show: true,
          },
          name: "(个)",
          nameTextStyle: {
            padding: [0, 0, 0, -8],
            fontSize: 14,
          },
        },
        textStyle: {
          color: "#939393",
          fontStyle: "normal",
        },
        series: [
          {
            name: "用户增长量",
            type: "line",
            itemStyle: {},
            symbolSize: 8,
            radius: "150%",
            data: [],
            label: {
              normal: {
                show: false,
                position: "top",
              },
            },
          },
        ],
        tooltip: {
          axisPointer: {
            lineStyle: {
              color: "#fff",
              type: "shadow",
            },
          },
        },
      },
      chartHeight: 0,
    };
  },
  components: {
    DiyTitle,
  },
  created() {
    this.getTenantData();
    this.getGroupData();
    this.getUserData();
    let _this = this;
    this.chartHeight = window.innerHeight - 345;
    getOnSaleAppNum().then((res) => {
      this.appTotal = res.data.data;
    });
    this.getAllUser();
    this.getDistribute();
    this.getOnlineUser();
  },
  mounted() {},
  methods: {
    getTenantData() {
      getTenantInfoMonitor({ flag: "100" }).then((res) => {
        this.createdTenant = res.data.data;
      });
      getTenantInfoMonitor({ flag: "103" }).then((res) => {
        this.tenantMonthUp = res.data.data;
      });
    },
    getGroupData() {
      getGroupInfoMonitor({ flag: "100" }).then((res) => {
        this.createdGroup = res.data.data;
      });
      getGroupInfoMonitor({ flag: "103" }).then((res) => {
        this.groupMonthUp = res.data.data;
      });
    },
    getUserData() {
      getUserInfoMonitor().then((res) => {
        let data = res.data.data;
        this.userIncreaseOptions.xAxis.data = [];
        this.userIncreaseOptions.series[0].data = [];
        data.forEach((item) => {
          this.userIncreaseOptions.xAxis.data.push(item.days.substring(5));
          this.userIncreaseOptions.series[0].data.push(item.count);
        });
      });
    },
    async getDistribute() {
      const res = await getDistributeUserNum();
      this.distribution = res.data.data;
    },
    async getAllUser() {
      const res = await getAllUserNum();
      this.regUser = res.data.data;
    },
    async getOnlineUser() {
      const { data: res } = await getOnlineUserNum();
      this.onlineUser = res.data;
    },
  },
};
</script>

<style lang="scss">
.monitor {
  .el-row {
    margin-top: 4px;
  }
  .el-col {
    margin-bottom: 4px;
  }
  .content-box {
    background-color: #fff;
    border-radius: 4px;
    padding: 16px 20px;
    .title-left {
      color: #154ad8;
    }
    .title-left::before {
      content: "已创建";
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: rgba(96, 98, 102, 1);
    }
    .box_top {
      display: flex;
      justify-content: space-between;
      .top-unit {
        margin-right: 36%;
      }
    }
    .box_joinRate {
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: rgba(144, 147, 153, 1);
    }
    .box_joinRate::before {
      margin-right: 8px;
      content: "单位加入集团";
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: rgba(144, 147, 153, 1);
    }
    .box_title {
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      display: flex;
      justify-content: space-between;
      .title_left {
        color: #154ad8;
      }
      .title_right {
        color: #67c23a;
      }
    }
    @mixin box_body {
      margin-top: 8px;
      margin-bottom: 16px;
      font-size: 32px;
      font-family: DINPro;
      font-weight: 500;
      line-height: 41px;
      color: rgba(48, 49, 51, 1);
      opacity: 1;
    }
    .box_body {
      @include box_body;
    }
    .box_body0 {
      @include box_body;
    }
    .box_body0::after {
      margin-left: 8px;
      content: "人";
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
      color: rgba(48, 49, 51, 1);
    }
    .box_body::after {
      margin-left: 8px;
      content: "家";
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
      color: rgba(48, 49, 51, 1);
    }
    .box_reg {
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      color: rgba(48, 49, 51, 1);
    }
    .box_reg::before {
      margin-right: 8px;
      content: "已注册用户";
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: rgba(144, 147, 153, 1);
    }
    .title-app {
      color: #154ad8;
    }
    .title-app::before {
      content: "已上架";
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: rgba(96, 98, 102, 1);
    }
    .box_distribution {
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      color: rgba(48, 49, 51, 1);
    }
    .box_distribution::before {
      margin-right: 8px;
      content: "已分配用户数";
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: rgba(144, 147, 153, 1);
    }
  }
  .box_line {
    width: 100%;
    height: 0px;
    border: 1px solid rgba(235, 238, 245, 1);
    opacity: 1;
    margin-bottom: 16px;
  }
  .title_left::before {
    content: "目前";
    font-size: 14px;
    font-weight: 500;
    color: #606266;
  }
  .title_right::before {
    content: "相比昨日";
    font-size: 14px;
    font-weight: 500;
    color: #606266;
    margin-right: 4px;
  }
  .top-num {
    margin: 8px 0 16px 0;
    font-size: 32px;
    font-family: DINPro;
    font-weight: 500;
    line-height: 41px;
    color: rgba(48, 49, 51, 1);
  }
  .top-num::after {
    margin-left: 8px;
    content: "个";
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: rgba(48, 49, 51, 1);
  }
  @mixin num() {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: rgba(48, 49, 51, 1);
  }
  .month-up {
    @include num;
  }
  .month-up::before {
    margin-right: 8px;
    content: "月增长";
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: rgba(96, 98, 102, 1);
  }
  .chartOne {
    width: 100%;
  }
}
</style>
