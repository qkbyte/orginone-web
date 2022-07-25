<template>
  <div class="login-box">
    <div class="login-box__back" @click="handleBack">
      <div class="back-icon el-icon-arrow-left"></div>
      <div class="back-text">返回</div>
    </div>
    <div class="login-box__title">请填写单位信息</div>
    <div class="login-box__title-2">请输入真实单位信息，便于单位成员查找</div>
    <el-form
      ref="regForm"
      class="login-box__content"
      :model="regForm"
      :rules="rules"
      status-icon
    >
      <el-form-item prop="comName">
        <el-input
          type="text"
          v-model="regForm.comName"
          clearable
          autocomplete="off"
          placeholder="请输入单位名称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="socialCode">
        <el-input
          type="text"
          v-model="regForm.socialCode"
          clearable
          autocomplete="off"
          placeholder="请输入统一社会信用代码"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="login-box__button">
      <el-button type="primary" @click="handleNext" style="width: 100%;"
        >确 定</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { addTenant } from "@api/tenant";
import { getRoleIdByTenantId } from "@api/role";
import { validateSocialCreCode } from "@utils/validate";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("请输入单位名称"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("请输入统一社会信用代码"));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      let res = validateSocialCreCode(value);
      if (!res) {
        callback(new Error("请输入符合规范的统一社会信用代码"));
      } else {
        callback();
      }
    };
    return {
      regForm: {},
      form: {},
      rules: {
        comName: [{ validator: validatePass, trigger: "blur" }],
        socialCode: [{ validator: validatePass2, trigger: "blur" }],
        socialCode: [{ validator: validatePass3, trigger: "blur" }],
      },
    };
  },
  props: ["account"],
  computed: {
    ...mapState("user", ["userId", "RegLogin"]),
  },

  methods: {
    ...mapActions("user", ["regLogin", "changeRoleId", "changeToken"]),
    handleBack() {
      this.$emit("handleToggle", 3);
    },
    handleNext() {
      let _this = this;
      this.$refs.regForm.validate((valid) => {
        if (!valid) {
          return _this.$message.error("请输入完整且规范的信息");
        }
        const loading = this.$loading({
          lock: true,
          text: "提交中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        this.form = {
          tenantName: this.regForm.comName,
          socialCreCode: this.regForm.socialCode,
          userId: this.userId,
        };
        let params = this.form;
        addTenant(params).then(
          async (res) => {
            let params = {
              account: this.account,
              tenantCode: res.data.data,
            };
            await getRoleIdByTenantId(params).then((res) => {
              const { tokenType, accessToken, roleId } = res.data.data;
              this.changeToken(tokenType + " " + accessToken);
              this.changeRoleId(roleId);
            });
            loading.close();
            this.$message.success({
              message: "创建成功",
              duriation: 700,
            });
            this.$router.push({ path: "/" });
          },
          (err) => {
            loading.close();
          }
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-box {
  &__title {
    margin-top: 10px;
    margin-bottom: 8px;
  }

  &__content {
    margin-top: 20px;
  }
  &__button {
    margin-top: 40px;
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
