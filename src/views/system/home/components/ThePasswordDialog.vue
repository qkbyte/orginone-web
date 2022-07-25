<template>
  <el-dialog
    title="修改密码"
    :visible.sync="dialogShow.value"
    width="30%"
    class="dialog-person"
    :show-close="false"
    :close-on-click-modal="false"
    @close='handleClose'
  >
    <div class="login-box">
      <div class="login-box__text">您的密码为弱密码 请修改密码</div>
      <diy-help
        content="密码长度6~16位，数字、字母、字符至少包含两种"
      ></diy-help>
    </div>
    <div class="login-input">
      <el-form
        ref="regForm"
        class="login-box__content"
        :model="regForm"
        :rules="rules"
        status-icon
      >
        <el-form-item prop="newPassword1" label="密码" label-width="100px">
          <el-input
            placeholder="请输入密码"
            clearable
            autocomplete="off"
            type="password"
            v-model="regForm.newPassword1"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="oldPassword"
          label="重新输入密码"
          label-width="100px"
        >
          <el-input
            placeholder="请再次输入密码"
            clearable
            autocomplete="off"
            type="password"
            v-model="regForm.oldPassword"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleReg">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { validatePassword } from "@utils/validate";
import { updatePassword } from "@api/user";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!validatePassword(value)) {
        callback(new Error("请输入符合规范的密码"));
      } else {
        if (this.regForm.newPassword1 !== "") {
          this.$refs.regForm.validateField("oldPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (!validatePassword(value)) {
        callback(new Error("请输入符合规范的密码"));
      } else if (value !== this.regForm.newPassword1) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      regForm: {
        newPassword1: "",
        oldPassword: "",
      },
      rules: {
        newPassword1: [{ validator: validatePass, trigger: "blur" }],
        oldPassword: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState("user", ["userId"]),
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    ...mapActions("user", ["logout"]),
    handleBack() {
      this.$emit("handleToggle", 0);
    },
    async handleReg() {
      this.$refs.regForm.validate((valid) => {
        if (valid) {
          let params = {
            checkPass: this.regForm.newPassword1,
            newPass: this.regForm.oldPassword,
            userId: this.userId,
          }
          updatePassword(params).then((res) => {
            // this.logout();
            this.$message.success("修改成功");
            this.handleClose()
          });
        } else {
          return false;
        }
      });
    },
    handleClose() {
      localStorage.setItem("PASSWORD_JUDGE", false);
      this.$emit("closeDialog", this.dialogShow.key);
    },
  },
};
</script>

<style lang="scss" scoped>
.login-box {
  width: 100%;
  display: flex;
  &__text {
    margin-right: 10px;
    // margin-left: 30px;
    font-size: 16px;
  }
  &__title {
    color: #606266;
    font-size: 15px;
    margin-left: 30px;
  }
  &__form {
    padding-top: 30px;
    padding-right: 30px;
  }
  &__title {
    margin-top: 10px;
  }
  &__button {
    margin-top: 60px !important;
    display: flex;
    flex-direction: row-reverse;
  }
}
.login-input {
  margin-top: 40px;
}
::v-deep .el-dialog__body {
  height: 250px;
}
::v-deep .el-dialog__body {
  overflow: auto;
}
::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
</style>
