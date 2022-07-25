<template>
  <ul class="diy-tabs">
    <li
      class="diy-tabs__item"
      :class="isActive === item.id ? 'active' : 'noactive'"
      v-for="item in tabList"
      :key="item.id"
      @click="handleClick(item.id)"
    >
      {{ item.title }}
      <div v-show="isActive === item.id" class="line"></div>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      isActive: "",
      tabs: []
    };
  },
  created() {
    this.isActive = this.selectTab || this.tabList[0].id || 0;
    // this.isActive = this.selectTab ;
    // this.tabs = this._.cloneDeep(this.tabList).map(obj => {
    //   return { id: obj[this.id], title: obj[this.title] };
    // });
  },
  props: {
    tabList: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: "id"
    },
    title: {
      type: String,
      default: "title"
    },
    selectTab: {
      type: String
    }
  },
  methods: {
    handleClick(val) {
      this.isActive = val;
      this.$emit("update:curTab", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.diy-tabs {
  display: block;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 10px;

  li + li {
    margin-left: 20px;
  }

  .active {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: rgba(48, 49, 51, 1);
    cursor: default;
  }

  .noactive {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: rgba(96, 98, 102, 1);
    cursor: pointer;
  }

  &__item {
    display: inline-block;

    .line {
      margin: 0 auto;
      margin-top: 4px;
      width: 15px;
      height: 0px;
      border: 1px solid rgba(21, 74, 216, 1);
    }
  }
}
</style>
