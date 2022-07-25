<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="base-layout">
    <DiyBoxLayout class="flex-column">
      <!-- 可获取App列表 -->
      <TheAppList style="padding:0 20px" v-if="viewShow"></TheAppList>
      <TheAppCard ref="card" v-else></TheAppCard>
      <div
        class="flex-row"
        :style="viewShow ? 'padding: 0px 20px;' : 'padding: 0px 0px 10px 0px;'"
      >
        <el-switch
          :class="value1 ? 'switch' : 'switchCard'"
          v-model="value1"
          inactive-text="切换视图"
        ></el-switch>
        <div class="footer-pagination">
          <el-pagination
            v-if="!viewShow"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            v-bind="page"
            :pager-count="5"
            style="text-align:right;margin-top:10px;"
          ></el-pagination>
        </div>
      </div>
    </DiyBoxLayout>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import DiyTabs from "@components/DiyTabs/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheAppList from "./components/AppList";
import TheAppCard from "./components/AppCard";
export default {
  data() {
    return {
      fullscreenLoading: false,
      pageName: "",
      allType: [{ id: "1", title: "应用市场" }],
      curTab: "1",
      viewShow: false,
      value1: false,
      page: {
        total: 0, // 总条数
        currentPage: 1, // 当前页
        pageSize: this.$store.state.options.pageSize, // 每页条数
        pageSizes: [20, 30, 50], // 分页数量列表
        layout: "total, prev, pager, next, sizes",
      },
    };
  },
  components: {
    DiyTabs,
    DiyBoxLayout,
    TheAppList,
    TheAppCard,
  },
  computed: {
    ...mapState("user", ["userName"]),
    ...mapState("options", ["pageSize"]),
  },
  watch: {
    value1(val) {
      if (!val) {
        this.fullscreenLoading = true;
      }
      this.viewShow = val;
    },
    pageSize: {
      handler(newValue, oldValue) {
        this.page.pageSize = newValue;
      },
      immediate: true,
    },
  },
  created() {
    this.pageName = this.$route.meta.title;
  },
  mounted() {},
  methods: {
    ...mapActions("options", ["updatePageSize"]),
    goDevCenter() {
      this.$router.push({ name: "app-dev" });
    },
    async handleSizeChange(val) {
      this.page.currentPage = 1;
      await this.updatePageSize(val);
      this.$refs.card.loadAppList();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.$refs.card.loadAppList();
    },
    back() {
      this.$router.push({ name: "app-assign" });
    },
  },
};
</script>

<style lang="scss" scoped>
.base-layout {
  height: 100%;
}
@import "@styles/common.scss";
.diy-table-layout {
  padding: 0px;
}
::v-deep .el-switch__label.is-active {
  color: #303133;
}
.flex-row {
  display: flex;
  justify-content: space-between;
}
.flex-column {
  overflow: auto;
}
.switch {
  position: absolute;
  bottom: 0%;
  transform: translate(0, -20px);
}
.switchCard {
  margin-top: 12px;
  margin-left: 20px;
}
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 20px 20px 0 20px;
}

.app-body {
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;

  .content-body {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    & > i {
      width: 32%;
    }
  }
}
.footer-pagination {
  & ::v-deep .btn-prev {
    border-radius: 16px;
  }
  & ::v-deep .el-pager > .number {
    border-radius: 4px;
  }
  & ::v-deep .btn-next {
    border-radius: 16px;
  }
  & ::v-deep .el-pagination__sizes .el-input__inner {
    border-radius: 16px;
    background: rgba(231, 239, 252, 1);
    border-color: transparent;
  }
}
::v-deep .el-button--primary {
  @include background_color("background_color13");
  border: unset;
}
</style>
