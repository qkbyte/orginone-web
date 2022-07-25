<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handlePass(0, row)">通过</div>
      <div class="diy-button" @click="handleDelete(0, row)">拒绝</div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";

export default {
  data() {
    return {};
  },
  computed: {},
  components: { DiyButton },
  created() {},
  props: ["row", "index"],
  methods: {
    /**通过人员 */
    handlePass(index, row) {
      this.$emit("handlePass", index, row);
    },
    /**拒绝人员 */
    handleDelete(index, row) {
      this.$emit("handleDelete", index, row);
    },
  },
};
</script>

<style lang="scss" scoped></style>
