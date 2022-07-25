<template>
  <div class="login-box">
    <div class="login-box__back" @click="$emit('handle-back')">
      <div class="back-icon el-icon-arrow-left"></div>
      <div class="back-text">返回</div>
    </div>
    <div class="login-box__title">忘记密码</div>
    <div class="login-box__title-2">通过手机号，重置密码</div>
    <el-form
      class="login-box__content"
      ref="forgetForm"
      :model="form"
      :rules="rules"
      status-icon
    >
      <el-form-item prop="phoneNumber">
        <el-input
          placeholder="请输入手机号"
          clearable
          type="text"
          v-model="form.phoneNumber"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="login-box__button">
      <el-button type="primary" @click="handleNext" style="width:100%;"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import { isvalidatemobile } from "@utils/validate";
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      let res = isvalidatemobile(value);
      if (!res[0]) {
        callback(new Error(res[1]));
      } else {
        callback();
      }
    };
    return {
      form: {},
      rules: {
        phoneNumber: [{ validator: validatePhone, trigger: "blur" }],
      },
    };
  },
  methods: {
    handleBack() {
      this.$emit("handleBack");
    },
    handleNext() {
      let _this = this;
      this.$refs.forgetForm.validate((valid) => {
        if (valid) {
          this.$emit("update:phoneNumber", _this.form.phoneNumber);
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
  &__title {
    margin-top: 10px;
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
