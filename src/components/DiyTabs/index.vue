<template>
  <el-tabs
    class="diy-tabs"
    v-model="activeName"
    type="card"
    @tab-click="handleClick"
  >
    <template v-for="(item, index) in tabs">
      <!-- <el-tab-pane
        class="tab-pane"
        :key="item.id"
        :label="
          `${item.title}${
            hasNum ? '(' + (numbers[index] ? numbers[index] : '0') + ')' : ''
          }`
        "
        :name="item.id"
      > -->
      <!-- </el-tab-pane> -->
      <el-tab-pane :key="item.id">
        <div slot="label">
          <i :class="tabIndex == index ? 'pane-active' : 'pane-noActive'">{{
            item.title
          }}</i>
          <el-badge
            :value="numbers[index]"
            size="mini"
            class="pane-badge"
          ></el-badge>
        </div>
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      isActive: "",
      tabs: [],
      activeName: "",
      numbers: [],
      tabIndex: "0",
    };
  },
  created() {
    this.isActive = this.selectTab || this.tabList[0].id || 0;
    this.tabs = this._.cloneDeep(this.tabList).map((obj) => {
      return { id: obj[this.id], title: obj[this.title] };
    });
    this.activeName = this.tabs[0].id;
  },
  props: {
    tabList: {
      type: Array,
      default: () => [],
    },
    id: {
      type: [String, Number],
      default: "id",
    },
    title: {
      type: String,
      default: "title",
    },
    selectTab: {
      type: String,
      default: "1",
    },
    hasNum: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    selectTab: {
      handler(val) {
        if (this.hasNum && val != 1) {
          this.handleClick({ index: val - 1 });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  beforeDestroy() {
    this.$store.commit("changeSkipState", "1");
  },
  methods: {
    handleClick(tab, event) {
      this.tabIndex = tab.index;
      this.isActive = this.activeName = this.tabs[tab.index].id;
      this.$emit("update:curTab", this.tabs[tab.index].id);
    },
    handleUpdate(nums) {
      this.numbers = [];
      this.numbers = nums;
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-tabs {
  display: block;
  white-space: nowrap;
  padding-bottom: 10px;
  position: relative;

  li + li {
    margin-left: 20px;
  }

  .active {
    font-size: 14px;
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
  .line {
    margin: 0 auto;
    margin-top: 4px;
    width: 15px;
    height: 0px;
    border: 1px solid rgba(21, 74, 216, 1);
  }
}
.diy-tabs__item {
  display: block;
}

.pane-active {
  position: relative;
  font-weight: bold;
  color: rgba(48, 49, 51, 1);
}
.pane-active::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 24px;
  transform: translate(-50%);
  width: 70%;
  height: 2px;
  background-color: #154ad8;
  border-radius: 100px;
}
.pane-noActive {
  color: #686a6e;
}
.pane-badge {
  // top: -10px;
  // position: absolute;
  float: right;
  top: -5px;
}
// element 样式修改
::v-deep .el-tabs__nav-wrap::after {
  display: none;
}
// ::v-deep .el-tabs__item.is-active {
//   font-weight: bold;
//   color: rgba(48, 49, 51, 1) !important;
// }
::v-deep .el-tabs__active-bar {
  display: none;
}
::v-deep .el-tabs__header {
  margin: 0;
}
::v-deep .el-badge__content {
  line-height: 16px;
}
// ::v-deep .is-active::after {
//   content: "";
//   position: absolute;
//   left: 50%;
//   top: 35px;
//   transform: translate(-50%);
//   width: 25%;
//   height: 2px;
//   background-color: #154ad8;
//   border-radius: 100px;
// }
::v-deep .el-tabs__header .el-tabs__nav {
  border: 0;
}
::v-deep .el-tabs__header .el-tabs__item {
  // color:#686a6e;
  border: 0;
}
::v-deep .el-tabs__header {
  border: 0;
}
::v-deep .el-tabs__item {
  padding: 0 10px !important;
}
</style>
