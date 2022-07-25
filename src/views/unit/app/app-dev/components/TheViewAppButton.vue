<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleUse(0, row)">启用</div>
      <Div class="diy-button" @click="handleDisable(0, row)">停用</Div>
      <div class="diy-button" @click="handleView(0, row)">查看</div>
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
    /**启用 */
    handleUse(index, row) {
      this.$emit("handlePass", index, row);
    },
    /**停用 */
    handleDisable(index, row) {
      this.$emit("handleDelete", index, row);
    },
     /**查看 */
    handleView(){

    }
  },
};
</script>

<style lang="scss" scoped></style>
