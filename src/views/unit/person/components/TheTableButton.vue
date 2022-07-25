<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" v-if="row.status == 3" @click="handleActive(index, row)">开通</div>
      <div class="diy-button" v-else @click="handleInactive(index, row)">停用</div>
      <div class="diy-button" v-if="row.phoneNumber" @click="handleEditPhone(index, row)">修改手机号</div>
      <div class="diy-button" v-else @click="handlePhone(index, row)">补充手机号</div>
      <div class="diy-button" @click="handleEdit(index, row)">角色分配</div>
      <div class="diy-button" @click="handleDelete(index, row)">移出单位</div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";

export default {
  data() {
    return {};
  },
  computed: {},
  components: { DiyButton },
  created() {},
  props: ["row", "index"],
  methods: {
    /**编辑人员信息 */
    handleEdit(index, row) {
      this.$emit("handleEdit", index, row);
    },
    /**编辑手机号 */
    handleEditPhone(index, row) {
      this.$emit("handleEditPhone", index, row);
    },
     /**补充手机号 */
    handlePhone(index, row) {
      this.$emit("handlePhone", index, row);
    },
    handleActive(index, row){
      this.$emit("handleActive", index, row)
    },
    handleInactive(index, row){
      this.$emit("handleInactive", index, row)
    },
    /**删除人员 */
    handleDelete(index, row) {
      console.log(row);
      this.$confirm("此操作将永久移出该人员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("handleDelete", index, row);
        })
        .catch(() => {
          return
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
