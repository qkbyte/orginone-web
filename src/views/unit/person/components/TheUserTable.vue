<template>
  <div style="height:100%">
    <DiyTable
      ref="table"
      :tableHead="tableHead"
      :tableName="tableName"
      :options="options"
      :tableData="tableData"
      :hasTabs="true"
      @handleUpdate="loadData"
      @handleSortChange="handleSortChange"
      @handleCommand="handleCommand"
    >
      <template v-slot:buttons>
        <el-button type="text" @click="handleExport">导出</el-button>
        <el-button type="text" @click="handleActive">账户开通</el-button>
        <el-button type="text" @click="goImport">人员导入</el-button>
        <el-button type="text" @click="handlePhones">补充手机号</el-button>
        <el-button type="text" @click="handleDeleteUsers">移出单位</el-button>
        <el-button type="text" @click="handleCheckUser">查看申请</el-button>
      </template>

      <template v-slot:slot-tabs>
        <DiyTabs
          ref="type-list"
          :tabList="allType"
          :curTab.sync="curTab"
        ></DiyTabs>
      </template>

      <template v-slot:operate="scope">
        <template v-if="scope.row.roleId !== '1' && roleId !== '3'">
          <TheTableButton
            v-if="scope.row.userId !== userId && scope.row.isCreated !== 2"
            :index="scope.index"
            :row="scope.row"
            @handleEdit="handleEdit"
            @handleDelete="handleDelete"
            @handleEditPhone="handleEditPhone"
            @handlePhone="handlePhone"
            @handleActive="handleActive"
            @handleInactive="handleInactive"
          ></TheTableButton>
          <TheTableButtonTwo
            @updateAuthTransferDialog="updateAuthTransferDialog"
            :index="scope.index"
            :row="scope.row"
            v-else-if="scope.row.isCreated === 2 && scope.row.userId == userId"
          ></TheTableButtonTwo>
        </template>
      </template>

      <template v-slot:icon="scope">
        <i :class="scope.row.source"></i>
      </template>
      <template v-slot:roleName="scope">
        <template v-if="scope.row.isCreated === 2"
          >超级管理员</template
        >
        <template v-else>{{ scope.row.roleName }}</template>
      </template>
      <template v-slot:gender="scope">
        <div v-if="scope.row.gender === 1">男</div>
        <div v-else>女</div>
      </template>

      <template v-slot:saleStatus="scope">
        <el-tag v-if="scope.row.status === 2" type="success">
          已开通
        </el-tag>
        <el-tag v-if="scope.row.status === 3" type="warning">
          未开通
        </el-tag>
      </template>
    </DiyTable>

    <template v-for="item in dialogShow">
      <TheEditDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
        :tableData="tableData"
        :index="index"
      ></TheEditDialog>
      <TheAddDialog
        v-if="item.key === 'add' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAddDialog>
      <ThePhoneDialog
        v-if="item.key === 'phone' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></ThePhoneDialog>
      <TheSuppleDialog
        v-if="item.key === 'supple' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheSuppleDialog>
      <TheTransferDialog
        v-if="item.key === 'transfer' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheTransferDialog>
    </template>
  </div>
</template>

<script>
import DiyTabs from "@components/DiyTabs/index";
import TheTransferDialog from "./TheTransferDialog";
import TheTableButton from "./TheTableButton";
import { mapGetters, mapState } from "vuex";
import {
  getUserList,
  tenantRemoveUser,
  removeUsers,
  resetPassword,
  exportExcel,
  exportDownload,
  getPersonInfoExport,
  getTenantPersonAll,
  activeUser,
  disableActiveUser,
} from "@api/user";
import DiyTable from "@components/DiyTable/index";
import TheEditDialog from "./TheEditDialog";
import TheAddDialog from "./TheAddDialog";
import { getTenantInfoDetailByCode, tenantAuthTransfer } from "@api/tenant";
import TheTableButtonTwo from "./TheTableButtonTwo";
import ThePhoneDialog from "./ThePhoneDialog";
import TheSuppleDialog from "./TheSuppleDialog";

export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "edit",
          value: false,
        },
        {
          key: "add",
          value: false,
        },
        {
          key: "phone",
          value: false,
        },
        {
          key: "supple",
          value: false,
        },
        {
          key: "phones",
          value: false,
        },
        {
          key: "transfer",
          value: false,
        },
      ],
      tableData: [],
      tableName: "人员列表",
      tableHead: [
        {
          prop: "realName",
          label: "姓名",
          width: "120",
          sortable: "custom",
        },
        {
          type: "slot",
          name: "roleName",
          prop: "roleName",
          label: "角色",
          width: "120",
        },
        {
          prop: "phoneNumber",
          label: "手机号",
          width: "160",
        },
        {
          prop: "userEmail",
          label: "邮箱",
          width: "200",
        },
        {
          type: "slot",
          name: "saleStatus",
          prop: "saleStatus",
          label: "状态",
          width: "100",
        },
        {
          prop: "userAddress",
          label: "地址",
          minWidth: "200",
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
      tableButton: [
        {
          key: "edit",
          type: "text",
          icon: "el-icon-edit",
          value: "编辑",
          func: function(index, row) {
            _this.handleEdit(index, row);
          },
        },
        {
          key: "table-del",
          type: "text",
          icon: "el-icon-delete",
          value: "移出单位",
          func: function(index, row) {
            _this.handleDelete(index, row);
          },
        },
      ],

      index: 999999,
      filterText: "",
      linkMan: "",
      flag: 0,
      authTransferDialog: false,
      transferPerson: "",
      searchInput: "",
      listData: [],
      listOrigionData: [],
      loading: false,
      records: true,
      allType: [
        { id: "1", title: "全部" },
        { id: "2", title: "已开通" },
        { id: "3", title: "未开通" },
      ],
      curTab: "1",
      isActivate: 3,
    };
  },
  components: {
    DiyTable,
    TheEditDialog,
    TheAddDialog,
    ThePhoneDialog,
    TheSuppleDialog,
    TheTableButton,
    TheTableButtonTwo,
    DiyTabs,
    TheTransferDialog,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
    this.getUnitInfo();
  },
  mounted() {},
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
    ...mapState("user", ["userName", "userId", "roleId"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadData();
    },
    authTransferDialog(val) {
      if (!val) {
        this.searchInput = "";
      }
    },
    curTab(newVal, oldVal) {
      this.filterList(newVal);
    },
  },
  methods: {
    async loadData() {
      this.$refs.table.loading = true;
      let { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        current: currentPage,
        size: pageSize,
        tenantCode: this.curTenantCode,
        fuzzyVal: this.filterText,
        flag: this.flag,
        isActivate: this.isActivate,
      };
      await getUserList(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
      if (this.tableData.length == 0 && this.$refs.table.page.total !== 0) {
        this.$refs.table.page.currentPage -= 1;
        this.loadData();
      }
    },
    handleSearch() {
      if (this.searchInput === "") {
        this.listData = this.listOrigionData;
      } else {
        this.listData = [];
        for (let i of this.listOrigionData) {
          if (i.realName.includes(this.searchInput)) {
            this.listData.push(i);
          }
        }
      }
    },
    getUnitInfo() {
      let params = {
        tenantCode: this.curTenantCode,
      };
      getTenantInfoDetailByCode(params).then((res) => {
        this.linkMan = res.data.data.linkMan;
      });
    },
    authTransferClose() {
      this.authTransferDialog = false;
      this.loadData();
    },
    updateAuthTransferDialog(row) {
      this.dialogShow.map((el) => {
        if (el.key == "transfer") {
          (el.value = true), (el.sendData = row);
        }
      });
    },
    /*
     * 加载人员不分页数据
     */
    loadAuthData() {
      this.loading = true;
      let params = {
        tenantCode: this.curTenantCode,
      };
      getTenantPersonAll(params).then((res) => {
        this.listOrigionData = res.data.data;
        this.listData = res.data.data;
        this.loading = false;
      });
    },
    /*
     * @method 权限转移
     */
    handleAuthTansfer() {
      if (this.transferPerson === "")
        return this.$message.warning("请先选择一位用户");
      let params = {
        userId: this.transferPerson,
      };
      tenantAuthTransfer(params)
        .then((res) => {
          console.log(res);
          this.$message.success("权限转移成功");
          this.authTransferDialog = false;
          this.loadData();
        })
        .catch((error) => {
          this.$message.error("权限转移失败");
          this.authTransferDialog = false;
          this.loadData();
        });
    },
    handleInactive(index, row) {
      let params = {
        phones: row.phoneNumber,
      };
      disableActiveUser(params).then((res) => {
        this.$message.success("停用成功");
        this.loadData();
      });
    },
    handleActive(index, row) {
      let ids = [];
      if (row) {
        ids = row.phoneNumber;
      } else {
        this.$refs.table.multipleSelection.forEach((element) => {
          ids.push(element.phoneNumber);
        });
      }
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一位用户");
      } else {
        let params;
        if (row) {
          params = {
            phones: ids,
          };
        } else {
          params = {
            phones: ids.join(","),
          };
        }

        activeUser(params).then((res) => {
          this.$message.success("开通成功");
          this.loadData();
        });
      }
    },
    /**
     * 按钮操作
     */
    handleCheckUser() {
      this.$router.push({ name: "user-check" });
    },
    handleDeleteUsers() {
      let idusers = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        idusers.push(element.userId);
      });
      if (idusers.length === 0) {
        return this.$message.warning("请至少选择一行用户信息");
      }
      this.$confirm("此操作将永久移出该人员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let userIds = idusers;
          let total = this.$refs.table.page.total;
          let pageSize = this.$refs.table.page.pageSize;
          let current = this.$refs.table.page.currentPage;
          removeUsers(userIds).then((res) => {
            this.$message.success("移出单位成功");
            this.loadData();
          });
        })
        .catch(() => {
          return;
        });
    },
    handleExport(type) {
      let data = [];
      if (type === 2) {
        if (this.$refs.table.multipleSelection.length == 0) {
          this.$message.warning("请至少选择一行用户信息");
          return;
        }
        this.$refs.table.multipleSelection.forEach((element) => {
          data.push(element.id);
        });
      }
      let params = {
        ids: data.join(","),
      };
      exportExcel(params).then((res) => {
        const content = res.data;
        const blob = new Blob([content], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        var date =
          new Date().getFullYear() +
          "" +
          (new Date().getMonth() + 1) +
          "" +
          new Date().getDate();
        const fileName = date + "_userInfo" + ".xls";
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      });
    },

    handleEdit(index, row) {
      this.index = index;
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handleEditPhone(index, row) {
      this.index = index;
      this.dialogShow.map((el) => {
        if (el.key === "phone") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handlePhone(index, row) {
      if (row.phoneNumber != "") {
        this.$message.warning("该人员已有手机号");
      } else {
        this.index = index;
        this.dialogShow.map((el) => {
          if (el.key === "supple") {
            el.value = true;
            el.sendData = row;
          }
        });
      }
    },
    handleDelete(index, row) {
      let userIds = [row.userId];
      removeUsers(userIds).then((res) => {
        this.loadData();
        this.$message.success("移出单位成功");
      });
    },
    // 批量补充手机号
    handlePhones() {
      this.$router.push({
        name: "phone-import",
      });
    },
    /*
     *  排序改变
     */
    handleSortChange(e) {
      if (e.order === "ascending") {
        this.flag = 0;
        this.loadData();
      } else if (e.order === "descending") {
        this.flag = 1;
        this.loadData();
      }
    },
    /*
     *  导出方法
     */
    async handleExport() {
      let selected = [];
      if (this.records) {
        this.$refs.table.multipleSelection.forEach((item) => {
          console.log(item);
          selected.push(item.id);
        });
        if (selected === undefined || selected.length === 0) {
          return this.$message.warning("至少选择一条租户信息");
        }
      }
      selected = selected.join(",");
      this.records = true;
      getPersonInfoExport(selected).then((res) => {
        const content = res.data;
        const blob = new Blob([content], {
          type: "application/vnd.ms-excel;",
        });
        const fileName = "导出租户数据.xls";
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      });
    },
    goImport() {
      this.$router.push({
        name: "person-import",
      });
    },
    handleCommand(e) {
      this.records = false;
      this.handleExport();
    },
    /*
    筛选框点击操作
    */
    filterList(val) {
      switch (val) {
        case "1":
          this.isActivate = 3;
          break;
        case "2":
          this.isActivate = 1;
          break;
        case "3":
          this.isActivate = 0;
          break;
      }
      this.$refs.table.initPage();
      this.loadData();
    },
    // 关闭dialog
    handleCloseDialog(val) {
      this.dialogShow.map((el) => {
        if (el.key == val) {
          el.value = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  color: #0b3ed3;
  cursor: pointer;
}
.table-header {
  display: flex;
  height: 40px;
  justify-content: space-between;

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: rgba(48, 49, 51, 1);

    span {
      margin-left: 10px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: rgba(192, 196, 204, 1);
    }
  }

  &__btn {
    display: flex;
    flex-direction: row;

    div + div {
      margin-left: 15px;
    }
  }
}

.table-notice {
  height: 30px;
  border: 1px solid rgba(21, 74, 216, 0.2);
  border-radius: 4px;
  padding: 5px 25px;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(96, 98, 102, 1);

  i {
    color: #154ad8;
  }
}
.user-TheUserTable {
  .importDialog {
    .el-button {
      width: 100%;
    }
  }
}

.authTransfer {
  overflow: auto;
  border: 1px solid #ebeef5;
  padding: 0 15px 10px 15px;
  max-height: 280px;
  &_son {
    margin-top: 10px;
  }
}

.dialog-footer {
  margin-top: 20px;
  text-align: end;
}

.search-list__search {
  margin-bottom: 20px;
}
</style>

<style lang="scss">
.user-TheUserTable {
  .upload-demo {
    .el-upload {
      width: 100%;
    }
  }
}
</style>
