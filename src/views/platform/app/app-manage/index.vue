<template>
  <div class="base-layout">
    <DiyBoxLayout>
      <template v-slot:table>
        <DiyTable
          ref="table"
          :tableName="tableName"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          @handleUpdate="loadlistData"
        >
          <template v-slot:buttons>
            <el-button type="text" @click="goto">查看申请</el-button>
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              :app="scope.row"
              @loadlistData="loadlistData"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
          <template v-slot:saleStatus="scope">
            <el-tag v-if="scope.row.saleStatus === 0" type="warning">
              未上架
            </el-tag>
            <el-tag v-else-if="scope.row.saleStatus === 3" type="danger" effect="dark">
              已冻结
            </el-tag>
            <el-tag v-else type="success">
              已上架
            </el-tag>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { checkApp, getAppList, updateAppOffSale ,checkRedeploy} from "@api/market";
import DiyTable from "@components/DiyTable/index";
import DiyTitle from "@components/DiyTitle/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./components/TheTableButton";

export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "edit",
          value: false,
        },
        {
          key: "add",
          value: false,
        },
      ],
      tableName: "已发布应用",
      tableData: [],
      tableHead: [
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
          prop: "version",
          label: "版本号",
          width: "100",
        },
        {
          type: "slot",
          name: "saleStatus",
          prop: "saleStatus",
          label: "上架状态",
          width: "100",
        },
        {
          prop: "tenantName",
          label: "开发商",
          width: "240",
        },
        {
          prop: "contactName",
          label: "负责人",
          width: "120",
        },
        {
          prop: "contact",
          label: "联系方式",
          width: "160",
        },
        {
          prop: "publishTime",
          label: "发布时间",
          minWidth: "180",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          width: "80",
          minWidth: "80",
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
      filterText: "",
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    TheTableButton,
  },
  created() {
    this.$nextTick(() => {
      this.loadlistData();
    });
  },
  mounted() {
    console.log("dialogShow",this.dialogShow);
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadlistData('search');
    },
  },
  methods: {
    goto() {
      this.$router.push({ name: "app-check" });
    },
    loadlistData(str) {
      this.$refs.table.loading = true;
      let currentPage = 1
      let pageSize = 20
      if(str){
        pageSize = this.$refs.table.page.pageSize;
      }else{
        currentPage = this.$refs.table.page.currentPage
        pageSize = this.$refs.table.page.pageSize;
      }
      let params = {
        appName: this.filterText,
        size: pageSize,
        current: currentPage,
      };
      getAppList(params).then((res) => {
        let data = res.data.data;
        this.tableData = [];
        this.tableData = data.records;
        this.$refs.table.page.total = data.total;
        this.$refs.table.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
