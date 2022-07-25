<template>
  <div class="home" style="height:100%;overflow:hidden;">
    <div class="layout" id="announceLayout" style="height:100%">
      <div class="layout-title__box">
        <div class="layout-title__text">通知公告</div>
        <el-button class="layout-btn" round size="mini" @click="gotoMore"
          >更多</el-button
        >
      </div>
      <div class="layout-content" v-for="item in list" :key="item.id">
        <div class="layout-content__left">
          <div
            v-if="item.noticeUnitIds[0].type == 1"
            class="layout-content__blue"
          >
            信息上报
          </div>
          <div
            v-if="item.noticeUnitIds[0].type == 2"
            class="layout-content__green"
          >
            日常通知
          </div>
          <div
            v-if="item.noticeUnitIds[0].type == 3"
            class="layout-content__red"
          >
            安全生产
          </div>
          <div
            v-if="item.noticeUnitIds[0].type == 4"
            class="layout-content__orange"
          >
            信息审核
          </div>
          <div class="layout-content__title" :title="item.noticeTitle" @click="openDialog(item)">
            {{ item.noticeTitle }}
          </div>
        </div>
        <div class="layout-content__right">
          <div class="layout-content__unit" :style="leftStyle" >
            <span class="layout-content__text" @click="openDialog(item)">{{ item.noticeContent }}</span>
          </div>
          <div class="layout-content__time" v-if="!timeShow">{{ item.noticeReleaseTime.substring(0,10) }}</div>
        </div>
      </div>
    </div>
    <template v-for="item in dialogShow">
      <TheAnnounceDialog
        v-if="item.key === 'view' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAnnounceDialog>
    </template>
  </div>
</template>

<script>
import indexcard from "./components/indexcard";
import { mapState, mapActions, mapGetters } from "vuex";
import { marketappnoticeMyAlertList } from "@api/market";
import TheAnnounceDialog from "./components/TheAnnounceDialog"
export default {
  components: { indexcard,TheAnnounceDialog },
  data() {
    return {
      colorList: ["blue", "green", "red", "orange"],
      list: [],
      current: 1,
      size: 99999,
      timer: null,
      leftStyle: "",
      timeShow:false,
      dialogShow:[
        {
          key:'view',
          value: false
        }
      ]
    };
  },
  mounted() {
    this.timer = setInterval(() => {
      let wid = document.getElementById("announceLayout").clientWidth;
      console.log(wid);
      if (wid <= 406) {
        this.leftStyle = "width:100%;margin:0px";
        this.timeShow = true
      }else{
        this.leftStyle = ""
        this.timeShow = false
      }
    }, 500);
    this.loadData();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  watch: {},
  computed: {
    ...mapState("user", ["roleName", "userName", "userPhoto", "roleId"]),
    ...mapGetters("tenant", ["curTenantId"]),
  },
  methods: {
    loadData() {
      let arr = [];
      arr.push(this.curTenantId);
      let params = {
        current: this.current,
        size: this.size,
        role: this.roleId.split(","),
        unit: arr,
      };
      marketappnoticeMyAlertList(params).then((res) => {
        const { records } = res.data.data;
        let arr = [];
        records.forEach((el) => {
          if (el.noticeReleaseStatus !== 0 && el.isDeleted !== 1) {
            arr.push(el);
          }
        });
        this.list = arr;
        this.list.forEach((el) => {
          el.noticeUnitIds = JSON.parse(el.noticeUnitIds);
        });
      });
    },
    handleCloseDialog(key){
      this.dialogShow.map((el)=>{
        if(el.key == key){
          el.value = false
        }
      })
    },
    openDialog(item){
      this.dialogShow.map((el)=>{
        if(el.key == 'view'){
          el.value = true
          el.sendData = item
        }
      })
    },
    gotoMore() {
      this.$router.push({
        path: "/acttodo",
      });
      this.$store.commit("changeSkipState", this.isActive.toString());
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  & > div + div {
    margin-top: 4px;
  }
}
.layout {
  padding: 16px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  &-btn {
    color: $theme-color;
    border: 1px solid $theme-color;
  }
  &-title {
    &__box {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    &__text {
      font-size: 16px;
      font-weight: bold;
    }
    &__btn {
      color: rgb(145, 188, 254);
      border: 1px solid rgb(145, 188, 254);
      width: 60px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 20px 20px 20px 20px;
      cursor: pointer;
    }
  }
  &-content {
    display: flex;
    justify-content: space-between;
    &__left {
      width: 40%;
      display: flex;
    }
    &__box {
      display: flex;
      flex-direction: row;
      margin-top: 10px;
    }
    &__blue {
      width: 100px;
      height: 20px;
      background: rgb(235, 240, 254);
      text-align: center;
      line-height: 20px;
      color: rgb(98, 136, 253);
      margin-right: 20px;
      margin-top: 8px;
      white-space: nowrap;
    }
    &__green {
      width: 100px;
      height: 20px;
      background: rgb(232, 251, 239);
      text-align: center;
      line-height: 20px;
      color: rgb(78, 205, 125);
      margin-right: 20px;
      margin-top: 8px;
      white-space: nowrap;
    }
    &__red {
      width: 100px;
      height: 20px;
      background: rgb(254, 235, 239);
      text-align: center;
      line-height: 20px;
      color: rgb(249, 71, 109);
      margin-right: 20px;
      margin-top: 8px;
      white-space: nowrap;
    }
    &__orange {
      width: 100px;
      height: 20px;
      background: rgb(254, 244, 235);
      text-align: center;
      line-height: 20px;
      color: rgb(253, 165, 93);
      margin-right: 20px;
      margin-top: 8px;
      white-space: nowrap;
    }
    &__title {
      margin-top: 10px;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    &__title:hover{
      color: $theme-color;
    }
    &__right {
      width: 60%;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
    &__time {
      width: 100px;
      white-space: nowrap;
      color: rgb(165, 168, 172);
    }
    &__unit {
      width: calc(100% - 120px);
      display: flex;
      flex-direction: row-reverse;
      margin-right: 20px;
    }
    &__text{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    &__text:hover{
      color: $theme-color;
    }
  }
}
@media only screen and (max-width: 420px) {
  .layout {
    border: 1px solid red;
    &-content {
      &__time {
        display: none;
      }
      &__unit {
        margin: 0;
      }
    }
  }
}
</style>
