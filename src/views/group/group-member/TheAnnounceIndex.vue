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
          @handleUpdate="loadData"
          ><template v-slot:buttons>
            <el-button type="text" @click="back">返回</el-button>
            <el-button type="text" @click="handleDeletes">删除</el-button>
            <el-button type="text" @click="handleAdd">新增</el-button>
          </template>
          <template v-slot:operate="scope">
            <TheAnnounceBtn
              :index="scope.index"
              :row="scope.row"
              @handleEdit="handleEdit"
              @handleDelete="handleDelete"
              @handleActive="handleActive"
            ></TheAnnounceBtn>
          </template>
          <template v-slot:noticeUnitIds="scope">
            <el-tag v-if="scope.row.noticeUnitIds[0].type == 1"
              >信息上报</el-tag
            >
            <el-tag
              v-else-if="scope.row.noticeUnitIds[0].type == 2"
              type="success"
              >日常通知</el-tag
            >
            <el-tag
              v-else-if="scope.row.noticeUnitIds[0].type == 3"
              type="danger"
              >安全生产</el-tag
            >
            <el-tag v-else type="warning">信息审核</el-tag>
          </template>
          <template v-slot:noticeReleaseStatus="scope">
            <div v-if="scope.row.noticeReleaseStatus === 0">下架</div>
            <div v-else>已发布</div>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>

    <template v-for="item in dialogShow">
      <TheEditAnnounceDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleUpdate="loadData"
        @closeDialog="handleCloseDialog"
      ></TheEditAnnounceDialog>
      <TheAddAnnounceDialog
        v-if="item.key === 'add' && item.value"
        :key="item.key"
        :dialogShow="item"
        @handleUpdate="loadData"
        @closeDialog="handleCloseDialog"
      ></TheAddAnnounceDialog>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  marketappnoticeList,
  marketappnoticeReleaseNote,
  marketappnoticeCancel,
  marketappnoticeRemove,
} from "@api/market";
import DiyTable from "@components/DiyTable/index";
import TheEditAnnounceDialog from "./components/TheEditAnnounceDialog";
import TheAddAnnounceDialog from "./components/TheAddAnnounceDialog";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheAnnounceBtn from "./components/TheAnnounceBtn";

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
      tableName: "公告记录",
      tableData: [],
      tableHead: [
        {
          prop: "noticeTitle",
          label: "标题",
          width: "250",
        },
        {
          prop: "noticeContent",
          label: "内容",
        },
        {
          type: "slot",
          name: "noticeUnitIds",
          label: "公告类型",
          width: "250",
        },
        {
          type: "slot",
          name: "noticeReleaseStatus",
          label: "发布状态",
          width: "250",
        },
        {
          prop: "noticeReleaseTime",
          label: "发布时间",
          width: "250",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          width: "100",
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
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    TheAnnounceBtn,
    TheEditAnnounceDialog,
    TheAddAnnounceDialog,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted() {},
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
    ...mapGetters("group", ["curGroupId"]),
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
        groupOrUnit: 1,
        noticeTitle: this.filterText,
        current: currentPage,
        size: pageSize,
      };
      marketappnoticeList(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.tableData.forEach((el)=>{
          el.noticeUnitIds = JSON.parse(el.noticeUnitIds)
        })
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
        let tableDataList = this.$refs.table;
        if (
          tableDataList.tableData.length == 0 &&
          tableDataList.page.currentPage >= 2
        ) {
          this.$refs.table.page.currentPage -= 1;
          this.loadData();
        }
      });
    },

    handleAdd() {
      this.dialogShow.map((el) => {
        if (el.key === "add") {
          el.value = true;
        }
      });
    },

    handleDeletes() {
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一条公告");
      } else {
        this.$confirm("此操作将永久删除所选公告, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let params = {
              ids: ids.join(","),
            };
            marketappnoticeRemove(ids).then((res) => {
              this.loadData();
              this.$message.success("删除成功");
            });
          })
          .catch(() => {
            return;
          });
      }
    },

    handleActive(index, row) {
      console.log("row", row);
      let params = {
        id: row.id,
      };
      if (row.noticeReleaseStatus == 0) {
        marketappnoticeReleaseNote(params).then((res) => {
          this.loadData();
          this.$message.success("发布成功");
        });
      } else {
        marketappnoticeCancel(params).then((res) => {
          this.loadData();
          this.$message.success("下架成功");
        });
      }
    },

    handleEdit(index, row) {
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = row;
        }
      });
    },

    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该公告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            ids: row.id,
          };
          marketappnoticeRemove([params.ids]).then((res) => {
            this.loadData();
            this.$message.success("删除成功");
          });
        })
        .catch(() => {
          return;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
