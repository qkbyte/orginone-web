<template>
  <div class="base-layout">
    <DiyBoxLayout>
      <template v-slot:table
        ><DiyTable
          ref="table"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          @handleUpdate="loadData"
        >
          <template v-slot:slot-title>
            <div class="group-select">
              <TheGroupSelect @handleUpdate="loadData"></TheGroupSelect>
            </div>
          </template>
          <template v-slot:buttons>
            <el-button type="text" @click="handleAnnounce">发布公告</el-button>
            <el-button type="text" @click="goCheckTenantApply"
              >查看申请</el-button
            >
            <el-button type="text" @click="handleDeletes">移出集团</el-button>
            <el-button type="text" @click="handleExport"
              >集团成员导出</el-button
            >
            <el-button type="text" @click="handleImport"
              >集团单位导入</el-button
            >
            <el-button type="text" @click="handleUnit">显示单位</el-button>
          </template>
          <template v-slot:operate="scope">
            <TheTableButton
              :index="scope.index"
              :row="scope.row"
            ></TheTableButton>
          </template>
          <template v-slot:icon="scope">
            <i :class="scope.row.source"></i>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTenantListFromGroup, groupRemoveTenantLeaf,exportGroupUnitData,hideUnitInGroup } from "@api/group";
import DiyTable from "@components/DiyTable/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTableButton from "./components/TheTableButton";
import TheGroupSelect from "../components/TheGroupSelectMenber";
import TheAnnounceDialog from "./components/TheAnnounceDialog";

export default {
  data() {
    let _this = this;
    return {
      dialogShow: [
        {
          key: "auth",
          value: false,
        },
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
          prop: "unitName",
          label: "单位名称",
          width: "240",
        },
        {
          prop: "socialCreditCode",
          label: "统一社会信用代码",
          width: "300",
        },
        {
          prop: "linkMan",
          label: "管理员",
          minWidth: "180",
        },
        {
          prop: "linkPhone",
          label: "联系方式",
          minWidth: "180",
        },
        {
          prop: "updateTime",
          label: "加入时间",
          minWidth: "180",
        },
        // {
        //   type: "slot",
        //   label: "操作",
        //   fixed: "right",
        //   align: "center",
        //   width: "80",
        //   name: "operate",
        // },
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
      tableButton: [
        {
          key: "auth",
          type: "text",
          icon: "el-icon-coordinate",
          value: "配置",
          func: function(index, row) {
            _this.handleAuth(index, row);
          },
        },
        {
          key: "edit",
          type: "text",
          icon: "el-icon-edit",
          value: "编辑",
          func: function(index, row) {
            _this.handleEdit(index, row);
          },
        },
        {
          key: "table-del",
          type: "text",
          icon: "el-icon-delete",
          value: "删除",
          func: function(index, row) {
            _this.handleDelete(index, row);
          },
        },
      ],
      filterText: "",
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    TheTableButton,
    TheGroupSelect,
    TheAnnounceDialog,
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  mounted() {},
  computed: {
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
    handleUnit() {
      if (this.$refs.table.multipleSelection.length === 0) {
        return this.$message.warning("请至少选择一个集团");
      } else if (this.$refs.table.multipleSelection.length === 1) {
        let tenantId = this.$refs.table.multipleSelection.map((el) => {
          return el.tenantId;
        });
        let params = {
          sourceGroupId: this.curGroupId,
          tenantId: tenantId[0],
          type: 0,
        };
        hideUnitInGroup(params).then(() => {
          this.$message.success("显示成功");
        });
      } else {
        return this.$message.warning("请选择一个集团");
      }
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
        current: currentPage,
        size: pageSize,
        name: this.filterText,
        groupId: this.curGroupId,
      };
      getTenantListFromGroup(params).then((res) => {
        const { records, total } = res.data.data;
        this.tableData = records;
        this.$refs.table.page.total = total;
        this.$refs.table.loading = false;
        if (
          this.$refs.table.tableData.length == 0 &&
          this.$refs.table.page.currentPage >= 2
        ) {
          this.$refs.table.page.currentPage -= 1;
          this.loadData();
        }
      });
    },
    /**
     * 按钮操作
     */
    handleAnnounce() {
      this.$router.push({name:'group-member-announce'})
    },
    goCheckTenantApply() {
      this.$router.push({
        name: "check-apply",
      });
    },
    handleExport(){
      if (this.$refs.table.multipleSelection.length === 0) {
        return this.$message.warning("请至少选择一个集团");
      }
      let data = []
      this.$refs.table.multipleSelection.forEach((element) => {
        data.push(element.id);
      });
       // 导出
      let params = {
        groupId:this.curGroupId,
        unitIdList:data,
      };
      exportGroupUnitData(params).then((res) => {
        const content = res.data;
        const blob = new Blob([content], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        var date =
          new Date().getFullYear() +
          "" +
          (new Date().getMonth() + 1) +
          "" +
          new Date().getDate();
        const fileName = "集团成员导出";
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      });
    },
    /**
     * 表格内按钮操作
     */
    handleAuth(index, row) {
      this.dialogShow.map((el) => {
        if (el.key === "auth") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handleEdit(index, row) {
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = row;
        }
      });
    },
    handleImport() {
      this.$router.push({ name: "group-import" });
    },
    handleDelete(index, row) {},
    handleDeletes() {
      if (this.$refs.table.multipleSelection.length === 0) {
        return this.$message.warning("请至少选择一个集团");
      }
      this.$confirm("此操作将永久移出该集团, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let selected = this.$refs.table.multipleSelection
            .map((el) => {
              return el.tenantId;
            })
            .join(",");
          let params = {
            groupId: this.curGroupId,
            tenantIds: selected,
          };
          groupRemoveTenantLeaf(params).then((res) => {
            this.$message.success("移出集团成功");
            this.loadData();
          });
        })
        .catch(() => {
          return;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.group-select {
  margin-top: -10px;
  margin-left: -20px;
  margin-bottom: 10px;
}
</style>
