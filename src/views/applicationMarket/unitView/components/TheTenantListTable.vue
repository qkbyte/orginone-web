<template>
  <div>
    <DiyTable
      ref="table"
      :tableHead="tableHead"
      :options="options"
      :tableData="tableData"
      :hasTableHead="false"
      @handleUpdate="loadTenantList"
    >
      <template v-slot:slot-select>
        <div class="content-title">已购单位列表</div>
      </template>
      <template v-slot:operate="scope">
        <template v-if="scope.row.admin !== 1">
          <TheTableButton
            :rowData="scope.row"
            @updateList="loadTenantList"
          ></TheTableButton>
        </template>
      </template>
    </DiyTable>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TheTableButton from "./TheTableButton";
import DiyTable from "@components/DiyTable/index";
export default {
  data() {
    let _this = this;
    return {
      tableHead: [
        {
          prop: "tenantName",
          label: "租户名称",
          minWidth: "200",
        },
        {
          prop: "applyReason",
          label: "单位管理员",
          minWidth: "250",
        },
        {
          prop: "phoneNumber",
          label: "联系方式",
          minWidth: "200",
        },
        {
          prop: "createTime",
          label: "申请时间",
          minWidth: "200",
        },
        {
          type: "slot",
          name: "applyStatus",
          prop: "status",
          label: "状态",
          minWidth: "200",
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
        page: {
          layout: " prev, pager, next, sizes",
        },
      },
      total: 0,
    };
  },
  components: {
    DiyTable,
    TheTableButton,
  },
  created() {
    this.$nextTick(() => {
      this.loadTenantList();
    });
  },
  mounted() {},
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant", "curTenantId"]),
  },
  methods: {
    async loadTenantList() {
      this.$refs.table.loading = false;
      this.$emit("updateList", this.$route.query.id);
    },
  },
  props: {
    tableData: {
      type: Array,
      default: () => [],
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
