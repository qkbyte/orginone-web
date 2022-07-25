<template>
  <div class="container">
    <div class="con">
      <div class="con-left">
        <img src="@assets/404.png" alt="" />
      </div>
      <div class="con-right">
        <div class="title-1">抱歉！</div>
        <div class="title-2">您访问的页面找不到了</div>
        <div class="btn">
          <div class="btn-back" @click="goHome">返回首页</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("menu", ["changeMenu"]),
    goHome() {
      sessionStorage.removeItem("openMenu");
      this.changeMenu({
        id: -1,
        type: "platform",
        path: "/",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;

  .con {
    width: 1000px;
    height: 400px;
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;

    &-right {
      .title-1 {
        font-size: 40px;
        font-weight: bold;
        color: rgba(21, 74, 216, 1);
      }

      .title-2 {
        margin-top: 20px;
        font-size: 25px;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }

      .btn {
        margin-top: 50px;
        width: 100px;
        height: 40px;
        background: rgba(21, 74, 216, 1);
        box-shadow: 0px 6px 10px rgba(6, 45, 103, 0.24);
        border-radius: 4px;

        .btn-back {
          width: 100%;
          height: 100%;
          display: block;
          font-size: 16px;
          font-weight: 400;
          line-height: 40px;
          text-align: center;
          text-decoration: none;
          color: rgba(255, 255, 255, 1);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
