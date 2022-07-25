<template>
  <div class="base-layout">
    <DiyBoxLayout>
      <DiyTable
        ref="table"
        :tableHead="tableHead"
        :options="options"
        :tableData="tableData"
        :tableName="'模板列表'"
        :hasTabs="true"
        @handleUpdate="loadlistData"
      >
        <template v-slot:buttons>
          <el-button type="text" @click="handleDeletes">删除</el-button>
        </template>
        <template v-slot:isDefault="scope">
          <div v-if="scope.row.isDefault === -1">否</div>
          <div v-else>是</div>
        </template>
        <template v-slot:status="scope">
          <div v-if="scope.row.status === -1">平台</div>
          <div v-else>用户</div>
        </template>
      </DiyTable>
    </DiyBoxLayout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getMarketappcomponentList,
  marketappcomponentRemove,
  getMarketappcomponenttemplateList,
  marketappcomponenttemplateRemove,
} from "@api/portal";
import DiyTable from "@components/DiyTable/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "add",
          value: false,
        },
        {
          key: "edit",
          value: false,
        },
        {
          key: "view",
          value: false,
        },
      ],
      tableData: [],
      tableHead: [
        {
          prop: "name",
          label: "名称",
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
      imageUrl: "",
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
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
      this.filterText = val;
      this.loadlistData();
    },
  },
  methods: {
    loadlistData() {
      const { currentPage, pageSize } = this.$refs.table.page;
      let params = {
        name:this.filterText,
        current: currentPage,
        size: pageSize,
        status: 1,
      };
      getMarketappcomponenttemplateList(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
      });
    },
    back() {
      this.$router.go(-1);
    },
    
    /**
     * 按钮操作
     */

    handleEdit(data) {
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = data;
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
      if (this.$refs.table.multipleSelection.length === 0) {
        this.$message.warning({
          message: "请至少选择一个模板",
          duriation: 700,
        });
      } else {
        this.$confirm("此操作将永久删除该模板, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let ids = [];
            this.$refs.table.multipleSelection.forEach((element) => {
              ids.push(element.id);
            });
            let params = {
              ids: ids.join(","),
            };
            console.log("paras", params);
            marketappcomponenttemplateRemove(ids).then((res) => {
              this.$message.success("删除成功");
              this.loadlistData();
            });
          })
          .catch(() => {
            return;
          });
      }
    },
    /**
     * 表格内按钮操作
     */
    handlePass() {
      this.$refs.table.loading = true;
      this.loadlistData();
    },
    handleView(row) {
      this.dialogShow.map((el) => {
        if (el.key === "view") {
          el.value = true;
          el.sendData = row.previewPic;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
