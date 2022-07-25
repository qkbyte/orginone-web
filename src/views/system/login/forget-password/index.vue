<template>
  <div class="forgetPd">
    <el-carousel
      ref="carousel"
      class="forgetPd-box"
      indicator-position="none"
      arrow="never"
      :autoplay="false"
    >
      <el-carousel-item v-for="item in 10" :key="item">
        <template v-if="item === 1">
          <ThePhoneForm
            @handleToggle="handleToggle"
            @handle-back="handleBack"
            :phoneNumber.sync="form.phoneNumber"
          >
          </ThePhoneForm>
        </template>
        <template v-else-if="item === 2">
          <TheCheckNum
            @handleToggle="handleToggle"
            :phoneNumber="form.phoneNumber"
            :isActive="active === 1"
          >
          </TheCheckNum>
        </template>
        <template v-else-if="item === 3">
          <TheSetPwd
            @handleToggle="handleToggle"
            @handleResetPwd="handleResetPwd"
            :password.sync="form.password"
          >
          </TheSetPwd>
        </template>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { resetPasswordByPhone } from "@api/user";
import ThePhoneForm from "./components/ThePhoneForm";
import TheCheckNum from "./components/TheCheckNum";
import TheSetPwd from "./components/TheSetPwd";
import { AESUtil } from "@/utils/utilencoder.js";
export default {
  data() {
    return {
      active: 0,
      form: {
        phoneNumber: "",
        password: "",
      },
    };
  },
  components: {
    ThePhoneForm,
    TheCheckNum,
    TheSetPwd,
  },
  methods: {
    /**
     * 切换步骤 输入手机号->短信验证->设置密码
     * @param {Number} val -0:输入手机号  1：短信验证  2：设置密码
     */
    handleToggle(val) {
      this.active = val;
      this.$refs.carousel.setActiveItem(val);
    },

    //返回登录
    handleBack() {
      this.$emit("handleToggle", 0);
    },
    handleResetPwd() {
      const { password: pwd, phoneNumber } = this.form;
      let params = {
        phoneNumber,
        pwd:AESUtil.aesEncrypt(pwd),
      };
      resetPasswordByPhone(params)
        .then((res) => {
          this.$message.success("修改成功");
          this.handleBack();
        })
        .catch((res) => {
          this.handleBack();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.forgetPd {
  height: 100%;
  width: 330px;
}
.forgetPd-box {
  height: 100%;
  width: 100%;
}
</style>
<style lang="scss" scoped>
.forgetPd ::v-deep .el-carousel {
  .el-carousel__container {
    height: 100%;
  }
  .el-carousel__item {
    display: flex;
    align-items: center;
  }
}
</style>
