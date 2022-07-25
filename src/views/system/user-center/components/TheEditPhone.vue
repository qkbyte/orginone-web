<template>
  <div class="config" v-if="configName === 'phoneNumber'">
    <div>
      <el-steps :active="active" align-center>
        <el-step title="验证手机"></el-step>
        <el-step title="修改号码"></el-step>
      </el-steps>
    </div>
    <div class="config-content">
      <div class="config-phone-1" v-show="active === 0">
        <div class="title">
          <span>
            请使用手机
            <span>{{ user.phoneNumber }}</span> 获取验证码短信
          </span>
        </div>
        <el-form :model="form" v-if="form !== undefined" :rules="rules">
          <el-row type="flex" justify="space-between">
            <el-col :span="12">
              <el-form-item prop="inputCaptcha_1">
                <el-input
                  v-model="form.inputCaptcha_1"
                  placeholder="请输入短信验证码"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label>
                <el-button
                  style="float:right;"
                  type="primary"
                  plain
                  @click="submitForm(null, rephone)"
                  :disabled="buttonDisabled"
                  >{{ timeButton }}</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col :span="10"></el-col>
            <el-col :span="10">
              <el-button
                type="primary"
                @click="verifyOldPhone(rephone, form.inputCaptcha_1)"
                style="width:150px;float:right;"
                >下一步</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="config-phone-2" v-show="active === 1">
        <el-form
          :model="form"
          ref="ruleForm"
          v-if="form !== undefined"
          :rules="rules"
        >
          <el-row type="flex" justify="space-between">
            <el-col :span="24">
              <el-form-item prop="inputNewPhone">
                <el-input
                  v-model="form.inputNewPhone"
                  placeholder="请输入新手机号码"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="space-between">
            <el-col :span="12">
              <el-form-item prop="inputCaptcha_2">
                <el-input
                  v-model="form.inputCaptcha_2"
                  placeholder="请输入短信验证码"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label>
                <el-button
                  style="float:right;"
                  type="primary"
                  @click="submitForm('ruleForm', form.inputNewPhone)"
                  :disabled="buttonDisabled"
                  >{{ timeButton }}</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col :span="10"></el-col>
            <el-col :span="10">
              <el-button
                type="primary"
                @click="verifyNewPhone(form.inputNewPhone, form.inputCaptcha_2)"
                style="width:150px;float:right;"
                >完成</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { updateUserPhoneNumber } from "@api/user";
import { sendVerifyMobile, verifyMobile } from "@api/mobile";
export default {
  name: "configDialog",
  props: {
    configName: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      active: 0,
      rephone: "13588025779", //测试电话
      /**
       * 表单内相关信息：输入的电话号码，验证码，输入短信验证码
       */
      form: {
        inputNewPhone: "", //新手机号
        inputVerifyCode: "", //
        inputMessageCode: "",
        inputCaptcha_1: "", // 输入旧手机短信验证码
        inputCaptcha_2: "", // 输入新手机短信验证码
      },
      verifyCode: "",
      messageCode: "",
      time_count: 60,
      buttonDisabled: false,
      thisTime: null, //计时器
      timer: {}, //60秒倒数
      timeButton: "获取验证码",
      rules: {
        inputOldPhone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "手机号长度为11", trigger: "blur" },
        ],
        inputNewPhone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "手机号长度为11", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.Loading();
  },
  methods: {
    /**
     * 读取信息
     */
    Loading() {
      let _this = this;
    },
    /**
     * 手机号格式验证
     */
    submitForm(formName, phoneNumber) {
      let _this = this;
      if (formName !== null) {
        _this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.SendMessage(phoneNumber);
          } else {
            return false;
          }
        });
      } else {
        _this.SendMessage(phoneNumber);
      }
    },
    /**
     * 身份验证
     */
    async verifyOldPhone(oldphone, Captcha) {
      let _this = this;
      let data = await _this.verifyPhone(oldphone, Captcha);
      if (data) {
        _this.$message.success("验证成功");
        clearInterval(_this.timer);
        _this.timeButton = "获取验证码";
        _this.active = 1;
        _this.buttonDisabled = false;
        return true;
      }
    },
    /**
     * 更新手机号码
     */
    async verifyNewPhone(newPhone, Captcha) {
      let _this = this;
      let data = await _this.verifyPhone(newPhone, Captcha);
      if (data) {
        _this.updatePhone();
        return true;
      }
    },
    /**
     * 手机号获取验证码
     */
    async SendMessage(phoneNumber) {
      let _this = this;
      let data2;
      try {
        data2 = await sendVerifyMobile({
          mobile: phoneNumber,
        });
      } catch (e) {}
      _this.buttonDisabled = true;
      let count = _this.time_count;
      _this.timeButton = `重新发送（${count}s）`;
      _this.timer = setInterval(() => {
        if (_this.thisTime === null) {
          _this.thisTime = _this.time_count - 1;
        }
        if (_this.thisTime === 0) {
          _this.thisTime = null;
          _this.buttonDisabled = false;
          _this.timeButton = `重新发送`;
          clearInterval(_this.timer);
          return true;
        }
        _this.timeButton = `重新发送（${_this.thisTime}s）`;
        _this.thisTime--;
      }, 1000);
    },
    /**
     * 手机号验证
     */
    async verifyPhone(phoneNumber, captcha) {
      let _this = this;
      let code;
      try {
        code = await verifyMobile({
          mobile: phoneNumber,
          captcha: captcha,
        });
      } catch (e) {
        return false;
      }
      return true;
    },
    /**
     * 手机号码修改
     */
    async updatePhone() {
      let _this = this;
      let getUser = _this.user;
      getUser.phoneNumber = _this.form.inputNewPhone;
      let updatePhone;
      try {
        updatePhone = await updateUserPhoneNumber(getUser);
      } catch (e) {
        return false;
      }
      _this.$message.success("修改成功");
    },
  },
};
</script>

<style lang="scss" scoped>
.config {
  .config-content {
    padding: 40px 30px;
    .config-phone-1 {
      .title {
        margin: 0 0 10px 0;

        span {
          color: #999999;
          span {
            color: #154ad8;
          }
        }
      }
      .verify-input {
        max-width: 180px;
      }
      .verify-code {
        border: 1px dashed black;
      }
    }
    .config-phone-2 {
    }
  }
}
</style>
