<template>
  <span>
    <el-tooltip
      class="item"
      effect="dark"
      :content="content"
      placement="right-end"
    >
      <div v-if="!content" slot="content">
        <slot name="content"></slot>
      </div>
      <svg class="icon " aria-hidden="true">
        <use :xlink:href="'#icon-help'"></use>
      </svg>
    </el-tooltip>
  </span>
</template>

<script>
export default {
  props: ["content"],
};
</script>

<style scoped>
.icon {
  vertical-align: 0;
}
</style>
