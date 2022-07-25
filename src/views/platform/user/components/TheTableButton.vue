<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleEdit(index, row)">编辑</div>
      <div class="diy-button" @click="handleTransfer(index, row)">角色管理</div>
      <div class="diy-button" @click="handlePassword(index, row)">重置密码</div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { resetUserPassword } from "@api/user"
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
    // 设置超管
    handleTransfer(index,row){
      this.$emit("handleTransfer", index, row);
    },
    handlePassword(index,row){
      this.$confirm('此操作将重置该用户的密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
           phoneNumber: row.phoneNumber
          };
          resetUserPassword(params).then((res) => {
            this.$message.success("重置密码成功");
          });
        }).catch(() => {
          return         
        });
    }
  },
};
</script>

<style lang="scss" scoped></style>
