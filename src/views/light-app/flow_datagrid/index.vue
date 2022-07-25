<template>
  <div>
    <div class="main-search">
      <div class="main-search--left">
        <el-input
          v-model="searchItem.modelName"
          class="input-name"
          placeholder="请输入模型名称"
          clearable
        ></el-input>
      </div>
      <div class="main-search--right">
        <el-button type="primary" icon="el-icon-search">查询</el-button>
      </div>
    </div>

    <DiyBoxLayout>
      <template v-slot:table
        ><DiyTable
          ref="table"
          :tableName="tableName"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          @handleUpdate="loadlistData"
        >
          <template v-slot:buttons>
            <el-button @click="handleDeleteflows">删除</el-button>
            <el-button @click="handleAddflow">新增</el-button>
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
            <i :class="scope.row.source"></i>
          </template>
        </DiyTable>
      </template>
    </DiyBoxLayout>
  </div>
</template>

<script>
import DiyTable from "@components/DiyTable/index";
import DiyTitle from "@components/DiyTitle/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";

export default {
  data() {
    let _this = this;
    return {
      searchItem: {
        modelName: "",
      },

      tableName: "流程列表",
      tableData: [],
      tableHead: [],
      options: {
        checkBox: true,
        order: true,
        defaultSort: { prop: "createdTime", order: "descending" },
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
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
          key: "table-del",
          type: "text",
          icon: "el-icon-delete",
          value: "删除",
          func: function(index, row) {
            _this.handleDelete(index, row);
          },
        },
      ],
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    DiyTitle,
  },
  created() {
    this.$nextTick(() => {
      this.loadlistData();
    });
  },
  methods: {
    loadlistData() {},
    handleDeleteflows() {},
    handleAddflow() {},
  },
};
</script>

<style lang="scss" scoped>
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
</style>
