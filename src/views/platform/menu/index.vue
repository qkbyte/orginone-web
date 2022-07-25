<template>
  <div class="base-layout">
    <DiyBoxLayout>
      <template v-slot:table>
        <DiyTable
          ref="table"
          :tableName="tableName"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          @handleUpdate="loadData"
        >
          <template v-slot:buttons>
            <el-button type="text" @click="handleCopyMenu">复制</el-button>
            <el-button type="text" @click="handleDeleteMenus">删除</el-button>
            <el-button type="text" @click="handleAddMenu">新增</el-button>
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              :index="scope.index"
              :row="scope.row"
              @handleEdit="handleEdit"
              @handleDelete="handleDelete"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="'#' + scope.row.icon"></use>
            </svg>
          </template>
          <template v-slot:type="scope">
            <el-tag v-if="scope.row.category === '1'" type="warning"
              >菜单</el-tag
            >
            <el-tag v-else>按钮</el-tag>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>

    <template v-for="item in dialogShow">
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
      <TheCopyDialog
        v-if="item.key === 'copy' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleUpdate="loadData"
        @closeDialog="handleCloseDialog"
      ></TheCopyDialog>
    </template>
  </div>
</template>

<script>
import DiyTable from "@components/DiyTable/index";
import DiyTitle from "@components/DiyTitle/index";
import TheAddDialog from "./components/TheAddDialog";
import TheEditDialog from "./components/TheEditDialog";
import TheCopyDialog from "./components/TheCopyDialog";
import { getMenuList, deleteMenuByMenuId } from "@api/menu";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./components/TheTableButton";

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
          key: "copy",
          value: false,
        },
      ],
      tableName: "菜单列表",
      tableData: [],
      tableHead: [
        {
          prop: "name",
          label: "菜单名称",
          width: "160",
        },
        {
          type: "slot",
          name: "type",
          label: "类型",
          align: "center",
          width: "100",
        },
        {
          prop: "path",
          label: "路由",
          width: "200",
        },
        {
          type: "slot",
          name: "icon",
          label: "图标",
          align: "center",
          width: "80",
        },
        {
          prop: "sort",
          label: "排序",
          width: "80",
        },
        {
          prop: "alias",
          label: "别名",
          width: "160",
        },
        {
          prop: "remark",
          label: "备注",
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
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
        noPage: true,
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
          type: "text",
          icon: "el-icon-delete",
          value: "删除",
          func: function(index, row) {
            _this.handleDelete(index, row);
          },
        },
      ],
      filterText: "",
    };
  },
  components: {
    DiyTable,
    DiyTitle,
    DiyBoxLayout,
    TheAddDialog,
    TheEditDialog,
    TheCopyDialog,
    TheTableButton,
  },
  computed: {
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
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted() {},
  methods: {
    //加载菜单列表数据
    loadData() {
      this.$refs.table.loading = true;
      let params = {
        name: this.filterText,
      };
      getMenuList(params).then((res) => {
        this.tableData = res.data.data;
        this.$refs.table.loading = false;
      });
    },

    //删除菜单
    handleDeleteMenus() {
      if (this.$refs.table.multipleSelection.length === 0) {
        this.$message.warning({
          message: "请至少选择一个菜单",
          duriation: 700,
        });
      } else {
        this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = this.$refs.table.multipleSelection
            .map((el) => el.id)
            .join(",");
          let params = {
            menuIds: ids,
          };
          deleteMenuByMenuId(params).then((res) => {
            this.$message.success("菜单删除成功");
            this.loadData();
          });
        }).catch(() => {
          return         
        });
      }
    },

    //打开新增菜单对话框
    handleAddMenu() {
      this.dialogShow.map((el) => {
        if (el.key === "add") {
          el.value = true;
        }
      });
    },

    //打开编辑菜单对话框
    handleEdit(index, row) {
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = row;
        }
      });
    },

    //打开复制菜单对话框
    handleCopyMenu() {
      if (this.$refs.table.multipleSelection.length > 1) {
        return this.$message.warning("至多选择一个菜单");
      }
      if (this.$refs.table.multipleSelection.length === 0) {
        return this.$message.warning("请选择一个菜单");
      }
      let selected = this.$refs.table.multipleSelection;
      this.dialogShow.map((el) => {
        if (el.key === "copy") {
          el.value = true;
          el.sendData = selected;
        }
      });
    },

    //处理列表内删除菜单操作
    handleDelete(index, row) {
      let params = {
        menuIds: row.id,
      };
      deleteMenuByMenuId(params).then((res) => {
        this.$message.success("菜单删除成功");
        this.loadData();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
