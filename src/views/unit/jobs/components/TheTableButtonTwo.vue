<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleEdit(0, row)">变更部门</div>
      <div class="diy-button" @click="handleAuthTrans(index, row)">
        权限转移
      </div>
    </template>
  </DiyButton>
</template>

<script>
import { mapState } from "vuex";
import DiyButton from "@components/DiyButton/index";
export default {
  data() {
    return {
      msg: "",
      delMsg: "",
    };
  },
  components: { DiyButton },
  props: ["row","index"],

  methods: {
    /**编辑人员信息 */
    handleEdit(index, row) {
      this.$emit("handleEdit", index, row);
    },
    /**权限转移 */
    handleAuthTrans() {
      this.$emit("updateAuthTransferDialog", this.row);
    },
  },
};
</script>

<style lang="scss" scoped></style>
