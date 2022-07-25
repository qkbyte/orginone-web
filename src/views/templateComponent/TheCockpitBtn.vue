<template>
  <div class="layout-box">
    <div class="content" @click="togo">
      <div class="content__background">
        <div class="content__taskbtn"></div>
      </div>
      <div class="content__text">
        展示平台
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("menu", ["changeMenu"]),
    togo() {
      let menu = {
        id: -1,
        appId: '1386206789054210049',
        url: 'http://gzzcy-gz-supervision.demo.test.hzjuxiu.com:81/#/assetScreen/bigDataScreen',
        type: "app",
      };
      window.open(menu.url, "_blank");
      this.changeMenu(menu);
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-box {
  width: 100%;
  height: 100%;
  background: white;
}
.content {
  background: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  &__background {
    width: 32px;
    height: 32px;
    background: rgba(133, 73, 244, 0.1);
    margin: 20px 10px 20px 0px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__taskbtn {
    width: 25px;
    height: 25px;
    background: url(../../assets/cockpitbtn.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  &__text {
    width: 83px;
    height: 22px;
    font-size: 24px;
    font-family: PingFangSC-Semibold, PingFang SC;
    white-space: nowrap;
    font-weight: 600;
    color: #303133;
    line-height: 22px;
    margin: 29px 28px 29px 0;
  }
}
</style>
