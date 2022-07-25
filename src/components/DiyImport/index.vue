<template>
  <div class="base-layout">
    <DiyBoxLayout>
      <DiyTable
        ref="table"
        :tableName="tableName"
        :tableHead="tableHead"
        :options="options"
        :tableData="tableData"
        :hasTabs="true"
        @handleUpdate="loadData"
      >
        <template v-slot:buttons>
          <el-button type="text" @click="back">返回</el-button>
          <el-button type="text" @click="loadData">刷新</el-button>
          <el-button v-if="exportData" type="text" @click="handleExport"
            >导出</el-button
          >
          <el-button v-if="!modelData" type="text" @click="handleModel('val')"
            >下载模板</el-button
          >
          <el-button v-if="!modelData" type="text" @click="handleImportFile('file')"
            >批量导入</el-button
          >
          <slot></slot>
        </template>
        <template v-slot:operate="scope">
          <TheTableButton
            :index="scope.index"
            :row="scope.row"
            @handleView="handleView"
          ></TheTableButton>
        </template>
        <template v-slot:status="scope">
          <el-tag v-if="scope.row.status === 1" type="success">成功</el-tag>
          <el-tag v-else-if="scope.row.status === 0" type="warning"
            >导入中</el-tag
          >
          <el-tag v-else type="error">失败</el-tag>
        </template>
      </DiyTable>
    </DiyBoxLayout>

    <template v-for="item in dialogShow">
      <TheImportDialog
        v-if="item.key === 'import' && item.value"
        :key="item.key"
        :uploadUrl="uploadUrl"
        :dialogShow="item"
        :importData="importData"
        @handleImport="handleImport"
        @handleUpdate="loadData"
        @closeDialog="handleCloseDialog"
      >
        <div slot="radio">
          <slot name="radio"></slot>
        </div>
      </TheImportDialog>
      <TheViewDialog
        v-if="item.key === 'view' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleUpdate="loadViewData"
        @closeDialog="handleCloseDialog"
      ></TheViewDialog>
    </template>
  </div>
</template>

<script>
import DiyTable from "@components/DiyTable/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheImportDialog from "./components/TheImportDialog";
import TheViewDialog from "./components/TheViewDialog";
import TheTableButton from "./components/TheTableButton";

export default {
  data() {
    return {
      dialogShow: [
        {
          key: "import",
          value: false,
        },
        {
          key: "view",
          value: false,
        },
      ],
      tableData: [],
      options: {
        checkBox: false,
        order: true,
        defaultSort: { prop: "createdTime", order: "descending" },
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
      },
      filterText: "",
      exportData: false,
    };
  },
  props: {
    tableName: {
      type: String,
      default: "导入记录",
    },
    tableHead: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    uploadUrl: {
      type: String,
      default: "",
    },
    importData: {
      type: Object,
      default: () => {},
    },
    export: {
      type: Boolean,
      default: false,
    },
    modelData: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    TheImportDialog,
    TheTableButton,
    TheViewDialog,
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
  mounted() {
    this.exportData = this.export;
    this.loadData();
  },
  methods: {
    handleExport(type) {
      // 导出
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
    loadData() {
      this.$nextTick(() => {
        this.$refs.table.loading = true;
        const { currentPage, pageSize } = this.$refs.table.page;
        let params = {
          current: currentPage,
          size: pageSize,
          type: 1,
        };
        this.$emit("handleUpdate", params, (res) => {
          const { records, total } = res.data.data;
          this.tableData = records;
          this.$nextTick(() => {
            this.$refs.table.page.total = total;
            this.$refs.table.loading = false;
          });
        });
      });
    },

    loadViewData(params, callback) {
      this.$emit("handleView", params, (res) => {
        callback(res);
      });
    },

    handleView(index, row) {
      this.dialogShow.map((el) => {
        if (el.key === "view") {
          el.value = true;
          el.sendData = row;
        }
      });
    },

    handleImportFile(val) {
      if (val !== 'file') {
        this.dialogShow.map((el) => {
          if (el.key === "import") {
            el.value = true;
            el.sendData = val;
          }
        });
      } else {
        this.dialogShow.map((el) => {
          if (el.key === "import") {
            el.value = true;
          }
        });
      }
    },

    handleImport(params, val, callback) {
      if (val) {
        this.$emit("handleImport", params,val,(res) => {
          callback(res);
        });
      } else {
        this.$emit("handleImport", params, (res) => {
          callback(res);
        });
      }
    },

    //下载导入模板
    async handleModel(val) {
      if (val !== 'val') {
        this.$emit("handleDownloadModel", val, (res, fileName) => {
          const data = res;
          const content = res;
          const blob = new Blob([content], {
            type: "application/vnd.ms-excel;",
          });
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
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
      } else {
        this.$emit("handleDownloadModel", (res, fileName) => {
          const data = res;
          const content = res;
          console.log('content', content);
          const blob = new Blob([content], {
            type: "application/vnd.ms-excel;",
          });
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
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
      }
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped></style>
