<template>
  <div class="myoffice-list">
    <el-tabs type="border-card" @tab-click="activeTitle">
      <el-tab-pane
        :label="item.typeName"
        v-for="item,index in officeList"
        :key="index"
        
      >
        <ul>
          <li class="item-text" v-for="it,i in officeItem" :key="i">
            <span class="icon-left">
              <i v-if="it.ZD1" class="label-ji">{{ it.ZD1 }}</i>
              <i v-if="it.ZD2" class="label1">{{ it.ZD2 }}</i>
            </span>
            <!--<a :href="it.URL" target="_blank" class="a-text">{{it.TITLE}}</a>-->
            <router-link :to="{ path: '/iframe?name=我的办公&url=' + it.YYRKDZ }">
              {{ it.YYLY_MC }}
            </router-link>
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
      officeList: [],
      officeItem: []
    };
  },
  mounted() {
    //我的办公
    this.getOfficeTwoColumn()
  },

  methods: {
    activeTitle(e) {
      this.geOfficeList(this.officeList[Number(e.index)].code)
    },
    getOfficeTwoColumn() {
      getTwoColumn({formobj: '829413246875209729', filterobj: {YYFL4: '829307884281008128', YYLM4: '832616449653608448'}, pageobj: {curPage: 1, pageSize: 20}}).then((res) => {
        if (res.data.data && res.data.data.rows.length) {
          res.data.data.rows.forEach((item, index) => {
              this.officeList.push({typeName: item.APPLYNAME, code: item.YYLM_LIST});
          })
          this.geOfficeList(this.officeList[0].code);
        }
      })
    },
    geOfficeList(code) {
      this.officeItem = []
      return getAssetsList({
        filterobj: {YYFL4: '829307884281008128', YYLM4: '832616449653608448', YYLM_LIST1: [code]},
        formobj: "829413246875209729",
        pageobj: { curPage: 1, pageSize: 20,total: 0},
      }).then((res) => {
        if (res.data.data && res.data.data.rows.length) {
          let data = res.data.data.rows;
          if (this.$route.path == "/government-home") {
            data = data.slice(0, 5);
          }
          this.officeItem = data;
        }
      });
    },
    // async geOfficeData() {
    //   await this.geOfficeList("重要事情办理");
    //   await this.geOfficeList("人大提案");
    //   await this.geOfficeList("政协议案");
    //   await this.geOfficeList("待办");
    // },
  },
};
</script>
<style lang="less" scoped>
.icon-left {
  //margin-top: 3px;
  display: flex;
  i {
    display: inline-block;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    margin-right: 5px;
  }
  .label-ji {
    width: 20px;
    height: 20px;
    background: #da2626;
    border-radius: 2px;
    color: #fff;
  }
  .label1 {
    width: 34px;
    height: 20px;
    background: #f0faf2;
    border-radius: 1px;
    color: #15be50;
    border: 1px solid #15be50;
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
.myoffice-list {
  padding: 20px 20px 0;
  .item-text {
    display: flex;
    padding-bottom: 16px;
    padding-top: 12px;
    border-bottom: 1px solid #eeeeee;
    .a-text {
      flex: 1;
      //height: 44px;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
  }
}
</style>
