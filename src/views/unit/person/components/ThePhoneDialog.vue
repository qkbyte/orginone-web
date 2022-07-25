<template>
<el-dialog
    title="修改手机号"
    :visible.sync="dialogShow.value"
    width="30%"
    class="dialog-person"
    :close-on-click-modal="false"
>
  <div class="login-box">
    <div class="login-box__form">
      <el-form :model="ruleForm" :rules="rules" ref="phoneForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="手机号：" prop="phone">
            <el-input style="width:100%" type="text"  placeholder="请输入手机号" v-model="ruleForm.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleReg">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </div>
</el-dialog>
</template>

<script>
import { isvalidatemobile } from "@utils/validate";
import { updatePersonInform } from "@api/tenant";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8|9][0-9]{9}$/
      if (!value) {
          return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
            if (phoneReg.test(value)) {
              callback()
            } else {
              callback(new Error('电话号码格式不正确'))
            }
        }
      }, 100)
    };
    return {
      form: {},
      rules: {
        phone: [
          { validator: validatePass, trigger: 'blur' }
        ],
      },
      ruleForm: {
        phone:'',
      },
    };
  },
  props:{
      dialogShow:{
        type: Object,
        default: ()=>{}
      }
  },
  methods: {
    handleBack() {
      this.$emit("handleToggle", 0);
    },
    handleReg() {
      let _this = this;
      this.$refs.phoneForm.validate((valid) => {
        if (valid) {
            let params = {
                phoneNumber: this.ruleForm.phone,
                name: this.dialogShow.sendData.realName,
                userId: this.dialogShow.sendData.userId,
            }
            updatePersonInform(params).then((res) => {
                this.$message.success("修改成功");
                this.$emit("closeDialog", this.dialogShow.key);
                this.$parent.loadData()
            });
        } else {
          return false;
        }
      });
    },
    handleClose(){
      this.$emit("closeDialog", this.dialogShow.key);
    }
  },
};
</script>

<style lang="scss" scoped>
.login-box {
    width: 100%;
  &__title{
    color: #606266;
    font-size: 15px;
    margin-left: 30px;
  }
  &__form{
    padding-top: 30px;
    padding-right: 30px;
  }
  &__title {
    margin-top: 10px;
  }
  &__button{
    margin-top: 60px !important;
    display: flex;
    flex-direction: row-reverse;
  }
}
.diy-dialog-footer{
  margin-top: 50px;
}
</style>
