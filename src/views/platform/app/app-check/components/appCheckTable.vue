<template>
  <div style="height:100%">
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
      <template v-slot:buttons>
        <el-button type="text" @click="handleDeletes">拒绝</el-button>
        <el-button type="text" @click="handlePasss">通过</el-button>
      </template>
      <template v-slot:operate="scope">
        <TheTableButton
          v-if="scope.row.status !== 2 || scope.row.status !== 5 || scope.row.status !== 8"
          :rowStatus="scope.row.status"
          :rowData="scope.row"
          @handleview="handleView"
          @consentAuditone="handlePass"
          @refuseAuditone="handleDelete"
        ></TheTableButton>
      </template>
      <template v-slot:icon="scope">
        <i :class="scope.row.source"></i>
      </template>
      <template v-slot:saleStatus="scope">
        <el-tag v-if="scope.row.status === 0" type="warning">
          注册审核中
        </el-tag>
        <el-tag v-else-if="scope.row.status === 1" type="success">
          注册通过
        </el-tag>
        <el-tag v-else-if="scope.row.status === 2" type="danger">
          注册拒绝
        </el-tag>
        <el-tag v-else-if="scope.row.status === 3" type="warning">
          部署审核中
        </el-tag>
        <el-tag v-else-if="scope.row.status === 4" type="success">
          部署通过
        </el-tag>
        <el-tag v-else-if="scope.row.status === 5" type="danger">
          部署拒绝
        </el-tag>
        <el-tag v-else-if="scope.row.status === 6" type="warning">
          发布审核中
        </el-tag>
        <el-tag v-else-if="scope.row.status === 7" type="success">
          发布通过
        </el-tag>
        <el-tag v-else-if="scope.row.status === 8" type="danger">
          发布拒绝
        </el-tag>
      </template>
    </DiyTable>
  </div>
</template>
<script>
import DiyTabs from "@components/DiyTabs/index";
import DiyTable from "@components/DiyTable/index";
import { mapGetters, mapActions } from "vuex";
import { getCheckAppList, checkApp, checkRedeploy } from "@api/market";
import TheTableButton from "./TheTableButton";
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
          label: "状态",
          width: "120",
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
          prop: "applyTime",
          label: "申请时间",
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
      filterText: "",
      count: 10,
      allType: [
        { id: "1", title: "全部" },
        { id: "2", title: "待办" },
        { id: "3", title: "已办" },
      ],
      curTab: "1",
      timer: null,
    };
  },
  components: {
    DiyTable,
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
      this.loadlistData('search');
    },
    curTab(newVal, oldVal) {
      this.filterList(newVal);
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.timer = null;
  },
  methods: {
    async loadlistData(str) {
      this.$refs.table.loading = true;
      let currentPage = 1
      let pageSize = 20
      if(str){
        pageSize = this.$refs.table.page.pageSize;
        this.$refs.table.page.currentPage = 1;
      }else{
        currentPage = this.$refs.table.page.currentPage
        pageSize = this.$refs.table.page.pageSize;
      }
      let params = {
        current: currentPage,
        size: pageSize,
        count: this.count,
        appName: this.filterText,
      };
      await getCheckAppList(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
      });
      this.$refs.table.loading = false;
    },
    /**
     * 按钮操作
     */
    handlePasss() {
      let ids = [];
      let code1 = 0;
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length > 0) {
        let params = {
          idList: ids,
          checkStatus: true,
        };
        checkApp(params).then((res) => {
          code1 = res.data.code;
          this.getMessage(code1);
        });
      } else {
        this.$message.error("至少选择一行");
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
    handleDeletes() {
      let ids = [];
      let code1 = 0;
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length > 0) {
        let params = {
          idList: ids,
          checkStatus: false,
        };
        checkApp(params).then((res) => {
          code1 = res.data.code;
          this.getMessage(code1);
        });
      } else {
        this.$message.error("至少选择一行");
      }
    },
    /**
     * 表格内按钮操作
     */
    handleView(row) {
      this.$router.push({
        name: "app-check-view",
        query: {
          id: row.id,
          status: row.status,
        },
      });
    },
    handlePass(row) {
      let params = {
        idList: [row.id],
        checkStatus: true,
      };
      checkApp(params).then((res) => {
        this.$message.success("审核成功");
        this.loadlistData();
      });
    },
    handleDelete(row) {
      let params = {
        idList: [row.id],
        checkStatus: false,
      };
      checkApp(params).then((res) => {
        this.$message.success("审核成功");
        this.loadlistData();
      });
    },
    /*
    筛选框点击操作
    */
    filterList(val) {
      switch (val) {
        case "1":
          this.count = 10;
          break;
        case "2":
          this.count = null;
          break;
        case "3":
          this.count = 11;
          break;
      }
      this.$refs.table.initPage();
      this,
        (timer = setTimeout(() => {
          this.loadlistData();
        }, 500));
    },
  },
};
</script>
<style lang="scss" scoped>
.content-title {
  font-size: 18px;
  height: 60px;
  line-height: 60px;
  font-weight: 700;
  color: #303133;
}
</style>
