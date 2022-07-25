<template>
  <div style="height:100%;">
    <DiyTable
      ref="table"
      :tableHead="tableHead"
      :options="options"
      :tableData="tableData"
      :hasTableHead="false"
      @handleUpdate="loadData"
    >
      <template v-slot:operate="scope">
        <TheTaskButton
          :index="scope.index"
          :row="scope.row"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
        ></TheTaskButton>
      </template>
      <template v-slot:alertEmergencyLevel="scope">
        <el-tag v-if="scope.row.alertEmergencyLevel === 1">
          低
        </el-tag>
        <el-tag v-if="scope.row.alertEmergencyLevel === 2" type="warning">
          中
        </el-tag>
        <el-tag v-if="scope.row.alertEmergencyLevel === 3" type="danger">
          高
        </el-tag>
      </template>
      <template v-slot:alertStatus="scope">
        <div v-if="scope.row.alertStatus == 0">未读</div>
        <div v-else>已读</div>
      </template>
    </DiyTable>
    <template v-for="item in dialogShow">
      <TheTaskEditDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="closeEdit"
      ></TheTaskEditDialog>
    </template>
  </div>
</template>

<script>
import TheTaskButton from "./TheTaskButton";
import { mapGetters, mapState, mapActions } from "vuex";
import { marketappalertList, marketappalertRemove } from "@api/market";
import DiyTable from "@components/DiyTable/index";
import TheTaskEditDialog from "./TheTaskEditDialog";
export default {
  data() {
    let _this = this;
    return {
      importToken: {
        Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
        "blade-auth": "",
      },
      fileList: [],
      importDialog: false,
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
          prop: "alertTitle",
          label: "标题",
          width: "250",
        },
        {
          prop: "alertContent",
          label: "内容",
          width: "300",
        },
        {
          prop: "alertBusiness",
          label: "业务",
          width: "250",
        },
        {
          type: "slot",
          name: "alertEmergencyLevel",
          prop: "alertEmergencyLevel",
          label: "紧急程度",
          width: "100",
        },
        {
          type: "slot",
          name: "alertStatus",
          prop: "alertStatus",
          label: "预警消息状态",
          width: "200",
        },
        {
          prop: "alertReleaseTime",
          label: "发布时间",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          width: "100",
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
    TheTaskEditDialog,
    TheTaskButton,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted() {
    // this.getSearchForm(this.form)
  },
  computed: {
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadData("search");
    },
  },
  methods: {
    handleMoreDel() {
      let deleteIds = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        deleteIds.push(element.id);
      });
      if (deleteIds.length === 0) {
        return this.$message.warning("请至少选择一条消息");
      } else {
        this.$confirm("此操作将删除所选消息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          deleteMessage({ deleteIds }).then((res) => {
            this.loadData();
            this.$message.success("删除消息成功");
          });
        });
      }
    },
    handleAdd() {
      this.dialogShow.map((el) => {
        if (el.key == "add") {
          el.value = true;
        }
      });
    },
    loadData(str) {
      this.$refs.table.loading = true;
      // const { currentPage, pageSize } = this.$refs.table.page;
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
        alertTitle: this.filterText,
        current: currentPage,
        size: pageSize,
      };
      marketappalertList(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
    },

    /**
     * 表格内按钮操作
     */
    handleEdit(index, row) {
      this.dialogShow.map((el) => {
        if (el.key == "edit") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    closeEdit(val) {
      this.dialogShow.map((el) => {
        if (el.key == val) {
          el.value = false;
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将删除该消息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        marketappalertRemove([row.id]).then((res) => {
          this.loadData();
          this.$message.success("删除消息成功");
        });
      });
    },
    handleDeletes() {
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一条消息");
      } else {
        this.$confirm("此操作将永久删除所选消息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            marketappalertRemove(ids).then((res) => {
              this.loadData();
              this.$message.success("删除成功");
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
.message-TheMessgaeTable {
  .importDialog {
    .el-button {
      width: 100%;
    }
  }
}
</style>

<style lang="scss">
.message-TheMessageTable {
  .upload-demo {
    .el-upload {
      width: 100%;
    }
  }
}
</style>
