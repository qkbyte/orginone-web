<template>
  <div class="login-box">
    <div class="login-box__back" @click="handleBack">
      <div class="back-icon el-icon-arrow-left"></div>
      <div class="back-text">返回</div>
    </div>
    <div class="login-box__title">验证手机号</div>
    <div class="login-box__tips">
      <div class="login-box__tips--left">短信已发送至</div>
      <div class="login-box__tips--middle">{{ phoneNumber }}</div>
      <div class="login-box__tips--right">请注意查收</div>
    </div>
    <div class="login-box__input">
      <input
        :id="'fbox-' + item"
        :ref="'input' + item"
        v-for="(item, index) in 4"
        :key="index"
        class="forget-input-box"
        type="text"
        v-model.number="code[index]"
        @keyup="nextFocus($event, index)"
        maxlength="1"
        autocomplete="off"
      />
    </div>
    <div class="login-box__time">
      <div class="time-clock" v-if="sendState">验证码已发送({{ times }})</div>
      <div class="time-resend" v-else @click="sendMessage">
        重新发送
      </div>
    </div>
    <div class="login-box__button">
      <el-button type="primary" style="width:100%;" @click="handleNext"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import { AESUtil } from "@/utils/utilencoder.js";
import { sendVerifyMobile, verifyMobile, sendCheckCode } from "@api/mobile";
export default {
  name: "checkNum",
  data() {
    return {
      code: [],
      times: 60,
      sendState: false,
      sendPass: "",
    };
  },
  props: ["phoneNumber", "isActive"],
  watch: {
    isActive: {
      handler(newValue, oldValue) {
        if (newValue) {
          if (!this.sendState) {
            this.sendMessage();
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    handleBack() {
      this.$emit("handleToggle", 0);
    },
    handleNext() {
      let captcha = this.code.join("");
      if (captcha.length === 4) {
        if (this.CURRENT_ENV != "production") {
          let params = {
            mobile: this.phoneNumber,
            captcha,
          };
          verifyMobile(params).then((res) => {
            this.$emit("handleToggle", 2);
          }, this);
        } else {
          if (AESUtil.aesDecrypt(this.sendPass) == captcha) {
            this.$emit("handleToggle", 2);
          } else {
            this.$message.error("验证码不正确");
          }
        }
      } else {
        this.$message.error("请输入验证码");
      }
    },

    sendMessage() {
      this.handleWait();
      if (this.CURRENT_ENV != "production") {
        let params = {
          mobile: this.phoneNumber,
        };
        sendVerifyMobile(params).then((res) => {
          this.$message.success("验证码已发送");
        });
      } else {
        let params = {
          phoneNumber: this.phoneNumber,
          digit: 4,
        };
        sendCheckCode(params).then((res) => {
          this.$message.success("验证码已发送");
          this.sendPass = res.data.data;
        });
      }
    },

    handleWait() {
      this.times--;
      this.sendState = true;
      if (this.times === 0) {
        this.sendState = false;
        this.times = 60;
      } else {
        let _this = this;
        setTimeout(() => {
          _this.handleWait();
        }, 1000);
      }
    },

    /**
     * 输入验证码跳转到下一个格子
     * @param {*} el -键盘事件
     * @param {number} index -当前格子
     */
    nextFocus(el, index) {
      const dom = document.getElementsByClassName("forget-input-box");
      const curInput = dom[index];
      const nextInput = dom[index + 1];
      const lastInput = dom[index - 1];
      if (el.code !== "Backspace") {
        if (index < 3) {
          nextInput.focus();
        } else {
          curInput.blur();
        }
      } else if (index !== 0 && (this.code[index] || this.code[index] !== "")) {
        lastInput.focus();
      }
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
    display: flex;
    font-size: 14px;
    font-weight: 400;
    color: #606266;

    &--middle {
      margin: 0 8px;
      color: #154ad8;
    }
  }

  &__input {
    margin-top: 20px;
    .forget-input-box {
      height: 40px;
      width: 40px;
      line-height: 40px;
      font-size: 20px;
      text-align: center;
      margin-right: 20px;
      border: 1px solid #dee0e3;
    }
  }
  &__time {
    margin-top: 83px;
    font-size: 13px;

    .time-clock {
      color: #909399;
    }
    .time-resend {
      color: #154ad8;
      cursor: pointer;
    }
  }

  &__button {
    margin-top: 20px;
  }
}
</style>

<style lang="scss" scoped>
.login-box__button ::v-deep .el-button {
  border-radius: 0;
}
</style>
