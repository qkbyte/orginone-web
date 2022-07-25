<template>
  <div class="search-input">
    <el-input
      :placeholder="placeholder"
      v-model="filterText"
      prefix-icon="el-icon-search"
    >
    </el-input>
  </div>
</template>

<script>
export default {
  name: "TheSearchInput",
  data() {
    return {
      filterText: ""
    };
  },
  props: ["placeholder"],
  watch: {
    filterText(val) {
      this.$emit("update:filterText", val);
    }
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.search-input {
  margin-top: 6px;
}
::v-deep .el-icon-search{
  left: 0px;
  top:1px;
}
.search-input ::v-deep .el-input {
  &__inner {
    height: 30px;
    font-size: 13px;
    background: rgba(242, 244, 249, 1);
    border: 0px;
    border-radius: 16px;
  }

  &__icon {
    line-height: 30px;
  }
}
</style>
