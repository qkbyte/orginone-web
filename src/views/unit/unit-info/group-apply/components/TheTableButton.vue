<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" v-if="row.status === 101" @click="handleCancel()">
        取消申请
      </div>
    </template>
  </DiyButton>
</template>

<script>
import { mapGetters } from "vuex";
import DiyButton from "@components/DiyButton/index";
import { tenantApplyGroup } from "@api/group";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("tenant", ["curTenantId"]),
  },
  components: { DiyButton },
  created() {},
  props: ["row", "index"],
  methods: {
    /**
     * 取消申请
     */
    handleCancel() {
      let _this = this;
      let params = {
        groupId: this.row.id,
        tenantId: this.curTenantId,
        flag: "104",
      };
      tenantApplyGroup(params).then((res) => {
        _this.$emit("handleUpdate");
        _this.$message.success("取消成功");
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
