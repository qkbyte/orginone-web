<template>
  <div style="height:100%;">
    <DiyTable
      ref="table"
      :tableHead="tableHead"
      :tableName="tableName"
      :options="options"
      :tableData="tableData"
      @handleUpdate="loadData"
    >
      <template v-slot:buttons>
        <el-button type="text" @click="handleDel">删除</el-button>
      </template>
      <template v-slot:operate="scope">
        <template v-if="scope.row.roleId !== '1'">
          <TheTableButton
            :index="scope.index"
            :row="scope.row"
            @handleEdit="handleEdit"
            @handleDelete="handleDelete"
            @handleTransfer="handleTransfer"
          ></TheTableButton>
        </template>
        <template
          v-else-if="
            scope.row.roleId == '1' && scope.row.realName == userName.realName
          "
        >
          <TheTableButtonTwo
            :index="scope.index"
            :row="scope.row"
          ></TheTableButtonTwo>
        </template>
      </template>
      <template v-slot:icon="scope">
        <i :class="scope.row.source"></i>
      </template>
      <template v-slot:roleName="scope">
        <template v-if="scope.row.realName === linkMan"
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
        :key="item.key"
        :dialogShow="item"
        @closeEdit="closeEdit"
      ></TheEditDialog>
      <TheAddDialog
        v-if="item.key === 'add' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeEdit="closeEdit"
      ></TheAddDialog>
      <TheTransfer
        v-if="item.key === 'transfer' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeEdit="closeEdit"
      ></TheTransfer>
    </template>
  </div>
</template>

<script>
import TheTableButton from "./TheTableButton";
import { mapGetters, mapState, mapActions } from "vuex";
import {
  getAllUserInfo,
  delUserInfo,
  resetPassword,
  exportExcel,
  exportDownload,
} from "@api/user";
import DiyTable from "@components/DiyTable/index";
import XLSX from "xlsx";
import { getTenantInfoDetailByCode } from "@api/tenant";
import TheEditDialog from "./TheEditDialog";
import TheAddDialog from "./TheAddDialog";
import TheTransfer from "./TheTransfer";
import Bus from "@utils/eventBus";
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
        {
          key: "test",
          value: false,
        },
        {
          key: "transfer",
          value: false,
        },
      ],
      tableData: [],
      tableName: "用户列表",
      tableHead: [
        {
          prop: "id",
          label: "id",
          width: "200",
        },
        {
          prop: "userName",
          label: "userName",
          width: "120",
        },
        {
          prop: "phoneNumber",
          label: "phoneNumber",
          width: "160",
        },
        {
          prop: "pwd",
          label: "pwd",
          width: "200",
        },
        {
          prop: "tenantCode",
          label: "tenantCode",
          width: "250",
        },
        {
          prop: "tenantApplyingState",
          label: "tenantApplyingState",
          width: "200",
        },
        {
          prop: "openId",
          label: "openId",
          width: "250",
        },
        {
          prop: "isAdmin",
          label: "isAdmin",
          width: "250",
        },
        {
          prop: "isCreated",
          label: "isCreated",
          width: "250",
        },
        {
          prop: "isMaster",
          label: "isMaster",
          width: "250",
        },
        {
          prop: "isDeleted",
          label: "isDeleted",
          width: "120",
        },
        {
          prop: "createUser",
          label: "createUser",
          width: "120",
        },
        {
          prop: "updateUser",
          label: "updateUser",
          width: "120",
        },
        {
          prop: "status",
          label: "status",
          width: "120",
        },
        {
          prop: "updateTime",
          label: "updateTime",
          width: "120",
        },
        {
          prop: "createTime",
          label: "createTime",
          minWidth: "200",
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
      ],
      total: 0,
      index: 999999,
      editData: {},
      dialogVisible: false,
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
    TheTableButton,
    TheEditDialog,
    TheAddDialog,
    TheTransfer,
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
    this.getSearchForm(this.form);
    Bus.$on("searchEnter", (target) => {
      this.filterText = target;
      this.searchData = "";
      this.loadData("search");
    });
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
    ...mapState("user", ["userName"]),
    ...mapState("options", ["formShow"]),
    getSearchData() {
      return this.$store.state.searchData;
    },
  },
  watch: {
    formShow(val) {
      if (val.load == false && val.show == false) {
        this.filterText = "";
        this.searchData = this.getSearchData;
        this.loadData();
      }
    },
  },
  methods: {
    ...mapActions("options", ["getSearchForm"]),
    handleTransfer(index, row) {
      this.dialogShow.map((el) => {
        if (el.key == "transfer") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handleDel() {
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一个用户");
      } else {
        this.$confirm("此操作将永久所选用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let params = {
              ids: ids.join(","),
            };
            delUserInfo(params).then((res) => {
              this.loadData();
              this.$message.success("删除用户成功");
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
        current: currentPage,
        size: pageSize,
      };
      if (this.filterText == "" && this.searchData !== "") {
        (params.id = this.searchData.id),
          (params.phoneNumber = this.searchData.phoneNumber),
          (params.userName = this.searchData.userName),
          (params.tenantCode = this.searchData.tenantCode);
        params.isDeleted = this.searchData.isDeleted;
      } else {
        params.userName = this.filterText;
      }
      getAllUserInfo(params).then((res) => {
        let data = res.data.data;
        this.tableData = data.records;
        this.total = data.total;
        this.$refs.table.page.total = data.total;
        this.$refs.table.loading = false;
        if (
          this.$refs.table.tableData.length == 0 &&
          this.$refs.table.page.currentPage >= 2
        ) {
          this.$refs.table.page.currentPage -= 1;
          this.loadData();
        }
      });
    },
    /**
     * 按钮操作
     */
    handleCheckUser() {
      this.$router.push({ name: "user-check" });
    },

    // handleDeleteUsers() {
    //   let idusers = [];
    //   this.$refs.table.multipleSelection.forEach((element) => {
    //     idusers.push(element.userId);
    //   });
    //   if (idusers.length === 0) {
    //     return this.$message.warning("请至少选择一行用户信息");
    //   }
    //   let params = {
    //     userIds: idusers.join(","),
    //     tenantCode: this.curTenantCode,
    //   };
    //   removeUsers(params).then((res) => {
    //     this.$message.success("移出单位成功");
    //     this.loadData();
    //   });
    // },

    handleExport(type) {
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

    //由于部分技术原因,用源生的方法上传数据
    handleImport(files) {
      let that = this;
      // FormData 对象
      var form = new FormData();
      form.append("file", files.file); // 文件对象

      // XMLHttpRequest 对象
      var xhr = new XMLHttpRequest();
      xhr.timeout = 30000; //设置超时
      xhr.open("post", "/dev-api/asset-system/person/importExcel", true);
      let token = this.$store.state.user.token;
      xhr.setRequestHeader("blade-auth", token);
      xhr.responseType = "json";
      xhr.onload = function() {
        if (xhr.response.code == 200) {
          that.$message.success("上传文件成功!");
          that.loadData();
        }
      };
      xhr.ontimeout = function() {
        that.$message.error("数据加载失败，请刷新页面");
      };
      xhr.onerror = function(res) {
        that.$message.error("数据加载失败，请刷新页面");
      };
      xhr.send(form);
    },

    handleDownload() {
      exportDownload("noMessage").then((res) => {
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
        const fileName = date + "_userInfo_template" + ".xls";
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

    //保留密码重置,未启用
    handleResetPassword() {
      if (this.$refs.table.multipleSelection.length == 0)
        this.$message.error("请至少选择一行用户信息");
      else {
        this.$confirm("确定重置?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let ids = [];
          this.$refs.table.multipleSelection.forEach((element) => {
            ids.push(element.id);
          });
          let params = {
            userIds: ids.join(","),
          };
          resetPassword(params).then((res) => {
            this.$message({
              type: "success",
              message: "密码重置成功",
              duriation: 700,
            });
          });
        });
      }
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
      let params = {
        userIds: row.userId,
        tenantCode: this.curTenantCode,
      };
      removeUsers(params).then((res) => {
        this.$message.success("删除用户成功");
        this.loadData();
      });
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    handleSuccess(res) {
      this.$message.success("文件上传成功");
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    /*
      导入模板Dialog关闭时清空fileList
    */
    importClose() {
      this.fileList = [];
    },
    handleReset() {
      (this.searchData = {}), (this.filterText = ""), this.loadData();
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
.user-TheUserTable {
  .importDialog {
    .el-button {
      width: 100%;
    }
  }
}
</style>

<style lang="scss">
.user-TheUserTable {
  .upload-demo {
    .el-upload {
      width: 100%;
    }
  }
}
</style>
