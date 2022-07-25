<template>
  <div class="search-list" style="height:100%">
    <div class="search-list__search">
      <el-input
        prefix-icon="el-icon-search"
        v-model="searchInput"
        placeholder="请输入搜索内容"
      ></el-input>
    </div>
    <div v-show="selectType !== 2" class="head-layout">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        >全选</el-checkbox
      >
      <div class="number">
        {{ checkList.length }}/{{ getSeletctList.length }}/{{ total }}
      </div>
    </div>
    <el-scrollbar style="height:100%;padding-top:3px" id="scroll">
      <div class="tree">
        <template v-if="selectType === 0">
          <el-tree
            id="tree"
            class="firstTree"
            ref="tree"
            :props="listOption"
            :data="listData"
            node-key="userId"
            show-checkbox
            check-strictly
            default-expand-all
            :filter-node-method="filterNode"
            @check-change="handleCheckChange"
          >
          </el-tree>
        </template>
        <div v-else-if="selectType === 1">
          <el-tree
            id="tree"
            class="sencondTree"
            ref="tree"
            :props="listOption"
            :data="listData"
            node-key="id"
            show-checkbox
            check-strictly
            default-expand-all
            :filter-node-method="filterNode"
            @check-change="handleCheckChange"
          >
          </el-tree>
        </div>
        <div v-else>
          <div class="search-list__option">
            <el-radio-group v-model="checkOption" @change="radioChange">
              <el-radio :label="1">包含下级部门</el-radio>
              <el-radio :label="2">仅当前部门</el-radio>
            </el-radio-group>
          </div>
          <el-tree
            id="tree"
            class="thirdTree"
            ref="tree"
            :props="listOption"
            :data="listData"
            node-key="id"
            show-checkbox
            default-expand-all
            :check-strictly="true"
            :filter-node-method="filterNode"
            @check-change="handleCheckChange"
            @check="handleCheck"
          >
          </el-tree>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchInput: "",
      listOption: {
        label: "",
        children: "children",
      },
      multipleSelection: [],
      curType: 0,
      current: 1,
      timer: null,
      listNode: 0,
      checkOption: 1, //关联下级节点
      checkStrictly: false,
      timer: null,
      arrList: [],
      checkList: [], // 当前勾选的数据
      checkAll: false,
      isIndeterminate: false,
    };
  },
  props: {
    total: {
      type: Number,
      default: 0,
    },
    selectType: {
      type: Number,
      default: 0,
    },
    listTitle: {
      type: String,
      default: "列表",
    },
    listData: {
      type: [Object, Array],
    },
    title: {
      type: String,
      default: "title",
    },
    type: {
      type: Number,
      default: 0,
    },
    isChoose: {
      type: Boolean,
      default: false,
    },
    curTab: {
      type: String,
      default: "",
    },
    allListData: {
      type: Array,
      default: () => [],
    },
    searchId: {
      type: [Number, String],
      default: -1,
    },
  },
  watch: {
    searchInput(val) {
      if (this.selectType == 2) {
        this.$refs.tree.filter(val);
      } else if (this.selectType == 0) {
        this.$parent.handlerSearchRight(val);
      } else {
        this.$parent.allList = [];
        this.$parent.searchJobList(val);
      }
    },
    title: {
      handler(n, o) {
        this.listOption.label = this.title;
      },
      deep: true,
    },
    type: {
      handler(n, o) {
        this.curType = n;
      },
      deep: true,
    },
  },
  computed: {
    getSeletctList() {
      return this.$parent.selectList;
    },
  },
  created() {
    this.listOption.label = this.title;
    this.arrList = this.allListData;
  },
  mounted() {
    this.$nextTick(() => {
      if (this.selectType != 2) {
        let handler = (event) => {
          // var left = document.getElementById("list");
          var left = document.getElementById("scroll").childNodes[0];
          var scrollTop = left.scrollTop;
          var windowHeight = left.clientHeight;
          var scrollHeight = left.scrollHeight;
          // console.log(scrollTop,windowHeight,scrollHeight);
          if (scrollTop + windowHeight + 0.5 >= scrollHeight) {
            this.timer = setTimeout(() => {
              this.$parent.current += 1;
              this.$parent.isCurrent = true;
              if (this.selectType == 0) {
                this.$parent.handleNode(this.searchId);
              } else {
                this.$parent.loadAllList(this.arrList);
              }
            }, 500);
          }
        };
        // let listener = document.getElementById("list");
        let listener = document.getElementById("scroll").childNodes[0];
        listener.addEventListener("scroll", handler, true);
        this.$once("hook:beforeDestroy", (e) => {
          listener.removeEventListener("scroll", handler);
        });
      }
    });
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.timer = null;
  },
  methods: {
    handleCheckAllChange(val) {
      // 全选的变化函数
      this.checkAll = val;
      this.isIndeterminate = false;
      if (this.checkAll) {
        this.$refs.tree.setCheckedNodes(this.listData);
      } else {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    handleCheck(data) {
      const node = this.$refs.tree.getNode(data.id);
      this.setNode(node);
    },
    //递归设置子节点和父节点
    setNode(node) {
      if (this.checkOption === 1) {
        //关联子节点
        if (node.checked) {
          //如果选中当前节点,则递归设置子节点全部取消选中
          this.setChildNdoe(node, true);
        } else {
          //如果取消选中当前节点,则递归设置子节点全部选中
          this.setChildNdoe(node, false);
        }
      }
    },
    //递归设置子节点状态
    setChildNdoe(node, check) {
      if (node.childNodes && node.childNodes.length) {
        node.childNodes.forEach((item) => {
          item.checked = check;
          this.setChildNdoe(item, check);
        });
      }
    },
    radioChange(val) {
      if (val == 1) {
        this.checkStrictly = false;
      } else {
        this.checkStrictly = true;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.agencyName.indexOf(value) !== -1;
    },
    getChoseTree() {
      // 用来获取已选中的树
      console.log("执行代码");
      if (this.selectType == 0) {
        let arr = [];
        if (this.arrList[0].userIds.length !== 0) {
          this.arrList[0].userIds.forEach((el) => {
            arr = [...arr, el.userId];
          });
          arr = arr.splice(",");
          this.$refs.tree.setCheckedKeys(arr);
          this.$parent.selectList = this.arrList[0].userIds;
        }
      } else if (this.selectType == 1) {
        let arr = [];
        if (this.arrList[0].jobIds.length !== 0) {
          this.arrList[0].jobIds.forEach((el) => {
            arr = [...arr, el.jobId];
          });
          arr = arr.splice(",");
          this.checkList = arr; // 切换时重新加载
          this.$refs.tree.setCheckedKeys(arr);
          this.$parent.selectList = this.arrList[0].userIds;
        }
      } else {
        let arr = [];
        if (this.arrList[0].agencyIds.length !== 0) {
          this.arrList[0].agencyIds.forEach((el) => {
            arr = [...arr, el.agencyId];
          });
          arr = arr.splice(",");
          this.$refs.tree.setCheckedKeys(arr);
          this.$parent.selectList = this.arrList[0].agencyIds;
          // this.$parent.$parent.selectList = this.arrList[i].agencyIds
        }
      }
      this.$parent.tabSwitch = true;
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log("进入勾选", checked);
      let arr = this.arrList;
      for (let i = 0; i < arr.length; i++) {
        if (this.selectType == 0) {
          // 按人员分配
          if (checked) {
            let handle = false;
            for (let j in arr[i].userIds) {
              if (arr[i].userIds[j].userId == data.userId) {
                handle = true;
                break;
              }
            }
            if (handle) {
              break;
            } else {
              arr[i].userIds.push({
                userId: data.userId,
                realName: data.realName,
              });
            }
          } else if (checked == false) {
            for (let j = 0; j < arr[i].userIds.length; j++) {
              if (arr[i].userIds[j].userId == data.userId) {
                arr[i].userIds.splice(j, 1);
                if (arr[i].userIds.length == 0) {
                  this.$refs.tree.setCheckedKeys([]);
                }
                break;
              }
            }
          } else {
            break;
          }
        } else if (this.selectType == 1) {
          // 按岗位分配
          if (checked) {
            let handle = false;
            for (let j = 0; j < arr[i].jobIds.length; j++) {
              if (arr[i].jobIds[j].jobId == data.id) {
                handle = true;
                break;
              }
            }
            if (handle) {
              break;
            } else {
              arr[i].jobIds.push({
                jobId: data.id,
                jobName: data.jobName,
              });
              this.checkList = arr[i].jobIds;
            }
          } else if (this.$parent.tabSwitch == true && checked == false) {
            for (let j = 0; j < arr[i].jobIds.length; j++) {
              if (arr[i].jobIds[j].jobId == data.id) {
                arr[i].jobIds.splice(j, 1);
                if (arr[i].jobIds.length == 0) {
                  this.$refs.tree.setCheckedKeys([]);
                }
                break;
              }
            }
          } else {
            break;
          }
        } else {
          // 按部门分配
          if (checked) {
            let handle = false;
            for (let j in arr[i].agencyIds) {
              if (arr[i].agencyIds[j].agencyId == data.id) {
                handle = true;
                break;
              }
            }
            if (handle) {
              break;
            } else {
              arr[i].agencyIds.push({
                agencyId: data.id,
                agencyName: data.agencyName,
              });
            }
          } else if (this.$parent.tabSwitch == true && checked == false) {
            for (let j = 0; j < arr[i].agencyIds.length; j++) {
              if (arr[i].agencyIds[j].agencyId == data.id) {
                arr[i].agencyIds.splice(j, 1);
                break;
              }
            }
          } else {
            break;
          }
        }
      }
      this.$emit("handleSelection", data, checked, this.arrList);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .is-vertical {
  display: none;
}
::v-deep .el-scrollbar__view {
  display: inline-block;
}
::v-deep .el-scrollbar__wrap {
  overflow: auto;
}
.head-layout {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .number {
    margin-top: 2px;
  }
}
.search-list__option {
  height: 20px;
  width: 100%;
  margin: 10px 0;
}
.firstTree {
  flex: auto;
  overflow: auto;
  background: white;
  min-width: 208px;
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
.sencondTree {
  flex: auto;
  overflow: auto;
  background: white;
  min-width: 338px;
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
.thirdTree {
  flex: auto;
  overflow: auto;
  background: white;
  min-width: 338px;
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
::-webkit-scrollbar {
  width: 8px;
  height: 0px;
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
.search-list {
  width: 100%;
  display: flex;
  flex-direction: column;

  &__list {
    height: 250px;
    margin-top: 20px;
    overflow-y: scroll;
  }
}
::v-deep .el-checkbox__label {
  padding-left: 7px !important;
}
.head-layout {
  margin-left: 24px;
  margin-top: 15px;
}
</style>
