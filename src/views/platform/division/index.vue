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
          @handleUpdate="loadlistData"
        >
          <template v-slot:buttons>
            <el-button type="text" @click="handleDeletes">删除</el-button>
            <el-button type="text" @click="handleAdd">新增</el-button>
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              :row="scope.row"
              @handleEdit="handleEdit"
              @handleDelete="handleDelete"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
          <template v-slot:saleStatus="scope">
            <el-tag v-if="scope.row.status == 1" type="success">
              通过
            </el-tag>
            <el-tag v-if="scope.row.status == 2" type="danger">
              拒绝
            </el-tag>
            <el-tag v-if="scope.row.status == 3" type="warning">
              重新发布
            </el-tag>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>
    <template v-for="item in dialogShow">
      <!-- <TheEditDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheEditDialog> -->
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
import { mapGetters } from "vuex";
import { administraListAll, administraRemoveByIds } from "@api/tenant";
import DiyTable from "@components/DiyTable/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./components/TheTableButton";
import TheAddDialog from "./components/TheAddDialog";
// import TheEditDialog from "./components/TheEditDialog";

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
      tableName: "区划管理",
      tableData: [],
      tableHead: [
        {
          prop: "code",
          label: "区划编码",
          width: "200",
        },
        {
          prop: "name",
          label: "区划简称",
          width: "300",
        },
        {
          prop: "allName",
          label: "区划全称",
          width: "300",
        },
        {
          prop: "id",
          label: "区划id",
          width: "300",
        },
        {
          prop: "pid",
          label: "父区划id",
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
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    TheTableButton,
    TheAddDialog,
    // TheEditDialog,
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
      this.loadlistData("search");
    },
  },
  methods: {
    loadlistData(str) {
      this.$refs.table.loading = true;
      let currentPage = 1;
      let pageSize = 20;
      if (str) {
        pageSize = this.$refs.table.page.pageSize;
        this.$refs.table.page.currentPage = 1;
      } else {
        currentPage = this.$refs.table.page.currentPage;
        pageSize = this.$refs.table.page.pageSize;
      }
      let params = {
        appName: this.filterText,
        size: pageSize,
        current: currentPage,
      };
      administraListAll(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
    },

    handleDeletes() {
      // 批量拒绝
      let ids = [];
      let code1 = 0;
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.redeployId);
      });
      if (ids.length > 0) {
        let params = {
          redeployIds: ids,
          checkStatus: false,
        };
        checkRedeploy(params).then((res) => {
          code1 = res.data.code;
          this.getMessage(code1);
        });
      } else {
        this.$message.error("至少选择一行");
      }
    },
    handleCloseDialog(val) {
      this.dialogShow.map((el) => {
        if (el.key == val) {
          el.value = false;
        }
      });
    },
    handlePasss() {
      // 批量通过
      let ids = [];
      let code1 = 0;
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.redeployId);
      });
      if (ids.length > 0) {
        let params = {
          redeployIds: ids,
          checkStatus: true,
        };
        checkRedeploy(params).then((res) => {
          code1 = res.data.code;
          this.getMessage(code1);
        });
      } else {
        this.$message.error("至少选择一行");
      }
    },
    handleAdd() {
      // 按钮新增
      this.dialogShow.map((el) => {
        if (el.key === "add") {
          el.value = true;
        }
      });
    },
    handleEdit(row) {
      // 按钮编辑
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handleDelete(row) {
      // 按钮删除
      this.$confirm("此操作将永久删除该区划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            ids: row.id,
          };
          administraRemoveByIds([params.ids]).then((res) => {
            if (res.data.code == 200) {
              this.$message.success("删除成功");
              this.loadlistData();
            }
          });
        })
        .catch(() => {});
    },
    handleDeletes() {
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一条区划");
      } else {
        this.$confirm("此操作将永久删除所选区划, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let params = {
              ids: ids.join(","),
            };
            administraRemoveByIds(ids).then((res) => {
              if (res.data.code == 200) {
                this.$message.success("删除成功");
                this.loadlistData();
              }
            });
          })
          .catch(() => {
            return;
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
