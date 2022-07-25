<template>
  <div class="app-info">
    <div class="app-info__pic">
      <el-carousel class="app-info__carousel" :arrow="image.length !== 1 ? 'hover' : 'never'" indicator-position="none"  trigger="click" height="450px" width="537px">
        <el-carousel-item v-for="item in image" :key="item" style="text-align: center;">
            <el-image
              v-if="item"
              class="app-info__img"
              :src="item">
            </el-image>
            <div v-else>
              <el-image
                class="app-info__img"
                style="height:426px;"
                :src="require('@assets/default-img.svg')">
              </el-image>
              <div>暂无数据</div>
            </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="app-info__detail">
      {{ sendData.description }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      image:[]
    };
  },
  created() {},
  props: {
    sendData: {
      type: Object,
      default: () => {}
    }
  },
  mounted(){
    this.image = this.sendData.appPhoto.split(',')
    console.log(this.image);
  },
  methods: {
    blobToBase64(blob) {
        returnnewPromise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.onload = (e) => {
            resolve(e.target.result);
          };
          // readAsDataURL
          fileReader.readAsDataURL(blob);
          fileReader.onerror = () => {
            reject(newError('文件流异常'));
          };
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  &__carousel{
    margin: 12px 0 0 0;
  }
  // &__pic {
  //   display: flex;
  //   justify-content: center;
  //   width: 100%;
  //   height: 100%;
  //   img {
  //     width: 540px;
  //     height: 300px;
  //   }
  // }
  &__img{
    width: 800px;
    height: 426px;
  }
  &__detail {
    margin-top: 20px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: rgba(96, 98, 102, 1);
  }
}
</style>
