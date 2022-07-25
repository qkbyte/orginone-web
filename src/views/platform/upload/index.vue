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
          @handleUpdate="loadData"
          ><template v-slot:buttons>
            <el-button type="text" @click="handleAddUpLoad">新增</el-button>
          </template>
          <!-- <template v-slot:operate="scope">
            <TheTableButton
              :index="scope.index"
              :row="scope.row"
              @handleEdit="handleEdit"
              @handleDelete="handleDelete"
            ></TheTableButton>
          </template> -->
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>

    <template v-for="item in dialogShow">
      <!-- <TheEditDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleUpdate="loadData"
        @closeDialog="handleCloseDialog"
      ></TheEditDialog> -->
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
import { mapGetters, mapState,mapActions } from "vuex";
import { getUploadList } from "@api/upload"
import DiyTable from "@components/DiyTable/index";
import TheAddDialog from "./components/TheAddDialog";
import DiyTitle from "@components/DiyTitle/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
export default {
  data() {
    let _this = this;
    return {
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
      tableName: "导入模板",
      tableData: [],
      tableHead: [
        {
          prop: "id",
          label: "id",
          width: "200",
        },
        {
          prop: "importName",
          label: "importName",
          width: "200",
        },
        {
          prop: "importType",
          label: "importType",
          width: "200"
        },
        {
          prop: "isDeleted",
          label: "isDeleted",
          width: "200",
        },
        {
          prop: "status",
          label: "status",
          minWidth:"200"
        },
      ],
      options: {
        checkBox: true,
        order: true,
        defaultSort: { prop: "createTime", order: "descending" },
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
      },
      unitName: "",
      user: {},
      form:{
        id:'',
        unitName: '',
        socialCreditCode:'',
        tenantId: '',
        isDeleted:'',
      },
      filterText: "",
      searchData:"",
    };
  },
  components: {
    DiyTable,
    // TheEditDialog,
    TheAddDialog,
    DiyBoxLayout,
    DiyTitle,
    // TheTableButton,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    async loadData() {
      this.$refs.table.loading = true;
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        current: currentPage,
        size: pageSize,
      };
      await getUploadList(params).then((res) => {
        console.log('res', res);
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
      let tableData = this.$refs.table
      if(tableData.tableData.length == 0 && tableData.page.currentPage >= 2){
        this.$refs.table.page.currentPage -= 1
        this.loadData();
      }
    },
    /**
     * 按钮操作
     */
    handleAddUpLoad() {
      this.dialogShow.map((el) => {
        if (el.key === "add") {
          el.value = true;
        }
      });
    },

    handleCloseDialog(val){
      this.dialogShow.map((el)=>{
        if(el.key == val){
          el.value = false
        }
      })
    },

    handleDeleteRoles() {
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一个单位");
      }else{
        this.$confirm('此操作将永久所选单位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
           ids: ids.join(","),
          };
          delOrgansList(params).then((res) => {
            this.loadData()
            this.$message.success("删除单位成功");
          });
        }).catch(() => {
          return         
        });
      }
    },

    /**
     * 表格内按钮操作
     */
    handleEdit(row) {
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该单位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            tenantCode: row.tenantCode,
          };
          deleteTenantByTenantId(params).then((res) => {
            if(row.linkPhone == this.user.phoneNumber){
              location.reload();
            }else{
              this.loadData()
            }
            this.$message.success("删除单位成功");
          });
        }).catch(() => {
          return           
        });
    },
    handleReset(){
      this.searchData = {},
      this.filterText = "",
      this.loadData()
    }
  },
};
</script>

<style lang="scss" scoped></style>
