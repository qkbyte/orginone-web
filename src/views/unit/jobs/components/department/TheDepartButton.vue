<template>
  <DiyButton>
    <template v-slot:opt>
      <div v-if="row.children.length == 0" class="diy-button" @click="handleView(row)">查看部门人员信息</div>
      <div class="diy-button" @click="handleDelete(0, row)">移出部门</div>
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
    /**移出部门 */
    handleDelete(index, row) {
      this.$emit("handleDelete", index, row);
    },
    /*
      配置角色
    */
    handleView(row) {
      this.$emit("handleDepart", row);
    },
  },
};
</script>

<style lang="scss" scoped></style>
