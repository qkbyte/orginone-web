<template>
  <div style="height:100%">
    <DiyTable
      ref="table"
      :tableHead="tableHead"
      :options="options"
      :tableData="allAppList"
      :hasTableHead="false"
      @handleUpdate="loadAppList"
    >
      <template v-slot:icon="scope">
        <div class="app-icon">
          <div class="app-icon__img">
            <img
              :src="
                scope.row.icon
                  ? scope.row.icon
                  : require('@assets/default-head.svg')
              "
            />
          </div>
          <div class="app-icon__state">
              <div class="yirenzheng" v-if="scope.row.reformStatus == 0"><img src="@assets/yirenzheng1.svg" alt="已认证" title="已认证"></div>
              <div class="weirenzheng" v-if="scope.row.reformStatus == 1"><img src="@assets/weirenzheng.svg" alt="整改中" title="整改中"></div>
          </div>
        </div>
      </template>
      <template v-slot:type="scope">
        <div v-if="scope.row.appType === -1">-</div>
        <div v-else>
          {{ appType[scope.row.appType] }}
        </div>
      </template>
      <template v-slot:targetUser="scope">
        <div v-if="scope.row.targetUser === -1">-</div>
        <div v-else>
          {{ targetUser[scope.row.targetUser].label }}
        </div>
      </template>
      <template v-slot:operate="scope">
        <TheTableButton
          :rowData="scope.row"
          @updateList="loadAppList"
          @handlePurchase="handlePurchase"
        ></TheTableButton>
      </template>
    </DiyTable>
    <template v-for="item in dialogShow">
      <TheAppInfoDialog
        v-if="item.key === 'getApp' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleClose="handleClose"
        @handleUpdate="loadAppList"
      ></TheAppInfoDialog>
    </template>
  </div>
</template>
<script>
import { getDictItemList, getDictItemObject } from "@utils/index";
import { mapGetters, mapActions } from "vuex";
import { getOnSaleAppList, getOnSaleGroupAppList } from "@api/market";
import DiyTable from "@components/DiyTable/index";
import TheTableButton from "./TheTableButton";
import TheAppInfoDialog from "./TheAppInfoDialog";
export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "getApp",
          value: false,
        },
      ],
      allAppList: [],
      tableHead: [
        {
          type: "slot",
          name: "icon",
          label: "图标",
          align: "center",
          width: "80",
        },
        {
          prop: "appName",
          label: "应用名称",
          width: "200",
        },
        {
          prop: "tenantName",
          label: "开发商",
          width: "200",
        },
        {
          prop: "description",
          label: "应用描述",
          width: "300",
        },
        {
          type: "slot",
          name: "type",
          label: "类型",
          width: "120",
        },
        {
          type: "slot",
          name: "targetUser",
          label: "目标用户",
          width: "120",
        },
        {
          prop: "version",
          label: "版本号",
          width: "120",
        },
        {
          prop: "publishTime",
          label: "上架时间",
          minWidth: "180",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          width: "80",
          name: "operate",
        },
      ],
      options: {
        checkBox: true,
        order: true,
        defaultSort: { prop: "createdTime", order: "descending" },
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
      },
      appType: [],
      filterText: "",
      targetUser: [],
    };
  },
  components: {
    DiyTable,
    TheTableButton,
    TheAppInfoDialog,
  },
  created() {
    this.$nextTick(async () => {
      this.appType = await getDictItemObject(this.dict.APP_TYPE);
      this.targetUser = [0].concat(await getDictItemList(this.dict.APP_TARGET));
      this.loadAppList();
    });
  },
  mounted() {},
  computed: {
    ...mapGetters("tenant", ["curTenant", "curTenantId"]),
    ...mapGetters("group", ["curGroupId"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadAppList("search");
    },
  },
  methods: {
    //获取应用列表
    loadAppList(str) {
      this.$refs.table.loading = true;
      let currentPage = 1;
      let pageSize = 20;
      if (str) {
        pageSize = this.$refs.table.page.pageSize;
        this.$refs.table.page.currentPage = 1;
      } else {
        currentPage = this.$refs.table.page.currentPage;
        pageSize = this.$refs.table.page.pageSize;
      }
      let params = {
        groupId: this.curGroupId,
        saleStatus: 1,
        current: currentPage,
        size: pageSize,
        appName: this.filterText,
      };
      getOnSaleGroupAppList(params).then((res) => {
        const { records, total } = res.data.data;
        this.allAppList = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
    },
    //打开获取窗口
    handlePurchase(item) {
      this.dialogShow.map((el) => {
        if (el.key === "getApp") {
          el.value = true;
          el.sendData = item;
        }
      });
    },
    handleClose(item) {
      this.dialogShow.map((el) => {
        if (el.key === "getApp") {
          el.value = false;
          el.sendData = item;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-icon {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &__img {
    width: 18px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.yirenzheng {
  width: 20px;
  height: 20px;
  position: absolute;
  top: -2px;
  left: -2px;
  img{
    width: 100%;
    height: 100%;
  }
}
.weirenzheng{
  width: 15px;
  height: 15px;
  position: absolute;
  top: -5px;
  left: 0;
  img{
    width: 100%;
    height: 100%;
  }
}
</style>
