<template>
  <div class="main">
    <div class="main--left box" style="margin-right:4px">
      <DiyBoxLayout class="flex-column">
        <div class="main--left__box">
          <div class="main--left__head">字典列表</div>
          <div class="main--left__icon">
            <div class="flex-center" @click="openDictDialog" ><i class="el-icon-plus"></i></div>
            <el-popover
              placement="bottom-end"
              width="150"
              trigger="hover"
            >
              <div slot="reference" class="el-icon-view"></div>
              <el-checkbox-group style="margin-left: 20px" v-model="checkList">
                <el-checkbox style="margin-bottom: 10px" label="字典名"></el-checkbox>
                <el-checkbox label="字典编码" ></el-checkbox>
              </el-checkbox-group>
            </el-popover>
          </div>
        </div>
        <TheDeptTree
          class="main-left-tree"
          ref="deptTree"
          :checkList="checkList"
        ></TheDeptTree>
      </DiyBoxLayout>
    </div>
    <div class="main--right box right-FBL">
      <DiyBoxLayout style="height:230px">
        <div class="main-form">
          <div class="title" style="margin-top:10px">
            <div class="title-left">字典信息</div>
            <div>
              <span @click="handleDistribute">发布</span>
            </div>
          </div>
          <div class="table">
            <div class="table-tr">
              <div class="table__left">字典编码</div>
              <div class="table__column">{{ dictData.code }}</div>
              <div class="table__left">字典名称</div>
              <div class="table__column">{{ dictData.dictValue }}</div>
            </div>
            <div class="table-tr">
              <div class="table__left">字典排序</div>
              <div class="table__column">{{ dictData.sort }}</div>
              <div class="table__left">备注</div>
              <div class="table__column">{{ dictData.remark }}</div>
            </div>
          </div>
        </div>
      </DiyBoxLayout>
      <DiyBoxLayout class="main--right box">
        <TheUserTable ref="table" :dictData="dictData"></TheUserTable>
      </DiyBoxLayout>
    </div>
    <template v-for="item in dialogShow">
      <TheAddDictDialog
        v-if="item.key === 'addDict' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAddDictDialog>
      <TheAuthDialog
        v-if="item.key === 'auth' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAuthDialog>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getDictTree } from "@api/dict";
import TheUserTable from "./components/TheUserTable";
import DiyTable from "@components/DiyTable/index";
import TheEditDialog from "./components/TheEditDialog";
import TheAddDialog from "./components/TheAddDialog";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./components/TheTableButton";
import TheDeptTree from "./components/TheDeptTree"
import TheAddDictDialog from "./components/TheAddDictDialog"
export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "addDict",
          value: false,
        },
        {
          key: "edit",
          value: false,
        },
        {
          key: "addEntry",
          value: false,
        },
      ],
      tableName: "字典列表",
      tableData: [],
      tableHead: [
        {
          prop: "dictValue",
          label: "字典名称",
          width: "240",
        },
        {
          prop: "code",
          label: "字典编号",
          width: "300",
        },
        {
          prop: "currversion",
          label: "当前版本",
          align: "center",
          width: "100",
        },
        {
          prop: "sort",
          label: "字典排序",
          minWidth: "80",
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
          key: "delete",
          type: "text",
          icon: "el-icon-delete",
          value: "删除",
          func: function(index, row) {
            _this.handleDelete(index, row);
          },
        },
      ],
      filterText: "",
      dictData: "",
      checkList: []
    };
  },
  components: {
    DiyTable,
    TheEditDialog,
    TheAddDialog,
    DiyBoxLayout,
    TheTableButton,
    TheDeptTree,
    TheUserTable,
    TheAddDictDialog
  },
  mounted() {
    this.loadData();
    this.$nextTick(()=>{
      this.checkList = ['字典名']
    })
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
      this.loadData();
    },
  },
  methods: {
    loadData() {
      // let params = {
      //   code: ''
      // };
      // getDictTree(params).then((res) => {
      //   console.log('res123', res);
      // });
    },

    /**
     * 点击发布按钮
     */
    handleDistribute() {
      this.$confirm('此操作将发布改字典, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '发布成功!'
          });
        }).catch(() => {
          return   
        });
    },

    openDictDialog(){
      this.dialogShow.map((el) => {
        if (el.key === "addDict") {
          el.value = true;
        }
      });
    },

    handleCloseDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
        }
      });
      this.$refs.deptTree.loadData()
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
      let params = {
        id: row.id,
      };
      delDict(params).then((res) => {
        this.$message.success("删除字典成功");
        this.loadData();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  display: flex;
  height: 100%;
  .box {
    display: flex;
    flex-direction: column;
  }
  .main-left-tree {
    display: flex;
    flex-direction: column;
  }
  &--left {
    width: 260px;
    &__box{
      display: flex;
      flex-direction: row;
      height: 52px;
    }
    &__head{
      font-size: 15px;
      font-weight: bold;
      margin-top: 25px;
    }
    &__icon{
      display: flex;
      flex-direction: row-reverse;
      flex: 1;
      .el-icon-view{
        color:#154AD8;
        margin: 28px;
        cursor: pointer;
      }
      .el-icon-plus{
        color: #ffffff;
        font-size: 12px;
      }
      .flex-center{
        width: 16px;
        height: 16px;
        background: #154AD8;
        border-radius: 50%;
        margin-top: 25px;
        cursor: pointer;
      }
    }
  }

  &--right {
    flex: 1;
    height: 100%;
  }
}
.table{
  width: 100%;
  border-collapse: collapse;
  height: 100%;
  display: flex;
  flex-direction: column;
  &-tr{
    display: flex;
    flex-direction: row;
    border: 1px solid rgba(239, 242, 247);
    color: #666;
    height: 45px;
  }
  &__left{
    background: rgb(245, 246, 252);
    width: 10%;
    min-width: 110px;
    text-align: center;
    line-height: 45px;
  }
  &__column{
    width: 39.6%;
    text-align: left;
    padding: 0 20px;
    line-height: 45px;
  }
  &__all{
    width: 90%;
    text-align: left;
    padding: 0 20px;
    line-height: 45px;
  }
}
.main-form {
  padding: 15px 0 25px 0;
  .title {
    display: flex;
    justify-content: space-between;
    .title-left {
      font-size: 16px;
      font-weight: 600;
      color: rgba(48, 49, 51, 1);
      margin-bottom: 20px;
    }
    span {
      margin-left: 12px;
      color: #154ad8;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
  }
}
.right-FBL{
   @media screen and (max-width: 1280px) {
     width: 800px;
   }
}
</style>
