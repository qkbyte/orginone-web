<template>
  <el-dialog
      title="查看消息"
      :visible.sync="dialogShow.value"
      width="600px"
      class="dialog-person"
      :close-on-click-modal='false'
      :append-to-body="true"
      @close="handleClose"
    >
      <el-form class="demo-ruleForm" label-width="100px" ref="ruleForm">
        <el-form-item label="标题：" prop="title">
          <div>{{ ruleForm.title }}</div>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <div>{{ ruleForm.content }}</div>
        </el-form-item>
        <el-form-item label="链接：" prop="url">
          <!--<a :href="ruleForm.url" v-if="ruleForm.url">{{ ruleForm.url }}</a>-->
          <div class="url" @click="openUrl" v-if="ruleForm.url">{{ ruleForm.url }}</div>
          <div v-else>-</div>
        </el-form-item>
        <el-form-item label="发送人：" prop="receiver">
          <div>{{ ruleForm.sender }}</div>
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
      ruleForm: {
        receiver:'',
        title: '',
        content: '',
        url: '',
        readStatus: null
      },
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {}
    }
  },
  watch:{
    dialogShow:{
      handler(val) {
        this.ruleForm = { ...val.sendData }
      },
      deep:true,
      immediate:true
    }
  },
  methods: {
    ...mapActions("menu", ["changeMenu"]),
    openUrl () {
      let obj = {
        url: this.ruleForm.url,
        type: 'app',
        appId: this.ruleForm.appId
      }
      this.changeMenu(obj)
    },
    handleClose() {
      this.$emit('closeEdit', this.dialogShow.key)
    }
  }
};
</script>

<style lang="scss" scoped>
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
.demo-ruleForm{
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
::v-deep .el-dialog{
       display: flex;
       flex-direction: column;
       margin:0 !important;
       position:absolute;
       top:50%;
       left:50%;
       transform:translate(-50%,-50%);
       /*height:600px;*/
       max-height:calc(100% - 30px);
       max-width:calc(100% - 30px);
   }
::v-deep .el-dialog .el-dialog__body{
       flex:1;
       overflow: auto;
   }
</style>
