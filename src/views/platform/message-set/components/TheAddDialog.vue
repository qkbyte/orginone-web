<template>
  <el-dialog
      title="发送消息"
      :visible.sync="dialogShow.value"
      width="600px"
      class="dialog-person"
      :close-on-click-modal='false'
      @close="handleClose('ruleForm')"
    >
      <el-form class="demo-ruleForm" :model="ruleForm" :rules="rules" label-width="100px" ref="ruleForm">
        <el-form-item label="接收人" prop="receiver">
          <sy-remote-select class="width" v-model="ruleForm.receiver" :apiPromise="apiPromise" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input class="width" v-model="ruleForm.title" maxlength="100" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input class="width" type="textarea" v-model="ruleForm.content" :autosize="{ minRows: 3, maxRows: 5 }" maxlength="4000" show-word-limit />
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input class="width" v-model="ruleForm.url" placeholder="链接请以 http(s):// 开头" maxlength="1000" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose('ruleForm')">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handleClick('ruleForm')">完 成</el-button>
      </span>
    </el-dialog>
</template>

<script>
import SyRemoteSelect from './SyRemoteSelect'
import { mapState } from "vuex";
import { getAllUserInfo, createMessage } from "@api/message-set";

export default {
  name: "TheAppDialog",
  data() {
    return {
      apiPromise: getAllUserInfo,
      options: {
        labelWidth: "150px",
      },
      ruleForm: {
        receiver: [],
        title: '',
        content: '',
        url: '',
        msgSource: 0,
        receiveType: 0,
        announceType:[]
      },
      rules: {
        receiver: [
          { required: true, message: '请选择接收人', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      loading: false
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    }
  },
  computed: {
    ...mapState("user", ["userName"])
  },
  methods: {
    handleClose(formRef) {
      this.$refs[formRef].resetFields();
      this.$emit('closeEdit', this.dialogShow.key)
    },

    handleClick() {
      this.$refs['ruleForm'].validate().then(() => {
        this.loading = true
        let params = { ...this.ruleForm, sender: this.userName.realName, receiverIds: this.ruleForm.receiver.join(',') }
        delete params.receiver
        createMessage(params).then(() => {
          this.$message.success("发送消息成功");
          this.$emit('closeEdit', this.dialogShow.key)
          this.$store.dispatch('changeMutation', this.$store.state.work.todoNumIndexSend + 1)
          this.$parent.loadData()
        }).finally(() => {
          this.loading = false
        })
      })
    },
  },
  components: { SyRemoteSelect }
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
    width: 420px;
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
