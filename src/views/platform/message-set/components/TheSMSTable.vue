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
        <TheSMSButton
          :index="scope.index"
          :row="scope.row"
          :isShow="true"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
        ></TheSMSButton>
      </template>
    </DiyTable>
    <template v-for="item in dialogShow">
      <TheSMSEditDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeEdit="closeEdit"
      ></TheSMSEditDialog>
      <TheSMSAddDialog
        v-if="item.key === 'add' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeEdit="closeEdit"
        @updateList="loadData"
      ></TheSMSAddDialog>
    </template>
  </div>
</template>

<script>
import TheSMSButton from "./TheSMSButton";
import { mapGetters, mapState, mapActions } from "vuex";
import { SMSList, SMSRemove } from "@api/market";
import DiyTable from "@components/DiyTable/index";
import TheSMSEditDialog from "./TheSMSEditDialog";
import TheSMSAddDialog from "./TheSMSAddDialog";
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
          prop: "title",
          label: "标题",
          width: "250",
        },
        {
          prop: "content",
          label: "内容",
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
      total: 0,
      form: {
        id: "",
        phoneNumber: "",
        userName: "",
        tenantCode: "",
        isDeleted: "",
      },
      filterText: "",
      searchData: "",
    };
  },
  components: {
    DiyTable,
    TheSMSButton,
    TheSMSEditDialog,
    TheSMSAddDialog,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
    let token = localStorage.getItem("ZCY_TOKEN");
    this.importToken = {
      Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
      "blade-auth": token,
    };
  },
  mounted() {
    // this.getSearchForm(this.form)
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
    ...mapState("user", ["userName"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
    getSearchData() {
      return this.$store.state.searchData;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadData("search");
    },
  },
  methods: {
    ...mapActions("options", ["getSearchForm"]),
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
      let currentPage = 1;
      let pageSize = 20;
      if (str) {
        pageSize = this.$refs.table.page.pageSize;
        this.$refs.table.page.currentPage = 1;
      } else {
        currentPage = this.$refs.table.page.currentPage;
        pageSize = this.$refs.table.page.pageSize;
      }
      // const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        current: currentPage,
        size: pageSize,
      };
      SMSList(params).then((res) => {
        const { total, records } = res.data.data
        this.tableData = records
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
        let tableData = this.$refs.table;
        if (
          tableData.tableData.length == 0 &&
          tableData.page.currentPage >= 2
        ) {
          this.$refs.table.page.currentPage -= 1;
          this.loadData();
        }
      });
    },

    /**
     * 表格内按钮操作
     */
    handleActive(index, row) {
      console.log("row", row);
      let params = {
        id: row.id,
      };
      if (row.noticeReleaseStatus == 0) {
        marketappnoticeReleaseNote(params).then((res) => {
          this.loadData();
          this.$message.success("发布成功");
        });
      } else {
        marketappnoticeCancel(params).then((res) => {
          this.loadData();
          this.$message.success("下架成功");
        });
      }
    },
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
      this.$confirm("此操作将永久删除所选短信模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let idList = [row.id];
          console.log('idlist', idList);
          SMSRemove(idList).then((res) => {
            this.loadData();
            this.$message.success("删除成功");
          });
        })
        .catch(() => {
          return;
        });
    },
    handleDeletes() {
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      console.log(this.$refs.table.multipleSelection);
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一条短信模板");
      } else {
        this.$confirm("此操作将永久删除所选短信模板, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let idList = ids;
            SMSRemove(idList).then((res) => {
              this.loadData();
              this.$message.success("删除成功");
            });
          })
          .catch(() => {
            return;
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
