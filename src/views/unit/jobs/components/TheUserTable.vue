<template>
  <div style="height:100%;">
    <DiyTable
      ref="table"
      :tableHead="tableHead"
      :options="options"
      :tableData="tableData"
      :hasTabs="true"
      @handleUpdate="loadData"
    >
      <template v-slot:slot-tabs>
        <DiyTabs
          ref="type-list"
          :tabList="allType"
          :curTab.sync="personTab"
        ></DiyTabs>
      </template>
      <template v-slot:buttons>
        <el-button v-show="isCreated == 2" type="text" @click="handleTransfer"
          >权限转移</el-button
        >
        <el-button type="text" @click="handleAnnounce">发布公告</el-button>
        <el-button type="text" @click="handleActive">账户开通</el-button>
        <el-dropdown trigger="click" style="margin:0 10px" placement="bottom">
          <el-button type="text"
            >人员操作<i class="el-icon-arrow-down el-icon--right"></i
          ></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              ><el-button type="text" @click="goImport"
                >人员导入</el-button
              ></el-dropdown-item
            >
            <el-dropdown-item
              ><el-button type="text" @click="exportUser"
                >人员导出</el-button
              ></el-dropdown-item
            >
            <el-dropdown-item
              ><el-button type="text" @click="exportMainUnit"
                >主单位导入</el-button
              ></el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="text" @click="changeDepart">变更部门</el-button>
        <!-- <el-button type="text" @click="handlePhones">补充手机号</el-button> -->
        <el-dropdown trigger="click" style="margin:0 10px" placement="bottom">
          <el-button type="text"
            >补充手机号<i class="el-icon-arrow-down el-icon--right"></i
          ></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              ><el-button type="text" @click="handlePhones"
                >单独补充手机号</el-button
              ></el-dropdown-item
            >
            <el-dropdown-item
              ><el-button type="text" @click="importPhones"
                >批量导入补充手机号</el-button
              ></el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="text" @click="handleDeleteUsers">移出单位</el-button>
        <el-button type="text" @click="handleCheckUser">查看申请</el-button>
        <el-button v-show="isCreated == 2" type="text" @click="handleUserEdit"
          >编辑信息</el-button
        >
        <el-button v-show="value1" type="text" @click="handleAddUser"
          >新增人员</el-button
        >
      </template>
      <template v-slot:operate="scope">
        <TheTableButton
          v-if="scope.row.isCreated !== 2 && scope.row.userId !== userId"
          :row="scope.row"
          :index="scope.index"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          @handleDistribution="handleDistribution"
          @handleDeleteUnit="handleDeleteUnit"
          @handleEditPhone="handleEditPhone"
          @handlePhone="handlePhone"
          @handleActive="handleActive"
          @handleInactive="handleInactive"
          @handleDepatDelte="handleDepatDelte"
          :btnStatus="btnStatus"
          :curDept="curDept"
          :curPos="curPos"
          :value="value1"
          :isShow="isShow"
        ></TheTableButton>
        <TheTableButtonTwo
          v-else-if="scope.row.isCreated === 2 && scope.row.userId == userId"
          @handleEdit="handleEdit"
          @updateAuthTransferDialog="updateAuthTransferDialog"
          :index="scope.index"
          :row="scope.row"
        ></TheTableButtonTwo>
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
      <template slot="footer-left">
        <el-switch class="switch" v-model="value1" inactive-text="显示下级">
        </el-switch>
      </template>
      <template v-slot:saleStatus="scope">
        <el-tag v-if="scope.row.status === 2" type="success">
          已开通
        </el-tag>
        <el-tag v-if="scope.row.status === 3" type="warning">
          未开通
        </el-tag>
      </template>
      <template v-slot:depart="scope">
        <div style="display:flex;justify-content:space-between">
          <div class="depart__text" v-if="scope.row.deptList.length != 0">
            {{ scope.row.deptList[0].agencyName }}
          </div>
          <div class="depart__number" v-if="scope.row.deptList.length > 0">
            <span
              class="depart__number__text"
              v-if="scope.row.deptList.length <= 99"
              >{{ scope.row.deptList.length }}</span
            >
            <span class="depart__number__text" v-else>99+</span>
          </div>
          <el-button
            size="mini"
            round
            v-if="scope.row.deptList.length != 0"
            @click="handleView(scope.row.deptList, scope.row)"
            >查看</el-button
          >
        </div>
      </template>
    </DiyTable>
    <template v-for="item in dialogShow">
      <TheEditDialog
        v-if="item.key === 'edit' && item.value"
        :curTab="personTab"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
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
      <TheChangeDepart
        v-if="item.key === 'depart' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheChangeDepart>
      <TheSuppleDialog
        v-if="item.key === 'supple' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheSuppleDialog>
      <TheDistributionDialog
        v-if="item.key === 'distribution' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
        :tableData="tableData"
        :index="index"
      ></TheDistributionDialog>
      <TheAnnounceDialog
        v-if="item.key === 'announce' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAnnounceDialog>
      <TheTransferDialog
        v-if="item.key === 'transfer' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheTransferDialog>
      <TheAddUserDialog
        v-if="item.key === 'addUser' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAddUserDialog>
      <TheDepartViewDialog
        v-if="item.key === 'departView' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleDepartDel="handleDepartDel"
        @closeDialog="handleCloseDialog"
      ></TheDepartViewDialog>
      <TheUserEditDialog
        v-if="item.key === 'editUser' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleDepartDel="handleDepartDel"
        @closeDialog="handleCloseDialog"
      ></TheUserEditDialog>
    </template>
  </div>
</template>

<script>
import DiyTabs from "@components/DiyTabs/index";
import { mapGetters, mapActions, mapState } from "vuex";
import {
  getUserListByDeptIdOrPosId,
  getUserListByDeptIdOrPosIdV3,
  deleteUserFromPositionOrDepartment,
  activeUser,
  getDeptAllPerson,
  getUserList,
  disableActiveUser,
  removeUsers,
  exportPersonData,
} from "@api/user";
import DiyTable from "@components/DiyTable/index";
import TheEditDialog from "./TheEditDialog";
import TheAddDialog from "./TheAddDialog";
import TheChangeDepart from "./department/TheChangeDepart";
import TheTableButton from "./TheTableButton";
import ThePhoneDialog from "./department/ThePhoneDialog";
import TheSuppleDialog from "./department/ThePhoneDialog";
import TheDistributionDialog from "./department/TheDistributionDialog";
import TheAnnounceIndex from "./department/TheAnnounceIndex";
import TheTransferDialog from "./TheTransferDialog";
import TheTableButtonTwo from "./TheTableButtonTwo";
import TheAddUserDialog from "./department/TheAddUserDialog";
import TheDepartViewDialog from "./department/TheDepartViewDialog";
import TheUserEditDialog from "./department/TheUserEditDialog";

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
          key: "test",
          value: false,
        },
        {
          key: "supple",
          value: false,
        },
        {
          key: "depart",
          value: false,
        },
        {
          key: "distribution",
          value: false,
        },
        {
          key: "transfer",
          value: false,
        },
        {
          key: "addUser",
          value: false,
        },
        {
          key: "departView",
          value: false,
        },
        {
          key: "editUser",
          value: false,
        },
      ],
      tableData: [],
      tableHead: [
        {
          prop: "userCode",
          label: "人员编码",
          width: "120",
        },
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
          prop: "idCard",
          label: "身份证",
          width: "160",
        },
        {
          type: "slot",
          name: "depart",
          prop: "depart",
          label: "所属部门",
          help:
            "数字代表用户所在部门个数，可点击查看按钮查看所有相关部门进行操作",
          width: "200",
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
          value: "移除",
          func: function(index, row) {
            _this.handleDelete(index, row);
          },
        },
      ],
      btnStatus: {},
      filterText: "",
      allType: [
        { id: "1", title: "全部" },
        { id: "2", title: "已开通" },
        { id: "3", title: "未开通" },
      ],
      personTab: "1",
      isActivate: 3,
      value1: true,
      isShow: false,
    };
  },
  components: {
    DiyTable,
    TheEditDialog,
    TheAddDialog,
    TheTableButton,
    DiyTabs,
    TheChangeDepart,
    ThePhoneDialog,
    TheSuppleDialog,
    TheDistributionDialog,
    TheAnnounceIndex,
    TheTransferDialog,
    TheTableButtonTwo,
    TheAddUserDialog,
    TheDepartViewDialog,
    TheUserEditDialog,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  updated() {},
  computed: {
    ...mapState("user", ["userName", "userId", "roleId", "isCreated"]),
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    value1() {
      this.loadData();
    },
    personTab(newVal, oldVal) {
      this.filterList(newVal);
    },
    getFilterText(val) {
      this.filterText = val;
      this.loadData(val);
    },
    curTab: {
      handler(val) {
        let { curTab, curDept, curPos } = this.$parent.$parent;
        this.btnStatus = {
          curTab: curTab,
          curDept: curDept,
          curPos: curPos,
        };
      },
      deep: true,
      immediate: true,
    },
    curDept: {
      handler(val) {
        if (val == -1) {
          this.isShow = true;
        } else {
          this.isShow = false;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  props: ["curTab", "curDept", "curPos"],
  methods: {
    ...mapActions("menu", ["updateAppMenu"]),
    loadData(val) {
      this.$refs.table.loading = true;
      let { curTab, curDept, curPos } = this.$parent.$parent;
      let deptId = "";
      let jobId = "";
      if (curTab === "1") {
        deptId = curDept;
        if (curDept === -1) {
          jobId = 0;
        }
      } else {
        jobId = curPos;
        if (curPos === -1) {
          deptId = 0;
        }
      }
      let currentPage = 1;
      let pageSize = 20;
      if (val) {
        pageSize = this.$refs.table.page.pageSize;
        this.$refs.table.page.currentPage = 1;
      } else {
        currentPage = this.$refs.table.page.currentPage;
        pageSize = this.$refs.table.page.pageSize;
      }
      // const { currentPage, pageSize } = this.$refs.table.page;
      if (this.value1) {
        let params = {
          current: currentPage,
          fuzzyVal: val,
          size: pageSize,
        };
        if (deptId == -1) {
          (params.tenantCode = this.curTenantCode),
            (params.isActivate = this.isActivate);
          getUserList(params).then((res) => {
            const { records, total } = res.data.data;
            records.forEach((el) => {
              if (el.phoneNumber.slice(0, 1) == "0") {
                el.phoneNumber = "";
              }
            });
            this.tableData = records;
            this.$parent.$parent.total = total;
            this.$refs.table.page.total = total;
            this.$refs.table.loading = false;
          });
        } else {
          params.deptId = deptId;
          params.isActivate = this.isActivate;
          console.log(params);
          getDeptAllPerson(params).then((res) => {
            const { records, total } = res.data.data;
            this.tableData = records;
            this.$parent.$parent.total = total;
            this.$refs.table.page.total = total;
            this.$refs.table.loading = false;
          });
        }
      } else {
        let params = {
          current: currentPage,
          size: pageSize,
          tenantCode: this.curTenantCode,
          count: 5,
          jobId: jobId,
          deptId: deptId,
          isActivate: this.isActivate,
          realName: this.filterText,
        };
        getUserListByDeptIdOrPosIdV3(params).then((res) => {
          const { records, total } = res.data.data;
          this.tableData = records;
          this.$parent.$parent.total = total;
          this.$refs.table.page.total = total;
          this.$refs.table.loading = false;
        });
      }
    },
    exportMainUnit() {
      this.$router.push({ name: "department-main-unit" });
    },
    async exportUser() {
      let list = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        list.push(element.id);
      });
      let params = {
        tenantCode: this.curTenantCode,
        list: list,
      };
      // if(list.length)
      exportPersonData(params).then((res) => {
        const data = res;
        const content = res.data;
        let fileName = "人员导出";
        const blob = new Blob([content], {
          type: "application/vnd.ms-excel;",
        });
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = fileName + ".xlsx";
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href);
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      });
    },
    filterList(val) {
      switch (val) {
        case "1":
          this.isActivate = 3;
          break;
        case "2":
          this.isActivate = 1;
          break;
        case "3":
          this.isActivate = 2;
          break;
      }
      this.$refs.table.initPage();
      this.loadData();
    },
    /**
     * 表格内按钮操作
     */
    handleEdit(index, row) {
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handlePhones() {
      let list = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        list.push(element);
      });
      if (list.length == 0) {
        this.$message.warning("请先选择人员再进行补充手机号操作");
      } else if (list.length !== 1) {
        this.$message.warning("请选择一个用户进行手机号补充");
      } else {
        // 补充手机号
        if (list[0].phoneNumber != "") {
          this.$message.warning("该人员已有手机号");
        } else {
          this.dialogShow.map((el) => {
            if (el.key === "supple") {
              el.value = true;
              el.sendData = list[0];
            }
          });
        }
      }
    },
    handleTransfer() {
      this.dialogShow.map((el) => {
        if (el.key == "transfer") {
          el.value = true;
        }
      });
    },
    updateAuthTransferDialog(row) {
      this.dialogShow.map((el) => {
        if (el.key == "transfer") {
          (el.value = true), (el.sendData = row);
        }
      });
    },
    async handleDelete(index, row) {
      let { curTab, curDept, curPos } = this.$parent.$parent;
      let jobId = curTab === 1 ? "" : curPos;
      let deptId = "";
      if (curTab === "1") {
        deptId = curDept;
      }
      let params = {
        jobId: jobId,
        deptId: deptId,
        userIds: row.id,
      };
      await deleteUserFromPositionOrDepartment(params).then((res) => {
        this.$message.success("移除人员成功");
        this.loadData();
      });
      this.updateAppMenu();
    },
    /**
     * 按钮操作
     */
    changeDepart(index, row) {
      let userId = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        userId.push(element.id);
      });
      if (userId.length == 0) {
        this.$message.warning("请先选择人员再进行变更部门操作");
      } else {
        this.dialogShow.map((el) => {
          if (el.key === "depart") {
            el.value = true;
            el.sendData = userId;
          }
        });
      }
    },
    handleAddUser() {
      this.dialogShow.map((el) => {
        if (el.key === "addUser") {
          el.value = true;
        }
      });
    },
    handleCheckUser() {
      this.$router.push({ name: "department-person-audit" });
    },
    goImport() {
      this.$router.push({
        name: "department-person-import",
      });
    },
    handleDistribution(index, row) {
      // 角色分配
      this.index = index;
      this.dialogShow.map((el) => {
        if (el.key === "distribution") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handleDeleteUnit(index, row) {
      // 移出单位
      let userIds = [row.userId];
      removeUsers(userIds).then((res) => {
        this.loadData();
        this.$message.success("移出单位成功");
      });
    },
    handleEditPhone(index, row) {
      // 修改手机号
      this.index = index;
      this.dialogShow.map((el) => {
        if (el.key === "phone") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handlePhone(index, row) {
      // 补充手机号
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
    handleInactive(index, row) {
      // 停用用户
      let params = {
        phones: row.phoneNumber,
      };
      let phones = [row.phoneNumber];
      disableActiveUser(phones).then((res) => {
        this.$message.success("停用成功");
        this.loadData();
      });
    },
    handleActive(index, row) {
      let ids = [];
      let letter = false;
      if (row) {
        ids.push(row.phoneNumber);
      } else {
        this.$refs.table.multipleSelection.forEach((element) => {
          if (element.status == 2) {
            letter = true;
          }
          ids.push(element.phoneNumber);
        });
      }
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一位用户");
      } else {
        if (letter) {
          this.$message.warning("所选用户中存在已开通的用户");
        } else {
          let params = ids;
          activeUser(params).then((res) => {
            this.$message.success("开通成功");
            this.loadData();
          });
        }
      }
    },
    // 编辑信息
    handleUserEdit(row) {
      let list = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        list.push(element);
      });
      if (list.length !== 1) {
        this.$message.warning("请选择一位用户");
      } else {
        this.dialogShow.map((el) => {
          if (el.key == "editUser") {
            el.value = true;
            el.sendData = list;
          }
        });
      }
    },
    // 发布公告
    handleAnnounce() {
      this.$router.push({ name: "department-person-announce" });
    },
    // 批量补充手机号
    importPhones() {
      this.$router.push({
        name: "department-tel-import",
      });
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
          // tenantCode: this.curTenantCode,
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
    handleView(row, list) {
      // 查看部门
      this.dialogShow.map((el) => {
        if (el.key === "departView") {
          el.value = true;
          el.sendData = row;
          el.list = list;
        }
      });
    },
    handleDepatDelte(row, index) {
      this.$confirm("此操作将该人员移出该部门, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let { curDept } = this.$parent.$parent;
          let deptId = "";
          deptId = curDept;
          let params = {
            deptId: deptId,
            userIds: row.id,
          };
          deleteUserFromPositionOrDepartment(params).then((res) => {
            this.$message.success("移除人员成功");
            this.loadData();
          });
          this.updateAppMenu();
        })
        .catch(() => {});
    },
    handleDepartDel(row, userId) {
      let { curDept } = this.$parent.$parent;
      let deptId = "";
      deptId = curDept;
      let params = {
        deptId: row.id,
        userIds: userId,
      };
      deleteUserFromPositionOrDepartment(params).then((res) => {
        this.$message.success("移除人员成功");
        this.loadData();
      });
      this.updateAppMenu();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
.depart__number {
  margin: 5px 1px 0 5px;
  width: fit-content;
  padding: 0 5px;
  height: 20px;
  margin-left: auto;
  border-radius: 10px;
  @include background_color("background_color13");
  color: white;
  &__text {
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    display: block;
    color: #fff;
    text-align: center;
  }
}
.depart__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 10px;
}
.btn {
  color: #0b3ed3;
  cursor: pointer;
}
.switch ::v-deep .el-switch__label.is-active {
  color: rgba(48, 49, 51, 1);
}
.switch ::v-deep .el-switch__label--left {
  color: #0b3ed3;
}
.switch {
  margin: 10px 0 0 10px;
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
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
