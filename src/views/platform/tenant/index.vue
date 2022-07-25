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
          @handleUpdate="loadlistData"
          :batchOperate="batchOperate"
          @handleCommand="handleCommand"
        >
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
          <template v-slot:buttons>
            <el-button type="text" @click="handleDel">删除</el-button>
            <el-button type="text" @click="handleExport">导出</el-button>
            <el-button type="text" @click="goImport">租户导入</el-button>
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              :row="scope.row"
              @handleEdit="handleEdit"
            ></TheTableButton>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>
    <template v-for="item in dialogShow">
      <TheEditDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        :editData="editData"
        @closeEdit="closeEdit"
      ></TheEditDialog>
      <TheAddDialog
        v-if="item.key === 'add' && item.value"
        :key="item.key"
        :dialogShow="item"
        :editData="editData"
        @closeEdit="closeEdit"
      ></TheAddDialog>
    </template>
  </div>
</template>

<script>
import { mapState,mapActions } from "vuex";
import { getAllTenantList, getTenantInfoExport, delTenantList } from "@api/tenant";
import DiyTable from "@components/DiyTable/index";
import TheEditDialog from "./components/TheEditDialog";
import TheAddDialog from "./components/TheAddDialog";
import TheAuthDialog from "./components/TheAuthDialog";
import DiyTitle from "@components/DiyTitle/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./components/TheTableButton";
import Bus from "@utils/eventBus"
export default {
  data() {
    let _this = this;
    return {
      importVisible: false,
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
      tableName: "租户列表",
      tableData: [],
      tableHead: [
        {
          prop: "id",
          label: "id",
          width: "120",
        },
        {
          prop: "tenantName",
          label: "tenantName",
          width: "240",
        },
        {
          prop: "tenantCode",
          label: "tenantCode",
          width: "240",
        },
        {
          prop: "tenantType",
          label: "tenantType",
          width: "120",
        },
        {
          prop: "status",
          label: "status",
          width: "120",
        },
        {
          prop: "createUser",
          label: "createUser",
          width: "120",
        },
        {
          prop: "createTime",
          label: "createTime",
          width: "240",
        },
        {
          prop: "isDeleted",
          label: "isDeleted",
          width: "120",
        },
        {
          prop: "pId",
          label: "pId",
          width: "120",
        },
        {
          prop: "pid",
          label: "pid",
          width: "120",
        },
        {
          prop: "updateTime",
          label: "updateTime",
          width: "180",
        },
        {
          prop: "createTime",
          label: "createTime",
          minWidth: "240",
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
      form:{
        id:'',
        tenantName:'',
        tenantCode:'',
        isDeleted: '',
      },
      searchData:{},
      filterText: "",
      fileName: "app.png",
      batchOperate: [{ key: "exportAll", value: "全部导出" }],
      records: true,
      loading: false,
      editData: {},
      dialogVisible: false
    };
  },
  components: {
    DiyTable,
    TheEditDialog,
    TheAddDialog,
    TheAuthDialog,
    DiyBoxLayout,
    DiyTitle,
    TheTableButton
  },
  created() {
    this.$nextTick(() => {
      this.loadlistData();
    });
  },
  mounted() {
    let token = localStorage.getItem("ZCY_TOKEN");
    this.uploadHeaders = {
      Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
      "blade-auth": token,
    };
    this.getSearchForm(this.form)
    Bus.$on('searchEnter', target=>{
      this.filterText = target
      this.searchData = ""
      this.loadlistData('search')
    })
  },
  computed: {
    ...mapState("options", ["formShow"]),
    getSearchData() {
      return this.$store.state.searchData;
    },
    // getSearchData() {
    //   return this.$store.state;
    // },
  },
  watch: {
    formShow(val){
      if(val.load == false && val.show == false){
        this.filterText = ""
        this.searchData = this.getSearchData
        this.loadlistData()
      }
      // if(val == false){
      //   this.searchData = this.getSearchData
      //   this.loadlistData()
      // }
    },
  },
  methods: {
    ...mapActions("options", ["getSearchForm"]),
    handleEdit(val){
      this.dialogShow.map((el)=>{
        if(el.key == 'edit'){
          el.value = true
          el.sendData = val
        }
      })
    },
    handleAdd(){
      this.dialogShow.map((el)=>{
        if(el.key == 'add'){
          el.value = true
        }
      })
    },
    handleDel(){
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一个租户");
      }else{
        this.$confirm('此操作将永久所选租户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
           ids: ids.join(","),
          };
          delTenantList(params).then((res) => {
            this.loadlistData()
            this.$message.success("删除租户成功");
          });
        }).catch(() => {
          return         
        });
      }
    },
    closeEdit(val){
      this.dialogShow.map((el)=>{
        if(el.key == val){
          el.value = false
        }
      })
    },
    async loadlistData(str) {
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
      if(this.filterText == "" && this.searchData !== ""){
        params.id = this.searchData.id,
        params.tenantName = this.searchData.tenantName
        params.tenantCode = this.searchData.tenantCode
        params.isDeleted = this.searchData.isDeleted
      }else{
        params.tenantName = this.filterText
      }
      await  getAllTenantList(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
      if(this.$refs.table.tableData.length == 0 && this.$refs.table.page.currentPage >= 2){
        this.$refs.table.page.currentPage -= 1
        this.loadlistData();
      }
    },
    async handleExport() {
      let selected = [];
      if (this.records) {
        this.$refs.table.multipleSelection.forEach((item) => {
          selected.push(item.tenantName);
        });
        if (selected === undefined || selected.length === 0) {
          return this.$message.warning("至少选择一条租户信息");
        }
      }
      selected = selected.join(",");
      this.records = true;
      getTenantInfoExport(selected).then((res) => {
        const content = res.data;
        const blob = new Blob([content], {
          type: "application/vnd.ms-excel;",
        });
        const fileName = "导出租户数据.xls";
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
    goImport() {
      this.$router.push({
        name: "tenant-import",
      });
    },
    handleCommand(e) {
      this.records = false;
      this.handleExport();
    },
    handleReset(){
      this.searchData = {},
      this.filterText = "",
      this.loadlistData()
    }
  },
};
</script>

<style lang="scss" scoped></style>
