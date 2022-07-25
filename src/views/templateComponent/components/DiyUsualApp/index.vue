<template>
  <div class="apps">
    <span class="apps__title">{{ listName }}</span>
    <div class="apps__list">
      <diyAppsList :appListData="applist"></diyAppsList>
    </div>
  </div>
</template>

<script>
import diyAppsList from "./TheAppsList";
export default {
  name: 'Apps',
  data() {
    return {};
  },
  components:{ diyAppsList },
  props: {
    listName: {
      type: String,
      default: ""
    },
    applist: {
      type: Array,
      default: () => []
    }
  },
};
</script>

<style lang="scss" scoped>
.apps {
  width: 100%;
  margin-top: 4px;
  background: rgba(255, 255, 255, 1);
  opacity: 1;
  border-radius: 4px;
  padding: 20px 32px;
  height: 100%;
  overflow: hidden;
  &__title {
    font-size: 16px;
    font-weight: bold;
    line-height: 44px;
    color: rgba(81, 81, 81, 1);
    opacity: 1;
  }
}
</style>
