<template>
  <div style="height:100%">
    <DiyTable
      ref="table"
      :tableName="'单位信息'"
      :tableHead="tableHead"
      :options="options"
      :tableData="tableData"
      :hasTabs="true"
      @handleUpdate="loadData"
    >
      <template v-slot:mainUnit="scope">
        <div v-if="scope.row.isMaster === 1">
          是
        </div>
        <div v-if="scope.row.isMaster === 0 || scope.row.isMaster === -1">
          否
        </div>
      </template>
      <template v-slot:slot-tabs>
        <DiyTabs
          ref="type-list"
          :tabList="allType"
          :curTab.sync="curTab"
        ></DiyTabs>
      </template>
      <template v-slot:buttons>
        <el-button @click="handleMain" type="text">设为主单位</el-button>
        <el-button @click="handleCheckApply" type="text">查看申请</el-button>
        <el-button @click="handleApplyTenant" type="text">加入单位</el-button>
      </template>
      <template v-slot:operate="scope">
        <TheTableButton
          :rowData="scope.row"
          :userPhone="userPhone"
          @loadData="loadData"
          @handleTransfer="handleTransfer"
        ></TheTableButton>
      </template>
      <template v-slot:icon="scope">
        <i :class="scope.row.source"></i>
      </template>
    </DiyTable>
    <template v-for="item in dialogShow">
      <TheApplyDialog
        v-if="item.key === 'apply' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheApplyDialog>
      <TheTransferDialog
        v-if="item.key === 'transfer' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheTransferDialog>
    </template>
  </div>
</template>

<script>
import DiyTabs from "@components/DiyTabs/index";
import { mapState } from "vuex";
import { getTenantListPages } from "@api/tenant";
import DiyTable from "@components/DiyTable/index";
import TheApplyDialog from "./TheApplyDialog";
import TheTableButton from "./TheTableButton";
import TheTransferDialog from "./TheTransferDialog";
import { setMasterUnit } from "@api/user";
export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "apply",
          value: false,
        },
        {
          value:false,
          key: 'transfer'
        }
      ],
      tableData: [],
      tableHead: [
        {
          prop: "tenantName",
          label: "单位名称",
          width: "180",
        },
        {
          prop: "socialCreCode",
          label: "统一社会信用代码",
          width: "220",
        },
        {
          prop: "realName",
          label: "管理员",
          width: "100",
        },
        {
          type: "slot",
          name: "mainUnit",
          prop: "isMaster",
          label: "主单位",
          width: "100",
        },
        {
          prop: "phoneNumber",
          label: "联系方式",
          width: "180",
        },
        {
          prop: "updateTime",
          label: "更新时间",
          width: "200",
        },
        {
          prop: "createTime",
          label: "创建时间",
          MinWidth: "200",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          width: "80",
          MinWidth: "80",
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
      tableButton: [],
      filterValue: "全部",
      count: 5, //筛选租户列表 0-用户创建租户，1-该用户申请加入待审核，2-用户已加入的也就是审核通过的，4-全部
      allType: [
        { id: '1', title: "全部" },
        { id: '2', title: "创建的" },
        { id: '3', title: "已加入" },
      ],
      curTab: '1',
      filterText: "",
    };
  },
  props:["userPhone"],
  components: {
    DiyTable,
    TheApplyDialog,
    TheTableButton,
    DiyTabs,
    TheTransferDialog
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  computed: {
    ...mapState("user", ["userName","id"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    curTab(val) {
      switch (val) {
        case '1':
          this.count = 5;
          break;
        case '2':
          this.count = 0;
          break;
        case '3':
          this.count = 2;
          break;
      }
      this.loadData();
    },
    getFilterText(val) {
      this.filterText = val;
      this.loadData();
    },
  },
  methods: {
    handleMain(){ // 设为主单位
      let tenantCode = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        tenantCode = [...tenantCode, element.tenantCode]
      });
      console.log('tenan', tenantCode);
      if(tenantCode.length > 1){
        this.$message.warning('只能设置一个主单位')
      }else if(tenantCode.length < 1){
        this.$message.warning('请至少选择一个单位')
      }else{
        let params = {
          tenantCode: tenantCode[0],
          phoneNumber: this.userName.accountName
        }
        console.log('params', params);
        setMasterUnit(params).then((res) => {
          if(res.data.code == 200){
            this.$message.success('设置主单位成功')
            this.loadData()
          }
        });
      }
    },
    loadData() {
      this.$refs.table.loading = true;
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        current: currentPage,
        size: pageSize,
        phoneNumber: this.userName.accountName,
        count: this.count,
        tenantName: this.filterText,
      };
      getTenantListPages(params).then((res) => {
        let data = res.data.data;
        this.tableData = data.records.filter(
          (el) => el.tenantName !== "开放中心"
        );
        this.$refs.table.page.total = data.total;
        this.$refs.table.loading = false;
      });
    },
    /**
     * 按钮操作
     */
    handleApplyTenant() {
      this.dialogShow.map((el) => {
        if (el.key === "apply") {
          el.value = true;
        }
      });
    },
    handleCheckApply() {
      this.$router.push({ name: "person-check-apply" });
    },
    handleTransfer(row){
      this.dialogShow.map((el)=>{
        if(el.key == 'transfer'){
          el.value = true,
          el.sendData = row
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.checkApply {
  margin-right: 15px;
}
</style>
