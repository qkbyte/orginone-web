<template>
  <div class="search-list" style="height:314px">
    <div class="search-list__search">
      <el-input
        prefix-icon="el-icon-search"
        v-model="searchInput"
        placeholder="请输入搜索内容"
      ></el-input>
    </div>
    <el-scrollbar style="height:100%;padding-top:5px" id="scroll">
      <div class="tree">
        <el-tree
          id="list"
          class="tree"
          ref="tree"
          :props="listOption"
          :data="listData"
          node-key="id"
          show-checkbox
          check-strictly
          default-expand-all
          :filter-node-method="filterNode"
          @check="handleCheckChange"
        >
          <div
            v-if="codeShow"
            class="node-model"
            slot-scope="{ node, data }"
          >
            {{ data.userCode }} {{ data.realName }}
          </div>
          <div
            v-else
            class="node-model"
            slot-scope="{ node, data }"
          >
            {{ data.realName }}
          </div>
        </el-tree>
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
        realName: "",
        children: "children",
      },
      multipleSelection: [],
      curType: 0,
      current: 1,
      timer: null,
      listNode: 0,
      isSearch: false,
    };
  },
  props: {
    listTitle: {
      type: String,
      default: "列表",
    },
    listData: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "title",
    },
    isChoose: {
      type: Boolean,
      default: false,
    },
    isScroll: {
      type: Boolean,
      default: true,
    },
    codeShow: {
      type: Boolean,
    },
  },
  watch: {
    searchInput(val) {
      this.$parent.$parent.current = 1;
      this.$parent.$parent.handlerFilter(val);
      if (val == "") {
        this.isSearch = false;
      } else {
        this.isSearch = true;
      }
    },
    title: {
      handler(n, o) {
        this.listOption.label = this.title;
      },
      deep: true,
    },
  },
  created() {
    this.listOption.label = this.title;
  },
  mounted() {
    // 滚动加载数据
    this.$nextTick(() => {
      let handler = (event) => {
        // var left = document.getElementById("list");
        var left = document.getElementById("scroll").childNodes[0];
        var scrollTop = left.scrollTop;
        var windowHeight = left.clientHeight;
        var scrollHeight = left.scrollHeight;
        console.log(scrollTop, windowHeight, scrollHeight);
        if (scrollTop + windowHeight + 0.5 >= scrollHeight) {
          this.timer = setTimeout(() => {
            let search = this.searchInput;
            if (search == "") {
              this.$parent.$parent.current += 1;
              this.$parent.$parent.scroll = true;
              this.$parent.$parent.loadUserList();
            } else {
              this.$parent.$parent.current++;
              this.$parent.$parent.handlerFilter(search);
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
    });
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.timer = null;
  },
  methods: {
    handleNodeClick(data, node, obj) {
      this.node = data.id;
      this.$emit("handleNode", this.node);
    },
    handleCheckChange(data, checked) {
      // 触发选择事件
      let select = this.$parent.selectList;
      let del = 0;
      let judge = false;
      for (var i = 0; i < checked.checkedNodes.length; i++) {
        if (data == checked.checkedNodes[i]) {
          judge = true; //选择
          break;
        } else {
          judge = false; //取消选择
        }
      }
      if (judge) {
        select = [...select, data];
      } else {
        for (let i = 0; i < select.length; i++) {
          if (select[i].realName == data.realName) {
            del = i;
          }
        }
        select.splice(del, 1);
      }
      this.multipleSelection = this.getCheckedNodes();
      this.$emit(
        "handleSelection",
        this.multipleSelection,
        select,
        this.isSearch
      );
    },
    rightDel(data) {
      let select = this.$parent.selectList;
      let del = 0;
      del = this.handleIndex(select, data);
      select.splice(del, 1);
      if (this.$parent.$refs.rightlist.isShow) {
        this.$parent.$refs.rightlist.searchData.splice(del, 1);
      }
      this.multipleSelection = this.getCheckedNodes();
      this.$emit(
        "handleSelection",
        this.multipleSelection,
        select,
        this.isSearch
      );
    },
    handleIndex(data, val) {
      let index = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == val.id) {
          index = i;
          return index;
        } else {
          index = -1;
        }
      }
      return index;
    },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    setCheckedNodes() {
      this.$nextTick(() => {
        let id = [];
        this.multipleSelection.forEach((element) => {
          id = [...id, element.id];
        });
        this.$refs.tree.setCheckedKeys(id);
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.realName.includes(value);
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
.tree {
  min-width: 278px;
  padding-top: 5px;
  flex: auto;
  background: white;
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

  &__search {
    margin-top: 20px;
    text-align: center;
    ::v-deep .el-input--prefix .el-input__inner {
      width: 260px;
      border-radius: 100px;
    }
    ::v-deep .el-icon-search:before {
      margin-left: 20px;
    }
  }

  &__list {
    height: 250px;
    margin-top: 20px;
    overflow-y: scroll;
  }
}
</style>
