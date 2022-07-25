<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" v-if="row.status === 101" @click="handleCancel()">
        取消申请
      </div>
    </template>
  </DiyButton>
</template>

<script>
import { mapGetters } from "vuex";
import DiyButton from "@components/DiyButton/index";
import { cancelApplyGroup } from "@api/group";

export default {
  data() {
    return {};
  },
  computed: {},
  components: { DiyButton },
  created() {},
  props: ["row", "index"],
  methods: {
    /**
     * 取消申请
     */
    handleCancel() {
      let _this = this;
      let params = { groupId: this.row.id };
      cancelApplyGroup(params).then((res) => {
        _this.$emit("handleUpdate");
        _this.$message.success("取消成功");
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
