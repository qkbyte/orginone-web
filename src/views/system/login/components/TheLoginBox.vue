<template>
  <div class="login-box">
    <div class="login-box__title">登录</div>
    <div class="login-box__title-2">
      {{ CURRENT_ENV === "production" ? "使用您的账号" : "使用您的云平台账号" }}
    </div>
    <div class="login-box__form">
      <el-form
        :model="loginData"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="login-input"
      >
        <el-form-item prop="pass">
          <el-input
            placeholder="请输入手机号码"
            prefix-icon="el-icon-user-solid"
            clearable
            @keyup.enter.native="handleNext"
            type="text"
            v-model="loginData.account"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            id="pd"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            clearable
            type="password"
            autocomplete="off"
            v-model="loginData.password"
            @keyup.enter.native="handleLogin"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="login-box__options">
      <el-checkbox v-model="loginData.checked">记住我</el-checkbox>
      <div class="login-box__options--forget" @click="handleClick(2)">
        忘记密码？
      </div>
    </div>
    <div class="login-box__button">
      <el-button type="primary" style="width: 100%;" @click="handleLogin"
        >登录</el-button
      >
    </div>
    <div class="login-box__register" v-if="CURRENT_ENV != 'production'">
      <div class="login-box__register--left">还没有账号？</div>
      <div class="login-box__register--right" @click="handleClick(1)">
        立即注册
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { AESUtil } from "@/utils/utilencoder.js";
import { getSimplePwd } from "@api/login";
export default {
  data() {
    return {
      loginData: {
        account: "",
        password: "",
        checked: false,
      },
      num:0,
    };
  },
  created() {
    this.getLoginData();
  },
  mounted() {
    const that = this
    window.addEventListener("keydown", (event) => {
      console.log("按下" + event.key);
      console.log("keycode:" + event.keyCode);
      console.log("thiscode:" + this.code);
      if (event.keyCode === 9) {
        that.num ++
        console.log(that.num);
        if(that.num >3){
           event.preventDefault();
        }
      }
    });
  },
  beforeDestroy(){
    window.removeEventListener('keydown')
  },
  methods: {
    ...mapActions("user", ["login", "changeToken"]),

    /**
     * 切换到 注册|忘记密码
     * @param {Number} val -1：注册  2：忘记密码
     */
    handleClick(val) {
      this.$emit("handleToggle", val);
    },
    handleNext() {
      document.getElementById("pd").focus();
    },
    async handleLogin() {
      const { account, password, checked } = this.loginData;
      let _this = this;
      if (!account || !password) {
        this.$message.warning("用户名或密码不能为空");
      } else {
        this.$loading({ fullscreen: true, text: "拼命登录中" });
        let params = {
          account: account,
          password: AESUtil.aesEncrypt(password),
        };
        this.login(params)
          .then(() => {
            const login = {
              account,
              checked,
            };
            const loginJson = JSON.stringify(login);
            localStorage.setItem("ZCY_LOGIN_DATA", loginJson);
            if (localStorage.getItem("RELOAD") == "true") {
              localStorage.setItem("RELOAD", false);
              window.location.href = "/";
            } else {
              this.$router.push("/");
            }
          })
          .catch(() => {
            this.$loading().close();
          });
        let res = await getSimplePwd(params);
        localStorage.setItem("PASSWORD_JUDGE", res.data.data);
      }
    },
    getLoginData() {
      //获取登录信息
      let account = "";
      let password = "";
      let checked = false;
      const loginJson = JSON.parse(localStorage.getItem("ZCY_LOGIN_DATA"));
      if (loginJson) {
        account = loginJson.account;
        checked = loginJson.checked === "false" ? false : true;
      }
      this.loginData = {
        account,
        password,
        checked,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.login-box {
  &__form {
    margin-top: 23px;
  }

  &__options {
    display: flex;
    justify-content: space-between;
    margin-top: 23px;
    color: #909399;
    &--forget:hover {
      cursor: pointer;
      color: #154ad8;
    }
  }

  &__button {
    margin-top: 33px;
  }

  &__register {
    margin-top: 23px;
    display: flex;
    justify-content: center;
    font-size: 14px;
    font-weight: 400;
    &--left {
      font-size: 14px;
      font-weight: 400;
      line-height: 17px;
      color: #303133;
    }
    &--right {
      color: #154ad8;
      cursor: pointer;
    }
  }
}
</style>

<style lang="scss" scoped>
.login-input ::v-deep .el-input {
  input {
    border-radius: 0;
  }
}
.login-input ::v-deep .el-form-item {
  &__content {
    margin-left: 0 !important;
  }
}
.login-box__options ::v-deep .el-checkbox {
  .el-checkbox__label {
    color: #909399;
  }
  .el-checkbox__inner {
    border-radius: 0;
  }
}
.login-box__button ::v-deep .el-button {
  border-radius: 0;
}
</style>
