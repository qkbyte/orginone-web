<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="base-layout">
    <DiyBoxLayout class="flex-column">
      <template v-slot:tabs>
        <div class="group-select">
          <TheGroupSelect @handleUpdate="handleUpdate"></TheGroupSelect>
        </div>
      </template>
      <div class="app-header">
        <DiyTabs
          ref="type-list"
          :tabList="allType"
          :curTab.sync="curTab"
        ></DiyTabs>
        <el-button type="text" @click="back">返回</el-button>
      </div>
      <TheAppList
        style="padding:0 20px"
        v-if="viewShow"
        ref="appList"
      ></TheAppList>
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
import TheAppItem from "../components/TheAppItem";
import TheAppInfoDialog from "./components/TheAppInfoDialog";
import DiyTabs from "@components/DiyTabs/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import { getOnSaleGroupAppList } from "@api/market";
import TheAppList from "./components/AppList";
import TheAppCard from "./components/AppCard";
import TheGroupSelect from "../../components/TheGroupSelectMenber";
export default {
  data() {
    return {
      fullscreenLoading: false,
      pageName: "",
      dialogShow: [
        {
          key: "info",
          value: false,
        },
      ],
      allType: [{ id: "1", title: "应用市场" }],
      curTab: "1",
      allAppList: [],
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
    TheAppItem,
    DiyTabs,
    TheAppInfoDialog,
    DiyBoxLayout,
    TheAppList,
    TheGroupSelect,
    TheAppCard,
  },
  computed: {
    ...mapState("user", ["userName"]),
    ...mapGetters("group", ["curGroupId"]),
    ...mapState("options", ["pageSize"]),
  },
  created() {
    this.pageName = this.$route.meta.title;
    // this.handleUpdate();
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
  mounted() {},
  methods: {
    ...mapActions("options", ["updatePageSize"]),
    async handleSizeChange(val) {
      this.page.currentPage = 1;
      await this.updatePageSize(val);
      this.$refs.card.loadAppList();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.$refs.card.loadAppList();
    },
    handleUpdate() {
      this.fullscreenLoading = true;
      let params = {
        groupId: this.curGroupId,
        saleStatus: 1,
        current: 1,
        size: 1000,
      };
      getOnSaleGroupAppList(params).then((res) => {
        this.allAppList = res.data.data.records;
        this.fullscreenLoading = false;
        this.$nextTick(() => {
          this.$refs.appList.loadAppList();
        });
      });
    },
    handlePurchase(item) {
      this.dialogShow.map((el) => {
        if (el.key === "info") {
          el.value = true;
          el.sendData = item;
        }
      });
    },
    back() {
      this.$router.push('/group-app/index')
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-table-layout {
  padding: 0 20px;
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
</style>
