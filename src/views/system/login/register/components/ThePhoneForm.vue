<template>
  <div class="login-box">
    <div class="login-box__title">注册</div>
    <div class="login-box__title-2">欢迎使用云原生应用管理平台</div>
    <el-form
      class="login-box__content"
      ref="regForm"
      :model="regForm"
      :rules="rules"
      status-icon
    >
      <el-form-item prop="realName">
        <el-input
          placeholder="请输入姓名"
          clearable
          type="text"
          v-model="regForm.realName"
          @keyup.enter.native="handleEnter"
        ></el-input>
      </el-form-item>
      <el-form-item prop="phoneNumber">
        <el-input
          id="phone"
          placeholder="请输入手机号"
          clearable
          type="text"
          v-model="regForm.phoneNumber"
          @keyup.enter.native="handleNext"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="login-box__button">
      <el-button type="primary" style="width: 100%;" @click="handleNext"
        >下一步</el-button
      >
    </div>
    <div class="login-box__login">
      <div class="login-text" @click="$emit('handle-back')">
        已有账号，立即登录
      </div>
    </div>
  </div>
</template>

<script>
import { isvalidatemobile } from "@utils/validate";
import { checkExistMobile } from "@api/user";
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
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
      regForm: {},
      rules: {
        phoneNumber: [{ validator: validatePhone, trigger: "blur" }],
        realName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //处理回车焦点跳到下个输入框
    handleEnter() {
      document.getElementById("phone").focus();
    },
    handleNext() {
      let _this = this;
      this.$refs.regForm.validate((valid) => {
        if (valid) {
          const { phoneNumber, realName } = _this.regForm;
          this.$emit("update:phoneNumber", phoneNumber);
          this.$emit("update:realName", realName);
          this.$emit("handleToggle", 1);
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-box {
  &__content {
    margin-top: 20px;
  }
  &__login {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    font-size: 14px;
    font-weight: 400;

    .login-text:hover {
      color: #154ad8;
      cursor: pointer;
    }
  }
}
</style>

<style lang="scss" scoped>
.login-box__content ::v-deep .el-input {
  input {
    border-radius: 0;
  }
}
.login-box__button ::v-deep .el-button {
  border-radius: 0;
}
</style>
