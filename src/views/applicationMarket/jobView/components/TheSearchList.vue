<template>
  <div class="search-list">
    <div class="search-list__search">
      <el-input
        prefix-icon="el-icon-search"
        v-model="searchInput"
        placeholder="请输入搜索内容"
      ></el-input>
    </div>
    <div class="search-list__list">
      <el-tree
        ref="tree"
        :props="listOption"
        :data="listData"
        node-key="id"
        show-checkbox
        default-expand-all
        :filter-node-method="filterNode"
        @check-change="handleCheckChange"
      >
      </el-tree>
    </div>
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
  },
  watch: {
    searchInput(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.listOption.label = this.title;
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      this.multipleSelection = this.getCheckedNodes();
      this.$emit("handleSelection", this.multipleSelection);
    },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.realName.includes(value);
    },
  },
};
</script>

<style lang="scss" scoped>
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
