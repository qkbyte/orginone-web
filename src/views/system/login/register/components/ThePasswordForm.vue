<template>
  <div class="login-box">
    <div class="login-box__back" @click="handleBack">
      <div class="back-icon el-icon-arrow-left"></div>
      <div class="back-text">返回</div>
    </div>
    <div class="login-box__title">设置密码</div>
    <div class="login-box__tips">
      密码长度6~16位，数字、字母、字符至少包含两种
    </div>
    <el-form
      ref="regForm"
      class="login-box__content"
      :model="regForm"
      :rules="rules"
      status-icon
    >
      <el-form-item prop="pwd">
        <el-input
          placeholder="请输入密码"
          clearable
          autocomplete="off"
          type="password"
          v-model="regForm.pwd"
        ></el-input>
      </el-form-item>
      <el-form-item prop="pwd2">
        <el-input
          placeholder="请再次输入密码"
          clearable
          autocomplete="off"
          type="password"
          v-model="regForm.pwd2"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="login-box__button">
      <el-button type="primary" @click="handleReg" style="width:100%"
        >确 定</el-button
      >
    </div>
  </div>
</template>

<script>
import { AESUtil } from "@/utils/utilencoder.js";
import { validatePassword } from "@utils/validate";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!validatePassword(value)) {
        callback(new Error("请输入符合规范的密码"));
      } else {
        if (this.regForm.pwd !== "") {
          this.$refs.regForm.validateField("pwd2");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (!validatePassword(value)) {
        callback(new Error("请输入符合规范的密码"));
      } else if (value !== this.regForm.pwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      regForm: {
        pwd: "",
        pwd2: "",
      },
      rules: {
        pwd: [{ validator: validatePass, trigger: "blur" }],
        pwd2: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },

  methods: {
    handleBack() {
      this.$emit("handleToggle", 0);
    },
    handleReg() {
      let _this = this;
      this.$refs.regForm.validate((valid) => {
        if (valid) {
          this.$emit("update:password",AESUtil.aesEncrypt(_this.regForm.pwd));
          this.$emit("handleReg");
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
  &__title {
    margin-top: 10px;
  }
  &__tips {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #606266;
  }
  &__content {
    margin-top: 20px;
  }
  &__button {
    margin-top: 50px;
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
