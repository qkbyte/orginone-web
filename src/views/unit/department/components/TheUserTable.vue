<template>
  <div style="height:100%;">
    <DiyTable
      ref="table"
      :tableHead="tableHead"
      :options="options"
      :tableData="tableData"
      :tableName="curTenant.name"
      @handleUpdate="loadData"
    >
      <template v-slot:operate="scope">
        <TheTableButton
          :row="scope.row"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          :btnStatus="btnStatus"
          :curDept="curDept"
          :curPos="curPos"
        ></TheTableButton>
      </template>
      <template v-slot:icon="scope">
        <i :class="scope.row.source"></i>
      </template>
      <template v-slot:roleName="scope">
        <template v-if="scope.row.admin === 1"
          >超级管理员</template
        >
        <template v-else>{{ scope.row.roleName }}</template>
      </template>
      <template v-slot:gender="scope">
        <div v-if="scope.row.gender === 1">男</div>
        <div v-else>女</div>
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
      <TheAddDialog
        v-if="item.key === 'add' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAddDialog>
    </template>
  </div>
</template>

<script>
import { mapGetters,mapActions } from "vuex";
import {
  getUserListByDeptIdOrPosId,
  getUserListByDeptIdOrPosIdV2,
  deleteUserFromPositionOrDepartment,
} from "@api/user";
import DiyTable from "@components/DiyTable/index";
import TheEditDialog from "./TheEditDialog";
import TheAddDialog from "./TheAddDialog";
import TheTableButton from "./TheTableButton";

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
          key: "test",
          value: false,
        },
      ],
      tableData: [],
      tableHead: [
        {
          prop: "realName",
          label: "姓名",
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
    };
  },
  components: {
    DiyTable,
    TheEditDialog,
    TheAddDialog,
    TheTableButton,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted() {},
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadData();
    },
    curTab:{
      handler(val){
        let { curTab, curDept, curPos } = this.$parent.$parent;
        this.btnStatus = {
          curTab: curTab,
          curDept: curDept,
          curPos: curPos,
        };
      },
      deep:true,
      immediate:true
    }
  },
  props: ["curTab", "curDept","curPos"],
  methods: {
    ...mapActions("menu", ["updateAppMenu"]),
    loadData() {
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
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        current: currentPage,
        size: pageSize,
        tenantCode: this.curTenantCode,
        count: 5,
        jobId: jobId,
        deptId: deptId,
        fuzzyVal: this.filterText,
      };
      getUserListByDeptIdOrPosIdV2(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$parent.$parent.total = total;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
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
    async handleDelete(index, row) {
      let { curTab, curDept, curPos } = this.$parent.$parent;
      console.log("curTab:"+curTab);
      console.log("curDept:"+curDept);
      let jobId = curTab === 1 ? "" : curPos;
      let deptId = "";
      if (curTab === "1") {
        deptId = curDept;
      }
      console.log("deptId:"+deptId);
      let params = {
        jobId: jobId,
        deptId: deptId,
        userIds: row.id,
      };
      await deleteUserFromPositionOrDepartment(params).then((res) => {
        this.$message.success("移除人员成功");
        this.loadData();
      });
      this.updateAppMenu()
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
</style>
