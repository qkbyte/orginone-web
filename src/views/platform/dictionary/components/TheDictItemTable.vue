<template>
  <DiyTable
    ref="table"
    :tableHead="tableHead"
    :options="options"
    :hasTableHead="false"
    :tableData="tableData"
    @handleUpdate="loadlistData"
  >
    <template v-if="isEdit" v-slot:slot-select>
      <font size="2" color="red">当前版本号：v{{ version }}</font>
    </template>
    <template v-slot:slot-buttons>
      <el-button-group>
        <el-button
          v-if="isEdit"
          type="primary"
          size="mini"
          title="发布新版本"
          @click="handleRelease"
        >
          <svg class="icon " aria-hidden="true">
            <use :xlink:href="'#icon-qingyingyong'"></use>
          </svg>
        </el-button>
        <el-button
          type="primary"
          size="mini"
          title="删除"
          @click="handleDelete"
        >
          <svg class="icon " aria-hidden="true">
            <use :xlink:href="'#icon-shanchu'"></use>
          </svg>
        </el-button>
        <el-button type="primary" size="mini" title="新增" @click="handleAdd">
          <svg class="icon " aria-hidden="true">
            <use :xlink:href="'#icon-xinzeng'"></use>
          </svg>
        </el-button>
      </el-button-group>
    </template>
    <template v-slot:dictValue="scope">
      <el-input size="small" v-model="scope.row.dictValue" clearable>
      </el-input>
    </template>
    <template v-slot:sort="scope">
      <el-input-number size="small" v-model="scope.row.sort" :min="1">
      </el-input-number>
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

<script>
import DiyTable from "@components/DiyTable/index";
import { addNewVersion, getDictItem, delDictItem } from "@api/dict";

export default {
  data() {
    let _this = this;
    return {
      tableHead: [
        {
          type: "slot",
          name: "dictValue",
          prop: "dictValue",
          label: "条目名称",
          width: "250",
        },
        {
          type: "slot",
          name: "sort",
          prop: "sort",
          label: "条目排序",
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
        noPage: true,
      },
      tableButton: [],
    };
  },
  components: {
    DiyTable,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    version: {
      default: () => 0,
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    parentid: {
      type: String,
      default: () => "0",
    },
  },
  created() {
    this.$nextTick(() => {
      this.loadlistData();
    });
  },
  mounted() {},
  computed: {},
  methods: {
    loadlistData() {
      this.$refs.table.loading = false;
    },
    /**
     * 按钮操作
     */
    handleRelease() {
      let params = {
        parentid: this.parentid,
        currversion: this.version,
      };
      addNewVersion(params).then((res) => {
        this.version = res.data;
        this.tableData = [];
        this.loadDictItemList(this.version, this.parentid);
        this.$message.success({
          message: "生成新版本成功",
          duriation: 700,
        });
      });
    },
    loadDictItemList(currvers, parent) {
      let params = {
        parentid: parent,
        version: currvers,
      };
      getDictItem(params).then((res) => {
        let data = res.data.data;
        data.forEach((el) => {
          let node = {
            id: el.id,
            dictValue: el.dictValue,
            parentId: el.parentId,
            code: el.code,
            currversion: el.currversion,
            version: el.version,
            dictKey: el.dictKey,
            sort: el.sort,
            dictparentId: el.dictparentId,
            isDeleted: el.isDeleted,
          };
          this.tableData.push(node);
        });
        this.loading = false;
      });
    },
    handleDelete() {
      let ids = [];
      this.$refs.table.multipleSelection.forEach((element) => {
        ids.push(element.id);
      });
      if (ids.length === 0) {
        this.$message({
          message: "请至少选择一个条目",
          type: "warning",
        });
      } else {
        let params = {
          ids: ids.join(","),
        };
        delDictItem(params).then((res) => {
          this.$message.success("删除条目成功");
        });
        this.tableData = this.tableData.filter(
          (item) => !ids.includes(item.id)
        );
      }
    },
    handleAdd() {
      let item = {
       // id: this.tableData.length + 1,
        dictValue: "",
        sort: 1,
      };
      this.tableData.push(item);
    },
  },
};
</script>

<style lang="scss" scoped></style>
