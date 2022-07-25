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
import { mapGetters, mapActions } from "vuex";
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
  created() {
  },
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
    ...mapActions("group", ["initGroupList"]),
    /**解散集团 */
    handleDisband(val) {
      let _this = this;
      this.$confirm("确定解散该集团吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = { groupId: this.data.id, sourceGroupId: this.curGroupId };
          disbandGroup(params).then((res) => {
            _this.initGroupList();
            _this.$emit("updateData");
            _this.$message.success("集团解散成功");
            if(this.$parent.$parent.tableData.length == 1){
              location.reload();
            }
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
