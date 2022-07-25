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
          ><template v-slot:buttons>
            <el-button type="text" @click="handleDeleteRoles">删除</el-button>
            <el-button type="text" @click="handleAddUser">新增</el-button>
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              :index="scope.index"
              :row="scope.row"
              @handleEdit="handleEdit"
              @handleDelete="handleDelete"
              @handleAuth="handleAuth"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>

    <template v-for="item in dialogShow">
      <TheAuthDialog
        v-if="item.key === 'auth' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAuthDialog>
      <TheEditDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleUpdate="loadData"
        @closeDialog="handleCloseDialog"
      ></TheEditDialog>
      <TheAddDialog
        v-if="item.key === 'add' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleUpdate="loadData"
        @closeDialog="handleCloseDialog"
      ></TheAddDialog>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getRoleListById, deleteRolesByRoleId } from "@api/role";
import DiyTable from "@components/DiyTable/index";
import TheEditDialog from "./components/TheEditDialog";
import TheAddDialog from "./components/TheAddDialog";
import TheAuthDialog from "./components/TheAuthDialog";
import DiyTitle from "@components/DiyTitle/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./components/TheTableButton";

export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "auth",
          value: false,
        },
        {
          key: "edit",
          value: false,
        },
        {
          key: "add",
          value: false,
        },
      ],
      tableName: "角色列表",
      tableData: [],
      tableHead: [
        {
          prop: "id",
          label: "id",
          width: "120",
        },
        {
          prop: "roleName",
          label: "角色名称",
          width: "120",
        },
        {
          prop: "roleDescription",
          label: "角色描述",
          width: "300",
        },
        {
          prop: "roleAlias",
          label: "角色标识",
          width: "200",
        },
        {
          prop: "updateTime",
          label: "更新时间",
          width: "180",
        },
        {
          prop: "createTime",
          label: "创建时间",
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
        defaultSort: { prop: "createTime", order: "descending" },
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
      },
      filterText: "",
    };
  },
  components: {
    DiyTable,
    TheEditDialog,
    TheAddDialog,
    TheAuthDialog,
    DiyBoxLayout,
    DiyTitle,
    TheTableButton,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted() {},
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
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
    loadData() {
      this.$refs.table.loading = true;
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        current: currentPage,
        size: pageSize,
        roleName: this.filterText,
      };
      getRoleListById(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
    },
    /**
     * 按钮操作
     */
    handleAddUser() {
      this.dialogShow.map((el) => {
        if (el.key === "add") {
          el.value = true;
        }
      });
    },

    handleDeleteRoles() {
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一个角色");
      }else{
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            ids: ids.join(","),
          };
          deleteRolesByRoleId(params).then((res) => {
            this.$message.success("删除角色成功");
            this.loadData();
          });
        }).catch(() => {
          return        
        });
      }
    },

    /**
     * 表格内按钮操作
     */
    handleAuth(index, row) {
      this.dialogShow.map((el) => {
        if (el.key === "auth") {
          el.value = true;
          el.sendData = row;
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
      let params = {
        ids: row.id,
      };
      deleteRolesByRoleId(params).then((res) => {
        this.$message.success("删除角色成功");
        this.loadData();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
