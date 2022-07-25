<template>
  <div class="app-contact">
    <div class="app-contact__info">
      <div class="app-contact__title">联系开发者</div>
      <div class="info">
        <div style="width:50%"><i class="el-icon-office-building"></i> {{ sendData.tenantName }}</div>
        <div style="width:50%"><i class="el-icon-coordinate"></i> {{ sendData.unitAddress }}</div>
      </div>
      <div class="info">
        <div style="width:50%"><i class="el-icon-user"></i> {{ sendData.contactName }}</div>
        <div style="width:50%"><i class="el-icon-phone-outline"></i> {{ sendData.contact }}</div>
      </div>
      <div class="info">
        <div v-if="sendData.appMail" style="width:50%"><i class="el-icon-message"></i> {{ sendData.appMail }}</div>
        <div v-if="sendData.appAddress" :style="sendData.appMail ? '' : 'white-space: nowrap;'" style="width:50%;height: 20px;line-height: 20px;display:flex"><i class="el-icon-link" style="margin:5px 8px 0 0"></i> <div>{{ sendData.appAddress }}</div></div>
      </div>
    </div>
    <div class="app-contact__version" :style="isShow ? 'margin-top:60px':'margin-top:20px'">
      <div class="app-contact__title">历史更新</div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow:false
    };
  },
  created() {
    if(this.sendData.appMail || this.sendData.appAddress){
      this.isShow = true
    }
  },
  props: {
    sendData: {
      type: Object,
      default: () => {}
    }
  },
  components:{
    hanlde(data){
      return data ? data : '暂无数据'
    }
  },
  mounted(){
    console.log(this.sendData);
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.app-contact {
  display: flex;
  flex-direction: column;

  &__title {
    font-size: 16px;
    font-weight: 550;
    line-height: 22px;
    color: rgba(48, 49, 51, 1);
  }

  &__info {
    height: 120px;

    .info {
      height: 35px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      line-height: 45px;
      color: rgba(48, 49, 51, 1);

      i {
        color: #999999;
      }
    }
  }
  // &__version{
  //   margin-top: 60px;
  // }
}
</style>
