<template>
  <div class="register">
    <el-carousel
      ref="carousel"
      class="register-box"
      indicator-position="none"
      arrow="never"
      :autoplay="false"
    >
      <el-carousel-item v-for="item in 15" :key="item">
        <template v-if="item === 1">
          <ThePhoneForm
            @handleToggle="handleToggle"
            @handle-back="handleBack"
            :phoneNumber.sync="regForm.phoneNumber"
            :realName.sync="regForm.realName"
          >
          </ThePhoneForm>
        </template>
        <template v-else-if="item === 2">
          <TheCheckNum
            @handleToggle="handleToggle"
            :phoneNumber="regForm.phoneNumber"
            :isActive="active === 1"
          >
          </TheCheckNum>
        </template>
        <template v-else-if="item === 3">
          <ThePasswordForm
            @handleToggle="handleToggle"
            @handleReg="handleReg"
            :password.sync="regForm.password"
          >
          </ThePasswordForm>
        </template>
        <template v-else-if="item === 4">
          <TheChoiceBox @handleToggle="handleToggle"> </TheChoiceBox>
        </template>
        <template v-else-if="item === 5">
          <CreateCompany
            @handleToggle="handleToggle"
            :account="regForm.phoneNumber"
          >
          </CreateCompany>
        </template>
        <template v-else-if="item === 6">
          <SearchCompany @handleToggle="handleToggle"> </SearchCompany>
        </template>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { regUser } from "@api/user";
import ThePhoneForm from "./components/ThePhoneForm";
import TheCheckNum from "./components/CheckNum";
import ThePasswordForm from "./components/ThePasswordForm";
import TheChoiceBox from "./components/TheChoiceBox";
import CreateCompany from "./components/CreateCompany";
import SearchCompany from "./components/SearchCompany";

export default {
  data() {
    return {
      active: 0,
      regForm: {
        phoneNumber: "",
        realName: "",
        password: "",
      },
    };
  },
  created() {},
  components: {
    ThePhoneForm,
    TheCheckNum,
    ThePasswordForm,
    TheChoiceBox,
    CreateCompany,
    SearchCompany,
  },
  methods: {
    ...mapActions("user", ["login", "regLogin"]),

    /**
     * 切换步骤注册->短信验证->设置密码->选择操作
     * @param {Number} val -0:注册  1：短信验证  2：设置密码  3：选择操作  4：创建单位 5：加入单位
     */
    handleToggle(val) {
      console.log('val',val);
      this.active = val;
      this.$refs.carousel.setActiveItem(val);
    },

    //返回登录
    handleBack() {
      this.$emit("handleToggle", 0);
    },
    handleReg() {
      this.$loading({ fullscreen: true, text: "注册中" });
      let params = this.regForm;
      regUser(params)
        .then(async (res) => {
          const { phoneNumber: account, password } = this.regForm;
          let params = {
            account,
            password,
          };
          await this.login(params)
            .then(() => {})
            .catch((e) => {
              this.$loading().close();
            });
          await this.regLogin(true);
          this.$loading().close();
          this.$message.success("注册成功");
          this.handleToggle(3);
        })
        .catch((res) => {
          this.$loading().close();
        }, this);
    },
  },
};
</script>

<style lang="scss" scoped>
.register {
  height: 100%;
  width: 330px;
}
.register-box {
  height: 100%;
  width: 100%;
}
</style>
<style lang="scss" scoped>
.register ::v-deep .el-carousel {
  .el-carousel__container {
    height: 100%;
  }
  .el-carousel__item {
    display: flex;
    align-items: center;
  }
}
</style>
