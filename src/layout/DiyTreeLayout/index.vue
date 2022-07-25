<template>
  <div class="diy-table-layout">
    <slot name="tabs"></slot>
    <slot name="table"></slot>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  computed: {},
  methods: {},
  components: {},
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
.diy-table-layout {
  width: 100%;
  height: 100%;
  margin-top: 4px;
  @include background_color("background_color3");
  @include border_color("border_color1");
  border-radius: 4px;
  padding: 0 20px;
  padding-bottom: 10px;
}
</style>
