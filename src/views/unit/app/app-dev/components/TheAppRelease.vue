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
      >
        <template v-slot:buttons>
          <el-button type="text" @click="back">返回</el-button>
          <el-button type="text" @click="handleDeletes">删除</el-button>
          <el-button type="text" @click="handleAdd">新增</el-button>
        </template>
        <template v-slot:operate="scope">
          <TheTableButton
            @handleEdit="handleEdit"
            @handleView="handleView"
            :index="scope.index"
            :row="scope.row"
          ></TheTableButton>
        </template>
      </DiyTable>
    </DiyBoxLayout>
    <template v-for="item in dialogShow">
      <TheAddComponentDialog
        v-if="item.key === 'add' && item.value"
        :key="item.key"
        :appId="appId"
        :dialogShow="item"
        @handleAddTableList="handleAddTableList"
        @closeDialog="handleCloseDialog"
      ></TheAddComponentDialog>
      <TheEditComponentDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleEditTableList="handleEditTableList"
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
import { getComponentListByAppId, marketappcomponentRemove } from "@api/portal";
import DiyTable from "@components/DiyTable/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./TheAppTableButton"
import TheAddComponentDialog from "./TheAddComponentDialog";
import TheEditComponentDialog from "./TheEditComponentDialog";
import TheViewComponentDialog from "./TheViewDialog";
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
        }
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
  props: {
    appId: {
      type: String,
      default: 0,
    },
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    TheTableButton,
    TheAddComponentDialog,
    TheEditComponentDialog,
    TheViewComponentDialog,
  },
  mounted() {
    this.$refs.table.loading = false;
  },
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
    tableData(val) {
      console.log("val", val);
    },
  },
  methods: {
    // loadlistData() {
    //   const { currentPage, pageSize } = this.$refs.table.page;
    //   let params = {
    //     current: currentPage,
    //     size: pageSize,
    //     appId: this.appId,
    //   };
    //   getComponentListByAppId(params).then((res) => {
    //     const { records, total } = res.data.data;
    //     this.tableData = records;
    //     this.$refs.table.page.total = total;
    //     this.$refs.table.loading = false;
    //   });
    // },
    loadData(){
      this.$refs.table.loading = false;
      this.$refs.table.page.total = this.tableData.length;
    },
    handleAddTableList(data) {
      data.id = this.tableData.length + 1
      this.tableData.push(data)
      this.loadData()
    },
    handleEditTableList(data){
      for (let i = 0; i < this.tableData.length; i++) {
        if(this.tableData[i].id == data.id){
          this.tableData[i] = data
        }        
      }
      this.loadData()
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
              for (let i = 0; i < this.tableData.length; i++) {
                  if(this.tableData[i].id == element.id){
                    this.tableData.splice(i,1)
                  }
              }
            });
            this.$message.success('删除成功')
            this.loadData()
          })
          .catch(() => {
            return;
          });
      }
    },
    /**
     * 表格内按钮操作
     */
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

<style lang="scss" scoped>
.base-layout {
  height: 100%;
}
</style>
