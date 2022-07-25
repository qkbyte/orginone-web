<template>
  <div class="position-box" style="flex:1;height:1px">
    <TheSearchInput
      placeholder="输入性质名称进行搜索"
      :filterText.sync="filterText"
    ></TheSearchInput>
    <el-scrollbar style="height:100%;padding-bottom:10px" id="scorllBar">
    <div class="tree">
      <el-tree
        id="tree"
        class="filter-tree"
        :data="treeData"
        node-key="id"
        highlight-current
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree"
        v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0.7)"
        element-loading-text="删除中"
      >
        <div
          class="node-model"
          @click.stop="handleClick(data)"
          slot-scope="{ node, data }"
        >
          <div class="node-model--left">
            <div class="node-model__title" :title="data.propertiesName">
              <svg class="icon " aria-hidden="true">
                <use :xlink:href="'#icon-gerenzhongxin1'"></use>
              </svg>
              {{ data.propertiesName }}
            </div>
          </div>
        </div>
      </el-tree>
    </div>
    </el-scrollbar>
    <template v-for="item in dialogShow">
      <TheEditDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheEditDialog>
    </template>
    <div
      style="height:46px;border-top:1px solid #EBEEF5;margin-bottom:8px"
      class="flex-center"
    >
      <el-button
        type="text"
        style="width:100%;font-size:16px;height:55px"
        @click="$emit('handle-go')"
        >性质维护</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TheSearchInput from "../TheSearchInput";
import TheEditDialog from "./TheEditDialog";
import DiyButton from "@components/DiyButton/index";
import { getPositionList, deletePosition } from "@api/position";
import {
  getGroupProperties,
  groupGetNoProperty,
  removeProperties,
} from "@api/group";

export default {
  name: "ThePosTree",
  data() {
    return {
      dialogShow: [
        {
          key: "edit",
          value: false,
        },
      ],
      filterText: "",
      treeData: [],
      loading: false,
      current: 1,
      treeData:[],
      isScorll:false,
      expendRight: 0,
      timer: null
    };
  },
  watch: {
    filterText(val) {
      this.current = 1
      this.$refs.tree.filter(val);
    },
  },
  computed: {
    ...mapGetters("group", ["curGroupId"]),
  },
  components: { TheSearchInput, DiyButton, TheEditDialog },
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
        this.expendRight =  -event.target.scrollLeft + 'px'
        // var left = document.getElementById("list");
        var left = document.getElementById("scorllBar").childNodes[0];
        var scrollTop = left.scrollTop;
        var windowHeight = left.clientHeight;
        var scrollHeight = left.scrollHeight;
         console.log(scrollTop,windowHeight,scrollHeight);
        if (scrollTop + windowHeight + 1 >= scrollHeight) {
          this.timer = setTimeout(() => {
            this.current++;
            this.isScorll = true
            this.loadData();
          }, 500);
        }
      };
      // let listener = document.getElementById("scorllBar");
      let listener = document.getElementById("scorllBar").childNodes[0];
      listener.addEventListener("scroll", handler, true);
      this.$once("hook:beforeDestroy", (e) => {
        listener.removeEventListener("scroll", handler);
      });
    });
  },
  methods: {
    /**
     * @method 加载单位列表
     */

    loadData(val) {
      if(this.isScorll == false){
        this.treeData = [
          {
            id: -1,
            propertiesName: "未分配单位",
          },
        ]
      }
      let params = {
        current: this.current,
        size: 20,
        groupId: this.curGroupId,
      };
      getGroupProperties(params).then((res) => {
        this.treeData = this.treeData.concat(res.data.data.records);
        this.$parent.$parent.posTreeList = this.treeData;
        this.$nextTick(() => {
          // this.$refs.tree.setCurrentKey(-1);
          this.handleClick(this.treeData[0])
        });
      });
      this.isScorll = false
    },

    /**
     * @method 选择性质时
     */
    handleClick(data) {
      console.log('data',data);
      // this.$parent.$parent.$refs.table.$refs.table.page.currentPage = 1;
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(data.id);
      });
      this.handleUpdate(data.id);
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
      return data.propertiesName.indexOf(value) !== -1;
    },

    /**
     * @method 删除性质
     */
    handleDelete(data, node) {
       this.$confirm('此操作将永久删除该性质, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          let params = {
            propertiesIds: data.id,
          };
          removeProperties(params).then(
            (res) => {
              this.loading = false;
              this.$nextTick(() => {
                this.current = 1
                this.handleClick({ id: -1 });
                this.loadData('del');
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
        }).catch(() => {
          return          
        });
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
@import "@styles/common.scss";
::v-deep .is-vertical {
  display: none;
}
::v-deep .el-scrollbar__view {
  display: inline-block;
}
::v-deep .el-scrollbar__wrap {
  overflow: auto;
}
::v-deep .el-tree-node {
  min-width: 225px;
}
::v-deep .el-tree__empty-text{
  width: 100px;
}
::v-deep .el-scrollbar__view{
  height: 100%;
}
.tree {
  @include background_color("background_color3");
  // flex: auto;
  background: white;
  margin-top: 15px;
  min-width: 260px;
  .el-tree-node {
    .el-tree-node__content {
      height: 40px;
      min-width: 100%;
      display: inline-flex;
    }
    .el-tree-node__children {
      overflow: unset;
      width: 100%;
    }
  }
}
.position-box {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.search-select {
  margin-top: 15px;
}
.position-box ::v-deep .el-cascader {
  height: 30px;
  .el-input,
  .el-input__inner {
    height: 30px;
  }
  .el-input--suffix {
    height: 40px;
  }
}

.filter-tree {
  @include background_color("background_color3");
  height: 100%;
  .node-model {
    width: 100%;
    height: 30px;
    padding-right: 20px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;

    &--left {
      padding-right: 20px;
      flex: 1;
    }

    &__title {
      overflow: hidden;

      svg {
        margin-right: 5px;
      }
    }
    &__btn {
      position: absolute;
      background: white;
      width: 20px;
      margin-top: 5px;
      display: flex;
      align-items: center;
    }
  }
}
::v-deep .el-tree {
  flex: auto;
  overflow: auto;
}
.filter-tree ::v-deep .el-tree-node__content {
  height: 30px;
}
.node-model__btn ::v-deep .diy-button-bg {
  background-color: transparent;
  width: 20px;
}
</style>
