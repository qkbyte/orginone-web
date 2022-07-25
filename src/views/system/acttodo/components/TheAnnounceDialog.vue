<template>
  <el-dialog
    title="查看公告"
    :visible.sync="dialogShow.value"
    width="600px"
    class="dialog-person"
    :close-on-click-modal="false"
    :append-to-body="true"
    @close="handleClose"
  >
    <el-form class="demo-ruleForm" label-width="100px" ref="ruleForm">
      <el-form-item label="标题：" prop="title">
        <div>{{ listData.noticeTitle }}</div>
      </el-form-item>
      <el-form-item label="内容：" prop="content">
        <div>{{ listData.noticeContent }}</div>
      </el-form-item>
      <el-form-item label="公告类型：" prop="url">
        <el-tag v-if="listData.noticeUnitIds[0].type == 1">信息上报</el-tag>
        <el-tag v-else-if="listData.noticeUnitIds[0].type == 2" type="success"
          >日常通知</el-tag
        >
        <el-tag v-else-if="listData.noticeUnitIds[0].type == 3" type="danger"
          >安全生产</el-tag
        >
        <el-tag v-else type="warning">信息审核</el-tag>
      </el-form-item>
      <el-form-item label="发布时间：" prop="receiver">
        <div>{{ listData.noticeReleaseTime }}</div>
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
import { mapActions } from "vuex";
export default {
  name: "TheAppDialog",
  data() {
    return {
      listData: {},
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.listData = this.dialogShow.sendData;
  },
  methods: {
    handleClose() {
      this.$emit("closeEdit", this.dialogShow.key);
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
  height: 500px !important;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-width: calc(100% - 30px);
}
::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>
