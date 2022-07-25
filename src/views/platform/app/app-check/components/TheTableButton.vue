<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="review">查看</div>
      <div class="diy-button" @click="handleRefuse">拒绝</div>
      <div class="diy-button" @click="handlePass">通过</div>
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
  props: {
    rowData: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    review() {
      this.$emit("handleview", this.rowData);
    },
    handlePass() {
      this.$emit("consentAuditone", this.rowData);
    },
    handleRefuse() {
      this.$emit("refuseAuditone", this.rowData);
    },
  },
};
</script>

<style lang="scss" scoped></style>
