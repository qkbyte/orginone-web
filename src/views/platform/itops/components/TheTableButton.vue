<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="itopsdetail(index, row)">修复详细信息</div>
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
    /**修复详细信息 */
    itopsdetail(index, row) {
      this.$emit("itopsdetail", index, row);
    },
  },
};
</script>

<style lang="scss" scoped></style>
