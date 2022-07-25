<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="delInfo">删除</div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  components: { DiyButton },
  created() {},
  props: {
    rowData: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    delInfo() {
      this.$emit("handleDel", this.rowData);
    },
  },
};
</script>

<style lang="scss" scoped></style>
