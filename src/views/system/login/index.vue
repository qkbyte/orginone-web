<template>
  <div class="login">
    <div
      class="login-bg"
      :class="
        CURRENT_ENV === 'production' ? 'login-bg--prod' : 'login-bg--line'
      "
    ></div>
    <div class="content">
      <div class="assets-link" v-if="CURRENT_ENV === 'production'">
        <a href="http://59.202.38.125:8080/" target="blank"
          >点击进入资产云1.0>>>(请用政务专网访问)</a
        >
      </div>
      <el-carousel
        ref="carousel"
        class="content-box"
        indicator-position="none"
        arrow="never"
        :autoplay="false"
      >
        <el-carousel-item v-for="item in 10" :key="item">
          <template v-if="item === 1">
            <TheLoginBox @handleToggle="handleToggle"></TheLoginBox>
          </template>
          <template v-else-if="item === 2">
            <TheRegBox @handleToggle="handleToggle"></TheRegBox>
          </template>
          <template v-else-if="item === 3">
            <TheForgetPdBox @handleToggle="handleToggle"></TheForgetPdBox>
          </template>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="footer">
      Copyright © 2021 资产云开放协同创新中心
      {{ CURRENT_ENV === "production" ? "主办单位：浙江省财政厅" : "" }}
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import TheLoginBox from "./components/TheLoginBox";
import TheRegBox from "./register/index";
import TheForgetPdBox from "./forget-password/index";

export default {
  data() {
    return {
      state: 0,
    };
  },
  components: { TheLoginBox, TheRegBox, TheForgetPdBox },
  async created() {
    await this.initInfo();
  },
  methods: {
    ...mapActions("user", ["initInfo"]),

    /**
     * 切换登录|注册|忘记密码
     * @param {Number} val -0:登录  1：注册  2：忘记密码
     */
    handleToggle(val) {
      this.$refs.carousel.setActiveItem(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;

  .login-bg {
    width: 52%;
    height: 100%;

    &--prod {
      background: url(../../../assets/login-bg-prod.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: 0 0;
    }

    &--line {
      background: url(../../../assets/login-bg-line.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: 0 0;
    }
  }

  .content {
    display: flex;
    flex: 1;
    align-items: center;
    padding-left: 6.74%;
    position: relative;
    .assets-link {
      position: absolute;
      top: 100px;
      right: 30px;
      a {
        color: blue;
      }
      a:link {
        text-decoration: none;
      }
    }
  }
  .content-box {
    margin-top: -40px;
    min-width: 330px;
    max-width: 460px;
    min-height: 350px;
    max-height: 530px;
    height: 50%;
    width: 24%;
  }
  .footer {
    position: absolute;
    right: 3%;
    bottom: 4%;
    font-size: 12px;
    font-weight: 500;
    color: #c0c4cc;
    opacity: 0.55;
  }
}
</style>

<style lang="scss" scoped>
.content ::v-deep .el-carousel {
  .el-carousel__container {
    height: 100%;
  }
  .el-carousel__item {
    display: flex;
    align-items: center;
  }
}
</style>
