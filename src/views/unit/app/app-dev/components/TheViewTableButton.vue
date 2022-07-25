<template>
  <DiyButton>
    <template v-slot:opt>
      <div
        class="diy-button"
        v-if="rowData.useStatus === 0"
        @click="handleChangeStatus(rowData, 1)"
      >
        启用
      </div>
      <div
        class="diy-button"
        v-else-if="rowData.useStatus === 1"
        @click="handleChangeStatus(rowData, 0)"
      >
        停用
      </div>
      <div class="diy-button" @click="handleCancel(rowData)">撤回</div>
    </template>
  </DiyButton>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import DiyButton from "@components/DiyButton/index";
import {
  updateGroupUseStatus,
  updateTenantUseStatus,
  withdrawGroupAuthority,
  withdrawTenantAuthority,
} from "@api/market";

export default {
  data() {
    return {};
  },
  components: { DiyButton },
  created() {},
  props: ["rowData"],
  methods: {
    ...mapActions("menu", ["updateAppMenu"]),
    handleChangeStatus(row, num) {
      let _this = this;
      if (row.groupName === undefined) {
        let params = {
          appId: this.$route.query.id,
          tenantId: row.tenantCode,
          useStatus: num,
        };
        updateTenantUseStatus(params)
          .then((res) => {
            if (res.data.code != 200) {
              return _this.$message.error("操作失败");
            }
            _this.$message.success("操作成功");
            _this.$emit("updateList");
          })
          .catch((error) => {
            this.$message.error("操作失败");
            this.$emit("updateList");
          });
      } else {
        let params = {
          appId: this.$route.query.id,
          groupId: row.id,
          useStatus: num,
        };
        updateGroupUseStatus(params)
          .then((res) => {
            if (res.data.code != 200) {
              return _this.$message.error("操作失败");
            }
            _this.$message.success("操作成功");
            _this.$emit("updateList");
          })
          .catch((error) => {
            this.$message.error("操作失败");
            this.$emit("updateList");
          });
      }
    },
    handleCancel(row) {
      let _this = this;
      if (row.groupName === undefined) {
        let params = {
          appIds: [this.$route.query.id],
          tenantId: row.tenantCode,
        };
        withdrawTenantAuthority(params)
          .then((res) => {
            if (res.data.code != 200) {
              return _this.$message.error("操作失败");
            }
            this.updateAppMenu()
            _this.$message.success("撤回成功");
            this.$emit("updateList");
          })
          .catch((error) => {
            this.$message.error(error);
            this.$emit("updateList");
          });
      } else {
        let params = {
          appIds:[this.$route.query.id],
          groupId: row.id,
        };
        withdrawGroupAuthority(params)
          .then((res) => {
            if (res.data.code != 200) {
              return _this.$message.error("操作失败");
            }
            this.updateAppMenu()
            _this.$message.success("撤回成功");
            this.$emit("updateList");
          })
          .catch((error) => {
            this.$message.error("操作失败");
            this.$emit("updateList");
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
