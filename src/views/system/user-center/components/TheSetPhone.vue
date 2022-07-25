<template>
  <div class="login-box">
    <div class="login-box__form">
      <el-form :model="ruleForm" :rules="rules" ref="phoneForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="手机号：" prop="phone">
            <el-input style="width:100%" type="text"  placeholder="请输入手机号" v-model="ruleForm.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="login-box__button">
      <el-button type="primary" @click="handleReg" style="width:20%;"
        >完成</el-button
      >
    </div>
  </div>
</template>

<script>
import { isvalidatemobile } from "@utils/validate";
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
      oldPhone:{
          type:String,
          default:''
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
          this.$emit("update:phoneNumber", _this.ruleForm.phone);
          this.$emit("handleResetPhone");
        } else {
          return false;
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.login-box__button{
  padding-top: 40px;
}
.login-box {
    width: 100%;
  &__title{
    color: #606266;
    font-size: 15px;
    margin-left: 30px;
  }
  &__form{
     padding-top: 70px;
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
</style>
