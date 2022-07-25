<template>
  <div
    class="base-flex"
    style="height:100%"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="删除中"
  >
    <div class="search-list__option">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
    </div>
    <el-scrollbar style="height:100%;padding-top:5px;padding-bottom:10px" id="scorllBar">
    <div class="tree" id="tree">
      <el-tree
        class="filter-tree"
        :data="treeData"
        node-key="id"
        highlight-current
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree"
      >
        <div
          class="node-model"
          @click.stop="handleClick(data)"
          slot-scope="{ node, data }"
        >
          <div class="node-model--left">
            <div class="node-model__title" :title="data.jobName">
              <svg class="icon " aria-hidden="true">
                <use :xlink:href="'#icon-gerenzhongxin1'"></use>
              </svg>
              {{ data.jobName }}
            </div>
          </div>
        </div>
      </el-tree>
    </div>
    </el-scrollbar>
    <div
      style="height:45px;border-top:1px solid #EBEEF5;margin-bottom:8px"
      class="flex-center"
    >
      <el-button
        type="text"
        style="width:100%;font-size:16px;"
        @click="$emit('handle-go')"
        >岗位维护</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DiyButton from "@components/DiyButton/index";
import { getPositionList, deletePosition, getSearchJobList } from "@api/position";

export default {
  name: "ThePosTree",
  data() {
    return {
      filterText: "",
      treeData: [
        {
          id: -1,
          jobName: "未分配人员",
        },
      ],
      loading: false,
      current: 1,
      timer: null,
      search: ''
    };
  },
  watch: {
    filterText(val) {
      this.search = val
      this.treeData = []
      this.current = 1
      this.searchData(val)
    },
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
  },
  components: { DiyButton },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  beforeDestroy(){
    clearTimeout(this.timer)
    this.timer = null
  },
  mounted() {
    // 滚动加载数据
    this.$nextTick(() => {
      let handler = (event) => {
        // var left = document.getElementById("list");
        var left = document.getElementById("scorllBar").childNodes[0];;
        var scrollTop = left.scrollTop;
        var windowHeight = left.clientHeight;
        var scrollHeight = left.scrollHeight;
        console.log(scrollTop,windowHeight,scrollHeight);
        if (scrollTop + windowHeight + 1 >= scrollHeight) {
          this.timer = setTimeout(()=>{
            this.current += 1;
            if(this.search !== ''){
              this.searchData(this.search)
            }else{
              this.loadData();
            }
          }, 500)
        }
      };
      // let listener = document.getElementById("list");
      let listener = document.getElementById("scorllBar").childNodes[0];;
      listener.addEventListener("scroll", handler, true);
      this.$once("hook:beforeDestroy", (e) => {
        listener.removeEventListener("scroll", handler);
      });
    });
  },
  methods: {
    /**
     * @method 加载岗位列表
     */

    loadData() {
      let params = {
        current: this.current,
        size: 20,
        tenantCode: this.curTenantCode,
      };
      getPositionList(params).then((res) => {
        this.treeData = this.treeData.concat(res.data.data.records);
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.$parent.$parent.curPos);
        });
      });
    },

    /**
     * @method 选择岗位时
     */
    handleClick(data) {
      this.$parent.$parent.curNode = data;
      this.$parent.$parent.mainTableData[0].value1 = data.jobName;
      this.$parent.$parent.$refs.table.$refs.table.page.currentPage = 1;
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(data.id);
      });
      this.handleUpdate(data.id);
    },

    /**
     * @method 搜索岗位列表
     */
     searchData(val) {
      if(val == ''){
        this.treeData =  [
          {
            id: -1,
            jobName: "未分配人员",
          },
        ]
      }
      let params = {
        current: this.current,
        size: 20,
        tenantCode: this.curTenantCode,
        name: val
      };
      getSearchJobList(params).then((res) => {
        this.treeData = this.treeData.concat(res.data.data.records);
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.$parent.$parent.curPos);
        });
      });
    },

    /**
     * @method 更新父组件当前选择部门、岗位数据
     */
    handleUpdate(posId) {
      this.$emit("update:curPos", posId);
      this.$emit("update:curDept", "");
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.jobName.indexOf(value) !== -1;
    },

    /**
     * @method 删除岗位
     */
    handleDelete(data) {
      this.loading = true;
      let params = {
        id: data.id,
        tenantCode: this.curTenantCode,
      };
      deletePosition(params).then(
        (res) => {
          this.loading = false;
          this.$nextTick(() => {
            this.handleUpdate(-1);
            this.loadData();
          });
          this.$message.success({
            message: "删除成功",
            duriation: 700,
          });
        },
        (err) => {
          this.loading = false;
        }
      );
    },
    /*
     * 点击节点，初始化current为1
     */
    initCurrent() {},
    handleCloseDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
        }
      });
      this.loadData();
      this.$emit("handleUpdate");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .is-vertical{
  display: none;
}
::v-deep .el-scrollbar__wrap{
  overflow: auto;
}
.tree{
    min-width: 220px;
    padding-top: 5px;
    flex:auto;
    background: white;
    .el-tree-node {
      .el-tree-node__content {
        height: 40px;
        min-width:100%;
        display:inline-flex;
      }
      .el-tree-node__children {
        overflow: unset;
        width: 100%;
      }
    }
}
.filter-tree {
  display: flex;
  flex-direction: column;
  // overflow: auto;
  height: 100%;
  .node-model {
    width: 100%;
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;

    &--left {
      flex: 1;
    }

    &__title {
      overflow: hidden;

      svg {
        margin-right: 5px;
      }
    }
    &__btn {
      width: 20px;
      display: flex;
      align-items: center;
    }
  }
}
.filter-tree ::v-deep .el-tree-node__content {
  height: 30px;
}
.node-model__btn ::v-deep .diy-button-bg {
  background-color: transparent;
}
</style>
