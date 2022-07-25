<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleAuth(index, row)">配置</div>
      <div class="diy-button" @click="handleEdit(index, row)">编辑</div>
      <div class="diy-button" @click="handleDelete(index, row)">删除</div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";

export default {
  data() {
    return {};
  },
  computed: {
  },
  components: { DiyButton },
  created() {},
  props: ["row", "index"],
  methods: {
    /**编辑角色 */
    handleEdit(index, row) {
      this.$emit("handleEdit", index, row);
    },
    /**删除角色 */
    handleDelete(index, row) {
      this.$emit("handleDelete", index, row);
    },
    /*
      配置角色
    */
    handleAuth(index, row) {
      this.$emit("handleAuth", index, row);
    },
  },
};
</script>

<style lang="scss" scoped></style>
