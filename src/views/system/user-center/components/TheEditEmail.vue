<template>
  <div class="config">
    <div class="config-phone" v-if="configName === 'userEmail'">
      <el-form
        :model="form"
        ref="ruleForm"
        :rules="rules"
        v-if="form !== undefined"
      >
        <el-row type="flex" justify="space-between">
          <el-col :span="24">
            <el-form-item prop="inputEmail">
              <el-input
                v-model="form.inputEmail"
                clearable
                placeholder="请输入新的邮箱地址"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="10"></el-col>
          <el-col :span="10">
            <el-button
              type="primary"
              @click="changeEmail()"
              style="width:150px;float:right;"
              >修改</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  updateUserPhoneNumber
} from "@api/user";

export default {
  name: "TheEditEmail",
  props: {
    configName: {
      //组件修改字段的name
      type: String,
      required: true
    },
    user: {
      //用户数据
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      /**
       * 表单数据
       */
      form: {
        inputEmail: "",
        inputVerifyCode: ""
      },
      /**
       * 生成的验证码
       */
      verifyCode: "",
      rules: {
        inputEmail: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.Loading();
  },
  methods: {
    /**
     * 初始化
     */
    Loading() {
      let _this = this;
      _this.myVerifyCode();
    },
    /**
     * 获取验证码
     */
    myVerifyCode() {
      let _this = this;
    },
    /**
     * 对输入的验证码进行验证
     */
    inputVerify() {
      let _this = this;

      if (_this.form.inputVerifyCode === _this.verifyCode) {
        return true;
      }
      return false;
    },
    /**
     * 更改邮箱信息
     */
    async changeEmail() {
      let _this = this;
      let getUser = _this.user;
      getUser.userEmail = _this.form.inputEmail;
      let updatePhone = await updateUserPhoneNumber(getUser);
      _this.$message.success("邮箱修改成功");
      _this.$emit("reback", "emailVisible");
    }
  }
};
</script>

<style lang="scss" scoped>
.config {
  .config-phone {
    .verify-input {
      max-width: 180px;
    }
    .verify-code {
      border: 1px dashed black;
    }
  }
}
</style>
