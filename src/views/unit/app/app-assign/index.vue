<template>
  <div class="base-layout">
    <DiyBoxLayout>
      <template v-slot:table
        ><DiyTable
          ref="table"
          :tableName="tableName"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          @handleUpdate="loadData"
          v-if="flag || searchShow"
        >
          <template v-slot:slot-title> </template>
          <!-- <template v-slot:buttons>
            <el-button type="text" @click="goAppCenter">
              应用市场
            </el-button>
          </template> -->
          <template v-slot:operate="scope">
            <TheTableButton
              :appId="scope.row.id"
              :row="scope.row"
              @handleAuth="handleAuth"
              @updateData="updateData"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <div class="app-icon">
              <div class="app-icon__img">
                <img
                  :src="
                    scope.row.icon
                      ? scope.row.icon
                      : require('@assets/default-head.svg')
                  "
                />
              </div>
            </div>
          </template>
          <template v-slot:type="scope">
            <div v-if="scope.row.appType === -1">-</div>
            <div v-else>
              {{ appType[scope.row.appType] }}
            </div>
          </template>
          <template v-slot:from="scope">
            <div>{{ scope.row.ifPurchase ? "自购" : "集团" }}</div>
          </template>
        </DiyTable>
        <div
          class="no-app"
          v-show="!flag && !searchShow"
        >
          <div class="no-app_img">
            <img src="@assets/no-app.svg" alt="" />
          </div>
          <div class="no-app_text">
            <div class="text-content" @click="goAppCenter">
              前往获取应用<i class="el-icon-right no-app-icon"></i>
            </div>
          </div>
        </div>
      </template>
    </DiyBoxLayout>

    <template v-for="item in dialogShow">
      <TheAppInfoDialog
        v-if="item.key === 'info' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAppInfoDialog>
      <TheAuthDialog
        v-if="item.key === 'auth' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAuthDialog>
    </template>
  </div>
</template>

<script>
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import DiyTable from "@components/DiyTable/index";
import TheTableButton from "./components/TheTableButton";
import TheAppInfoDialog from "../app-center/components/TheAppInfoDialog";
import TheAuthDialog from "./components/TheAuthDialog";
import { mapGetters, mapState, mapActions } from "vuex";
import { getCanUseAppIdList, getAppInfo } from "@api/market";
import { getDictItemObject } from "@utils/index";

export default {
  data() {
    let _this = this;
    return {
      flag: true,
      dialogShow: [
        {
          key: "info",
          value: false,
        },
        {
          key: "auth",
          value: false,
        },
      ],
      table: {},
      tableData: [],
      tableName: "单位应用中心",
      tableHead: [
        {
          type: "slot",
          name: "icon",
          label: "图标",
          align: "center",
          width: "80",
        },
        {
          prop: "appName",
          label: "应用名称",
          width: "200",
        },
        {
          prop: "tenantName",
          label: "开发商",
          width: "200",
        },
        {
          prop: "description",
          label: "应用描述",
          width: "300",
        },
        {
          type: "slot",
          name: "type",
          label: "类型",
          width: "120",
        },
        {
          prop: "version",
          label: "版本号",
          width: "120",
        },
        {
          type: "slot",
          name: "from",
          label: "来源",
          width: "120",
        },
        {
          prop: "createTime",
          label: "获取时间",
          minWidth: "180",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          width: "80",
          name: "operate",
        },
      ],
      options: {
        checkBox: true,
        order: true,
        defaultSort: { prop: "createdTime", order: "descending" },
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
      },
      roleList: [],
      approvalInfo: [],
      appType: [],
      filterText: "",
      searchShow: false,
    };
  },
  components: {
    DiyBoxLayout,
    TheTableButton,
    TheAppInfoDialog,
    TheAuthDialog,
    DiyTable,
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
    ...mapState("tenant", ["defaultTenantCode"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadData("search");
    },
  },
  created() {
    this.$nextTick(async () => {
      this.appType = await getDictItemObject(this.dict.APP_TYPE);
      await this.loadData();
    });
  },
  mounted() {},
  methods: {
    ...mapActions("menu", ["updateAppMenu"]),
    async loadData(str) {
      this.$refs.table.loading = true;
      let currentPage = 1;
      let pageSize = 20;
      if (str) {
        pageSize = this.$refs.table.page.pageSize;
        this.$refs.table.page.currentPage = 1;
      } else {
        currentPage = this.$refs.table.page.currentPage;
        pageSize = this.$refs.table.page.pageSize;
      }
      let params = {
        current: currentPage,
        size: pageSize,
        tenantId: this.curTenantCode,
        appName: this.filterText,
      };
      await getCanUseAppIdList(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
        if (this.tableData.length === 0) {
          this.flag = false;
        } else {
          this.flag = true;
        }
        if (this.filterText == "") {
          this.searchShow = false;
        } else {
          this.searchShow = true;
        }
      });
    },

    async loadAppAll(val) {
      let params = {
        id: val,
      };
      await getAppInfo(params).then((res) => {
        let data = res.data.data;
        this.roleList = data.roleList;
      });
    },

    /**
     * @method 退订回调：更新界面数据
     */
    updateData() {
      this.loadData();
      this.updateAppMenu();
    },
    /**
     * 按钮操作
     */
    goAppCenter() {
      this.$router.push({
        name: "app-center",
      });
    },
    /**分配应用权限 */
    async handleAuth(val) {
      await this.loadAppAll(val);
      this.dialogShow.map((el) => {
        if (el.key === "auth") {
          el.value = true;
          el.sendData = {
            roleName: this.roleList[0].roleName,
            roleList: this.roleList,
            roleId: this.roleList[0].id,
            appId: val,
          };
        }
      }, this);
    },

    handleCloseDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
          if (key === "info") {
            this.loadData();
          }
        }
      }, this);
    },

    goToTemplate() {
      this.$router.push({ name: "approvalTemplate" });
    },
    goToList() {
      this.$router.push({ name: "approvalList" });
    },
    goToDesign() {
      this.$router.push({ name: "approvalDesign" });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-icon {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &__img {
    width: 18px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
}

.title {
  font-size: 16px;
  line-height: 40px;
  font-weight: 600;
  color: rgba(48, 49, 51, 1);
  vertical-align: center;
}

.content-body {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  & > i {
    width: 340px;
  }
}

.no-app {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
</style>
