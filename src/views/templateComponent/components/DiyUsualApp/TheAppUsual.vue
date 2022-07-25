<template>
  <div class="app-box">
    <div :class="editShow ? 'app-box__iconShow' : 'app-box__icon'" :title="sendData.name">
      <div v-show="editShow" @click.stop="handleDelete" class="app-box__delete el-icon-error"></div>
      <svg
        v-if="sendData.icon == ''"
        :style="sendData.id === openMenuId ? 'opacity: 1;' : ''"
        class="icon munu-item-img"
        aria-hidden="true"
      >
        <use :xlink:href="'#' + 'icon-linshitubiao'"></use>
      </svg>
      <img v-else :src="sendData.icon" alt="" class="munu-item-img" />
    </div>
    <div class="app-box__title" :title="sendData.name">{{ sendData.menuName }}</div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { marketusedappRemoveByRelation } from "@api/user";
import Bus from "@utils/eventBus"
export default {
  data() {
    return {
    };
  },
   computed: {
    ...mapGetters("menu", ["openMenuId"]),
    ...mapState("user", ["userId"]),
  },
  mounted() {},
  props: {
    sendData: {
      type: Object,
      default: () => {},
    },
    editShow:{
      type:Boolean,
      default: false,
    }
  },
  watch:{
    sendData(val){
      console.log('val',val);
    }
  },
  mounted(){
      console.log('senddata', this.sendData);
  },
  methods: {
    handleDelete(){
      let params = {
        appId: this.sendData.id,
        userId: this.userId
      }
      marketusedappRemoveByRelation(params).then((res)=>{
        Bus.$emit('handleRefresh')
      })
    },
  },
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
  &__delete{
    position: absolute;
    right: -5px;
    top: -5px;
    font-size: 18px;
    cursor: pointer;
    color: rgb(253, 60, 47);
  }
  &__icon {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(235, 241, 251);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    img {
      width: 60%;
      height: 60%;
    }
  }

  &__iconShow{
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(235, 241, 251);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    img {
      width: 60%;
      height: 60%;
    }
  }

  &__title {
    max-width: 100px;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: rgba(48, 49, 51, 1);
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
  &__iconShow{
    width: 48px;
    height: 48px;
  }
  &__title {
    margin-top: 10px;
    max-width: 70px;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
  }
}
}
</style>
