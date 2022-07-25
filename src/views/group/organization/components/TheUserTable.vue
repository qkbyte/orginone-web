<template>
  <div>
    <DiyTable
      ref="table"
      :tableHead="tableHead"
      :options="options"
      :tableData="tableData"
      :tableName="'单位列表'"
      @handleUpdate="loadData"
    >
      <template v-if="this.$parent.$parent.curTab == 1" slot="footer-left">
        <el-switch
          class="switch"
          v-model="value1"
          inactive-text="仅显示直属下级"
        >
        </el-switch>
      </template>
      <template v-slot:operate="scope">
        <TheTableButton
          :row="scope.row"
          :user="user"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          :btnStatus="btnStatus"
        ></TheTableButton>
      </template>
    </DiyTable>

    <template v-for="item in dialogShow">
      <TheEditDialog
        v-if="item.key === 'edit' && item.value"
        :curTab="curTab"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheEditDialog>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {
  getUserListBygroupIdOrPosId,
  deleteUserFromPositionOrDepartment,
} from "@api/user";
import {
  getTenantListBelowGroup,
  groupGetNoProperty,
  getPropertiesUnitList,
  removeDistributedProperties,
  groupRemoveTenant,
  getAllTenantListFromGroup,
} from "@api/group";
import DiyTable from "@components/DiyTable/index";
import TheEditDialog from "./TheEditDialog";
import TheTableButton from "./TheTableButton";
import { getUserInfoById } from "@api/user";
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
      ],
      tableData: [],
      tableHead: [
        {
          prop: "unitName",
          label: "单位名称",
          width: "240",
        },
        {
          prop: "linkMan",
          label: "管理员",
          width: "120",
        },
        {
          prop: "linkPhone",
          label: "联系方式",
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
      btnStatus: {},
      user: {},
      value1: false,
      filterText: "",
    };
  },
  components: {
    DiyTable,
    TheEditDialog,
    TheTableButton,
  },
  created() {
    // this.$nextTick(() => {
    //   this.loadData();
    // });
  },
  mounted() {},
  watch: {
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
    value1(val) {
      this.loadData();
    },
    getFilterText(val) {
      this.filterText = val;
      this.loadData("search");
    },
  },
  computed: {
    ...mapGetters("group", ["curGroup", "curGroupId"]),
    ...mapState("user", ["userId"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  mounted() {
    this.getUserInfor();
  },
  props: ["curTab"],
  methods: {
    async getUserInfor() {
      let info = await getUserInfoById({
        id: this.userId,
      });
      this.user = info.data.data;
    },
    loadData(str) {
      this.$refs.table.loading = true;
      let { curTab, curDept, curPos } = this.$parent.$parent;
      let groupId = "";
      let currentPage = 1;
      let pageSize = 20;
      if (str) {
        pageSize = this.$refs.table.page.pageSize;
        this.$refs.table.page.currentPage = 1;
      } else {
        currentPage = this.$refs.table.page.currentPage;
        pageSize = this.$refs.table.page.pageSize;
      }
      if (curTab === "1") {
        groupId = curDept;
        if (!this.value1) {
          let params = {
            current: currentPage,
            size: pageSize,
            groupId: groupId,
            name: this.filterText,
          };
          getAllTenantListFromGroup(params).then((res) => {
            const { records, total } = res.data.data;
            this.tableData = records;
            this.$refs.table.page.total = total;
            this.$refs.table.loading = false;
          });
        } else {
          let params = {
            current: currentPage,
            size: pageSize,
            groupId: groupId,
            name: this.filterText,
          };
          getTenantListBelowGroup(params).then((res) => {
            const { records, total } = res.data.data;
            this.tableData = records;
            this.$refs.table.page.total = total;
            this.$refs.table.loading = false;
          });
        }
      } else {
        if (curPos === "-1") {
          let params = {
            groupId: this.curGroup.groupId,
          };
          groupGetNoProperty(params).then((res) => {
            let data = res.data.data;
            this.tableData = data;
            this.$refs.table.loading = false;
          });
        } else {
          let params = {
            propertiesId: curPos,
            current: currentPage,
            size: pageSize,
          };
          getPropertiesUnitList(params).then((res) => {
            let data = res.data.data.records;
            this.tableData = data;
            this.$parent.$parent.total = res.data.data.total;
            this.$refs.table.page.total = res.data.data.total;
            this.$refs.table.loading = false;
          });
        }
      }
    },

    /**
     * 表格内按钮操作
     */
    handleCloseDialog(key, val) {
      console.log("key", key);
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
          if (key == "edit") {
            this.$parent.$parent.deptTreeList = [];
            this.$parent.$parent.$refs.deptTree.loadData();
            this.$parent.$parent.$refs.table.loadData();
          }
        }
      });
    },
    handleEdit(index, row) {
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handleDelete(index, row) {
      let { curTab, curDept, curPos } = this.$parent.$parent;
      console.log("curtab", curTab);
      if (curTab === "2") {
        this.$confirm("此操作将永久移出此单位, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let params = {
              propertiesId: curPos,
              tenantId: row.tenantId,
            };
            removeDistributedProperties(params).then((res) => {
              this.$message.success("移除单位成功");
              this.loadData();
            });
          })
          .catch(() => {
            return;
          });
      } else {
        this.$confirm("此操作将永久移出此单位, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let params = {
              groupId: curDept,
              tenantIds: row.tenantId,
              sourceGroupId: this.curGroupId,
            };
            groupRemoveTenant(params).then((res) => {
              this.$message.success("移除单位成功");
              this.loadData();
              this.$parent.$parent.deptTreeList = [];
              this.$parent.$parent.$refs.deptTree.loadData();
            });
          })
          .catch(() => {
            return;
          });
      }
    },
    closeDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
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
.switch ::v-deep .el-switch__label.is-active {
  color: rgba(48, 49, 51, 1);
}
.switch ::v-deep .el-switch__label--left {
  color: #0b3ed3;
}
.switch {
  margin: 10px 0 0 10px;
}
</style>
