<template>
  <div class="diy-dialog__wrapper" v-if="dialogShow">
    <div class="diy-dialog__container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseDialog",
  data() {
    return {};
  },
  components: {},
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.diy-dialog__wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  overflow: auto;
  z-index: 2030;
}
.diy-dialog__container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2049;
}
</style>
