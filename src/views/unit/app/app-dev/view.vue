<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" style="overflow:auto">
    <div :class="curTab === '1' ? 'con' : 'conTable'">
      <div class="flex-between">
        <DiyTabs
          ref="type-list"
          :tabList="allType"
          :curTab.sync="curTab"
        ></DiyTabs>
        <div class="flex-row">
          <el-button style="margin-right:20px" type="text" @click="back"
            >返回</el-button
          >
          <div v-show="curTab === '1'">
            <el-button v-if="formData.status === 1" @click="handleDeploy"
              >部署</el-button
            >
            <el-button v-else-if="formData.status === 4" @click="handleRelease"
              >发布</el-button
            >
            <el-button
              v-else-if="formData.status === 7 && formData.saleStatus === 0"
              @click="handleUp"
              >上架</el-button
            >
            <el-button
              v-else-if="formData.status === 7 && formData.saleStatus === 1"
              @click="handleDown"
              >下架</el-button
            >
          </div>
          <el-button type="text" v-show="curTab !== '1' && curTab !=='4'">发公告</el-button>
        </div>
      </div>
      <TheAppForm
        v-if="curTab === '1'"
        ref="form"
        :formData="formData"
        :disabled="true"
        @handleShow="handleShow"
      ></TheAppForm>
      <TheTenantListTable
        v-else-if="curTab === '2'"
        ref="tenantTable"
        :tableData="tenantTableData"
        @updateList="setTenantListTable"
        :curTab="curTab"
      >
      </TheTenantListTable>
      <TheGroupListTable
        v-else-if="curTab === '3'"
        ref="groupTable"
        :tableData="groupTableData"
        @updateList="setGroupListTable"
        :curTab="curTab"
      >
      </TheGroupListTable>

      <TheAppComponent
        v-else-if="curTab === '4'"
        ref="appTable"
        :curTab="curTab"
        :appId="appId"
      ></TheAppComponent>
    </div>
    <div class="con" v-show="curTab === '1' && isShow">
      <div class="flex-between">
        <div class="title">应用状态</div>
        <div>
          <a
            href="http://assetdocs.assetcloud.org.cn/"
            target="_blank"
            style="text-decoration:none;color:#446ee0"
            v-if="formData.status !== 0 && formData.status !== 2"
            >开发文档</a
          >
        </div>
      </div>
      <div class="body">
        <div class="body-left">
          <div :class="active[0]"></div>
          <div class="line"></div>
          <div :class="active[1]"></div>
          <div class="line"></div>
          <div :class="active[2]"></div>
        </div>
        <div class="body-right">
          <div class="right_first">
            <div class="first">
              应用注册
              <img src="../../../../assets/question-mark.png" alt />
              <span class="pass-goto" v-if="reg === 1" @click="gotoReg"
                >去修改</span
              >
              <span class="pass" v-if="reg === 2">
                <div class="pass-round"></div>
                <div class="pass-text">已通过</div>
              </span>
              <span class="pass-reject" v-if="reg === 3">注册拒绝</span>
              <span class="pass-reject-retry" v-if="reg === 3" @click="gotoReg"
                >修改信息并重新申请</span
              >
            </div>
            <div class="first-text">填写应用基础信息</div>
            <div class="first-text">应用id：{{ formData.id }}</div>
            <div class="first-text">应用key：{{ formData.appKey }}</div>
            <div class="first-text">应用secret：{{ formData.appSecret }}</div>
          </div>
          <div class="right_first">
            <div class="first">
              部署
              <img src="@assets/question-mark.png" alt />
              <span class="pass-goto" v-if="deploy === 1" @click="gotoDep"
                >去填写</span
              >
              <span class="pass" v-if="deploy === 2">
                <div class="pass-round"></div>
                <div class="pass-text">已通过</div>
              </span>
              <span class="pass-reject" v-if="deploy === 3">部署拒绝</span>
              <span
                class="pass-reject-retry"
                v-if="deploy === 3"
                @click="gotoDep"
                >修改信息并重新申请</span
              >
            </div>
            <span class="first-text">获取应用key、进行应用部署</span>
          </div>
          <div class="pub">
            <div class="first">
              发布
              <img src="@assets/question-mark.png" alt />
              <span class="pass-goto" v-if="pub === 1" @click="gotoPub"
                >去填写</span
              >
              <span class="pass" v-if="pub === 2">
                <div class="pass-round"></div>
                <div class="pass-text">已通过</div>
              </span>
              <span class="pass-reject" v-if="pub === 3">发布拒绝</span>
              <span class="pass-reject-retry" v-if="pub === 3" @click="gotoPub"
                >修改信息并重新申请</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <DiyBoxLayout> </DiyBoxLayout> -->
    <!-- <DiyBoxLayout v-show="curTab === '3'"> </DiyBoxLayout> -->
  </div>
</template>

<script>
import DiyTabs from "@components/DiyTabs/index";
import TheAppForm from "../components/TheAppForm";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTenantListTable from "./components/TheTenantListTable";
import TheGroupListTable from "./components/TheGroupListTable";
import TheAppComponent from "./components/TheAppComponent";
import {
  getAppInfo,
  updateAppOnSale,
  updateAppOffSale,
  deployApp,
  appPurchaseGroupList,
  appPurchaseTenantList,
} from "@api/market";

export default {
  data() {
    return {
      fullscreenLoading: false,
      img: "",
      formData: {},
      roles: [],
      menuTree: [],
      active: ["round-gray", "round-gray", "round-gray"],
      pub: 0,
      deploy: 0,
      reg: 0,
      status: 0,
      groupTableData: [],
      tenantTableData: [],
      allType: [
        { id: "1", title: "应用详情" },
        { id: "2", title: "已购租户" },
        { id: "3", title: "已购集团" },
        { id: "4", title: "应用组件" },
      ],
      curTab: "1",
      isShow: false,
      timer: null,
      appId:'',
    };
  },
  components: {
    TheAppForm,
    TheTenantListTable,
    TheGroupListTable,
    DiyBoxLayout,
    DiyTabs,
    TheAppComponent,
  },
  created() {
    this.fullscreenLoading = true;
    this.loadAppAll();
  },
  mounted(){
    this.appId = this.$route.query.id
  },
  beforeDestroy() {
    clearTimeout();
    this.timer = null;
  },
  methods: {
    back() {
      this.$router.push({ name: "app-dev" });
    },
    handleReturn() {
      this.$router.push({ name: "app-dev" });
    },
    handleDeploy() {
      this.$router.push({
        name: "app-deploy",
        params: { appId: this.$route.query.id },
      });
    },
    handleRelease() {
      this.$router.push({
        name: "app-release",  
        params: {
          row: this.formData,
        },
      });
    },
    async handleUp() {
      let params = {
        ids: this.$route.query.id,
      };
      await updateAppOnSale([params.ids]).then((res) => {
        this.$message.success("上架成功");
        this.timer = setTimeout(() => {
          location.reload();
        }, 500);
      });
    },
    async handleDown() {
      let params = {
        ids: this.$route.query.id,
      };
      await updateAppOffSale([params.ids]).then((res) => {
        this.$message.success("下架成功");
        this.timer = setTimeout(() => {
          location.reload();
        }, 500);
      });
    },
    /*
      跳转注册
    */
    gotoReg() {
      this.$router.push({
        name: "app-register",
        params: { appId: this.formData.id, appInfo: this.formData },
      });
    },
    /*
      跳转部署
    */
    gotoDep() {
      this.$router.push({
        name: "app-deploy",
        params: { appId: this.formData.id },
      });
    },
    /*
      跳转发布
    */
    gotoPub() {
      this.$router.push({
        name: "app-release",
        params: {
          id: this.formData.id,
          roleList: this.roles,
          menuTree: this.menuTree,
          row: this.formData,
        },
      });
    },
    /*
      判断app状态
    */
    changeStatus(status) {
      switch (status) {
        case 0:
          this.reg = 1;
          this.deploy = 0;
          this.pub = 0;
          this.active[0] = "round-unactive";
          break;
        case 1:
          this.reg = 2;
          this.deploy = 1;
          this.pub = 0;
          this.active[0] = "round";
          this.active[1] = "round-unactive";
          break;
        case 2:
          this.reg = 3;
          this.deploy = 0;
          this.pub = 0;
          this.active[0] = "round-unactive";
          break;
        case 3:
          this.reg = 2;
          this.deploy = 1;
          this.pub = 0;
          this.active[0] = "round";
          this.active[1] = "round-unactive";
          break;
        case 4:
          this.reg = 2;
          this.deploy = 2;
          this.pub = 1;
          this.active[0] = "round";
          this.active[1] = "round";
          this.active[2] = "round-unactive";
          break;
        case 5:
          this.reg = 2;
          this.deploy = 3;
          this.pub = 0;
          this.active[0] = "round";
          this.active[1] = "round-unactive";
          break;
        case 6:
          this.reg = 2;
          this.deploy = 2;
          this.pub = 1;
          this.active[0] = "round";
          this.active[1] = "round";
          this.active[2] = "round-unactive";
          break;
        case 7:
          this.reg = 2;
          this.deploy = 2;
          this.pub = 2;
          this.active[0] = "round";
          this.active[1] = "round";
          this.active[2] = "round";
          break;
        case 8:
          this.reg = 2;
          this.deploy = 2;
          this.pub = 3;
          this.active[0] = "round";
          this.active[1] = "round";
          this.active[2] = "round-unactive";
          break;
      }
    },
    /**
     * 加载数据
     */
    loadAppAll() {
      let params = {
        id: this.$route.query.id,
      };
      getAppInfo(params).then((res) => {
        console.log("res", res);
        //获取数据
        let data = res.data.data;
        this.formData = data.app;
        this.status = data.app.status;
        this.roles = data.roleList;
        this.menuTree = data.menu;
        //数据处理
        let listToTree = function listToTree(oldArr) {
          oldArr.forEach((el) => {
            let parentId = el.parentId;
            if (el.roleList) {
              el.roleList = action(el.roleList);
            }
            if (parentId !== -1) {
              oldArr.forEach((ele) => {
                if (ele.id === parentId) {
                  ele.children.push(el);
                }
              });
            }
          });
          oldArr = oldArr.filter((el) => el.parentId === -1);
          return oldArr;
        };
        let traversal = function handleMenuTree(node, action) {
          if (node.children) {
            let childs = node.children;
            childs.forEach((el) => {
              traversal(el, action);
            });
          }
          return node;
        };
        let action = function handleRoleList(val) {
          let res = [];
          val.forEach((el) => {
            res.push(el.roleName);
          });
          return res;
        };
        this.menuTree = listToTree(this.menuTree);
        this.roles = action(this.roles);
        this.fullscreenLoading = false;
        this.changeStatus(this.formData.status);
      });
    },
    async setTenantListTable(id) {
      let appId = id;
      let params = {
        appId: appId,
        current: this.$refs.tenantTable.$refs.table.page.currentPage,
        size: this.$refs.tenantTable.$refs.table.page.pageSize,
      };
      let res = await appPurchaseTenantList(params);
      this.tenantTableData = res.data.data.records;
      this.$refs.tenantTable.$refs.table.page.total = res.data.data.total;
    },
    async setGroupListTable(id) {
      let appId = id;
      let params = {
        appId: appId,
        current: this.$refs.groupTable.$refs.table.page.currentPage,
        size: this.$refs.groupTable.$refs.table.page.pageSize,
      };
      let res = await appPurchaseGroupList(params);
      this.groupTableData = res.data.data.records;
      this.$refs.groupTable.$refs.table.page.total = res.data.data.total;
    },
    async setAppListTable(id) {
      let appId = id;
      let params = {
        appId: appId,
        current: this.$refs.groupTable.$refs.table.page.currentPage,
        size: this.$refs.groupTable.$refs.table.page.pageSize,
      };
      let res = await appPurchaseGroupList(params);
      this.groupTableData = res.data.data.records;
      this.$refs.groupTable.$refs.table.page.total = res.data.data.total;
    },
    handleShow(val) {
      this.isShow = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-between {
  height: 40px;
}
.conTable {
  width: 100%;
  height: 99%;
  margin-top: 4px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  padding: 14px 20px;

  &__option {
    margin-top: 60px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
  }
}
.con {
  width: 100%;
  margin-top: 4px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  padding: 14px 20px;

  &__option {
    margin-top: 60px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
  }
}
.f .title {
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: rgba(48, 49, 51, 1);
}
</style>

<style lang="scss" scoped>
.flex-between {
  height: 40px;
}
.con__option ::v-deep .el-button {
  width: 150px;
}
.con__option ::v-deep .el-button:hover {
  color: #fff !important;
  background-color: #1549d8e5 !important;
  border-color: #1549d8e5 !important;
  font-weight: 400 !important;
}
.body {
  display: flex;
  &-left {
    margin-right: 11px;
    .round {
      width: 12px;
      height: 12px;
      background: rgba(21, 74, 216, 1);
      border-radius: 50%;
      opacity: 1;
    }
    .round-unactive {
      width: 12px;
      height: 12px;
      background: rgba(245, 246, 252, 1);
      border: 1px solid rgba(21, 74, 216, 1);
      border-radius: 50%;
      opacity: 1;
    }
    .round-gray {
      width: 12px;
      height: 12px;
      background: rgba(245, 246, 252, 1);
      border: 1px solid rgba(235, 238, 245, 1);
      border-radius: 50%;
      opacity: 1;
    }
    .line {
      width: 2px;
      height: 130px;
      background: rgba(245, 246, 252, 1);
      margin-left: 5px;
    }
  }
  &-right {
    img {
      width: 12px;
      height: 12px;
      margin-left: 8px;
      margin-right: 30px;
    }
    .right_first {
      margin-top: -6px;
      margin-bottom: 33px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(48, 49, 51, 1);
      .first {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .pass-goto {
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: rgba(21, 74, 216, 1);
          cursor: pointer;
        }
        .pass-reject {
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
        }
        .pass-reject-retry {
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: rgba(21, 74, 216, 1);
          cursor: pointer;
          margin-left: 30px;
        }
        .pass {
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          width: 74px;
          height: 24px;
          background: #e0f3d7;
          border-radius: 15px;
          .pass-round {
            width: 8px;
            height: 8px;
            background: rgba(103, 194, 58, 1);
            border-radius: 50%;
            opacity: 1;
          }
          .pass-text {
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: rgba(48, 49, 51, 1);
          }
        }
      }
      .first-text {
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: rgba(96, 98, 102, 1);
      }
    }
  }
  .pub {
    margin-top: 92px;

    font-size: 16px;
    font-weight: 500;
    color: rgba(48, 49, 51, 1);
    .first {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .pass-goto {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: rgba(21, 74, 216, 1);
        cursor: pointer;
      }
      .pass {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        width: 74px;
        height: 24px;
        background: #e0f3d7;
        border-radius: 15px;
        .pass-round {
          width: 8px;
          height: 8px;
          background: rgba(103, 194, 58, 1);
          border-radius: 50%;
          opacity: 1;
        }
        .pass-text {
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: rgba(48, 49, 51, 1);
        }
      }
    }
    .first-text {
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: rgba(96, 98, 102, 1);
    }
  }
}
.flex-row {
  display: flex;
  flex-direction: row;
}
</style>
