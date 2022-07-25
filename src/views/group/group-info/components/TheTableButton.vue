<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleDisband" v-if="isOwner">
        解散
      </div>
    </template>
  </DiyButton>
</template>

<script>
import { mapGetters } from "vuex";
import DiyButton from "@components/DiyButton/index";
import {
  getJoinAndCreateGroupList,
  tenantApplyGroup,
  applyGroup,
  disbandGroup,
} from "@api/group";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("group", ["curGroupId"]),
  },
  components: { DiyButton },
  created() {},
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    isOwner: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    /**解散集团 */
    handleDisband() {
      let _this = this;
      this.$confirm("确定解散该集团吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger",
      })
        .then(() => {
          let params = {
            groupId: _this.curGroupId,
            sourceGroupId: _this.curGroupId,
          };
          disbandGroup(params).then((res) => {
            _this.$emit("updateData");
            _this.$message.success("集团解散成功");
          });
        })
        .catch(() => {});
    },

    /**移交集团 */
    handleTransfer() {
      this.$emit("handleTransfer", this.data.id);
    },
  },
};
</script>

<style lang="scss" scoped></style>
