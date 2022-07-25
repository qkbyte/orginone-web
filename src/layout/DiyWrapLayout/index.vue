<template>
  <div class="flex-wrap">
    <slot></slot>
    <i v-for="index in number" :key="'i-' + index" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    number: {
      type: Number,
      default: 100,
    },
  },
  created() {},
  computed: {},
  methods: {},
  components: {},
};
</script>

<style lang="scss" scoped>
.diy-table-layout {
  width: 100%;
  margin-top: 4px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  padding: 0 20px;
}
</style>
