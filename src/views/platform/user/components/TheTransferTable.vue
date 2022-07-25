<template>
  <div class="diy-table">
    <div class="diy-table__header" v-if="hasTableHead">
      <div class="diy-table__header--left">
        <div class="header-title" v-if="hasTitle">
          {{ tableName }}
          <slot name="slot-title"></slot>
        </div>
        <div class="header-tabs" v-if="hasTabs">
          <slot name="slot-tabs"></slot>
        </div>
      </div>
      <div class="diy-table__header--right">
        <div class="header-buttons">
          <slot name="buttons"></slot>
        </div>
      </div>
    </div>
    <div class="diy-table__btn">
      <div>
        <slot name="slot-select"></slot>
      </div>
      <div>
        <slot name="slot-buttons"></slot>
      </div>
    </div>
    <div class="diy-table__body">
      <div class="diy-table__body-box">
        <el-table
          ref="diyTable"
          style="width:100%;height:100%;"
          height="'true'"
          class="table-row-sty"
          tooltip-effect="dark"
          :header-cell-style="getRowClass"
          :row-style="{ height: '44px' }"
          :cell-style="{ padding: '0px' }"
          :data="tableData"
          row-key="id"
          v-bind="options"
          v-loading="loading"
          border
          stripe
          @select-all="selectAll"
          @selection-change="handleSelectionChange"
          @cell-mouse-enter="handleMouseEnter"
          @sort-change="handleSortChange"
          @row-click="handleRowClick"
        >
          <el-table-column
            v-if="options.checkBox"
            type="selection"
            width="50"
          ></el-table-column>
          <el-table-column
            v-if="options.order"
            type="index"
            label="序号"
            width="50"
          ></el-table-column>
          <template v-for="(item, index) in tableHead">
            <el-table-column
              v-if="item.type === 'slot'"
              :key="index"
              v-bind="item"
              :sortable="item.sortable"
            >
              <template slot-scope="scope">
                <slot
                  :name="item.name"
                  :row="scope.row"
                  :index="scope.$index"
                ></slot>
              </template>
              <template slot="header" slot-scope="scope">
                {{ scope.column.label }}
                <template v-if="scope.column.label === '操作'"
                  ><svg
                    class="icon "
                    aria-hidden="true"
                    style="cursor:pointer;color:#606266;margin-left:4px;"
                  >
                    <use :xlink:href="'#icon-shezhibiaodan'"></use>
                  </svg>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="'column' + index"
              v-bind="item"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-show="scope.row.showInput" v-model="editData[scope.$index].id" @focus="focusEvent(scope.$index)"></el-input>
                <p v-show="!scope.row.showInput">{{scope.row.id}}</p>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
    </div>
    <div class="diy-table__footer">
      <div class="footer-buttons">
        <div class="footer-operate" v-if="batchOperate.length">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              批量操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in batchOperate"
                :command="item.key"
                :key="item.key"
                >{{ item.value }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="footer-pagination" v-if="!options.noPage">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-bind="page"
          :pager-count="5"
          style="text-align:right;margin-top:10px;"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from "./eventBus"
import { mapActions, mapState } from "vuex";
export default {
  name: "BaseTable",
  data() {
    return {
      //表格信息
      loading: true, //加载动画
      multipleSelection: [], //多选

      //分页信息
      page: {
        total: 0, // 总条数
        currentPage: 1, // 当前页
        pageSize: this.$store.state.options.pageSize, // 每页条数
        pageSizes: [20, 30, 50], // 分页数量列表
        layout: "total, prev, pager, next, sizes",
      },
      isAllSelect: false,
      editData:[]
    };
  },
  components: {},
  props: {
    tableName: {
      type: String,
      default: "",
    },
    hasTableHead: {
      type: Boolean,
      default: true,
    },
    hasTitle: {
      type: Boolean,
      default: true,
    },
    hasTabs: {
      type: Boolean,
      default: false,
    },
    tableHead: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => {},
    },
    batchOperate: {
      type: Array,
      default: () => [],
    },
    queryParams: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState("options", ["pageSize"]),
  },
  created() {
    if (this.options.page) {
      Object.keys(this.options.page).forEach((key) => {
        this.page[key] = this.options.page[key];
      });
    }
  },
  mounted(){
    Bus.$on('handleClose', ()=>{
      this.editData = this.tableData
    })
  },
  watch: {
    pageSize: {
      handler(newValue, oldValue) {
        this.page.pageSize = newValue;
      },
      immediate:true
    },
    tableData:{
      handler(newValue, oldValue) {
        this.editData = JSON.parse(JSON.stringify(newValue))
      },
      deep:true,
    },
    editData:{
      handler(val){
        Bus.$emit('getEditData', val)
      },
      deep:true
    }
  },
  destroyed(){
    Bus.$off('handleClose')
  },
  methods: {
    ...mapActions("options", ["updatePageSize"]),
    focusEvent(index){
      console.log('进入了foucus', index);
    },
    handleRowClick(row) {
      this.$emit("handleRowClick", row);
    },
    /**
     * el-table 表格配置
     */
    //配置表头背景
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background:#F5F6FC;color:#333333;font-weight:bold;height:36px;padding:2px 0;";
      } else {
        return "";
      }
    },
    //多选
    // toggleSelection(rows) {
    //   if (rows) {
    //     rows.forEach((row) => {
    //       this.$refs.diyTable.toggleRowSelection(row);
    //     });
    //   } else {
    //     this.$refs.diyTable.clearSelection();
    //   }
    // },
    toggleSelection(rows, select) {
      if (select) {
        this.$refs.diyTable.toggleRowSelection(rows, select);
      } else {
        this.$refs.diyTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * handleCommand 批量操作
     */
    handleCommand(command) {
      this.$emit("handleCommand", command);
    },
    /**
     * 初始化页码
     */
    initPage() {
      this.page.currentPage = 1;
    },
    /**
     * el-pagination 分页配置
     */
    async handleSizeChange(val) {
      console.log('分页配置',val);
      await this.updatePageSize(val);
      this.page.currentPage = 1;
      this.$emit("handleUpdate");
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.$emit("handleUpdate");
    },
    /**
     * 状态筛选
     */
    filterHandler(value, row, column) {
      const property = "status";
      return row[property] == value;
    },
    /**
     * 鼠标进入表格是隐藏groupselect的drop
     */
    handleMouseEnter() {
      this.$emit("hideDrop");
    },
    /**
     * 表头排序
     */
    handleSortChange(e) {
      this.$emit("handleSortChange", e);
    },
    /**
     * 全选事件
     */
    selectAll(selection, first) {
      if (!first) {
        this.isAllSelect = !this.isAllSelect;
      }
      if(this.isAllSelect){
        selection.map(el => {
          if (el.children) {
            el.children.map(j => {
              this.toggleSelection(j, this.isAllSelect);
            });
            if (el.children.length > 0) {
              this.selectAll(el.children, true);
            }
          }
        });
      }else{
        this.$refs.diyTable.clearSelection();
      }
      
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    padding-top: 10px;

    .header-title {
      font-size: 16px;
      font-weight: bold;
      color: rgba(48, 49, 51, 1);
      padding: 0 0 10px;

      i {
        font-size: 20px;
        color: rgba(21, 74, 216, 1);
      }
    }

    .header-tabs {
      margin-bottom: -5px;
    }

    .header-buttons {
      display: flex;
    }
  }

  &__btn {
    display: flex;
    justify-content: space-between;
  }

  &__body {
    width: 100%;
    height: 100px; //避免el-table无限变高
    display: flex;
    flex: 1;
    margin-top: 10px;

    &-box {
      width: 1vw;
      flex: auto;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .footer-operate {
      width: 110px;
      height: 40px;
      border: 1px solid rgba(209, 223, 245, 1);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      .el-dropdown {
        width: 100%;
        height: 100%;
      }
      .el-dropdown-link {
        width: 100%;
        height: 100%;
        display: block;
        text-align: center;
        height: 38px;
        line-height: 38px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }

    .footer-buttons {
      width: 350px;
      display: flex;
      justify-content: space-between;

      .select-options {
        width: 150px;
      }
    }

    .footer-pagination {
      & ::v-deep .btn-prev {
        border-radius: 16px;
      }
      & ::v-deep .el-pager > .number {
        border-radius: 4px;
      }
      & ::v-deep .btn-next {
        border-radius: 16px;
      }
      & ::v-deep .el-pagination__sizes .el-input__inner {
        border-radius: 16px;
        background: rgba(231, 239, 252, 1);
        border-color: transparent;
      }
    }
  }
}
.el-dropdown-menu {
  width: 110px;
}
.table-row-sty tr:hover,
.table-row-sty tbody tr.el-table__row.not-read:hover {
  cursor: pointer;
  color: #2da1f8;
}
@media screen and (max-width: 1280px) {
  .diy-table__header{
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
