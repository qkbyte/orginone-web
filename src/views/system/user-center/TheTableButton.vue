<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleDissolution">
        取消申请
      </div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { mapState } from "vuex";
import { cancelApplyTenant } from "@api/tenant";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("user", ["userId"]),
  },
  components: { DiyButton },
  created() {
    console.log('rwo', this.rowData);
  },
  props: ["rowData"],
  methods: {
    handleDissolution() {
      let arr = [this.rowData.tenantCode]
      cancelApplyTenant(arr).then((res) => {
        this.$message.success("取消成功");
        this.$emit("refresh");
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
