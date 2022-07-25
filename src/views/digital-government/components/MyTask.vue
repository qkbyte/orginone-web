<template>
  <div class="mytask-list" :class="{ home: cls == 'home' ? true : false }">
    <div class="item" v-for="(item, i) in taskList" :key="i">
      <router-link :to="{ path: '/iframe?name=我的任务&url=' + item.YYRKDZ }">
        <div class="titlebox">
          <div>
            <img :src="item.YINGYTB_LJ" width="28" />
          </div>
          <div class="text1">{{ item.ZDRW_MC }}</div>
        </div>
      </router-link>
      <!-- <div>
        <div>
          <span class="count">{{ item.ZD2 }}</span
          >
        </div>
        <div class="text2">{{ item.ZD1 }}</div>
      </div>
      <div v-if="item.ZD6 != '环形图'">
        <div>
          <span class="count">{{ item.ZD5 }}</span>
        </div>
        <div class="text2">{{ item.ZD4 }}</div>
      </div>
      <div v-else>
        <el-progress
          type="circle"
          :percentage="75"
          stroke-linecap="square"
          :stroke-width="10"
          :width="70"
        ></el-progress>
      </div> -->
      <div class="view_chart" v-if="item.VIEW_TYPE1">
        <ViewChart :chartData="item.ZD2" :titleData="item.ZD1" :chartType="item.VIEW_TYPE1"/>
      </div>
      <div class="view_chart" v-if="item.VIEW_TYPE2">
        <ViewChart :chartData="item.ZD2" :titleData="item.ZD1" :chartType="item.VIEW_TYPE2"/>
      </div>
    </div>
  </div>
</template>
<script>
import { getAssetsList } from "@api/assetsCard.js";
import ViewChart from "./ViewChart.vue"
export default {
  name: "mytask",
  components: {
    ViewChart
  },
  data() {
    return {
      taskList: [],
    };
  },
  props: {
    cls: String,
  },
  mounted() {
    //我的任务
    this.getTaskList();
  },
  methods: {
    getTaskList() {
      let data = {
        filterobj: { YYFL4: "829307884281008128", YYLM4: '832616449456476160'  },
        formobj: "829413246875209729",
        pageobj: { curPage: 1, pageSize: 20,total: 0 },
      };
      getAssetsList(data).then((res) => {
        if (res.data.data && res.data.data.rows.length) {
          this.taskList = res.data.data.rows;
          if (this.$route.path == "/government-home") {
            this.taskList = this.taskList.slice(0, 3);
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
@10px: 0.69444444vw;
@font-face {
  font-family: DinAlternate;
  src: url("./font/DINAlternateBold.ttf");
}
.mytask-list {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 20px 0;
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 49%;
    height: 102px;
    margin-right: 2%;
    background: #ffffff;
    // padding-right: @10px * 3.3;
    text-align: center;
    border-radius: 2px;
    border: 1px solid #eeeeee;
    margin-bottom: 20px;
    &:nth-child(n) {
      .titlebox {
        &::before {
          background: linear-gradient(180deg, #fddb02 0%, #ffbd03 100%);
        }
      }
    }
    &:nth-child(2n) {
      margin-right: 0;
      .titlebox {
        &::before {
          background: linear-gradient(180deg, #00ebc1 0%, #00d28e 100%);
        }
      }
    }
    &:nth-child(3n) {
      .titlebox {
        &::before {
          background: linear-gradient(180deg, #00e5ff 0%, #00c6ff 100%);
        }
      }
    }
    .view_chart{
      height: 100%;
      flex: 1;
    }
    .titlebox {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: @10px * 10.2;
      height: 102px;
      background: #f5f6fa;
      border-radius: 2px 0px 0px 2px;
      &::before {
        position: absolute;
        left: 0;
        top: 0;
        content: "";
        width: 4px;
        height: 100%;
        border-radius: 2px 0px 0px 2px;
      }
    }
    .text1 {
      margin-top: 13px;
      font-size: 16px;
      font-weight: 600;
      color: #2f2f32;
      padding: 0 15px;
    }
    .text2 {
      margin-top: 5px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
    }
    .count {
      font-family: DinAlternate;
      height: 28px;
      font-size: 24px;
      font-weight: bold;
      color: #1d96ff;
      line-height: 28px;
    }
    small {
      font-size: 14px;
      font-weight: 600;
      color: #1d96ff;
      margin-left: 2px;
    }
  }
}
</style>
<style lang="less">
html,
body,
#app {
  height: auto !important;
}
</style>
