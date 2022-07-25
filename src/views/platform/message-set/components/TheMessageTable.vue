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
      <!-- <template v-slot:buttons>
        <el-button type="text" @click="handleMoreDel">删除</el-button>
        <el-button type="text" @click="handleAdd">新增</el-button>
      </template> -->
      <template v-slot:operate="scope">
        <TheTableButton :index="scope.index" :row="scope.row" @handleEdit="handleEdit" @handleDelete="handleDelete"></TheTableButton>
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
    </template>
  </div>
</template>

<script>
import TheTableButton from "./TheTableButton";
import { mapGetters, mapState,mapActions } from "vuex";
import {
  getAllUserInfo,
  delUserInfo,
  resetPassword,
  exportExcel,
  exportDownload,
} from "@api/user";
import { getMessages, deleteMessage } from '@api/message-set'
import DiyTable from "@components/DiyTable/index";
import XLSX from "xlsx";
import { getTenantInfoDetailByCode } from "@api/tenant";
import TheEditDialog from "./TheEditDialog";
import TheAddDialog from "./TheAddDialog";
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
        }
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
          prop: "url",
          label: "链接",
          width: "250",
        },
        {
          prop: "sender",
          label: "发送人",
          width: "250",
        },
        {
          prop: "sendTime",
          label: "发送时间",
          width: "250",
        },
        {
          prop: "receiver",
          label: "接收人",
          width: "250",
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
      form:{
        id:'',
        phoneNumber:'',
        userName: '',
        tenantCode: '',
        isDeleted: '',
      },
      filterText: "",
      searchData:"",
    };
  },
  components: {
    DiyTable,
    TheTableButton,
    TheEditDialog,
    TheAddDialog
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
      this.loadData();
    }
  },
  methods: {
    ...mapActions("options", ["getSearchForm"]),
    handleMoreDel(){
      let deleteIds = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        deleteIds.push(element.id);
      });
      if (deleteIds.length === 0) {
        return this.$message.warning("请至少选择一条消息");
      }else{
        this.$confirm('此操作将删除所选消息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMessage({ deleteIds }).then((res) => {
            this.loadData()
            this.$message.success("删除消息成功");
          })
        })
      }
    },
    handleAdd(){
      console.log('jinru');
      this.dialogShow.map((el)=>{
        if(el.key == 'add'){
          el.value = true
        }
      })
    },
    loadData() {
      this.$refs.table.loading = true;
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        current: currentPage,
        size: pageSize,
      };
      if(Object.keys(this.searchData).length !== 0){
        params.id = this.searchData.id,
        params.phoneNumber = this.searchData.phoneNumber
      }else{
        params.title = this.filterText
      }
      getMessages(params).then(res => {
        let data = res.data.data;
        this.tableData = data.records.map(i => {
          return {
            ...i,
            url: i.url || '-',
            receiver: i.personList.map(j => j.name).join('，')
          }
        })
        this.total = data.total;
        this.$refs.table.page.total = data.total;
        this.$refs.table.loading = false;
        if(this.$refs.table.tableData.length == 0 && this.$refs.table.page.currentPage >= 2){
          this.$refs.table.page.currentPage -= 1
          this.loadData();
        }
      });
    },

    /**
     * 表格内按钮操作
     */
    handleEdit(index, row) {
      this.dialogShow.map((el)=>{
        if(el.key == 'edit'){
          el.value = true
          el.sendData = row
        }
      })
    },
    closeEdit(val){
      this.dialogShow.map((el)=>{
        if(el.key == val){
          el.value = false
        }
      })
    },
    handleDelete(index, row) {
      this.$confirm('此操作将删除该消息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMessage({ deleteIds: [row.id] }).then((res) => {
          this.loadData();
          this.$message.success("删除消息成功");
        });
      })
    }
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
