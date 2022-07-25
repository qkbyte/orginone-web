<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleCancel">取消分发</div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { groupCancelAuth } from "@api/market";

export default {
  data() {
    return {};
  },
  components: { DiyButton },
  created() {},
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    async handleCancel() {
      let params = {
        appId: this.$route.query.id,
        groupId: this.$route.query.groupId,
        tenantId: this.row.tenantCode,
      };
      const { data: res } = await groupCancelAuth(params);
      if (res.code !== 200) {
        return this.$message.error("取消权限失败");
      }
      this.$message.success("取消权限成功");
      this.$emit("freashTableData");
    },
  },
};
</script>

<style lang="scss" scoped></style>
