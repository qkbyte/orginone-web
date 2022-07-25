<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
    class="positionEditDialog"
    center
    top="10vh"
    width="700px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title"> 编辑岗位 </span>
    <div class="body-container diy-dialog-body">
      <div class="body-container__title">岗位信息</div>
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          class="formItem"
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-input
            class="positionInput"
            v-if="item.prop === 'jobName'"
            v-model="form.jobName"
            placeholder="请输入岗位名称"
          ></el-input>
          <el-input
            class="positionInput"
            v-if="item.prop === 'sort'"
            v-model="form.sort"
            placeholder="请输入排序序号"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="body-container body-item">
      <div class="body-item-header">
        <div class="body-container__title">分配人员</div>
      </div>
      <div class="body-item-main">
        <TheUserTransfer
          ref="userTransfer"
          type="edit"
          :select="select"
        ></TheUserTransfer>
      </div>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { updatePosition } from "@api/position";
import { DebounceBy } from "@utils/debounce";
import { getHasSelectUserList } from "@api/user";
import TheUserTransfer from "./TheUserTransfer";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "岗位名称",
          prop: "jobName",
        },
        {
          label: "排序",
          prop: "sort",
        },
      ],
      form: {
        sort: "",
      },
      rules: {
        jobName: [
          { required: true, message: "请输入岗位名称", trigger: "blur" },
        ],
      },
      loading: false,
      select: [],
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
    position: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    dialogShow: {
      handler(val) {
        console.log("val", val);
        this.form = this._.cloneDeep(val.sendData);
        console.log("=====", this.form);
        this.getSelect();
      },
      deep: true,
      immediate: true,
    },
    form(val) {
      console.log("======", val);
    },
  },
  components: { TheUserTransfer },
  created() {
    // this.form = this._.cloneDeep(this.dialogShow.sendData);
    // this.getSelect()
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
  },
  methods: {
    ...mapActions("menu", ["updateAppMenu"]),
    getSelect() {
      let params = {
        tenantCode: this.curTenantCode,
        jobId: this.dialogShow.sendData.id,
        deptId: "",
      };
      getHasSelectUserList(params).then((res) => {
        this.select = res.data.data;
      });
    },
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleClick: DebounceBy(function(value) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          if (!this.form.parentId) {
            this.form.parentId = 13;
          }
          let params = {
            sort: this.form.sort,
            deptId: this.form.deptId,
            jobId: this.form.id,
            jobName: this.form.jobName,
            userIds: this.$refs.userTransfer.$children[0].value.join(","),
          };

          await updatePosition(params).then(
            (res) => {
              this.loading = false;
              this.$emit("closeDialog", this.dialogShow.key);
              this.$message.success({
                message: "修改成功",
                duriation: 700,
              });
              if (this.position) {
                this.$parent.loadData();
              } else {
                (this.$parent.$refs.posTree.treeData = [
                  {
                    id: -1,
                    jobName: "未分配人员",
                  },
                ]),
                  this.$parent.$refs.posTree.loadData(true);
                this.$parent.mainTableData[0].value1 = this.$parent.curNode.jobName = this.form.jobName;
              }
            },
            (err) => {
              this.loading = false;
            }
          );
          this.updateAppMenu();
        }
      });
    }, 1000),
  },
};
</script>

<style lang="scss" scoped>
.formItem {
  width: 49%;
  display: flex;
}
::v-deep .el-dialog__body {
  overflow: auto;
}
::v-deep .formItem {
  margin-left: 6px;
}
.diy-dialog-body {
  justify-content: space-between;
  .el-form {
    display: flex;

    .el-input {
      width: 200px;
    }
  }
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 20px;
}
.body-container {
  padding: 10px 20px;
  border: 1px solid rgba(235, 238, 245, 1);
  border-radius: 4px;

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 30px;
    color: rgba(48, 49, 51, 1);
  }
}
.body-item {
  margin-top: 10px;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-main {
    width: 100%;
    margin-top: 10px;
  }

  .diy-table {
    padding: 0;
  }
}
.positionEditDialog {
  width: 100%;
  .is-required {
    display: flex;
  }
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .positionInput {
    margin-left: 20px;
  }
}
</style>
<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 7px;
  background: #ffffff;
}
::-webkit-scrollbar-thumb {
  height: 0px;
  border-radius: 4px;
  background: #90939928;
}
::-webkit-scrollbar-thumb:hover {
  width: 8px;
  background: #90939967;
}
::v-deep .el-dialog__body {
  height: 620px;
}
::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
::v-deep .el-form-item__error {
  left: 38px;
}
</style>
