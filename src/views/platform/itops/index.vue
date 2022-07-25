<template>
  <div class="base-layout">
    <DiyBoxLayout>
      <template v-slot:table>
        <DiyTable
          ref="table"
          :tableName="tableName"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          @handleUpdate="loadlistData"
        >
          <template v-slot:buttons>
            <el-button type="text" @click="allitops">扫描并自动修复</el-button>
            <el-button type="text" @click="alltenantitops">手动修复租户</el-button>
            <el-button type="text" @click="alluseritops">手动修复用户</el-button>
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              :index="scope.index"
              :row="scope.row"
              @itopsdetail="itopsdetail"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
           <template v-slot:type="scope">
            <div v-if="scope.row.type === 3">按用户扫描</div>
            <div v-if="scope.row.type === 2">按租户扫描</div>
            <div v-if="scope.row.type === 1">自动修复</div>
          </template>
          <template v-slot:if_end="scope">
            <el-tag v-if="scope.row.if_end === 1" type="success">
            扫描已结束
            </el-tag>
            <el-tag v-if="scope.row.if_end === 0" type="warning">
            扫描未结束
            </el-tag>
          </template>
          <template v-slot:if_modifyend="scope">
            <el-tag v-if="scope.row.if_modifyend === 1" type="success">
            已修复完成
            </el-tag>
            <el-tag v-if="scope.row.if_modifyend === 2" type="warning">
            未修复完成
            </el-tag>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getpubliccontainbyfilter,
  deletePublicContainByRecid,
} from "@api/home";
import {
  allitops,
  alltenantitops,
  alluseritops,
  getallitops,
  getallitopsdetail,
} from "@api/itops";
import DiyTable from "@components/DiyTable/index";
import DiyTitle from "@components/DiyTitle/index";
import DiySearch from "@components/DiySearch/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./components/TheTableButton";

export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "edit",
          value: false,
        },
      ],
      searchItem: {
        accuontName: "",
        realName: "",
      },
      tableName: "数据运维列表",
      tableData: [],
      tableHead: [
        {
          prop: "start_date",
          label: "运维时间",
          width: "150",
        },
        {
          prop: "start_time",
          label: "运维开始时间",
          width: "150",
        },
        {
          prop: "end_time",
          label: "运维结束时间",
          width: "150",
        },
        {
          prop: "content",
          label: "运维扫描内容",
          width: "150",
        },
        {
          type: "slot",
          prop: "type",
          name: "type",
          label: "运维类型",
        },
        {
          type: "slot",
          prop: "if_end",
          name: "if_end",
          label: "是否扫描结束",
        },
        {
          type: "slot",
          prop: "if_modifyend",
          name: "if_modifyend",
          label: "是否修复结束",
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
        defaultSort: { prop: "start_date", order: "start_date" },
      },
      tableButton: [
        {
          key: "edit",
          type: "text",
          icon: "el-icon-edit",
          value: "查看详情",
          func: function(index, row) {
            _this.itopsdetail(index, row);
          },
        },
      ],
    };
  },
  components: {
    DiyTable,
    DiyTitle,
    DiyBoxLayout,
    TheTableButton,
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
     // this.searchItem.containName = val;
      this.loadlistData();
    },
  },
  methods: {
    loadlistData() {
      this.$refs.table.loading = true;
      getallitops().then((res) => {
        let data = res.data.data;
        this.tableData = data;
        this.$refs.table.total = data.total;
        this.$refs.table.loading = false;
      });
    },
   /**
     * 按钮操作
     */
    allitops(){
      allitops().then((res) => {
      this.loadlistData();
      this.$message.success({
            message: "自动扫描并修复成功",
            duriation: 700,
          });
      });
    },
    alltenantitops(){
      alltenantitops().then((res) => {
      this.loadlistData();
      this.$message.success({
            message: "扫描需修复的租户成功",
            duriation: 700,
          });
      });
    },
    alluseritops(){
      alluseritops().then((res) => {
      this.loadlistData(); 
      this.$message.success({
            message: "扫描需修复的用户成功",
            duriation: 700,
          });
      });
    },


    /**
     * 表格内按钮操作
     */
    itopsdetail(index, row) {
      this.$router.push({
        name: "itops-detail-view",
        query: {
          itopsid: row.id,
        },
      });
      // this.dialogShow.map((el) => {
      //   if (el.key === "edit") {
      //     el.value = true;
      //     el.sendData = row;
      //   }
      // });
    },
    handleCloseDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-search {
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  margin-top: 12px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;

  &--left {
    display: flex;

    .input-name {
      width: 30%;
      min-width: 200px;
      max-width: 300px;
    }

    .input-other-name {
      margin-left: 20px;
    }
  }
}
</style>
