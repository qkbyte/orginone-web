<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button">查看</div>
      <div class="diy-button" v-if="rowStatus == 101">去审核</div>
      <div class="diy-button" v-if="rowStatus == 3">邀请激活</div>
      <div class="diy-button" v-if="rowStatus == 2" @click="handleRemove">
        移出集团
      </div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { mapGetters } from "vuex";
import { removeTenantFromGroup } from "@api/group";

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
    rowStatus: {
      type: Number,
      default: -1,
    },
    tenantId: {
      type: String,
      default: "",
    },
    groupId: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleRemove() {
      let groupId = this.groupId;
      let tenantId = this.tenantId;
      let data = { tenantId, groupId };
      this.$confirm("确定要移除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          removeTenantFromGroup(data);
          this.$message.success("集团移出成功");
          let item = {id :groupId}
          this.$emit("updateList", item);
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
