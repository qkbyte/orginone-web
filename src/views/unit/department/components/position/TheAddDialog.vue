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
    <span slot="title" class="diy-dialog-title"> 新增岗位 </span>
    <div class="body-container diy-dialog-body">
      <div class="body-container__title">岗位信息</div>
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
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
            maxlength="20"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="body-container body-item">
      <div class="body-item-header">
        <div class="body-container__title">分配人员</div>
      </div>
      <div class="body-item-main">
        <TheUserTransfer type="add" ref="userTransfer" :state="1"></TheUserTransfer>
      </div>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { addPosition } from "@api/position";
import { DebounceBy } from "@utils/debounce";
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
      ],
      form: {},
      rules: {
        jobName: [
          { required: true, message: "请输入岗位名称", trigger: "blur" },
        ],
      },
      loading: false,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  components: { TheUserTransfer },
  created() {
    this.form = {
      jobName: "",
      jobId: this.$parent.curPos,
      userIds: "",
    };
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleClick:DebounceBy(function(value){
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return this.$message.warning("请填写正确信息");
        }
        this.loading = true;
        this.form.userIds = this.$refs.userTransfer.$children[0].value.join(",");
        let params = this.form;
        addPosition(params).then(
          (res) => {
            this.$message.success({
              message: "新增成功",
              duriation: 700,
            });
            this.loading = false;
            this.$emit("closeDialog", this.dialogShow.key);
            this.$parent.loadData()
          },
          (err) => {
            this.loading = false;
          }
        );
      });
    },1000)
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-body {
  justify-content: space-between;
  .el-form {
    justify-content: space-between;

    .el-input {
      width: 250px;
    }
  }
}
::v-deep .el-dialog__body {
  overflow: auto;
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
    width: 100%;
    display: flex;
  }
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .positionInput {
    margin-left: 40px;
  }
  .el-form-item__error {
    margin-left: 40px;
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
::v-deep .el-form-item__error{
  left: 38px;
}
</style>