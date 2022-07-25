<template>
  <div class="menu">
    <div class="menu-main">
      <div class="main-title">{{ pageName }}</div>
      <div class="main-search">
        <div class="main-search--left">
          <el-input
            v-model="searchItem.name"
            class="input-name"
            placeholder="请输入卡片样式名称"
            clearable
          ></el-input>
        </div>
        <div class="main-search--right">
          <el-button type="primary" icon="el-icon-search">查询</el-button>
        </div>
      </div>
      <DiyTable
        ref="table"
        :tableName="tableName"
        :tableHead="tableHead"
        :options="options"
        :batchOperate="batchOperate"
        :tableData="tableData"
        @handleUpdate="loadlistData"
        ><template v-slot:buttons>
          <el-button @click="handleAddcardstyle">新增</el-button>
        </template>
        <template v-slot:operate="scope">
          <el-button
            size="small"
            v-for="item in tableButton"
            :key="item.key"
            :type="item.type"
            :icon="item.icon"
            @click="item.func(scope.index, scope.row)"
            >{{ item.value }}
          </el-button>
        </template>
        <template v-slot:icon="scope">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="'#' + scope.row.source"></use>
          </svg>
        </template>
      </DiyTable>
      <template v-for="item in dialogShow">
        <TheEditDialog
          v-if="item.key === 'edit' && item.value"
          :key="item.key"
          :dialogShow="item"
          @closeDialog="handleCloseDialog"
        ></TheEditDialog>
        <TheAddDialog
          v-if="item.key === 'add' && item.value"
          :key="item.key"
          :dialogShow="item"
          @closeDialog="handleCloseDialog"
        ></TheAddDialog>
      </template>
    </div>
  </div>
</template>

<script>
import DiyTable from "@components/DiyTable/index";
import TheAddDialog from "./components/TheAddDialog";
import TheEditDialog from "./components/TheEditDialog";
import { getcardstyle, deletecardstyleByRecid } from "@api/card-style";
export default {
  data() {
    let _this = this;
    return {
      pageName: "",
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
      searchItem: {
        accuontName: "",
        realName: "",
      },
      tableName: "卡片样式列表",
      tableData: [],
      tableHead: [
        {
          prop: "name",
          label: "样式名称",
          width: "120",
        },
        {
          prop: "type",
          label: "样式类型",
          width: "150",
        },
        {
          prop: "remarks",
          label: "样式描述",
          width: "300",
        },
        {
          prop: "t_order",
          label: "排序",
          width: "100",
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
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
        noPage: true,
      },
      tableButton: [
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
          type: "text",
          icon: "el-icon-delete",
          value: "删除",
          func: function(index, row) {
            _this.handleDelete(index, row);
          },
        },
      ],
      batchOperate: [],
    };
  },
  components: {
    DiyTable,
    TheAddDialog,
    TheEditDialog,
  },
  created() {
    this.pageName = this.$route.meta.title;
    this.$nextTick(() => {
      this.loadlistData();
    });
  },
  mounted() {},
  methods: {
    loadlistData() {
      this.$refs.table.loading = true;
      getcardstyle().then((res) => {
        let data = res.data.data;
        this.tableData = data;
        this.$refs.table.page.total = data.length;
        this.$refs.table.loading = false;
      });
    },
    handleAddcardstyle() {
      this.dialogShow.map((el) => {
        if (el.key === "add") {
          el.value = true;
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
    handleDelete(index, row) {
      let params = {
        recid: row.recid,
      };
      deletecardstyleByRecid(params).then((res) => {
        this.$message.success("卡片样式删除成功");
        this.loadlistData();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.menu {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  .menu-main {
    display: flex;
    flex-direction: column;
    padding: 3%;

    .main-title {
      font-size: 2rem;
      font-weight: bold;
      line-height: 50px;
      color: rgba(51, 51, 51, 1);
    }

    .main-search {
      width: 100%;
      height: 100px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 6px 10px rgba(5, 36, 83, 0.06);
      border-radius: 4px;
      margin-top: 30px;
      padding: 0 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &--left {
        width: 80%;
        display: flex;

        .input-name,
        .input-other-name {
          width: 30%;
          min-width: 200px;
          max-width: 300px;
        }

        .input-other-name {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
