<template>
  <div class="home" style="height:100%;overflow:hidden;">
    <div class="layout" id="taskLayout" style="height:100%">
      <div class="layout-title__box">
        <div class="layout-title__text">预警消息</div>
        <el-button class="layout-btn" round size="small" @click="gotoMore"
          >更多</el-button
        >
      </div>
      <div class="layout-content" v-for="item in list" :key="item.id">
        <div class="layout-content__left" :style="leftStyle">
          <div class="layout-content__box" @click="handleBox(item)">
            <div
              v-if="item.alertEmergencyLevel == 1"
              class="layout-content__blue"
            >
              <div class="el-icon-message-solid"></div>
            </div>
            <div
              v-else-if="item.alertEmergencyLevel == 2"
              class="layout-content__orange"
            >
              <div class="el-icon-message-solid"></div>
            </div>
            <div
              v-else-if="item.alertEmergencyLevel == 3"
              class="layout-content__red"
            >
              <div class="el-icon-message-solid"></div>
            </div>
            <div class="layout-content__title">
              {{ item.alertTitle }}
            </div>
            <div class="layout-content__text">
              {{ item.alertBusiness }}
            </div>
          </div>
        </div>
        <div class="layout-content__right">
          <div class="layout-content__time">{{ item.alertReleaseTime.substring(0,10) }}</div>
        </div>
      </div>
    </div>
    <template v-for="item in dialogShow">
      <TheViewDialog
        v-if="item.key === 'view' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheViewDialog>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import indexcard from "./components/indexcard";
import { marketappalertMyAlertList } from "@api/market";
import { selectJobsByUserId } from "@api/position";
import TheViewDialog from "./components/TheViewDialog";
export default {
  components: { indexcard, TheViewDialog },
  data() {
    return {
      dialogShow: [
        {
          key: "view",
          value: false,
        },
      ],
      list: [],
      pageSize: 999999,
      currentPage: 1,
      jobId: [],
      timer:null,
      leftStyle: "width:calc(100% - 150px)",
    };
  },
  created() {
    this.$nextTick(async () => {
      await this.getJobId();
      this.loadData();
    });
  },
  mounted() {
    this.timer = setInterval(() => {
      let wid = document.getElementById("taskLayout").clientWidth;
      console.log(wid);
      if (wid <= 406 && wid > 233) {
        this.leftStyle = "width:calc(100% - 75px);";
      } else if (wid <= 233) {
        this.leftStyle = "width:calc(100% + 20px);";
      } else {
        this.leftStyle = "width:calc(100% - 75px);";
      }
    }, 500);
  },
  beforeDestroy(){
    clearInterval(this.timer);
    this.timer = null;
  },
  computed: {
    ...mapState("user", ["id","userId", "roleId"]),
  },
  methods: {
    async getJobId() {
      let params = {
        userId: this.userId,
      };
      const res = await selectJobsByUserId(params);
      let arr = res.data.data;
      arr.forEach((el) => {
        this.jobId.push(el.id);
      });
    },
    loadData() {
      let jsonObject = {
        role: this.roleId.split(","),
        job: this.jobId,
      };
      let params = {
        current: this.currentPage,
        size: this.pageSize,
        jsonObject: jsonObject,
      };
      marketappalertMyAlertList(params).then((res) => {
        this.list = res.data.data.records;
      });
    },
    gotoMore() {
      this.$router.push({
        path: "/acttodo",
      });
      this.$store.commit("changeSkipState", this.isActive.toString());
    },
    handleBox(data) {
      this.dialogShow.map((el) => {
        if (el.key === "view") {
          el.value = true;
          el.sendData = data;
        }
      });
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
      color: $theme-color;
      border: 1px solid $theme-color;
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
    flex-direction: row;
    justify-content: space-between;
    &__box {
      display: flex;
      flex-direction: row;
      margin-top: 12px;
      cursor: pointer;
    }
    &__box:hover {
      color: rgb(145, 188, 254);
    }
    &__blue {
      width: 30px;
      height: 20px;
      background: rgb(235, 240, 254);
      border-radius: 4px;
      text-align: center;
      line-height: 20px;
      color: rgb(98, 136, 253);
      margin-right: 20px;
    }
    &__red {
      width: 30px;
      height: 20px;
      background: rgb(254, 235, 239);
      text-align: center;
      border-radius: 4px;
      line-height: 20px;
      color: rgb(249, 71, 109);
      margin-right: 20px;
    }
    &__orange {
      width: 30px;
      height: 20px;
      border-radius: 4px;
      background: rgb(254, 244, 235);
      text-align: center;
      line-height: 20px;
      color: rgb(253, 165, 93);
      margin-right: 20px;
    }
    &__text {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &__right {
      margin-top: 10px;
    }
    &__time {
      width: 90px;
      color: rgb(165, 168, 172);
    }
    &__title {
      width: 350px;
      white-space: nowrap;
      margin-right: 10px;
    }
  }
}
</style>
