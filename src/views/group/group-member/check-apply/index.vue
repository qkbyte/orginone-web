<template>
  <div>
    <DiyBoxLayout>
      <template v-slot:table
        ><DiyTable
          ref="table"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          :hasTabs="true"
          @handleUpdate="loadData"
        >
          <template v-slot:slot-tabs>
            <DiyTabs
              ref="type-list"
              :tabList="allType"
              :curTab.sync="curTab"
            ></DiyTabs>
          </template>
          <template v-slot:slot-title>
            <div class="group-select">
              <TheGroupSelect @handleUpdate="loadData"></TheGroupSelect>
            </div>
          </template>
          <template v-slot:buttons>
            <el-button type="text" @click="back">返回</el-button>
            <el-button type="text" @click="handleCheck(false)">拒绝</el-button>
            <el-button type="text" @click="handleCheck(true)">通过</el-button>
          </template>
          <template v-slot:status="scope">
            <el-tag v-if="scope.row.flag === 101" type="warning">待审核</el-tag>
            <el-tag v-else-if="scope.row.flag === 102" type="success"
              >已通过</el-tag
            >
            <el-tag v-else-if="scope.row.flag === 103" type="danger"
              >已拒绝</el-tag
            >
            <el-tag v-else type="info">已取消</el-tag>
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              v-if="scope.row.flag === 101"
              :index="scope.index"
              :row="scope.row"
              @handleUpdate="loadData"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DiyTabs from "@components/DiyTabs/index";
import { getApplyGroupList, checkTenantApplyGroup } from "@api/group";
import DiyTable from "@components/DiyTable/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./components/TheTableButton";
import TheGroupSelect from "../../components/TheGroupSelectMenber";

export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "auth",
          value: false,
        },
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
          prop: "unitName",
          label: "名称",
          width: "240",
        },
        {
          prop: "linkMan",
          label: "管理员",
          width: "120",
        },
        {
          prop: "linkPhone",
          label: "联系方式",
          width: "160",
        },
        {
          type: "slot",
          name: "status",
          align: "center",
          label: "状态",
          width: "100",
        },
        {
          prop: "updateTime",
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
        defaultSort: { prop: "createTime", order: "descending" },
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
      flag: "GROUP_ALL_APPLYING_STATUS",
      flag2: false,
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    TheTableButton,
    TheGroupSelect,
    DiyTabs,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted() {},
  computed: {
    ...mapGetters("group", ["curGroupId"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadData("search");
    },
    curTab(val) {
      switch (val) {
        case "1":
          this.flag = "GROUP_ALL_APPLYING_STATUS";
          break;
        case "2":
          this.flag = "GROUP_APPLYING_STATUS";
          break;
        case "3":
          this.flag = "GROUP_DONE_APPLYING_STATUS";
          break;
      }
      this.loadData();
    },
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    loadData(str) {
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
        size: pageSize,
        groupName: this.filterText,
        flag: this.flag,
        groupId: this.curGroupId,
      };
      getApplyGroupList(params)
        .then((res) => {
          const { records, total } = res.data.data;
          this.tableData = records;
          this.$refs.table.page.total = total;
          this.$refs.table.loading = false;
        })
        .catch(() => {
          this.$refs.table.page.total = 0;
          this.$refs.table.loading = false;
        });
    },
    /**
     * 按钮操作
     */
    handleCheck(val) {
      let _this = this;
      const selectedList = this.$refs.table.multipleSelection;
      if (selectedList.length === 0) {
        this.$message.warning("请至少选择一行");
      } else {
        let ids = selectedList
          .map((el) => {
            if (el.flag === 101) {
              return el.tenantId;
            } else {
              _this.flag2 = true;
            }
          })
          .join(",");
        if (this.flag2) {
          this.flag2 = false;
          return _this.$message.error("请不要选择已通过或已拒绝的单位");
        }
        if (val) {
          let params = {
            groupId: this.curGroupId,
            tenantIds: ids,
            flag: "102",
          };
          checkTenantApplyGroup(params).then((res) => {
            this.loadData();
            this.$message.success("审核完成");
          });
        } else {
          let params = {
            groupId: this.curGroupId,
            tenantIds: ids,
            flag: "103",
          };
          checkTenantApplyGroup(params).then((res) => {
            this.loadData();
            this.$message.success("审核完成");
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.group-select {
  margin-top: -10px;
  margin-left: -20px;
  margin-bottom: 10px;
}
</style>
