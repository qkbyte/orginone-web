<template>
  <div class="app-box" @click="handlePurchase()">
    <div class="app-box--left">
      <div class="app-box__icon ">
        <img src="@assets/store/app-icon-2.png" />
      </div>
      <div class="app-box__version ">
        {{ sendData.version }}
      </div>
    </div>
    <div class="app-box--right">
      <div class="app-box__title">
        {{ sendData.appName }}
      </div>
      <div class="app-box__content">
        {{ sendData.description }}
      </div>
      <div class="app-box__btn">
        <el-button
          v-if="!sendData.ifPurchase"
          type="primary"
          size="mini"
          round
          @click="handlePurchase()"
        >
          获取
        </el-button>
        <el-button
          v-else
          type="primary"
          size="mini"
          round
          @click="handleOpen()"
        >
          打开
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  props: {
    sendData: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    handlePurchase() {
      this.$emit("handlePurchase");
    },
    handleOpen() {
      this.$router.push({
        name: "app-manage-view",
        query: {
          id: this.sendData.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-box {
  width: 32%;
  height: 145px;
  padding: 20px 20px 16px;
  margin-top: 20px;
  display: flex;
  border: 1px solid rgba(235, 238, 245, 1);
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: rgba(245, 246, 252, 1);
    box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.05);
  }

  &--left {
    height: 100%;
    width: 80px;
  }

  &--right {
    height: 100%;
    width: 100%;
    margin-left: 20px;
  }

  &__icon {
    width: 60px;
    height: 60px;
    margin-top: 10px;
    border-radius: 4px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    & > img {
      width: 100%;
      height: 100%;
    }
  }

  &__version {
    margin-top: 20px;
    font-size: 12px;
    font-weight: 500;
    line-height: 17px;
    color: rgba(192, 196, 204, 1);
  }

  &__title {
    height: 30px;
    max-width: 200px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(48, 49, 51, 1);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__content {
    max-width: 200px;
    height: 40px;
    line-height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(96, 98, 102, 1);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
  }

  &__btn {
    margin-top: 10px;
    display: flex;
    flex-direction: row-reverse;

    .el-button {
      background-color: #fff;
      color: #154ad8;

      &:hover {
        background-color: #154ad8;
        color: #fff;
      }
    }
  }
}
</style>
