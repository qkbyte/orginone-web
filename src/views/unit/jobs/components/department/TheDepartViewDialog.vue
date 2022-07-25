<template>
  <el-dialog
    center
    top="10vh"
    width="700px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
  >
    <span slot="title" class="diy-dialog-title"> 人员所属部门 </span>
    <div class="body-container diy-dialog-body">
      <DiyTable
        ref="table"
        :tableHead="tableHead"
        :options="options"
        :tableData="tableData"
        :hasTabs="true"
        @handleUpdate="loadData"
      >
        <template v-slot:operate="scope">
          <TheTableButton
            :row="scope.row"
            :index="scope.index"
            @handleDepart="handleDepart"
            @handleDelete="handleDelete"
          ></TheTableButton>
        </template>
      </DiyTable>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClose('cancel')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DiyTable from "@components/DiyTable/index";
import TheTableButton from "./TheDepartButton";
export default {
  name: "TheAppDialog",
  components: { DiyTable, TheTableButton },
  data() {
    return {
      tableData: [],
      tableHead: [
        {
          prop: "agencyCode",
          label: "部门编码",
          width: "200",
        },
        {
          prop: "agencyName",
          label: "所属部门",
          width: "200",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          name: "operate",
        },
      ],
      options: {
        labelWidth: "100px",
      },
      options: {
        checkBox: true,
        order: true,
        defaultSort: { prop: "createdTime", order: "descending" },
        noPage: true,
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
      },
      loading: false,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.loadData();
  },
  computed: {},
  methods: {
    loadData() {
      this.$nextTick(() => {
        this.tableData = this.dialogShow.sendData;
        this.$refs.table.loading = false;
      });
    },
    handleDelete(index, data) {
      this.$confirm("此操作将该人员移出该部门, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(this.tableData);
          this.tableData.forEach((el,index)=>{
            if(el.id == data.id){
              this.tableData.splice(index,1)
            }
          })
          this.$emit("handleDepartDel", data, this.dialogShow.list.id);
        })
        .catch(() => {});
    },
    handleDepart(data) {
      console.log('data',this.$parent.$parent.$parent);
      this.handleClose();
      this.$parent.value1 = false;
      this.$parent.$parent.$parent.handleTreeKey(data);
      this.$parent.$parent.$parent.mainTableData[0].value1 = data.agencyName;
    },
    handleClose(data) {
      this.$emit("closeDialog", this.dialogShow.key, data);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  overflow: auto;
}
::v-deep .el-transfer-panel {
  width: 270px;
}
::v-deep .el-transfer-panel__filter {
  width: 245px !important;
}
.diy-dialog-body {
  justify-content: space-between;
  .el-form {
    justify-content: space-between;
    .el-input {
      width: 300px;
    }
  }
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 10px;
}
.body-container {
  margin-top: 10px;

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 30px;
    color: rgba(48, 49, 51, 1);
  }
}
.body-item {
  margin-top: 10px;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-main {
    width: 100%;
    margin-top: 10px;
  }

  .diy-table {
    padding: 0;
  }
}

.node-model__list {
  font-size: 16px;
  margin-left: 10px;
  padding-left: 40px;
  padding: 10px;
  cursor: pointer;
}
.node-model__click {
  background: rgb(236, 241, 252);
}
.node-model__list:hover {
  background: rgb(236, 241, 252);
}
::v-deep .el-tree {
  background: rgba(0, 0, 0, 0);
  font-size: 16px;
}
::v-deep .el-tree-node {
  // margin-top: 8px;
  padding: 4px 0;
}
::v-deep .el-tree-node__content {
  height: 30px;
}
::v-deep .el-tree .is-current {
  color: rgb(62, 120, 255);
}
.headLayout-avatar_img {
  width: 20px;
  height: 20px;
  background: #154ad8;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  margin-right: 5px;
  color: #ffffff;
}
.headLayout-avatar_img2 {
  width: 30px;
  height: 30px;
  background: #154ad8;
  margin-top: 10px;
  margin-left: 10px;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  font-size: 15px;
  color: #ffffff;
  margin-left: 60px;
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
::v-deep .el-input__inner {
  border: 0;
  background-color: rgb(250, 250, 252);
}
::v-deep .el-dialog {
  transform: translate(-20%);
}
.el-icon-search {
  font-size: 20px;
  margin-top: 10px;
}
.flex-row {
  width: 80%;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid rgb(215, 218, 224);
}
.diy-dialog-depart {
  display: flex;
  flex-direction: row;
  &__text {
    font-size: 15px;
    margin: 16px 0 0 20px;
  }
}
.search-list {
  &__search {
    margin-right: 40px;
  }
}
.diy-dialog-body {
  &__row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  &__center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__radio {
    margin-left: 30px;
    margin-top: 15px;
  }
  &__treeBox {
    margin-top: 10px;
  }
  &__tree {
    margin-top: 20px;
    background-color: rgb(250, 250, 252);
    overflow: auto;
    width: 100%;
    height: 430px;
  }
}
</style>
<style lang="scss" scoped>
.diy-dialog-body {
  flex: 1;
  height: 1px;
}
.body-container ::v-deep .el-form {
  .el-cascader,
  .el-input {
    width: 300px;
  }
}
::v-deep .el-textarea__inner {
  height: 200px;
}
::-webkit-scrollbar {
  width: 8px;
  height: 7px;
  background: #ffffff;
}
::-webkit-scrollbar-thumb {
  height: 0px;
  border-radius: 4px;
  background: #90939928;
}
::-webkit-scrollbar-thumb:hover {
  width: 8px;
  background: #90939967;
}
::v-deep.diy-dialog-body {
  border: 0 !important;
}
::v-deep .el-tabs__header {
  margin: 0px !important;
}
::v-deep .el-dialog__body {
  height: 556px;
  display: flex;
  flex-direction: column;
}
.tabs {
  width: 490px;
}
.diy-dialog-box {
  border: 1px solid rgba(235, 238, 245, 1);
  padding: 10px;
  display: flex;
  flex-direction: column;
  &__checkBox {
    border: 1px solid rgba(235, 238, 245, 1);
    padding: 10px;
  }
  &__radio {
    margin-top: 10px;
    border: 1px solid rgba(235, 238, 245, 1);
    padding: 10px;
  }
  &-treeBox {
    display: flex;
    flex-direction: row;
    margin-top: 5px;
  }
  &-left,
  &-right {
    width: 50%;
    padding: 16px;
    border: 1px solid rgba(235, 238, 245, 1);
  }
}
.layout-role {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(235, 238, 245, 1);
}
.diy-dialog-body {
  border: 1px solid rgba(235, 238, 245, 1);
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  justify-content: flex-start;
  &--left,
  &--right {
    width: 50%;
    height: 500px;
    padding: 16px;
  }

  &--left {
    border-right: 1px solid rgba(235, 238, 245, 1);
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    height: 20px;
    color: rgba(48, 49, 51, 1);
  }

  &__list {
    height: 440px;
    margin-top: 10px;
    overflow-y: scroll;

    li {
      overflow: hidden;
      height: 26px;
      line-height: 26px;
      display: flex;
      justify-content: space-between;

      i {
        margin-right: 5px;
        color: #c0c4cc;
        cursor: pointer;

        &:hover {
          color: #9da1a8;
        }
      }
    }
  }
}
::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-65%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
</style>
