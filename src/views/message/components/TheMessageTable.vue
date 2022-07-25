<template>
  <div>
    <DiyTable
      ref="table"
      :tableName="tableName"
      :tableHead="tableHead"
      :options="options"
      :tableData="tableData"
      @handleUpdate="loadlistData"
    >
      <template v-slot:buttons>
        <el-button @click="handleBack">返回首页</el-button>
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
    <template v-for="item in dialogShow">
      <TheAddDialog
        v-if="item.key === 'add' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAddDialog>
      <TheApplyDialog
        v-if="item.key === 'apply' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheApplyDialog>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DiyTable from "@components/DiyTable/index";
import TheAddDialog from "./TheAddDialog";
import TheApplyDialog from "./TheApplyDialog";

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
      tableData: [],
      tableHead: [
        {
          prop: "title",
          label: "消息名称",
        },
        {
          prop: "commitTime",
          label: "申请时间",
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
          value: "内容",
          func: function(index, row) {
            _this.goToWriteForm(row);
          },
        },
      ],
    };
  },
  props: {
    tableName: {
      type: String,
    },
    activeId: {
      type: Number,
    },
  },
  components: {
    DiyTable,
    TheAddDialog,
    TheApplyDialog,
  },
  created() {
    this.$nextTick(() => {
      this.loadlistData();
    });
  },
  mounted() {
    if (this.activeId === 3) this.tableButton = [];
  },
  computed: {
    ...mapState("user", ["userName"]),
    ...mapState("tenant", ["defaultTenantCode"]),
    ...mapState("user", ["userId"]),
  },
  methods: {
    loadlistData() {
      this.$refs.table.loading = true;
      let val = {
        num: 5,
        taskType: this.activeId | 0,
        userId: this.userId,
        tenantId: this.defaultTenantCode,
        sectionId: "",
        curSectionUsers: "",
      };
      this.post(
        `/dev-bmp/form_inst/show?page=${
          this.$refs.table.page.currentPage
        }&size=${this.$refs.table.page.pageSize}`,
        val
      )
        .then((res) => {
          var objList = [];
          for (let key of res.data.obj.list) {
            let temp = {
              commitTime: this.dateT(key.commitTime),
              title: key.title,
              id: key.id,
              formModelId: key.formModelId,
              procInstId: key.procInstId,
            };
            objList.push(temp);
          }
          this.tableData = objList;
          this.$refs.table.page.total = res.data.obj.total;
          this.$refs.table.loading = false;
        })
        .catch((err) => {
          this.$refs.table.loading = false;
        });
    },

    dateT(value) {
      let dateT = new Date(value);
      var year = dateT.getFullYear(); //取得4位数的年份
      var month = dateT.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
      var date = dateT.getDate(); //返回日期月份中的天数（1到31）
      var hour = dateT.getHours(); //返回日期中的小时数（0到23）
      var minute = dateT.getMinutes(); //返回日期中的分钟数（0到59）
      var second = dateT.getSeconds(); //返回日期中的秒数（0到59）
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },

    /**
     * 按钮操作
     */
    handleBack() {
      this.$router.push({
        path: "/index",
      });
    },

    /**
     * 表格内按钮操作
     */

    goToWriteForm(obj) {
      this.$router.push({
        path: "/light-app/write_form",
        query: {
          id: obj.formModelId,
          title: obj.title,
          procModelId: obj.procInstId,
          task_id: obj.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
