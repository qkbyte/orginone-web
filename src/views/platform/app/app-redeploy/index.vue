<template>
  <div class="base-layout">
    <DiyBoxLayout>
      <template v-slot:table>
        <DiyTable
          ref="table"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          :hasTabs="true"
          @handleUpdate="loadlistData"
        >
          <template v-slot:slot-tabs>
            <DiyTabs
              ref="type-list"
              :tabList="allType"
              :curTab.sync="curTab"
            ></DiyTabs>
          </template>
          <template v-slot:buttons v-if="curTab !== '3'">
            <el-button type="text" @click="handleDeletes">拒绝</el-button>
            <el-button type="text" @click="handlePasss">通过</el-button>
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              :app="scope.row"
              @loadlistData="loadlistData('tab')"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
          <template v-slot:saleStatus="scope">
            <el-tag v-if="scope.row.redeployStatus == 1" type="success">
              通过
            </el-tag>
            <el-tag v-if="scope.row.redeployStatus == 2" type="danger">
              拒绝
            </el-tag>
            <el-tag v-if="scope.row.redeployStatus == 0" type="warning">
              待审核
            </el-tag>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DiyTabs from "@components/DiyTabs/index";
import { getAppList, checkRedeploy, getRedeployAppList } from "@api/market";
import DiyTable from "@components/DiyTable/index";
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
          label: "发布状态",
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
      allType: [
        { id: "1", title: "全部" },
        { id: "2", title: "待办" },
        { id: "3", title: "已办" },
      ],
      curTab: "1",
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    TheTableButton,
    DiyTabs,
  },
  created() {
    this.$nextTick(() => {
      this.loadlistData();
    });
  },
  mounted() {},
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadlistData("search");
    },
    curTab(val){
      this.loadlistData('tab')
    }
  },
  methods: {
    loadlistData(str) {
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
        flag: this.curTab,
        size: pageSize,
        current: currentPage,
        appName: this.filterText,
      };
      getRedeployAppList(params).then((res) => {
        let data = res.data.data;
        this.tableData = [];
        this.tableData = data.records;
        this.$refs.table.page.total = data.total;
        this.$refs.table.loading = false;
      });
    },
    handleDeletes() {
      // 批量拒绝
      let ids = [];
      let code1 = 0;
      let judge = false
      this.$refs.table.multipleSelection.forEach((element) => {
        if(element.redeployStatus == 0){
          ids.push(element.redeployId);
        }else{
          judge = true
        }
      });
      if (ids.length > 0 && !judge) {
        let params = {
          redeployIds: ids,
          checkStatus: false,
        };
        checkRedeploy(params).then((res) => {
          code1 = res.data.code;
          this.getMessage(code1);
        });
      } else if(judge) {
        this.$message.warning("存在已处理过的数据");
      }else{
        this.$message.warning("至少选择一条数据"); 
      }
    },
    handlePasss() {
      // 批量通过
      let ids = [];
      let code1 = 0;
      let judge = false
      this.$refs.table.multipleSelection.forEach((element) => {
        if(element.redeployStatus == 0){
          ids.push(element.redeployId);
        }else{
          judge = true
        }
      });
      if (ids.length > 0 && !judge) {
        let params = {
          redeployIds: ids,
          checkStatus: true,
        };
        checkRedeploy(params).then((res) => {
          code1 = res.data.code;
          this.getMessage(code1);
        });
      } else if(judge) {
        this.$message.warning("存在已处理过的数据");
      }else{
        this.$message.warning("至少选择一条数据"); 
      }
    },
    getMessage(code1) {
      if (code1 == 200) {
        this.$message.success("审核通过");
        this.loadlistData();
      } else {
        this.$message.warning("审核失败");
        this.loadlistData();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
