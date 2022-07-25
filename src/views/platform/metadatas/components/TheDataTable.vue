<template>
  <div style="height:100%">
    <DiyTable
      ref="table"
      :tableName="tableName"
      :tableHead="tableHead"
      :options="options"
      :tableData="tableData"
      @handleUpdate="loadData"
    >
      <template v-slot:slot-title>
        <font size="2" color="red">当前版本号：v{{ version }}</font>
      </template>
      <template v-slot:buttons>
        <el-button type="text" @click="handleRelease">发布</el-button>
        <el-button type="text" @click="handleAdd">新增</el-button>
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
        <i :class="scope.row.source"></i>
      </template>
    </DiyTable>

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
    </template>
  </div>
</template>

<script>
import {
  getAllFields,
  getAllFieldsByFilter,
  getCurVersion,
  updateVersion,
  deleteFieldByRecid,
} from "@api/field";
import DiyTable from "@components/DiyTable/index";
import TheEditDialog from "./TheEditDialog";
import TheAddDialog from "./TheAddDialog";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./TheTableButton";

export default {
  data() {
    let _this = this;
    return {
      version: "",
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
      tableName: "字段列表",
      tableData: [],
      tableHead: [
        {
          prop: "title",
          label: "字段标识",
          width: "160",
        },
        {
          prop: "name",
          label: "字段名称",
          width: "240",
        },
        {
          prop: "t_order",
          label: "字段序号",
          width: "160",
        },
        {
          prop: "datatypename",
          label: "字段类型",
          width: "120",
        },
        {
          prop: "precision_",
          label: "字段精度",
          width: "100",
        },
        {
          prop: "length",
          label: "字段长度",
          minWidth: "120",
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
    TheEditDialog,
    DiyBoxLayout,
    TheAddDialog,
    TheTableButton,
  },
  props: {
    filterValue: {
      type: [String, Number],
      default: "",
    },
  },
  computed: {
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    filterValue: {
      handler(newValue, oldValue) {
        this.loadData();
      },
    },
    getFilterText(val) {
      this.filterText = val;
      this.loadData();
    },
  },
  created() {
    this.$nextTick(() => {
      // this.loadData();
      // this.loadCurVersion();
    });
  },
  methods: {
    loadData() {
      this.$refs.table.loading = true;
      let filtersearch =
        "(name like '%" +
        this.filterText +
        "%' or title like '%" +
        this.filterText +
        "%')";
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        current: currentPage,
        size: pageSize,
        mtcode: this.filterValue,
        filtertext: filtersearch,
      };
      getAllFieldsByFilter(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = parseInt(total);
        this.$refs.table.loading = false;
      });
      this.loadCurVersion();
    },
    loadCurVersion() {
      let params = {
        mtcode: this.filterValue,
      };
      getCurVersion(params).then((res) => {
        res.data ? (this.version = "0") : (this.version = res.data);
      });
    },
    searchmetadata() {
      this.loadData();
    },
    /**
     * 按钮操作
     */
    handleAdd() {
      this.dialogShow.map((el) => {
        if (el.key === "add") {
          el.value = true;
          el.sendData = {
            mtcode: this.filterValue,
          };
        }
      });
    },

    handleRelease() {
      let params = {
        mtcode: this.filterValue,
      };
      updateVersion(params).then((res) => {
        let data = res.data.data;
        this.$message.success("发布成功");
        this.loadData();
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
    handleDelete(index, row) {
      let params = {
        id: row.id,
      };
      deleteFieldByRecid(params).then((res) => {
        this.$message.success("删除字段成功");
        this.loadData();
      });
    },
    handleCloseDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
