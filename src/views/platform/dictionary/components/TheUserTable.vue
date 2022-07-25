<template>
  <div style="height:100%;">
    <DiyTable
      ref="table"
      :tableHead="tableHead"
      :options="options"
      :tableData="tableData"
      :tableName="tableName"
      :cell="true"
      @handleUpdate="loadData"
    >
      <template v-slot:buttons>
        <el-button type="text" @click="handleAddEntry">新增</el-button>
      </template>
      <template v-slot:operate="scope">
        <TheTableButton
          :row="scope.row"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          :btnStatus="btnStatus"
        ></TheTableButton>
      </template>
      <template v-slot:icon="scope">
        <i :class="scope.row.source"></i>
      </template>
      <template v-slot:roleName="scope">
        <template v-if="scope.row.admin === 1"
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
        @closeDialog="handleCloseDialog"
      ></TheEditDialog>
      <TheAddDialog
        v-if="item.key === 'add' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAddDialog>
      <TheAddEntryDialog
        v-if="item.key === 'addEntry' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAddEntryDialog> 
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { delDictItem,getDictItem,getDictMax } from "@api/dict";
import DiyTable from "@components/DiyTable/index";
import TheEditDialog from "./TheEditEntryDialog";
import TheAddDialog from "./TheAddDialog";
import TheAddEntryDialog from "./TheAddEntryDialog";
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
        {
          key: "addEntry",
          value: false,
        },
        {
          key: "test",
          value: false,
        },
      ],
      tableName: "条目列表",
      tableData: [],
      tableHead: [
        {
          prop: "code",
          label: "条目编码",
          width: "200",
        },
        {
          prop: "dictValue",
          label: "条目值",
          width: "160",
        },
        {
          prop: "dictKey",
          label: "条目键",
          width: "200",
        },
        {
          prop: "sort",
          label: "排序",
          minWidth: "200",
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
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
        noPage: true,
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
        {
          key: "table-del",
          type: "text",
          icon: "el-icon-delete",
          value: "移除",
          func: function(index, row) {
            _this.handleDelete(index, row);
          },
        },
      ],
      btnStatus: {},
      filterText: "",
      version: 1,
      treeData: []
    };
  },
  components: {
    DiyTable,
    TheEditDialog,
    TheAddDialog,
    TheTableButton,
    TheAddEntryDialog
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted() {},
  updated() {
    
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadData();
    },
    dictData:{
      handler(val){
        this.getMaxVersion(val)
      },
      deep:true
    },
  },
  props: ["dictData"],
  methods: {
    //  获取最大版本号
    getMaxVersion(data){
      let params={
        parentid: data.id
      }
      getDictMax(params).then((res) => {
        this.dictData.version = res.data
        this.$nextTick(()=>{
          this.loadData()
        })
      });
    },
    handleAddEntry(){
      this.dialogShow.map((el)=>{
        if(el.key == 'addEntry'){
          el.value = true,
          el.sendData = this.dictData
        }
      })
    },
    async loadData() {
      this.$refs.table.loading = true;
      let params = {
        parentid: this.dictData.id,
        version: this.dictData.version
      };
    await getDictItem(params).then((res) => {
        this.treeData = res.data.data
        this.tableData = this.getDealMenu(this.treeData)
      });
      this.$refs.table.loading = false;
    },
    getDealMenu(arr){
      arr.forEach(function(item) {
        delete item.children;
      });
      let map = {}
      arr.forEach(i => {
        map[i.id] = i;
      });
      let treeData = [];
      arr.forEach(child => {
        const mapItem = map[child.parentId]; //判断当前数据的parentId是否存在map中
        if (mapItem) {
          (mapItem.children || (mapItem.children = [])).push(child); //这里判断mapItem中是否存在child
        } else {
          treeData.push(child);
        }
      });
      return treeData;
    },
    /**
     * 表格内按钮操作
     */
    handleEdit(index, row) {
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            ids: row.id,
          };
          delDictItem(params).then((res) => {
            this.$message.success("删除条目成功");
            this.loadData();
          });
        }).catch(() => {
          return         
        });
    },
    // 关闭dialog
    handleCloseDialog(key){
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
        }
      });
      this.loadData()
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
</style>
