<template>
  <div class="base-layout">
    <TheMesaageComponent class="message"></TheMesaageComponent>
    <TheTaskWaring class="task"></TheTaskWaring>
  </div>
</template>

<script>
import TheMesaageComponent from "./TheMessageComponent.vue";
import TheTaskWaring from "./TheTaskWaring.vue";
export default {
  components: {
    TheMesaageComponent,
    TheTaskWaring,
  },
};
</script>

<style lang="scss" scoped>
.base-layout {
  padding: 20px 20px 10px 20px;
  display: flex;
  background: #f1f1f8;
  height: 280px;
}
.message {
  width: 48%;
  border-radius: 4px;
  margin-right: 16px;
}
.task {
  width: 51%;
  border-radius: 4px;
}
</style>
