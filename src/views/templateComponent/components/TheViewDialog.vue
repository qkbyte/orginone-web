<template>
  <el-dialog
    title="查看预警"
    :visible.sync="dialogShow.value"
    width="600px"
    class="dialog-person"
    :close-on-click-modal="false"
    :append-to-body="true"
    @close="handleClose"
  >
    <el-form class="demo-ruleForm" label-width="100px" ref="ruleForm">
      <el-form-item label="标题：" prop="alertTitle">
        <div>{{ ruleForm.alertTitle }}</div>
      </el-form-item>
      <el-form-item label="内容：" prop="alertContent">
        <div>{{ ruleForm.alertContent }}</div>
      </el-form-item>
      <el-form-item label="业务：" prop="alertBusiness">
        <div>{{ ruleForm.alertBusiness }}</div>
      </el-form-item>
      <el-form-item label="紧急程度：" prop="alertEmergencyLevel">
        <div v-if="ruleForm.alertEmergencyLevel == 1">低</div>
        <div v-else-if="ruleForm.alertEmergencyLevel == 2">中</div>
        <div v-else>高</div>
      </el-form-item>
      <el-form-item label="发布时间：" prop="alertReleaseTime">
        <div>{{ ruleForm.alertReleaseTime }}</div>
      </el-form-item>
      <!--<el-form-item label="阅读状态：" prop="readStatus" v-if="ruleForm.readStatus !== null">-->
      <!--  <div>{{ ruleForm.readStatus ? '已读' : '未读' }}</div>-->
      <!--</el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { marketappalertCheckAlert } from "@api/market";
export default {
  name: "TheAppDialog",
  data() {
    return {
      ruleForm: {
        receiver: "",
        title: "",
        content: "",
        url: "",
        readStatus: null,
      },
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    dialogShow: {
      handler(val) {
        this.ruleForm = { ...val.sendData };
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    openUrl() {
      window.open(this.ruleForm.url);
    },
    handleClose() {
      if (this.dialogShow.sendData.alertStatus == 0) {
        let params = {
          id: this.dialogShow.sendData.id,
        };
        try {
          marketappalertCheckAlert(params).then((res) => {
            this.$parent.loadData()
            this.$emit("closeDialog", this.dialogShow.key);
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        this.$emit("closeDialog", this.dialogShow.key);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
.demo-ruleForm {
  padding-right: 40px;
  padding-top: 30px;
  .width {
    width: 400px;
  }
}
.url {
  color: #0023e5;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: #0023e5;
  }
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
::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>
