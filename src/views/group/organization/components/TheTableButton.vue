<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleEdit(0, row)">调整{{ msg2 }}</div>
      <div
        class="diy-button"
        @click="handleDelete(0, row)"
        v-if="user.isCreated == 2"
      >
        移出{{ msg2 }}
      </div>
    </template>
  </DiyButton>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import DiyButton from "@components/DiyButton/index";
export default {
  data() {
    return {
      msg: "",
      msg2: "组织",
      isShow: true,
      isCreate: 0
    };
  },
  components: { DiyButton },
  computed: {
    ...mapState("user", ["roleName"]),
    ...mapGetters("group", ["curGroupId"]),
  },
  watch: {
    btnStatus: {
      handler(newVal, oldVal) {
        if (newVal.curPos === "-1" || newVal.curDept === "-1") {
          this.msg = "编辑";
        } else {
          this.msg = "修改";
        }
        if (newVal.curTab === "1") {
          this.msg2 = "组织";
        } else {
          this.msg2 = "性质";
        }
      },
      deep:true,
      immediate:true
    },
  },
  props: ["row", "btnStatus", "user"],
  methods: {
    /**编辑单位信息 */
    handleEdit(index, row) {
      this.$emit("handleEdit", index, row);
    },
    /**移除单位 */
    handleDelete(index, row) {
      this.$emit("handleDelete", index, row);
    },
  },
};
</script>

<style lang="scss" scoped></style>
