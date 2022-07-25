<template>
  <div style="width:100%">
    <el-popover width="150" trigger="hover" placement="bottom">
      <slot name="opt"></slot>
      <div slot="reference" style="display:flex;justify-content:center;">
        <div class="diy-button-bg">
          <slot name="icon"> <i class="el-icon-s-operation"></i></slot>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {},
  components: {},
  created() {}
};
</script>

<style lang="scss" scoped>
.diy-button-bg {
  width: 38px;
  height: 20px;
  background: rgba(235, 238, 245, 1);
  border-radius: 13px;
  display: flex;
  justify-content: center;
  align-items: center;

  i {
    font-size: 16px;
    color: #61626b;
  }
}
</style>
