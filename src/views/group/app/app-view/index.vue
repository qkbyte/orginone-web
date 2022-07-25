<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div class="flex-column" style="height:100%">
      <DiyBoxLayout class="info" style="height:200px">
        <div class="info-btn-back" @click="handleReturn">
          <i class="el-icon-back"></i> 返回
        </div>
        <div class="info-main">
          <div class="info-main--left">
            <div class="info-main__icon">
              <img :src="formData.icon ? formData.icon  : require('@assets/default-head.svg')" />
            </div>
            <div class="info-main__con main-con">
              <div class="main-con__title">{{ formData.appName }}</div>
              <div class="main-con__desc">{{ formData.description }}</div>
              <div class="main-con__version">
                <span>{{ formData.version }}</span>
                <span>订阅到期时间：2022-02-02</span>
                <span>开发商：{{ formData.tenantName }}</span>
                <span>管理员：{{ formData.contactName }}</span>
                <span>联系方式：{{ formData.contact }}</span>
              </div>
            </div>
          </div>
          <!-- <div class="info-main__btn">
            <DiyButton class="btn-bg">
              <template v-slot:opt>
                <div class="diy-button" @click="handleAuth('auth')">
                  分配单位
                </div>
                <div class="diy-button" @click="handleDelete">退订</div>
              </template>
              <template v-slot:icon>
                <svg class="icon " aria-hidden="true">
                  <use :xlink:href="'#icon-more'"></use>
                </svg>
              </template>
            </DiyButton>
          </div> -->
        </div>
      </DiyBoxLayout>
      <DiyBoxLayout class="auth">
        <template v-slot:table>
          <DiyTable
            style="height:100%"
            ref="table"
            :hasTitle="true"
            :hasTab="false"
            :tableName="tableName"
            :tableHead="tableHead"
            :options="options"
            :tableData="tableData"
            @handleUpdate="handleChange"
          >
            <template slot="operate" slot-scope="scope">
              <TheTableButton
                :row="scope.row"
                @freashTableData="freashTableData"
              ></TheTableButton>
            </template>
          </DiyTable>
        </template>
      </DiyBoxLayout>
      <template v-for="item in dialogShow">
        <TheAuthDialog
          v-if="item.key === 'auth' && item.value"
          :key="item.key"
          :dialogShow="item"
          @updateList="handleChange"
          @closeDialog="handleCloseDialog"
        ></TheAuthDialog>
      </template>
    </div>
  </div>
</template>

<script>
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import DiyButton from "@components/DiyButton/index";
import { mapActions, mapGetters } from "vuex";
import {
  getAppInfo,
  unsubscribeGroupApp,
  distributeGroupAppTenantList,
} from "@api/market";
import DiyTable from "@components/DiyTable/index";
import TheTableButton from "./components/TheTableButton";
import TheAuthDialog from "./components/TheAuthDialog";
export default {
  data() {
    return {
      dialogShow: [
        {
          key: "view",
          value: false,
        },
        {
          key: "auth",
          value: false,
        },
      ],
      fullscreenLoading: false,
      img: "",
      formData: {},
      roles: [],
      menuTree: [],
      tableName: "已分配单位",
      tableHead: [
        {
          prop: "unitName",
          label: "单位名称",
          width: "300",
        },
        {
          prop: "socialCreditCode",
          label: "统一社会信用代码",
          width: "250",
        },
        {
          prop: "linkMan",
          label: "管理员",
          width: "200",
        },
        {
          prop: "linkPhone",
          label: "手机号",
          width: "200",
        },
        {
          prop: "createTime",
          label: "加入时间",
          width: "200",
        },
        {
          type: "slot",
          label: "操作",
          align: "center",
          name: "operate",
        },
      ],
      tableData: [],
      options: {
        checkBox: true,
        order: true,
        defaultSort: { prop: "createdTime", order: "descending" },
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
        page: {
          layout: "total, prev, pager, next, sizes",
          total: 0,
        },
      },
      filterText: "",
    };
  },
  components: {
    DiyBoxLayout,
    DiyButton,
    DiyTable,
    TheTableButton,
    TheAuthDialog,
  },
  created() {
    this.fullscreenLoading = true;
    this.loadAppAll();
    this.$nextTick(() => {
      this.loadData();
      this.$refs.table.loading = false;
    });
  },
  computed: {
    ...mapGetters("group", ["curGroupId"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadData();
    },
  },
  methods: {
    freashTableData(){
      this.loadData()
    },
    /**退订应用 */
    handleDelete() {
      let params = {
        appIds: [this.$route.query.id],
        groupid: this.curGroupId,
      };
      unsubscribeGroupApp(params).then((res) => {
        this.$message.success("退订成功");
        this.$emit("upadate");
      });
      this.handleReturn();
    },
    handleReturn() {
      this.$router.go(-1);
    },
    /*
      权限分配
    */
    handleAuth() {
      this.dialogShow.map((el) => {
        if (el.key === "auth") {
          el.value = true;
          el.sendData = {
            groupId: this.$route.query.groupId,
            appId: this.$route.query.appId,
          };
        }
      });
    },
    /**
     * 加载数据
     */
    loadAppAll() {
      let params = {
        id: this.$route.query.id,
      };
      getAppInfo(params).then((res) => {
        //获取数据
        const { app, roleList, menu } = res.data.data;
        this.formData = app;
        this.roles = roleList;
        this.menuTree = menu;
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
        this.fullscreenLoading = false;
      });
    },
    //获取组织表数据
    async loadData() {
      this.$refs.table.loading = true;
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        current: currentPage,
        size: pageSize,
        appId: this.$route.query.id,
        groupId: this.$route.query.groupId,
        unitName: this.filterText,
      };
      let res = await distributeGroupAppTenantList(params);
      const { records, total } = res.data.data;
      const { code } = res.data;
      if (code === 200) {
        this.tableData = records;
        this.$refs.table.page.total = total;
      }
      this.$refs.table.loading = false;
    },
    //当表格每页数量变化时
    handleChange() {
      this.loadData();
    },
  },
};
</script>

<style lang="scss" scoped>
.info {
  padding-top: 20px;
  padding-bottom: 30px;

  .info-btn-back {
    width: 60px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: rgba(144, 147, 153, 1);
  }

  .info-main {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;

    &--left {
      display: flex;
    }

    &__icon {
      width: 55px;
      height: 55px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    &__con {
      display: flex;
      flex-direction: column;
      margin-left: 20px;

      .main-con {
        &__title {
          height: 25px;
          font-size: 18px;
          font-weight: 600;
          line-height: 25px;
          color: rgba(48, 49, 51, 1);
        }

        &__desc {
          max-width: 80%;
          margin-top: 10px;
          font-size: 14px;
          font-weight: 400;
          line-height: 25px;
          color: rgba(96, 98, 102, 1);
        }

        &__version {
          margin-top: 8px;
          font-size: 12px;
          font-weight: 400;
          line-height: 17px;
          color: rgba(144, 147, 153, 1);

          span + span {
            margin-left: 10px;
          }
        }
      }
    }

    &__btn {
      margin-top: 20px;
      margin-right: 40px;
      font-size: 20px;
    }
  }
}

.btn-bg ::v-deep .diy-button-bg {
  background: white;
}

.auth {
  padding-top: 20px;
  padding-bottom: 30px;

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: rgba(48, 49, 51, 1);
  }
}
</style>
