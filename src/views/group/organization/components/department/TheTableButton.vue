<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleEdit(0, row)">编辑</div>
      <div v-if="!row.below" class="diy-button" @click="handleDelete(0, row)">删除</div>
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
    /**编辑角色 */
    handleEdit(index, row) {
      this.$emit("handleEdit", index, row);
    },
    /**删除组织 */
    handleDelete(index, row) {
      this.$emit("handleDelete", index, row);
    },
    /*
      配置角色
    */
    handleAuth(index, row) {
      this.$emit("handleAuth", index, row);
    },
  },
};
</script>

<style lang="scss" scoped></style>
