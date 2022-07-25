<template>
  <div class="base-layout">
    <DiyBoxLayout>
      <TheUserTable ref="table"></TheUserTable>
    </DiyBoxLayout>
  </div>
</template>

<script>
import TheUserTable from "./components/TheUserTable";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";

export default {
  data() {
    return {};
  },
  components: {
    DiyBoxLayout,
    TheUserTable,
  },
  watch: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>
