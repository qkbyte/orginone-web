<template>
  <div>
    <DiyBoxLayout>
      <template v-slot:table>
        <DiyTable
          ref="table"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          :hasTabs="true"
          @handleUpdate="loadData"
        >
          <template v-slot:buttons v-if="curTab !== '3' ">
            <el-button @click="handleCancelApply" type="text"
              >取消申请</el-button
            >
          </template>
          <template v-slot:slot-tabs>
            <DiyTabs
              ref="type-list"
              :tabList="allType"
              :curTab.sync="curTab"
            ></DiyTabs>
          </template>
          <template v-slot:status="scope" class="check-status">
            <el-tag type="danger" v-if="scope.row.tenantApplyingState == '3'">
              <span class="statusPoint refusePoint"></span>已拒绝
            </el-tag>
            <el-tag
              type="warning"
              v-else-if="scope.row.tenantApplyingState == '1'"
            >
              <span class="statusPoint refusePoint"></span>待审核
            </el-tag>
            <el-tag
              type="success"
              v-else-if="scope.row.tenantApplyingState == '2'"
            >
              <span class="statusPoint refusePoint"></span>已通过
            </el-tag>
          </template>
          <template v-slot:operate="scope">
            <div v-if="scope.row.tenantApplyingState == '1'">
              <TheTableButton
                :rowData="scope.row"
                @refresh="loadData"
              ></TheTableButton>
            </div>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>
  </div>
</template>

<script>
import DiyTabs from "@components/DiyTabs/index";
import { mapState } from "vuex";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import DiyTable from "@components/DiyTable/index";
import { getTenantListPages, cancelApplyTenant } from "@api/tenant";
import TheTableButton from "./TheTableButton";

export default {
  data() {
    return {
      count: 4,
      allType: [
        { id: '1', title: "全部" },
        { id: '2', title: "待审核" },
        { id: '3', title: "已完成" },
      ],
      curTab: '1',
      tableData: [],
      tableHead: [
        {
          prop: "tenantName",
          label: "单位名",
          width: "180",
        },
        {
          prop: "status",
          label: "申请状态",
          type: "slot",
          name: "status",
          width: "180",
        },
        {
          prop: "createTime",
          label: "申请时间",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          width: "100",
          MinWidth: "100",
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
    };
  },
  components: {
    DiyBoxLayout,
    DiyTable,
    DiyTabs,
    TheTableButton,
  },
  computed: {
    ...mapState("user", ["userName"]),
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  methods: {
    async loadData() {
      this.$refs.table.loading = true;
      const { currentPage, pageSize } = this.$refs.table.page;
      console.log(this.$refs.table.page);
      let params = {
        current: currentPage,
        size: pageSize,
        phoneNumber: this.userName.accountName,
        count: this.count,
      };
      const res = await getTenantListPages(params);
      const { records, total } = res.data.data;
      this.tableData = records;
      this.$refs.table.page.total = total;
      this.$refs.table.loading = false;
    },
    handleCancelApply() {
      let selected = this.$refs.table.multipleSelection;
      if (selected.length === 0)
        return this.$message.warning("请至少选择一个单位");
      let arr = [];
      for (let i of selected) {
        if (i.tenantApplyingState === 2 || i.tenantApplyingState == 3)
          return this.$message.warning("请不要选择已审核过的单位");
        else {
          arr.push(i.tenantCode);
        }
      }
      cancelApplyTenant(arr).then((res) => {
        this.$message.success("取消成功");
        this.loadData();
      });
    },
  },
  watch: {
    curTab(val) {
      switch (val) {
        case '1':
          this.count = 4;
          break;
        case '2':
          this.count = 1;
          break;
        case '3':
          this.count = 7;
      }
      this.loadData();
    },
  },
};
</script>

<style lang="scss"></style>
