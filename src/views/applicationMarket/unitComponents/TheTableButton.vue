<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleView">查看</div>
      <div
        class="diy-button"
        @click="handleDelete"
        v-if="row.ifPurchase === true"
      >
        退订
      </div>
      <div class="diy-button" @click="handleAuth">权限分配</div>
      <div class="diy-button" @click="handleWorkorder">发起工单</div>
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
  props: ["appId", "row"],
  methods: {
    /**查看应用详情 */
    handleView() {
      this.$router.push({
        name: "applicationMarket-unitView",
        query: {
          id: this.appId,
        },
      });
    },

    /**分配应用权限 */
    handleAuth() {
      this.$emit("handleAuth", this.appId);
    },

    /**退订应用 */
    handleDelete() {
      this.$confirm("此操作将退订该应用, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            appIds: this.appId,
            tenantIds: this.curTenantCode,
          };
          unsubscribeApp([params.appIds]).then((res) => {
            this.$message.success("退订成功");
            this.$emit("updateData");
          });
        })
        .catch(() => {});
    },

    /** 发起工单 */
    handleWorkorder() {
      this.$router.push({
        name: "workorder-launch-flow",
        query: {
          tenantId: this.row.tenantId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
