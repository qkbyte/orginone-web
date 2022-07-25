<template>
  <DiyButton>
    <template v-slot:opt>
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
    /**编辑菜单 */
    handleEdit(index, row) {
      this.$emit("handleEdit", index, row);
    },
    /**删除菜单 */
    handleDelete(index, row) {
      this.$emit("handleDelete", index, row);
    },
  },
};
</script>

<style lang="scss" scoped></style>
