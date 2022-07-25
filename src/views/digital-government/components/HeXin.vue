<template>
  <div class="hexin-list">
    <div class="item" v-for="(item, i) in hxList" :key="i">
      <i
        class="cornor"
        :class="i == 0 ? 'color1' : i == 1 ? 'color2' : 'color3'"
        >{{ item.ZDRW_MC }}</i
      >
      <router-link :to="{ path: '/iframe?name=核心指标&url=' + item.YYRKDZ }">
        <div class="text1">{{ item.YYLY_MC }}</div>
      </router-link>
      <el-progress
        color="#1D96FF"
        :percentage="Number(item.ZD2)"
      ></el-progress>
      <div class="text2">{{ item.ZD1 }}</div>
    </div>
  </div>
</template>
<script>
import { getAssetsList } from "@api/assetsCard.js";
export default {
  data() {
    return {
      hxList: [],
    };
  },
  mounted() {
    //核心指标
    this.getHxList();
  },
  methods: {
    getHxList() {
      let data = {
        filterobj: {YYFL4: '829307884281008128', YYLM4: '832616449531973632'},
        formobj: "829413246875209729",
        pageobj: { curPage: 1, pageSize: 20 },
      };
      getAssetsList(data).then((res) => {
        if (res.data.data && res.data.data.rows.length) {
          this.hxList = res.data.data.rows;

          if (this.$route.path == "/government-home") {
            this.hxList = this.hxList.slice(0, 3);
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.hexin-list {
  padding: 20px 20px 0;
  .item {
    position: relative;
    height: 118px;
    background: #f5f6fa;
    border-radius: 2px;
    padding: 36px 20px 10px;
    margin-bottom: 16px;
    .cornor {
      position: absolute;
      left: 0;
      top: 0;
      width: 78px;
      height: 22px;
      line-height: 22px;
      background: #1d96ff;
      text-align: center;
      color: #fff;
      border-radius: 2px 0px 4px 0px;
      &.color1 {
        background: url(./img/label-yellow.png) no-repeat;
      }
      &.color2 {
        background: url(./img/label-green.png) no-repeat;
      }
      &.color3 {
        background: url(./img/label-blue.png) no-repeat;
      }
    }
    .text1 {
      height: 22px;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      margin-bottom: 8px;
    }
    .text2 {
      width: 96px;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
      margin-top: 8px;
    }
  }
}
</style>
