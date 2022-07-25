<template>
  <div class="search-list" style="height:100%">
    <div class="search-list__search">
      <el-input
        prefix-icon="el-icon-search"
        v-model="searchInput"
        placeholder="请输入搜索内容"
      ></el-input>
    </div>
    <el-scrollbar style="height:100%;padding-top:10px;padding-bottom:10px;">
    <div class="tree" id="list">
          <el-tree
            ref="tree"
            :props="listOption"
            :data="listData"
            node-key="id"
            check-strictly
            default-expand-all
            :default-checked-keys = [-1]
            :highlight-current="true"
            :filter-node-method="filterNode"
            @check-change="handleCheckChange"
            @node-click="handleNodeClick"
          >
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
        label: "",
        children: "children",
      },
      multipleSelection: [],
      curType: 0,
      current: 1,
      timer:null,
      listNode: 0
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
    type: {
      type: Number,
      default: 0,
    },
    isChoose: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    searchInput(val) {
      this.$refs.tree.filter(val);
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
  created() {
    this.listOption.label = this.title;
  },
  mounted() {},
  methods: {
    handleNodeClick(data,node,obj){
      console.log(data);
      this.node = data.id
      this.$parent.$parent.current = 1
      this.$parent.$parent.deptId = this.node
      this.$emit('handleNode', this.node)
    },
    handleCheckChange(data, checked, indeterminate) {
      this.multipleSelection = this.getCheckedNodes();
      this.$emit("handleSelection", this.multipleSelection);
    },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.agencyName.indexOf(value) !== -1;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .is-vertical{
  display: none;
}
::v-deep .el-scrollbar__view{
  display: inline-block;
}
::v-deep .el-scrollbar__wrap{
  overflow: auto;
}
.tree{
    min-width: 209px;
    flex:auto;
    overflow: auto;
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
</style>
