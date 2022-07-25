<template>
  <div style="height:100%">
    <DiyTable
      ref="table"
      :tableHead="tableHead"
      :tableName="tableName"
      :options="options"
      :tableData="tableData"
      @handleUpdate="loadData"
    >
      <template v-slot:buttons>
        <el-button type="text" @click="handleDel">删除</el-button>
      </template>
      <template v-slot:operate="scope">
        <template>
          <TheTableButton
            :row="scope.row"
            @handleEdit="handleEdit"
          ></TheTableButton>
        </template>
      </template>
      <template v-slot:icon="scope">
        <i :class="scope.row.source"></i>
      </template>
      <template v-slot:roleName="scope">
        <template v-if="scope.row.admin === 1"
          >超级管理员</template
        >
        <template v-else>{{ scope.row.roleName }}</template>
      </template>
    </DiyTable>
    <template v-for="item in dialogShow">
      <TheEditDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeEdit="closeEdit"
      ></TheEditDialog>
      <TheAddDialog
        v-if="item.key === 'add' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeEdit="closeEdit"
      ></TheAddDialog>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { getGroupListByFilterPage, delGroupList } from "@api/group";
import DiyTable from "@components/DiyTable/index";
import TheTableButton from "./TheTableButton";
import TheEditDialog from "./TheEditDialog";
import TheAddDialog from "./TheAddDialog";
import Bus from "@utils/eventBus";
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
      tableData: [],
      tableName: "集团列表",
      tableHead: [
        {
          prop: "id",
          label: "id",
          width: "200",
        },
        {
          prop: "groupName",
          label: "groupName",
          width: "250",
        },
        {
          prop: "groupDescription",
          label: "groupDescription",
          width: "200",
        },
        {
          prop: "tenantCode",
          label: "tenantCode",
          width: "200",
        },
        {
          prop: "type",
          label: "type",
          width: "120",
        },
        {
          prop: "groupCode",
          label: "groupCode",
          width: "200",
        },
        {
          prop: "status",
          label: "status",
          width: "200",
        },
        {
          prop: "isDeleted",
          label: "isDeleted",
          width: "200",
        },
        {
          prop: "updateTime",
          label: "updateTime",
          width: "200",
        },
        {
          prop: "updateUser",
          label: "updateUser",
          width: "200",
        },
        {
          prop: "createUser",
          label: "createUser",
          width: "200",
        },
        {
          prop: "depth",
          label: "depth",
          minWidth: "200",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          width: "100",
          name: "operate",
        },
        {
          prop: "createTime",
          label: "createTime",
          width: "200",
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
      tableButton: [],
      filterText: "",
      form: {
        id: "",
        groupName: "",
        tenantCode: "",
        type: "",
        groupCode: "",
        isDeleted: "",
      },
      searchData: {},
    };
  },
  components: {
    DiyTable,
    TheTableButton,
    TheEditDialog,
    TheAddDialog,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted() {
    this.getSearchForm(this.form);
    Bus.$on("searchEnter", (target) => {
      this.filterText = target;
      this.searchData = "";
      this.loadData("search");
    });
  },
  computed: {
    ...mapState("options", ["formShow"]),
    getSearchData() {
      return this.$store.state.searchData;
    },
  },
  watch: {
    formShow(val) {
      if (val.load == false && val.show == false) {
        this.filterText = "";
        this.searchData = this.getSearchData;
        this.loadData();
      }
    },
  },
  methods: {
    ...mapActions("options", ["getSearchForm"]),
    /**
     * 加载集团列表数据
     */
    async loadData(str) {
      this.$refs.table.loading = true;
      // const { currentPage, pageSize } = this.$refs.table.page;
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
      };
      console.log("search", this.searchData);
      if (this.filterText == "" && this.searchData !== "") {
        params.id = this.searchData.id;
        params.groupName = this.searchData.groupName;
        params.tenantCode = this.searchData.tenantCode;
        params.type = this.searchData.type;
        params.groupCode = this.searchData.groupCode;
        params.isDeleted = this.searchData.isDeleted;
      } else {
        params.groupName = this.filterText;
      }
      await getGroupListByFilterPage(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
      if (
        this.$refs.table.tableData.length == 0 &&
        this.$refs.table.page.currentPage >= 2
      ) {
        this.$refs.table.page.currentPage -= 1;
        this.loadData();
      }
    },
    handleDel() {
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length === 0) {
        return this.$message.warning("请至少选择一个集团");
      } else {
        this.$confirm("此操作将永久所选集团, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let params = {
              ids: ids.join(","),
            };
            delGroupList(ids).then((res) => {
              this.loadData();
              this.$message.success("删除集团成功");
            });
          })
          .catch(() => {
            return;
          });
      }
    },
    handleAdd() {
      this.dialogShow.map((el) => {
        if (el.key == "add") {
          el.value = true;
        }
      });
    },
    closeEdit(val) {
      this.dialogShow.map((el) => {
        if (el.key == val) {
          el.value = false;
        }
      });
    },
    /**
     * 表格内按钮操作
     */
    handleEdit(row) {
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.table-header {
  display: flex;
  height: 40px;
  justify-content: space-between;

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: rgba(48, 49, 51, 1);

    span {
      margin-left: 10px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: rgba(192, 196, 204, 1);
    }
  }

  &__btn {
    display: flex;
    flex-direction: row;

    div + div {
      margin-left: 15px;
    }
  }
}

.table-notice {
  height: 30px;
  border: 1px solid rgba(21, 74, 216, 0.2);
  border-radius: 4px;
  padding: 5px 25px;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(96, 98, 102, 1);

  i {
    color: #154ad8;
  }
}
.organizationNotice {
  display: inline-flex;
  justify-content: space-around;
  border: none;
}
.selectLabel {
  height: 20px;
  white-space: nowrap;
  cursor: pointer;
  margin-right: 30px;
}
.selectLabel:hover {
  border-bottom: 2px solid #154ad8;
}
</style>
