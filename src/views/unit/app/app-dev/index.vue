<template>
  <DiyBoxLayout>
    <template v-slot:table>
      <DiyTable
        ref="table"
        :tableHead="tableHead"
        :options="options"
        :tableData="tableData"
        @handleUpdate="loadData"
      >
        <template v-slot:slot-title
          >已开发应用</template
        >
        <template v-slot:buttons>
          <el-button type="text" @click="back">返回</el-button>
          <el-button type="text" @click="handleIcon">图标库</el-button>
          <el-button type="text" @click="handleRegister">注册</el-button>
        </template>
        <template v-slot:operate="scope">
          <TheTableButton
            :rowData="scope.row"
            @handleUpdate="loadData"
          ></TheTableButton>
        </template>
        <template v-slot:icon="scope">
          <div class="app-icon">
            <div class="app-icon__img">
              <img :src=" scope.row.icon ? scope.row.icon : require('@assets/default-head.svg') " />
            </div>
          </div>
        </template>
        <template v-slot:type="scope">
          <div v-if="scope.row.appType === -1">-</div>
          <div v-else>
            {{ appType[scope.row.appType] }}
          </div>
        </template>
        <template v-slot:saleStatus="scope">
          <el-tag v-if="scope.row.status === 0" type="warning"
            >注册申请中</el-tag
          >
          <el-tag v-if="scope.row.status === 1" type="success">注册成功</el-tag>
          <el-tag v-if="scope.row.status === 2" type="danger">注册失败</el-tag>
          <el-tag v-else-if="scope.row.status === 3" type="warning"
            >部署申请中</el-tag
          >
          <el-tag v-else-if="scope.row.status === 4" type="success"
            >部署成功</el-tag
          >
          <el-tag v-else-if="scope.row.status === 5" type="danger"
            >部署失败</el-tag
          >
          <el-tag v-else-if="scope.row.status === 6" type="warning"
            >发布申请中</el-tag
          >
          <el-tag v-else-if="scope.row.status === 8" type="danger"
            >发布失败</el-tag
          >
          <el-tag
            v-else-if="scope.row.status === 7 && scope.row.saleStatus === 0"
            type="warning"
            >可上架</el-tag
          >
          <el-tag
            v-else-if="scope.row.status === 7 && scope.row.saleStatus === 1"
            type="success"
            >已上架</el-tag
          >
        </template>
      </DiyTable>
    </template>
  </DiyBoxLayout>
</template>

<script>
import { mapGetters } from "vuex";
import { getAppListByTenantId, deleteAppByAppId } from "@api/market";
import DiyTable from "@components/DiyTable/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./components/TheTableButton";
import { getDictItemObject } from "@utils/index";

export default {
  data() {
    let _this = this;
    return {
      total: 0,
      tableData: [],
      tableHead: [
        {
          type: "slot",
          name: "icon",
          label: "图标",
          align: "center",
          width: "80",
        },
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
          name: "type",
          label: "类型",
          width: "120",
        },
        {
          type: "slot",
          name: "saleStatus",
          prop: "saleStatus",
          minWidth: "100",
          label: "状态",
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
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    TheTableButton,
  },
  created() {
    this.$nextTick(async () => {
      this.appType = await getDictItemObject(this.dict.APP_TYPE);
      this.loadData();
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
      this.loadData('search');
    },
  },
  methods: {
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
        tenantId: this.curTenantCode,
        appName: this.filterText,
      };
      getAppListByTenantId(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
    },
    /**
     * 按钮操作
     */
    handleRegister() {
      this.$router.push({ name: "app-register" });
    },
    handleIcon(){
      this.$router.push({ name: "app-icon" });
    },
    back(){
      this.$router.push({name:'applicationMarket'})
    },
    /**
     * 表格内按钮操作
     */
    handleDelete(index, row) {
      deleteAppByAppId([row.id]).then((res) => {
        this.$message.success("应用删除成功");
        this.loadData();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-icon {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &__img {
    width: 18px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
