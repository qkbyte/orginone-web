<template>
  <div class="layout">
    <div class="layout-row" style="height:100%" v-if="allAppList.length !== 0">
      <div class="layout-box" v-for="item in allAppList" :key="item.id" :class="item.saleStatus === 3? 'boxgray': ''">
        <div class="layout-box__row">
          <div class="layout-box__img">
            <img
              class="image"
              :src="item.icon ? item.icon : require('@assets/default-head.svg')"
            />
          </div>
          <div class="layout-box__column">
            <div class="row">
              <div class="layout-box__name">{{ item.appName }}</div>
              <el-button
                v-show="!item.ifPurchase && item.saleStatus !== 3"
                class="layout-box__btn"
                size="mini"
                round
                @click="handlePurchase(item)"
                >获取</el-button
              >
              <el-button
                v-show="item.ifPurchase && item.saleStatus !== 3"
                class="layout-box__btn"
                size="mini"
                round
                @click="openApp(item)"
                >打开</el-button
              >
              <el-button
                v-show="item.saleStatus === 3"
                class="layout-box__btn boxgray"
                size="mini"
                round
                disabled
                >冻结</el-button
              >
            </div>
            <div class="layout-box__descripe">{{ item.description }}</div>
          </div>
        </div>
        <div class="layout-box__bottmrow">
          <div class="layout-box__tenantName">开发商:{{ item.tenantName }}</div>
          <div class="layout-box__version">最新版本:{{ item.version }}</div>
        </div>
        <div class="yirenzheng" v-if="item.reformStatus == 0"><img src="@assets/yirenzheng1.svg" alt="已认证" title="已认证"></div>
        <div class="weirenzheng" v-if="item.reformStatus == 1"><img src="@assets/weirenzheng.svg" alt="整改中" title="整改中"></div>
      </div>
      <i v-for="index in 20" :key="index"></i>
    </div>
    <div v-else>
      <div class="no-app">
        <div class="no-app_img">
          <img src="@assets/no-app.svg" alt="" />
        </div>
        <div class="no-app_text">
          <div class="text-content" @click="handleCreateGroup">
            请创建集团<i class="el-icon-right no-app-icon"></i>
          </div>
        </div>
      </div>
    </div>
    <template v-for="item in dialogShow">
      <TheAppInfoDialog
        v-if="item.key === 'getApp' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleUpdate="loadAppList"
        @handleClose="handleCloseDialog"
      ></TheAppInfoDialog>
      <TheCreateGroupDialog
        v-if="item.key === 'apply' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheCreateGroupDialog>
    </template>
  </div>
</template>

<script>
import { getDictItemList, getDictItemObject } from "@utils/index";
import { mapGetters, mapActions } from "vuex";
import { getOnSaleAppList, getOnSaleGroupAppList } from "@api/market";
import DiyTable from "@components/DiyTable/index";
import TheTableButton from "./TheTableButton";
import TheAppInfoDialog from "./TheAppInfoDialog";
import TheCreateGroupDialog from "./TheCreateGroupDialog";
export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "getApp",
          value: false,
        },
        {
          key: "apply",
          value: false,
        },
      ],
      allAppList: [],
      options: {
        checkBox: true,
        order: true,
        defaultSort: { prop: "createdTime", order: "descending" },
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
        page: {
          layout: "total,prev, pager, next, sizes",
        },
      },
      appType: [],
      filterText: "",
      targetUser: [],
      current: 1,
      size: 16,
    };
  },
  components: {
    DiyTable,
    TheTableButton,
    TheAppInfoDialog,
    TheCreateGroupDialog,
  },
  created() {
    this.$nextTick(async () => {
      this.appType = await getDictItemObject(this.dict.APP_TYPE);
      this.targetUser = [0].concat(await getDictItemList(this.dict.APP_TARGET));
      this.loadAppList();
    });
  },
  mounted() {},
  computed: {
    ...mapGetters("tenant", ["curTenant", "curTenantId"]),
    ...mapGetters("group", ["curGroupId"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadAppList("search");
    },
  },
  methods: {
    //创建集团
    handleCreateGroup() {
      this.dialogShow.map((el) => {
        if (el.key === "apply") {
          el.value = true;
        }
      });
    },
    //获取应用列表
    loadAppList(str) {
      this.$parent.$parent.fullscreenLoading = true;
      let currentPage = 1;
      let pageSize = 20;
      if (str) {
        pageSize = this.$parent.$parent.page.pageSize;
        this.$parent.$parent.page.currentPage = 1;
      } else {
        currentPage = this.$parent.$parent.page.currentPage;
        pageSize = this.$parent.$parent.page.pageSize;
      }
      if (this.curGroupId == "") {
        this.$parent.$parent.fullscreenLoading = false;
      } else {
        let params = {
          groupId: this.curGroupId,
          saleStatus: 1,
          current: currentPage,
          size: pageSize,
          appName: this.filterText,
        };
        getOnSaleGroupAppList(params).then((res) => {
          const { records, total } = res.data.data;
          this.allAppList = records;
          this.$parent.$parent.page.total = total;
          this.$parent.$parent.fullscreenLoading = false;
        });
      }
    },
    openApp(item) {
      this.$router.push({
        name: "applicationMarket-view",
        query: {
          id: item.id,
        },
      });
    },
    //打开获取窗口
    handlePurchase(item) {
      this.dialogShow.map((el) => {
        if (el.key === "getApp") {
          el.value = true;
          el.sendData = item;
        }
      });
    },
    handleClose(item) {
      this.dialogShow.map((el) => {
        if (el.key === "getApp") {
          el.value = false;
          el.sendData = item;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-button.is-disabled, .el-button.is-disabled:hover, .el-button.is-disabled:focus {
    color: lavender;
    cursor: not-allowed;
    background-image: none;
    background-color: lightgray;
    border-color: #EBEEF5;
}
.boxgray{
  background-color: lightgray;
  cursor: no-drop;
}
.row {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.image {
  width: 60px;
  height: 60px;
  border-radius: 15px;
}
.layout {
  height: 100%;
  overflow: auto;
  margin-top: 10px;
}
.layout-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
  & > i {
    width: 5.8%;
  }
}
.layout-box {
  width: 24%;
  height: 170px;
  border: 1px solid #ebeef5;
  opacity: 1;
  border-radius: 4px;
  margin-left: 10px;
  margin-bottom: 1%;
  position: relative;
  padding: 10px;
  &__row {
    position: absolute;
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    width: 100%;
  }
  &__img {
    margin-top: 8px;
  }
  &__column {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  &__name {
    width: fit-content;
    height: 22px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 22px;
    color: #303133;
    opacity: 1;
    margin-left: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__descripe {
    width: 78%;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 20px;
    color: #606266;
    opacity: 1;
    margin-left: 20px;
    margin-top: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  &__bottmrow {
    font-size: 12px;
    position: absolute;
    width: 98%;
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    bottom: 10px;
    justify-content: space-between;
  }
  &__version {
    width: 30%;
    white-space: nowrap;
    margin-right: 12px;
    margin-top: 8px;
    display: flex;
    flex-direction: row-reverse;
  }
  &__tenantName {
    margin-top: 8px;
    width: 70%;
  }
  &__btn {
    margin-right: 20px;
    margin-top: -5px;
    color: $theme-color;
    border: 1px solid $theme-color;
  }
}
@media (min-width: 250px) and (max-width: 1600px) {
  .layout-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px;
    & > i {
      width: 33%;
    }
  }
  .layout-box {
    width: 32%;
    height: 170px;
    border: 1px solid #ebeef5;
    opacity: 1;
    border-radius: 4px;
    margin-left: 10px;
    margin-bottom: 15px;
    position: relative;
    padding: 10px;
    &__row {
      position: absolute;
      display: flex;
      flex-direction: row;
      width: 100%;
    }
    &__img {
      margin-top: 8px;
    }
    &__column {
      width: 75%;
      display: flex;
      flex-direction: column;
    }
    &__name {
      width: fit-content;
      height: 22px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 22px;
      color: #303133;
      opacity: 1;
      margin-left: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &__descripe {
      width: 70%;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 20px;
      color: #606266;
      opacity: 1;
      margin-left: 20px;
      margin-top: 10px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    &__bottmrow {
      position: absolute;
      width: 88%;
      display: flex;
      flex-direction: row;
      margin-top: 10px;
      bottom: 10px;
      justify-content: space-between;
    }
    &__version {
      width: 22%;
      margin-top: 8px;
      display: flex;
      margin-right: 0px;
      flex-direction: row-reverse;
    }
    &__tenantName {
      margin-top: 8px;
      width: 60%;
    }
    &__btn {
      margin-left: 10px;
      margin-right: 10px;
      color: $theme-color;
      border: 1px solid $theme-color;
    }
  }
}
.no-app {
  position: absolute;
  top: 50%;
  left:50%;
  transform: translate(-50%,-50%);
  font-size: 18px;
  font-weight: 600;
  padding: 30px;
  &_img {
    text-align: center;
  }
  img {
    width: 190px;
    height: 140px;
    margin-bottom: 30px;
  }
  &_text {
    display: flex;
    justify-content: center;
    .text-content {
      font-size: 15px;
      cursor: pointer;
    }
  }
  .text-content:hover {
    color: #154ad8;
  }
  .no-app-icon {
    font-weight: 800;
  }
}
.yirenzheng {
  width: 35px;
  height: 35px;
  position: absolute;
  top: -5px;
  left: -5px;
  img{
    width: 100%;
    height: 100%;
  }
}
.weirenzheng{
  width: 25px;
  height: 25px;
  position: absolute;
  top: 0;
  left: 0;
  img{
    width: 100%;
    height: 100%;
  }
}
</style>
