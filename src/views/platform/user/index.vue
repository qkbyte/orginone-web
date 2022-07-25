<template>
  <div class="base-layout">
    <DiyBoxLayout class="border">
      <TheUserTable ref="table"></TheUserTable>
    </DiyBoxLayout>
  </div>
</template>

<script>
import DiyTitle from "@components/DiyTitle/index";
import TheUserTable from "./components/TheUserTable";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";

export default {
  data() {
    return {};
  },
  components: {
    DiyBoxLayout,
    TheUserTable,
    DiyTitle,
  },
  watch: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.border-top{
  margin: 4px 4px 0 4px;
}

</style>
