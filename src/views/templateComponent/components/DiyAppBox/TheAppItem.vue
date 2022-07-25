<template>
  <div class="app-box">
    <div class="app-box__icon" :title="sendData.name">
      <!-- <img :src="sendData.name === '发起审批' ? imageCount[5] : (sendData.name === '待办中心' ? imageCount[4] : (sendData.name === '人员管理' ? imageCount[3] : (sendData.name === '单位管理' ? imageCount[2] : (sendData.name === '集团管理' ? imageCount[1] : (sendData.name === '平台管理' ? imageCount[0] : (imageCount[0]))))))" /> -->
      <svg
        v-if="!sendData.appId"
        :style="sendData.id === openMenuId ? 'opacity: 1;' : ''"
        class="icon munu-item-img"
        aria-hidden="true"
      >
        <use :xlink:href="'#' + sendData.icon"></use>
      </svg>
      <svg
        v-else-if="sendData.icon === 'icon-linshitubiao'"
        :style="sendData.id === openMenuId ? 'opacity: 1;' : ''"
        class="icon munu-item-img"
        aria-hidden="true"
      >
        <use :xlink:href="'#' + sendData.icon"></use>
      </svg>
      <svg
        v-else-if="sendData.icon === ''"
        :style="sendData.id === openMenuId ? 'opacity: 1;' : ''"
        class="icon munu-item-img"
        aria-hidden="true"
      >
        <use :xlink:href="'#' + 'icon-linshitubiao'"></use>
      </svg>
      <img v-else :src="sendData.icon" alt="" class="munu-item-img" />

    </div>
    <div class="app-box__title" :title="sendData.menuName">{{ sendData.menuName }}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      imageCount: [
        require("@/assets/img/work-icon1.svg"),
        require("@/assets/img/work-icon2.svg"),
        require("@/assets/img/work-icon3.svg"),
        require("@/assets/img/work-icon5.svg"),
        require("@/assets/img/work-icon6.svg"),
        require("@/assets/img/work-icon14.svg")
      ],
    };
  },
   computed: {
    ...mapGetters("menu", ["openMenuId"]),
  },
  mounted() {},
  props: {
    sendData: {
      type: Object,
      default: () => {},
    },
  },
  mounted(){
    console.log('senda', this.sendData);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.munu-item-img{
  width: 60%;
  height: 60%;
}
.app-box {
  width: 84px;
  height: 104px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  fill: #333333;
  color: rgba(112, 112, 112, 1);
  &:hover {
    fill: #154ad8;
    color: #154ad8;
  }

  &__icon {
    width: 64px;
    height: 64px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../../../../assets/icon-bg.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    img {
      width: 60%;
      height: 60%;
    }
  }

  &__title {
    max-width: 150px;
    height: 40px;
    line-height: 25px;
    font-size: 18px;
    text-align: center;
    color: rgba(48, 49, 51, 1);
    white-space: unset;
    text-overflow: unset;
    overflow: unset;
  }
}
@media screen and (max-width: 1500px) {
  .app-box {
  width: 84px;
  height: 80px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  fill: #333333;
  color: rgba(112, 112, 112, 1);
  &:hover {
    fill: #154ad8;
    color: #154ad8;
  }

  &__icon {
    width: 48px;
    height: 48px;
  }

  &__title {
    margin-top: 10px;
    max-width: 65px;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    white-space: unset;
    text-overflow: unset;
    overflow: unset;
  }
}
}
</style>
