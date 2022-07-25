<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handletenant(index, row)">修复租户</div>
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
  props: ["row", "index"],
  methods: {
    /**修复租户 */
    handleEdit(index, row) {
      this.$emit("handletenant", index, row);
    },
  },
};
</script>

<style lang="scss" scoped></style>