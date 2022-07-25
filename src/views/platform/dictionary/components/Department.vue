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
          :cell="true"
          @handleUpdate="loadData"
          ><template v-slot:buttons>
            <el-button type="text" @click="back">返回</el-button>
            <el-button type="text" @click="handleDeletes">删除</el-button>
            <el-button type="text" @click="handleAdd">新增</el-button>
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              :index="scope.index"
              :row="scope.row"
              @handleEdit="handleEdit"
              @handleDelete="handleDelete"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>

    <template v-for="item in dialogShow">
      <TheEditDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleUpdate="loadData"
        @closeDialog="handleCloseDialog"
      ></TheEditDialog>
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
import { mapGetters } from "vuex";
import { getDictList, delDictItem } from "@api/dict";
import DiyTable from "@components/DiyTable/index";
import TheEditDialog from "./TheEditEntryDialog";
import TheAddDialog from "./TheAddDictDialog";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./TheTableButton";

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
      tableName: "字典列表",
      tableData: [],
      tableHead: [
        {
          prop: "code",
          label: "字典编码",
          width: "200",
        },
        {
          prop: "dictValue",
          label: "字典名称",
          width: "200",
        },
        {
          prop: "sort",
          label: "字典排序",
          width: "120",
        },
        {
          prop: "remark",
          label: "备注",
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
        defaultSort: { prop: "createTime", order: "descending" },
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
      },
      filterText: "",
      current:1,
      size: 10,
      code: '',
      dictValue: '',
    };
  },
  components: {
    DiyTable,
    TheEditDialog,
    TheAddDialog,
    DiyBoxLayout,
    TheTableButton,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
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
      this.loadData();
    },
  },
  methods: {
    back(){
      this.$router.go(-1)
    },
    loadData() {
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        code: this.code,
        current: currentPage,
        dictValue: this.dictValue,
        size: pageSize,
      };
      getDictList(params).then((res) => {
        console.log(res);
        const { records,total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = parseInt(total);
        this.$refs.table.loading = false;
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
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一个字典");
      }else{
        this.$confirm('此操作将永久删除所选的字典, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            ids: ids.join(","),
          };
         delDictItem(params).then((res) => {
            this.loadData();
            this.$message.success("删除字典成功");
          });
        }).catch(() => {
          return         
        });
      }
    },

    handleEdit(index, row) {
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = row;
        }
      });
      
    },

    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该字典, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            ids: row.id,
          };
       delDictItem(params).then((res) => {
            this.$message.success("删除字典成功");
            this.loadData();
          });
        }).catch(() => {
          return        
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
