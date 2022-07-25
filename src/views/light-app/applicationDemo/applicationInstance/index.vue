<template>
  <div>
    <DiyBoxLayout>
      <template v-slot:table
        ><DiyTable
          ref="table"
          :tableName="tableName"
          :tableHead="tableHead"
          :options="options"
          :tableData="tableData"
          @handleUpdate="loadlistData"
          ><template v-slot:buttons>
            <el-button @click="handleDeleteApplication">删除</el-button>
            <el-button @click="handleAddApplication">新增</el-button>
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
    return {
      tableName: "申请表单实例",
      tableData: [],
      tableHead: [
        {
          prop: "applicationName",
          label: "申请名称",
          width: "120",
        },
        {
          prop: "applicationDescription",
          label: "申请描述",
          width: "300",
        },
        {
          prop: "applicationSource",
          label: "申请来源",
          width: "200",
        },
        {
          prop: "applicationType",
          label: "申请类型",
          width: "200",
        },
        {
          prop: "updateTime",
          label: "更新时间",
          width: "140",
        },
        {
          prop: "bindingInstance",
          label: "绑定实例",
          width: "140",
        },
        {
          prop: "createdTime",
          label: "创建时间",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          width: "220",
          minWidth: "80",
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
      tableButton: [
        {
          key: "auth",
          type: "text",
          icon: "el-icon-coordinate",
          value: "配置",
          func: function(index, row) {},
        },
        {
          key: "edit",
          type: "text",
          icon: "el-icon-edit",
          value: "编辑",
          func: function(index, row) {},
        },
        {
          key: "table-del",
          type: "text",
          icon: "el-icon-delete",
          value: "删除",
          func: function(index, row) {},
        },
      ],
    };
  },
  components: {
    DiyTable,
    DiyBoxLayout,
    DiyTitle,
  },
  methods: {
    loadlistData() {
      this.$refs.table.loading = false;
    },
    handleDeleteApplication() {
      this.$refs.table.loading = false;
    },
    handleAddApplication() {},
  },
};
</script>

<style scoped></style>
