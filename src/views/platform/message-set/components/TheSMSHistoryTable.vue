<template>
  <div class="base-layout">
    <DiyBoxLayout>
      <template v-slot:table
        ><DiyTable
          ref="table"
          :tableName="tableName"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          @handleUpdate="loadData"
        >
          <template v-slot:buttons>
            <el-button
              style="margin-right:20px"
              type="text"
              @click="handleDeletes"
              >删除</el-button
            >
          </template>
          <template v-slot:operate="scope">
            <TheSMSButton
              :index="scope.index"
              :row="scope.row"
              @handleDelete="handleDelete"
            ></TheSMSButton>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>
  </div>
</template>

<script>
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import DiyTable from "@components/DiyTable/index";
import { SMSRecordList, SMSRecordRemove } from "@api/market";
import TheSMSButton from "./TheSMSButton";
import TheSMSEditDialog from "./TheSMSEditDialog";
import TheSMSAddDialog from "./TheSMSAddDialog";
export default {
  data() {
    let _this = this;
    return {
      tableName: "短信历史记录",
      importToken: {
        Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
        "blade-auth": "",
      },
      fileList: [],
      importDialog: false,
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
          prop: "title",
          label: "标题",
          width: "250",
        },
        {
          prop: "content",
          label: "内容",
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
        defaultSort: { prop: "createdTime", order: "descending" },
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
      },
      total: 0,
      form: {
        id: "",
        phoneNumber: "",
        userName: "",
        tenantCode: "",
        isDeleted: "",
      },
      filterText: "",
      searchData: "",
    };
  },
  components: {
    DiyBoxLayout,
    DiyTable,
    TheSMSButton,
    TheSMSEditDialog,
    TheSMSAddDialog,
  },
  computed: {
    getFilterText() {
      return this.$store.state.searchContent;
    },
  },
  watch: {
    getFilterText(val) {
      this.filterText = val;
      this.loadData("search");
    },
  },
  created() {
    this.$nextTick(async () => {
      await this.loadData();
    });
  },
  mounted() {},
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
      // const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        current: currentPage,
        size: pageSize,
      };
      SMSRecordList(params).then((res) => {
        const { total, records } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
        let tableData = this.$refs.table;
        if (
          tableData.tableData.length == 0 &&
          tableData.page.currentPage >= 2
        ) {
          this.$refs.table.page.currentPage -= 1;
          this.loadData();
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除所选短信模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let idList = [row.id];
          console.log("idlist", idList);
          SMSRecordRemove(idList).then((res) => {
            this.loadData();
            this.$message.success("删除成功");
          });
        })
        .catch(() => {
          return;
        });
    },
    handleDeletes() {
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      console.log(this.$refs.table.multipleSelection);
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一条短信模板");
      } else {
        this.$confirm("此操作将永久删除所选短信模板, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let idList = ids;
            SMSRecordRemove(idList).then((res) => {
              this.loadData();
              this.$message.success("删除成功");
            });
          })
          .catch(() => {
            return;
          });
      }
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

.title {
  font-size: 16px;
  line-height: 40px;
  font-weight: 600;
  color: rgba(48, 49, 51, 1);
  vertical-align: center;
}

.content-body {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  & > i {
    width: 340px;
  }
}

.no-app {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  font-weight: 600;
  padding: 30px;
  &_img {
    text-align: center;
  }
  img {
    width: 190px;
    height: 140px;
    margin-bottom: 30px;
  }
  &_text {
    display: flex;
    justify-content: center;
    .text-content {
      font-size: 15px;
      cursor: pointer;
    }
  }
  .text-content:hover {
    color: #154ad8;
  }
  .no-app-icon {
    font-weight: 800;
  }
}
</style>
