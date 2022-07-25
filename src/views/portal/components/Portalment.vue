<template>
  <div class="base-layout">
    <DiyBoxLayout>
      <DiyTable
        ref="table"
        :tableHead="tableHead"
        :options="options"
        :tableData="tableData"
        :tableName="'组件列表'"
        :hasTabs="true"
        @handleUpdate="loadlistData"
      >
        <template v-slot:buttons>
          <el-button type="text" @click="back">返回</el-button>
          <el-button type="text" @click="handleDeletes">删除</el-button>
          <el-button type="text" @click="handleAdd">新增</el-button>
        </template>
        <template v-slot:operate="scope">
          <TheTableButton
            @handleEdit="handleEdit"
            @handlePass="handlePass"
            @handleView="handleView"
            :index="scope.index"
            :row="scope.row"
          ></TheTableButton>
        </template>
        <template v-slot:appId="scope">
          <div v-if="scope.row.appId === -1">平台组件</div>
          <div v-else>应用组件</div>
        </template>
        <template v-slot:status="scope">
          <div v-if="scope.row.status === -1">停用</div>
          <div v-else>启用</div>
        </template>
      </DiyTable>
    </DiyBoxLayout>
    <template v-for="item in dialogShow">
      <TheAddComponentDialog
        v-if="item.key === 'add' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAddComponentDialog>
      <TheEditComponentDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheEditComponentDialog>
      <TheViewComponentDialog
        v-if="item.key === 'view' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheViewComponentDialog>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getMarketappcomponentList,
  marketappcomponentRemove,
  getMarketappcomponenttemplateList,
  marketappcomponenttemplateRemove,
} from "@api/portal";
import DiyTable from "@components/DiyTable/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./TheTableButton";
import TheAddComponentDialog from "./AddDialog";
import TheEditComponentDialog from "./EditDialog";
import TheViewComponentDialog from "./ViewDialog";
export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "add",
          value: false,
        },
        {
          key: "edit",
          value: false,
        },
        {
          key: "view",
          value: false,
        },
      ],
      tableData: [],
      tableHead: [
        {
          prop: "name",
          label: "名称",
          width: "300",
        },
        {
          prop: "url",
          label: "链接",
          width: "600",
        },
        {
          type: "slot",
          name: "appId",
          label: "组件类型",
          width: "250",
        },
        {
          type: "slot",
          name: "status",
          label: "状态",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          width: "80",
          minWidth: "80",
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
      filterText: "",
      imageUrl: "",
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    TheTableButton,
    TheAddComponentDialog,
    TheEditComponentDialog,
    TheViewComponentDialog,
  },
  created() {
    this.$nextTick(() => {
      this.loadlistData();
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
      this.loadlistData();
    },
  },
  methods: {
    loadlistData() {
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        name:this.filterText,
        current: currentPage,
        size: pageSize,
      };
      getMarketappcomponentList(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
    },
    back() {
      this.$router.go(-1);
    },
    /**
     * 按钮操作
     */

    handleEdit(data) {
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = data;
        }
      });
    },
    handleAdd() {
      this.dialogShow.map((el) => {
        if (el.key === "add") {
          el.value = true;
        }
      });
    },
    handleDeletes() {
      if (this.$refs.table.multipleSelection.length === 0) {
        this.$message.warning({
          message: "请至少选择一个组件",
          duriation: 700,
        });
      } else {
        this.$confirm("此操作将永久删除该组件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let ids = [];
            this.$refs.table.multipleSelection.forEach((element) => {
              ids.push(element.id);
            });
            marketappcomponentRemove(ids).then((res) => {
              this.$message.success("删除成功");
              this.loadlistData();
            });
          })
          .catch(() => {
            return;
          });
      }
    },
    /**
     * 表格内按钮操作
     */
    handlePass() {
      this.$refs.table.loading = true;
      this.loadlistData();
    },
    handleView(row) {
      this.dialogShow.map((el) => {
        if (el.key === "view") {
          el.value = true;
          el.sendData = row.previewPic;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
