<template>
  <div class="apps">
    <span class="apps__title">{{ listName }}</span>
    <div class="apps__list">
      <diyAppsList :appListData="handleAppData(applist)"></diyAppsList>
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
  components: { diyAppsList },
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
  methods: {
    handleAppData(data) {
      let _this = this;
      function addProp(obj) {
        for (var i in obj) {
          _this.$set(obj[i], "showSubData", false);
          if (obj[i].children) {
            addProp(obj[i].children);
          }
        }
      }
      addProp(data);
      return data;
    }
  }
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

  &__title {
    font-size: 16px;
    font-weight: bold;
    line-height: 44px;
    color: rgba(81, 81, 81, 1);
    opacity: 1;
  }
}
</style>
