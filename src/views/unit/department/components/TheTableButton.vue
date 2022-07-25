<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleEdit(0, row)">{{ msg }}</div>
      <div
        class="diy-button"
        @click="handleDelete(0, row)"
        v-if="curDept !== -1 && curPos !== -1"
      >
        移除
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
  watch: {
    btnStatus: {
      handler(newVal, oldVal) {
        if (newVal.curTab === "1") {
          this.msg = "调整部门";
          this.delMsg = "部门人员"
        } else {
          this.msg = "调整岗位";
          this.delMsg = "岗位人员"
        }
      },
      deep:true,
      immediate:true
    },
  },
  mounted() {
    console.log(this.curDept,this.curPos);
  },
  props: ["row", "btnStatus","curDept","curPos"],

  methods: {
    /**编辑人员信息 */
    handleEdit(index, row) {
      this.$emit("handleEdit", index, row);
    },
    /**删除人员 */
    handleDelete(index, row) {
      this.$confirm('此操作将永久移除该' + this.delMsg +  ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit("handleDelete", index, row);
        }).catch(() => {    
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
