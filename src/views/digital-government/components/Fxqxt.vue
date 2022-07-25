<template>
  <div class="fxqxt-list">
    <el-tabs type="border-card" @tab-click="activeTitle">
      <el-tab-pane
        v-for="item,inde in fxqxtList"
        :key="inde"
        :label="item.typeName"
      >
        <ul>
          <li class="item-text" v-for="(it, j) in FxqxtItem" :key="j">
            <span class="icon-left icon-left2" v-if="j < 3">
              <i class="icon-level">{{
                it.BH
              }}</i>
            </span>
            <div class="a-text-box">
              <router-link
                :to="{ path: '/iframe?name=风险气象台&url=' + it.YYRKDZ }"
              >
                {{ it.YYLY_MC }}
              </router-link>
              <!--<a :href="it.FXQXT_URL" target="_blank" class="a-text">{{it.TITLE}}</a>-->
              <div class="a-time">{{ timeFormat(it.TIJIAOSJ) }}</div>
            </div>
            <img class="pic" :src="it.PICTURE_LJ" />
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getAssetsList,getTwoColumn } from "@api/assetsCard.js";
export default {
  data() {
    return {
      fxqxtList: [],
      FxqxtItem: []
    };
  },
  mounted() {
    //风险气象台
    // this.geFxqxtData();
    this.getOfficeTwoColumn()
  },
  methods: {
    activeTitle(e) {
      this.geFxqxtList(this.fxqxtList[Number(e.index)].code)
    },
    getOfficeTwoColumn() {
      getTwoColumn({formobj: '829413246875209729', filterobj: {YYFL4: '829307884281008128',YYLM4: '832616449590693888'}, pageobj: {curPage: 1, pageSize: 20}}).then((res) => {
        if (res.data.data && res.data.data.rows.length) {
          res.data.data.rows.forEach((item, index) => {
              this.fxqxtList.push({typeName: item.APPLYNAME,code: item.YYLM_LIST });
          })
          this.geFxqxtList(this.fxqxtList[0].code);
        }
      })
    },
    geFxqxtList(code) {
      return getAssetsList({
        filterobj: {YYFL4: '829307884281008128',YYLM4: '832616449590693888',YYLM_LIST1:[code] },
        formobj: "829413246875209729",
        pageobj: { curPage: 1, pageSize: 20 },
      }).then((res) => {
        if (res.data.data && res.data.data.rows.length) {
          let data = res.data.data.rows;
          if (this.$route.path == "/government-home") {
            data = data.slice(0, 3);
            this.FxqxtItem = data;
          }

        }
      });
    },
    // async geFxqxtData() {
    //   await this.geFxqxtList("突发事件");
    //   await this.geFxqxtList("任务滞后");
    //   await this.geFxqxtList("舆情监测");
    //   await this.geFxqxtList("重大风险");
    // },
    monthAdd0(m) {
      return m < 10 ? "0" + m : m;
    },
    timeFormat(shijianchuo) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y + "-" + this.monthAdd0(m) + "-" + this.monthAdd0(d);
    },
  },
};
</script>
<style lang="less" scoped>
.icon-left {
  &.icon-left2 {
    width: 30px;
  }
  i {
    display: inline-block;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    margin-right: 5px;
  }
  .icon-level {
    width: 20px;
    height: 20px;
    background: #da2626;
    border-radius: 2px;
    color: #fff;
    margin-right: 5px;
    margin-top: 5px;
  }
}

.fxqxt-list {
  padding: 20px 20px 0;
  .item-text {
    display: flex;
    padding-bottom: 19px;
    padding-top: 17px;
    border-bottom: 1px solid #ffeeeeee;
    .a-text-box {
      flex: 1;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      margin-right: 10px;
      .a-text {
        display: block;
        height: 52px;
        line-height: 26px;
        overflow: hidden;
      }
      .a-time {
        font-size: 16px;
        font-weight: 400;
        color: #999999;
        line-height: 26px;
        margin-top: 4px;
      }
    }
    .pic {
      width: 120px;
      height: 80px;
    }
  }
}
</style>
