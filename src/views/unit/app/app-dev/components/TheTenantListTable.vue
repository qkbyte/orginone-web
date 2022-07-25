<template>
  <div style="height:95%">
    <DiyTable
      ref="table"
      :tableHead="tableHead"
      :options="options"
      :tableData="tableData"
      :hasTableHead="false"
      @handleUpdate="loadTenantList"
    >
      <template v-slot:operate="scope">
        <template v-if="scope.row.admin !== 1">
          <TheViewTableButton
            :rowData="scope.row"
            @updateList="loadTenantList"
          ></TheViewTableButton>
        </template>
      </template>
      <template v-slot:status="scope">
        <el-tag type="success" v-if="scope.row.useStatus === 1">启用中</el-tag>
        <el-tag type="danger" v-if="scope.row.useStatus === 0">停用中</el-tag>
      </template>
    </DiyTable>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { appPurchaseTenantList } from "@api/market";
import TheViewTableButton from "./TheViewTableButton";
import DiyTable from "@components/DiyTable/index";
export default {
  data() {
    let _this = this;
    return {
      showOperate: false,

      dialogShow: [
        {
          key: "edit",
          value: false,
        },
        {
          key: "add",
          value: false,
        },
        {
          key: "test",
          value: false,
        },
      ],
      tableHead: [
        {
          prop: "unitName",
          label: "租户名称",
          minWidth: "200",
        },
        {
          prop: "linkMan",
          label: "单位管理员",
          minWidth: "250",
        },
        {
          prop: "linkPhone",
          label: "联系方式",
          minWidth: "200",
        },
        {
          prop: "createTime",
          label: "订阅时间",
          minWidth: "200",
        },
        {
          type: "slot",
          name: "status",
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
    DiyTable,
    TheViewTableButton,
  },
  created() {
    this.$nextTick(() => {
      this.loadTenantList();
    });
  },
  mounted() {},
  computed: {
    ...mapGetters("tenant", ["getCurTenant"]),
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
