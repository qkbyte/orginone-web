<template>
  <div class="banner" >
    <div class="banner__bg" >
      <!-- <div class="banner__bg--icon"></div> -->
    </div>
    <div class="banner__title">
      <div class="banner__title--icon"></div>
      <div class="banner__title--text" style="margin-left:8px;">
        浙江省党政机关办公用房数字化管理平台
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      time: "",
      timer: null,
    };
  },
  mounted() {
    this.timer = setInterval(function() {
      let showTime = function() {
        let fnW = function(time) {
          let num;
          time >= 10 ? (num = time) : (num = "0" + time);
          return num;
        };
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let data = date.getDate();
        let hours = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        return (
          year +
          "-" +
          fnW(month + 1) +
          "-" +
          fnW(data) +
          " " +
          fnW(hours) +
          ":" +
          fnW(minute) +
          ":" +
          fnW(second)
        );
      };
      let dom = document.getElementById("time");
      dom.innerText = showTime();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    //获取当前时间
  },
};
</script>

<style lang="scss" scoped>
.banner {
  border-radius: 8px;
  width: 100%;
  height: 100%;
  min-width: 558px;
  background: #ffffff;
  // &__time {
  //   position: absolute;
  //   left: 0;
  //   top: 0;
  //   height: 30px;
  //   width: 220px;
  //   background-image: url("../../assets/system-components/banner/bg2.png");
  //   background-repeat: no-repeat;
  //   background-size: 100% 100%;

  //   height: 26px;
  //   font-size: 14px;
  //   font-weight: 500;
  //   color: #ffffff;
  //   line-height: 26px;

  //   div {
  //     margin-left: 16px;
  //   }
  // }

  &__bg {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    background-image: url("../../assets/system-components/banner/bg3.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    display: flex;
    align-items: center;
    flex-direction: row-reverse;

    &--icon {
      margin-right: 16px;
      height: 60px;
      width: 175px;
      background-image: url("../../assets/system-components/banner/icon2.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }

  &__title {
    height: 100%;
    display: flex;
    align-items: center;
    letter-spacing: 5px;
    // background: linear-gradient(180deg, #67a4fa 0%, #166ee8 100%);

    &--icon {
      height: 26px;
      width: 26px;
      background-image: url("../../assets/system-components/banner/icon.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;

      height: 26px;
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
      line-height: 26px;
      margin-left: 14px;
    }
    &--text {
      font-size: 34px;
      color: linear-gradient(180deg, #67a4fa 0%, #166ee8 100%);
      font-weight: bolder;
      background-image: -webkit-linear-gradient(bottom, #166ee8, #67a4fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>
