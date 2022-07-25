<template>
  <div style="height:100%;">
    <DiyTable
      ref="taskWaring"
      :tableHead="tableHead"
      :options="options"
      :tableData="tableData"
      :hasTableHead="false"
      @handleUpdate="loadData"
    >
    </DiyTable>
  </div>
</template>

<script>
import DiyTable from "@components/DiyTable/index";
import { getallaudit } from "@api/configApproval";
import Bus from "@utils/eventBus";
export default {
  data() {
    let _this = this;
    return {
      importToken: {
        Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
        "blade-auth": "",
      },
      fileList: [],
      importDialog: false,
      tableData: [],
      tableHead: [
        {
          prop: "applyTime",
          label: "申请时间",
          width: "250",
        },
        {
          prop: "applyingName",
          label: "申请人姓名",
          width: "250",
        },
        {
          prop: "type",
          label: "类型",
          width: "250",
        },
        {
          prop: "tenantName",
          label: "租户姓名",
          width: "250",
        },
        {
          prop: "status",
          label: "审核状态",
          width: "250",
        },
        {
          prop: "telephone",
          label: "电话",
          width: "250",
        },
        {
          prop: "auditTime",
          label: "审批时间",
          width: "250",
        },
        {
          prop: "applyingReson",
          label: "申请理由",
          width: "250",
        },
        {
          prop: "disagreement",
          label: "审批理由",
          width: "250",
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
    };
  },
  components: {
    DiyTable,
  },
  created() {
    Bus.$on('searchEnter', (search) => {
      this.loadData(search)
    })
    this.$nextTick(() => {
      this.loadData();
    });
  },

  methods: {
    //待办列表
    getTaskData(){
      return this.$refs.taskWaring.multipleSelection
    },
    loadData(str) {
      this.$refs.taskWaring.loading = true;
      // const { currentPage, pageSize } = this.$refs.taskWaring.page;
      let currentPage = 1;
      let pageSize = 20;
      if (str) {
        pageSize = this.$refs.taskWaring.page.pageSize;
        this.$refs.taskWaring.page.currentPage = 1;
      } else {
        currentPage = this.$refs.taskWaring.page.currentPage;
        pageSize = this.$refs.taskWaring.page.pageSize;
      }
      let params = {
        currentPage: currentPage,
        pageSize: pageSize,
        state: "1",
        applyingName: str
      };
      getallaudit(params).then((res) => {
        this.tableData = res.data.data.records;
        this.$refs.taskWaring.page.total = Number(res.data.data.total);
        this.tableData.forEach((item) => {
          let str = "";
          switch (item.status) {
            case 1:
              str = "审批中";
              break;
            case 3:
              str = "已通过";
              break;
            case 4:
              str = "未通过";
              break;
            default:
              break;
          }
          let str2 = "";
          switch (item.type) {
            case 1:
              str2 = "字典";
              break;
            case 2:
              str2 = "元数据";
              break;
            default:
              str2="未知"
              break;
          }
          item.status = str;
          item.type=str2
        });
        this.$refs.taskWaring.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  color: #0b3ed3;
  cursor: pointer;
}
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
.message-TheMessgaeTable {
  .importDialog {
    .el-button {
      width: 100%;
    }
  }
}
</style>

<style lang="scss">
.message-TheMessageTable {
  .upload-demo {
    .el-upload {
      width: 100%;
    }
  }
}
</style>
