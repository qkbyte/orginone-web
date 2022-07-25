<template>
  <div class="base-layout">
    <DiyBoxLayout class="flex-column">
      <template v-slot:tabs>
        <div class="group-select">
          <TheGroupSelect style="width:fit-content" @handleUpdate="handleUpdate"></TheGroupSelect>
        </div>
      </template>
      <template v-slot:table>
        <DiyTable
          ref="table"
          :tableName="tableName"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          @handleUpdate="loadData"
          v-show="flag || searchShow"
        >
          <!-- <template v-slot:buttons>
            <el-button type="text" @click="goAppCenter">
              应用市场
            </el-button>
          </template> -->
          <template v-slot:operate="scope">
            <TheTableButton
              :appId="scope.row.id"
              :groupId="curGroupId"
              @handleAuth="handleAuth"
              @upadate="handleUpdate"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <div class="app-icon">
              <div class="app-icon__img">
                <img :src="scope.row.icon ? scope.row.icon : require( '@assets/default-head.svg' )" />
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
            <div v-if="scope.row.ifPurchase">
              自购
            </div>
            <div v-else>
              {{ scope.row.groupName }}
            </div>
          </template>
        </DiyTable>
        <div class="no-app" v-show="!flag && !searchShow">
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
        @handleUpdate="loadData"
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
import TheGroupSelect from "../../components/TheGroupSelectMenber";
import { mapGetters, mapActions } from "vuex";
import { getManageGroupList } from "@api/group";
import {
  getGroupAppList,
  getOnSaleGroupAppList,
  getAppInfo,
} from "@api/market";
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
      tableName: "集团应用中心",
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
      groupListCount: "",
      appType: [],
      filterText: "",
    };
  },
  components: {
    DiyBoxLayout,
    TheTableButton,
    DiyTable,
    TheAppInfoDialog,
    TheAuthDialog,
    TheGroupSelect,
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
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
  created() {
    this.$nextTick(async () => {
      this.appType = await getDictItemObject(this.dict.APP_TYPE);
      this.setGroupListCount();
      if (this.appListStatus) {
        this.table = this.$refs.tableList;
      } else {
        this.table = this.$refs.tableItem;
      }
      this.loadData();
    });
  },
  mounted() {},
  methods: {
    ...mapActions("menu", ["updateAppMenu"]),
    setGroupListCount() {
      getManageGroupList({ type: 0 }).then((res) => {
        this.groupListCount = res.data.data.length;
      });
    },
    handleSwitch() {
      this.toggleAppListStatus();
      if (this.appListStatus) {
        this.table = this.$refs.tableList;
      } else {
        this.table = this.$refs.tableItem;
      }
    },

    loadData(item) {
      this.$refs.table.loading = true;
      if (item) {
        this.curGroup = item;
      }
      let params = {
        current: this.$refs.table.page.currentPage,
        size: this.$refs.table.page.pageSize,
        groupId: this.curGroupId,
        appName: this.filterText,
      };
      getGroupAppList(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        if (this.tableData.length === 0) {
          this.flag = false;
        }else {
          this.flag = true;
        }
        if (this.filterText == "") {
          this.searchShow = false;
        } else {
          this.searchShow = true;
        }
        this.$refs.table.loading = false;
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
     * 按钮操作
     */
    goAppCenter() {
      this.$router.push({
        name: "group-app-center",
        query: {
          groupId: this.curGroupId,
        },
      });
    },

    /**
     * @method 退订集团应用：更新界面数据
     */
    handleUpdate() {
      this.loadData();
      this.updateAppMenu();
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
            groupId: this.curGroupId,
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
  },
};
</script>

<style lang="scss" scoped>
.group-select {
  margin-left: -20px;
  margin-bottom: 10px;
}

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
</style>
