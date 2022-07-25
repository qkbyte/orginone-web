<template>
  <div>
    <DiyBoxLayout>
      <template v-slot:table>
        <DiyTable
          ref="table"
          :tableName="tableName"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          @handleUpdate="loadData"
        >
          <template v-slot:buttons> </template>
          <template v-slot:operate="scope">
            <TheTableButton
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
            <el-tag v-else-if="scope.row.status === 103" type="success"
              >已通过</el-tag
            >
            <el-tag v-else type="error">已拒绝</el-tag>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DiyTable from "@components/DiyTable/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./components/TheTableButton";
import { getGroupApplyGroupList } from "@api/group";

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
      tableName: "申请记录",
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
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    TheTableButton,
  },
  computed: {
    ...mapGetters("group", ["curGroupId"]),
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
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
        groupId: this.curGroupId,
        flag: 104,
      };
      getGroupApplyGroupList(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
