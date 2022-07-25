<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleView">查看</div>
      <div class="diy-button" @click="handleDelete">退订</div>
      <div class="diy-button" @click="handleAuth">应用分发</div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { getAppInfo, unsubscribeGroupApp } from "@api/market";

export default {
  data() {
    return {};
  },
  computed: {},
  components: { DiyButton },
  created() {},
  props: {
    appId: {
      type: String,
      default: "-1",
    },
    groupId: {
      type: String,
      default: "",
    },
  },
  methods: {
    /**查看应用详情 */
    handleView() {
      this.$router.push({
        name: "group-app-manage-view",
        query: {
          id: this.appId,
          groupId: this.groupId,
        },
      });
    },

    /**分配应用权限 */
    handleAuth() {
      this.$emit("handleAuth", this.appId);
    },

    /**退订应用 */
    handleDelete() {
      this.$confirm("此操作将退订该应用并清除所有集团单位下的分配关系, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: 'messageBox_class',
        type: "warning",
      })
        .then(() => {
          let params = {
            appIds: [this.appId],
            groupid: this.groupId,
          };
          unsubscribeGroupApp(params).then((res) => {
            this.$message.success("退订成功");
            this.$emit("upadate");
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss">
 .messageBox_class{
  width: 600px;
}
</style>
