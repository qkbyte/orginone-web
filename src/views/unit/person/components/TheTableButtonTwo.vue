<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleAuthTrans(index, row)">
        权限转移
      </div>
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
    /**权限转移 */
    handleAuthTrans() {
      this.$emit("updateAuthTransferDialog", this.row);
    },
  },
};
</script>

<style lang="scss" scoped></style>
