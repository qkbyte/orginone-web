<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button">启用</div>
      <div class="diy-button">停用</div>
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
  methods: {},
};
</script>

<style lang="scss" scoped></style>
