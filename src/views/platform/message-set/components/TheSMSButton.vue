<template>
  <DiyButton>
    <template v-slot:opt>
      <div v-if="isShow" class="diy-button" @click="handleEdit(0, row)">编辑</div>
      <div class="diy-button" @click="handleDelete(0, row)">删除</div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  components: { DiyButton },
  created() {},
  props: ["row", "index","isShow"],
  methods: {
    /**删除 */
    handleDelete(index, row) {
      this.$emit("handleDelete", index, row);
    },
    /**编辑 */
    handleEdit(index, row) {
      this.$emit("handleEdit", index, row);
    },
  },
};
</script>

<style lang="scss" scoped></style>
