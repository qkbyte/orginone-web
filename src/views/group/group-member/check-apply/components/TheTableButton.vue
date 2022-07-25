<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleCheck(true)">通过</div>
      <div class="diy-button" @click="handleCheck(false)">拒绝</div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { mapGetters } from "vuex";
import { checkTenantApplyGroup } from "@api/group";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("group", ["curGroupId"]),
  },
  components: { DiyButton },
  created() {},
  props: ["row", "index"],
  methods: {
    handleCheck(val) {
      if (val) {
        let params = {
          groupId: this.curGroupId,
          tenantIds: this.row.tenantId,
          flag: "102",
        };
        checkTenantApplyGroup(params).then((res) => {
          this.$emit("handleUpdate");
          this.$message.success("审核完成");
        });
      } else {
        let params = {
          groupId: this.curGroupId,
          tenantIds: this.row.tenantId,
          flag: "103",
        };
        checkTenantApplyGroup(params).then((res) => {
          this.$emit("handleUpdate");
          this.$message.success("审核完成");
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
