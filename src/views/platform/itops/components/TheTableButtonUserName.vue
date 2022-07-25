<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleusername(index, row)">修复用户人员中有不同用户名的</div>
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
    /**修复用户人员中有不同用户名的 */
    handleEdit(index, row) {
      this.$emit("handleusername", index, row);
    },
  },
};
</script>

<style lang="scss" scoped></style>