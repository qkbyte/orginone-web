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
        
          <template v-slot:slot-tabs>
            <DiyTabs
              ref="type-list"
              :tabList="allType"
              :curTab.sync="curTab"
            ></DiyTabs>
          </template>
          <template v-slot:buttons>
            <el-button type="text" @click="back">返回</el-button>
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              v-if="scope.row.status === 101"
              :index="scope.index"
              :row="scope.row"
              @handleUpdate="loadData"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="'#' + scope.row.icon"></use>
            </svg>
          </template>
          <template v-slot:status="scope">
            <el-tag v-if="scope.row.status === 101" type="warning"
              >待审核</el-tag
            >
            <el-tag v-else-if="scope.row.status === 102" type="success"
              >已通过</el-tag
            >
            <el-tag v-else-if="scope.row.status === 104" type="info"
              >已取消</el-tag
            >
            <el-tag v-else type="danger">已拒绝</el-tag>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>
  </div>
</template>

<script>
import DiyTabs from "@components/DiyTabs/index";
import DiyTable from "@components/DiyTable/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./components/TheTableButton";
import { getTenantApplyGroup } from "@api/group";

export default {
  data() {
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
          prop: "groupName",
          label: "集团名称",
          width: "240",
        },
        {
          type: "slot",
          name: "status",
          label: "状态",
          align: "center",
          width: "100",
        },
        {
          prop: "createTime",
          label: "申请时间",
          minWidth: "200",
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
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
      },
      filterText: "",
      allType: [
        { id: "1", title: "全部" },
        { id: "2", title: "待审核" },
        { id: "3", title: "已完成" },
      ],
      curTab: "1",
      flag: "GROUP_ALL_APPLYING_STATUS",
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    TheTableButton,
    DiyTabs,
  },
  computed: {
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadData();
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
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted() {},
  methods: {
    /**
     * 加载列表数据
     */
    loadData() {
      this.$refs.table.loading = true;
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        current: currentPage,
        size: pageSize,
        flag: this.flag,
        propertiesName: this.filterText,
      };
      getTenantApplyGroup(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
    },
    back(){
      this.$router.go(-1)
    }
  },
};
</script>

<style lang="scss" scoped></style>
