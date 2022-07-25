<template>
  <div>
    <div class="app-list" id="appList" v-if="!isShow">
      <div
        class="app-main"
        v-for="(item, index) in appList"
        :key="'item-' + item.id + index"
        @click="handleClickRoot(item)"
      >
        <TheAppItem :sendData="item"></TheAppItem>
      </div>
      <div
        style="width:84px;height:100px;margin-right:20px;"
        class="flex-center"
      >
        <!-- <div class="oftenapp-more">
          +
        </div> -->
      </div>
      <i v-for="index in 20" :key="index"></i>
    </div>
    <div v-else>
      <div class="app-list">
        <div
          class="app-main"
          v-for="(item, index) in appChild"
          :key="'item-' + item.id + index"
          @click="handleClickRoot(item)"
        >
          <TheAppItem :sendData="item"></TheAppItem>
        </div>
        <i v-for="index in 20" :key="index"></i>
      </div>
      <div class="container__footer">
        <el-pagination
          small
          layout="prev, pager, next"
          :total="total"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
          current-change
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import TheAppDialog from "./TheAppDialog";
import TheAppItem from "./TheAppItem";
// import SdkClient from "@assetcloud/asset-sdk";
export default {
  name: "DiyAppList",
  data() {
    return {
      dialog: {
        isVisible: false,
        sendData: {},
      },
      // sdk: "",
      isShow: false,
      appChild: [],
      currentPage: 1,
      total: 0,
      timer: null,
      appList: [],
    };
  },
  components: {
    TheAppDialog,
    TheAppItem,
  },
  created() {
    // this.$nextTick(async () => {
    //   this.sdk = new SdkClient(5);
    //   let res = await this.sdk.init();
    // });
    this.$nextTick(() => {
      let _this = this;
      let arr = JSON.parse(JSON.stringify(this.appListData));
      this.timer = setInterval(() => {
        let wid = document.getElementById("appList").clientWidth;
        let a = Math.floor(wid / 94);
        let list = [];
        for (let i = 0; i < a; i++) {
          if(arr[i]){
            list.push(arr[i]);
          }
        }
        _this.appList = list;
      }, 1000);
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  mounted() {},
  props: {
    appListData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {},
  methods: {
    ...mapActions("menu", ["changeMenu"]),
    async handleClickRoot(obj) {
      if (obj.children && obj.children.length !== 0) {
        this.appChild = obj.children;
        this.isShow = true;
        this.$emit("changeTitle", obj);
      } else {
        this.changeMenu(obj);
      }
    },
    closeDialogByChild() {
      this.dialog.isVisible = false;
    },
    /**
     * 分页
     */
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  flex-direction: row;
}
.app-list {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .app-main {
    margin-right: 20px;
  }
  & > i {
    width: 104px;
  }
}
.oftenapp-more {
  border: 1px dashed #ebeef5;
  width: 67px;
  height: 67px;
  font-size: 40px;
  text-align: center;
  line-height: 67px;
  color: #999;
  cursor: pointer;
  margin-bottom: 15%;
}

.container__footer {
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translate(-50%);
}

@media screen and (max-width: 1500px) {
  .app-list {
    .app-main {
      margin-right: 20px;
    }
    & > i {
      width: 104px;
    }
  }
  .oftenapp-more {
    width: 48px;
    height: 48px;
    font-size: 30px;
    line-height: 48px;
  }
}
</style>
