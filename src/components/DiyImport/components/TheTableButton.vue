<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleView(0, row)">查看</div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { mapGetters } from "vuex";
import { getAppInfo, unsubscribeApp } from "@api/market";

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
    //查看导入详情
    handleView(index, row) {
      this.$emit("handleView", index, row);
    },
  },
};
</script>

<style lang="scss" scoped></style>
