<template>
  <DiyTable
    ref="table"
    :tableHead="tableHead"
    :options="options"
    :tableData="tableData"
    :tableName="'单位应用'"
    @handleUpdate="loadData"
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
      </div>
    </template>
    <template v-slot:type="scope">
      <div v-if="scope.row.appType === -1">-</div>
      <div v-else>
        {{ appType[scope.row.appType] }}
      </div>
    </template>
    <template v-slot:from="scope">
      <div>{{ scope.row.ifPurchase ? "自购" : "集团" }}</div>
    </template>
  </DiyTable>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import DiyTable from "@components/DiyTable/index";
import { getCanUseAppIdList } from "@api/market";
import { getDictItemObject } from "@utils/index";
export default {
  data() {
    return {
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
          prop: "version",
          label: "版本号",
          width: "120",
        },
        {
          type: "slot",
          name: "from",
          label: "来源",
          width: "120",
        },
        {
          prop: "createTime",
          label: "获取时间",
          minWidth: "180",
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
      tableData: [],
      appType: [],
      filterText:'',
    };
  },
  props: {
    unitData: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    DiyTable,
  },
  created() {
    this.$nextTick(async () => {
      this.appType = await getDictItemObject(this.dict.APP_TYPE);
    });
  },
  mounted() {},
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadData();
    },
  },
  computed: {
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  mounted() {},
  methods: {
    loadData() {
      this.$refs.table.loading = true;
      let params = {
        current: this.$refs.table.page.currentPage,
        size: this.$refs.table.page.pageSize,
        tenantId: this.unitData.tenantCode?this.unitData.tenantCode : this.unitData.id,
        appName: this.filterText,
      };
      getCanUseAppIdList(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
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
</style>
