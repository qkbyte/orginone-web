<template>
  <el-dialog
    center
    top="10vh"
    width="680px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <img width="100%" :src="dialogShow.sendData" alt />
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped></style>
