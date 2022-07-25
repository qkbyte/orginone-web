<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handlePass">
        通过
      </div>
      <div class="diy-button" @click="handleRefuse">
        拒绝
      </div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { mapGetters } from "vuex";
import { updateAppOffSale, checkRedeploy } from "@api/market";

export default {
  data() {
    return {};
  },
  components: {
    DiyButton,
  },
  props: ["app"],
  methods: {
    /**下架应用 */
    handleDismount() {
      let params = {
        ids: this.app.id,
      };
      updateAppOffSale([params.ids]).then((res) => {
        this.$emit("loadlistData");
        this.$message.success("下架成功");
      });
    },
    handlePass() {
      let params = {
        checkStatus: true,
        redeployIds: [this.app.redeployId],
      };
      checkRedeploy(params).then((res) => {
        this.$emit("loadlistData");
        this.$message.success("审核通过");
      });
    },
    handleRefuse() {
      let params = {
        checkStatus: false,
        redeployIds: [this.app.redeployId],
      };
      checkRedeploy(params).then((res) => {
        this.$emit("loadlistData");
        this.$message.success("审核通过");
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
