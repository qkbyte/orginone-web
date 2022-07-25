<template>
  <div style="height:95%">
    <DiyTable
      ref="table"
      :tableHead="tableHead"
      :options="options"
      :tableData="tableData"
      :hasTableHead="false"
      @handleUpdate="loadGroupList"
    >
      <template v-slot:operate="scope">
        <template v-if="scope.row.admin !== 1">
          <TheViewTableButton
            :rowData="scope.row"
            @updateList="loadGroupList"
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
import TheViewTableButton from "./TheViewTableButton";
import DiyTable from "@components/DiyTable/index";
import { appPurchaseGroupList } from "@api/market";
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
          prop: "groupName",
          label: "集团名称",
          minWidth: "200",
        },
        {
          prop: "linkMan",
          label: "集团管理员",
          minWidth: "250",
        },
        {
          prop: "linkPhone",
          label: "联系方式",
          width: "180",
        },
        {
          prop: "createTime",
          label: "订阅时间",
          width: "180",
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
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.$nextTick(() => {
      this.loadGroupList();
    });
  },
  mounted() {},
  computed: {},
  methods: {
    async loadGroupList() {
      this.$refs.table.loading = false;
      this.$emit("updateList", this.$route.query.id);
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
