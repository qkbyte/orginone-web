<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleEdit(0, row)">{{ msg }}</div>
      <!-- <div
        class="diy-button"
        @click="handleDelete(0, row)"
        v-if="curDept !== -1 && curPos !== -1"
      >
        移除
      </div> -->
      <div class="diy-button" v-if="row.status == 3" @click="handleActive(index, row)">开通</div>
      <div class="diy-button" v-else @click="handleInactive(index, row)">停用</div>
      <div class="diy-button" v-if="row.phoneNumber" @click="handleEditPhone(index, row)">修改手机号</div>
      <div class="diy-button" v-else @click="handlePhone(index, row)">补充手机号</div>
      <div class="diy-button" @click="handleDistribution(index, row)">角色分配</div>
      <div class="diy-button" v-if="!value && !isShow" @click="handleDeleteDepart(index, row)">移出部门</div>
      <div class="diy-button" v-if="isShow" @click="handleDeleteUnit(index, row)">移出单位</div>
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
          this.msg = "变更部门";
          this.delMsg = "部门人员"
        } else {
          this.msg = "变更岗位";
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
  props: ["row","index", "btnStatus","curDept","curPos","value", "isShow"],

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
    /**编辑人员信息 */
    handleDistribution(index, row) {
      this.$emit("handleDistribution", index, row);
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
    handleDeleteDepart(index, row){
      this.$emit("handleDepatDelte", row, index)
    },
    /**删除人员 */
    handleDeleteUnit(index, row) {
      console.log(row);
      this.$confirm("此操作将永久移出该人员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("handleDeleteUnit", index, row);
        })
        .catch(() => {
          return
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
