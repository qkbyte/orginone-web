<template>
  <div class="base-layout">
    <DiyBoxLayout>
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
          <el-button type="text" @click="back">返回</el-button>
          <el-button v-show="count !== 6" type="text" @click="handleDeletes">拒绝</el-button>
          <el-button v-show="count !== 6" type="text" @click="handlePasss">通过</el-button>
        </template>
        <template v-slot:status="scope" class="check-status">
          <el-tag v-if="scope.row.tenantApplyingState == '2'" type="success">
            <span class="statusPoint passPoint"></span>审核通过
          </el-tag>
          <el-tag
            v-else-if="scope.row.tenantApplyingState == '1'"
            type="warning"
          >
            <span class="statusPoint refusePoint"></span>审核中
          </el-tag>
          <!-- <el-tag
            v-else-if="scope.row.tenantApplyingState == '0'"
            type="success"
          >
            <span class="statusPoint refusePoint"></span>拥有者
          </el-tag> -->
          <el-tag v-else type="danger">
            <div class="statusPoint auditPoint"></div>
            已拒绝
          </el-tag>
        </template>
        <template v-slot:operate="scope">
          <div v-if="scope.row.tenantApplyingState == '1'">
            <TheTableButton
              @handleDelete="handleDelete"
              @handlePass="handlePass"
              :index="scope.index"
              :row="scope.row"
            ></TheTableButton>
          </div>
        </template>
        <template v-slot:icon="scope">
          <i :class="scope.row.source"></i>
        </template>
        <template v-slot:gender="scope">
          <div v-if="scope.row.gender === 1">男</div>
          <div v-else>女</div>
        </template>
      </DiyTable>
    </DiyBoxLayout>
  </div>
</template>

<script>
import DiyTabs from "@components/DiyTabs/index";
import { mapGetters } from "vuex";
import { getCheckUsersListByTenantCode, checkUser } from "@api/user";
import DiyTable from "@components/DiyTable/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./components/TheTableButton";

export default {
  data() {
    let _this = this;
    return {
      count: 7,
      allType: [
        { id: "1", title: "全部" },
        { id: "2", title: "待办" },
        { id: "3", title: "已办" },
      ],
      curTab: "1",
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
          prop: "userName",
          label: "姓名",
          width: "150",
        },
        {
          prop: "phoneNumber",
          label: "手机号",
          width: "200",
        },
        {
          type: "slot",
          name: "status",
          prop: "status",
          label: "审核状态",
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
      tableButton: [
        {
          key: "reject",
          type: "text",
          icon: "el-icon-close",
          value: "拒绝",
          func: function(index, row) {
            _this.handleDelete(index, row);
          },
        },
        {
          key: "pass",
          type: "text",
          icon: "el-icon-check",
          value: "通过",
          func: function(index, row) {
            _this.handlePass(index, row);
          },
        },
      ],
      filterText: "",
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
      this.loadlistData('search');
    },
    curTab(val) {
      switch (val) {
        case '1':
          this.count = 7;
          break;
        case '2':
          this.count = 1;
          break;
        case '3':
          this.count = 6;
      }
      this.loadlistData();
    },
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
        current: currentPage,
        count: this.count,
        size: pageSize,
        realName: this.filterText,
      };
      getCheckUsersListByTenantCode(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
    },
    back(){
      this.$router.go(-1)
    },
    /**
     * 按钮操作
     */
    handlePasss() {
      if (this.$refs.table.multipleSelection.length === 0) {
        this.$message.warning({
          message: "请至少选择一个用户",
          duriation: 700,
        });
      } else {
        let ids = [];
        this.$refs.table.multipleSelection.forEach((element) => {
          ids.push(element.id);
        });
        let params = {
          userIds: ids.join(","),
          tenantCode: this.curTenantCode,
          isPass: 1,
        };
        checkUser(params).then((res) => {
          this.$message.success("通过用户成功");
          this.loadlistData();
        });
      }
    },

    handleDeletes() {
      if (this.$refs.table.multipleSelection.length === 0) {
        this.$message.warning({
          message: "请至少选择一个用户",
          duriation: 700,
        });
      } else {
        let ids = [];
        let judge = false
        this.$refs.table.multipleSelection.forEach((element) => {
          if(element.tenantApplyingState == '1'){
            ids.push(element.id);
            judge = true
          }else{
            this.$message.warning('不能对已办人员进行操作')
            return
          }
        });
        if(judge){
          let params = {
            userIds: ids.join(","),
            tenantCode: this.curTenantCode,
            isPass: 0,
          };
          checkUser(params).then((res) => {
            this.$message.success("拒绝用户成功");
            this.loadlistData();
          });
        }
      }
    },
    /**
     * 表格内按钮操作
     */
    handlePass(index, row) {
      let params = {
        userIds: row.id,
        tenantCode: this.curTenantCode,
        isPass: 1,
      };
      checkUser(params).then((res) => {
        this.$message.success("通过用户成功");
        this.loadlistData();
      });
    },
    handleDelete(index, row) {
      let params = {
        userIds: row.id,
        tenantCode: this.curTenantCode,
        isPass: 0,
      };
      checkUser(params).then((res) => {
        this.$message.success("拒绝用户成功");
        this.loadlistData();
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
