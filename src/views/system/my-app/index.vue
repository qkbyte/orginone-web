<template>
  <div style="overflow:auto">
    <div v-if="myAppList.length !== 0">
      <div class="main-con">
        <DiyApps
          v-if="menuList && menuList.length !== 0"
          :listName="usualTitle"
          :applist.sync="usualList"
          :editShow="editShow"
          @handleEditShow="handleEditShow"
        />
      </div>
      <div class="main-con">
        <DiyApps
          v-if="menuList && menuList.length !== 0"
          :listName="title"
          :applist="myAppList"
          :editShow="editShow"
        />
      </div>
    </div>
    <div v-else>
      <div class="no-app">
        <div class="no-app_img">
          <img src="@assets/no-app.svg" alt="" />
        </div>
        <div class="no-app_text">
          <div class="text-content" @click="goAppCenter">
            前往获取应用<i class="el-icon-right no-app-icon"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DiyApps from "@components/DiyAppBox/index";
import DiyTitle from "@components/DiyTitle/index";
import { mapState } from "vuex";
import { getUsedAppMenu } from "@api/user"
import Bus from "@utils/eventBus"
export default {
  components: {
    DiyApps,
    DiyTitle,
  },
  data() {
    return {
      usualTitle: "常用应用",
      title: "我的应用",
      editShow: false,
      myAppList: [],
      usualList: [],
    };
  },
  created() {
    this.loadData()
  },
  mounted() {
    this.menuList.map((el) => {
      if (el.type === "app") {
        this.myAppList.push(el);
      }
    });
    Bus.$on("handleRefresh", () => {
      this.loadData()
    });
    Bus.$on("updateAppListData", (data) => {
      this.usualList = data
      Bus.$emit("getUsualList", this.usualList)
    });
    
  },
  computed: {
    ...mapState("menu", ["menuList"]),
    ...mapState("user", ["userId"]),
  },
  methods: {
    // handleEdit() {
    //   this.editShow = !this.editShow
    // },
    handleEditShow() {
      this.editShow = !this.editShow;
    },
    loadData(){
      let params ={
        userId: this.userId
      }
      getUsedAppMenu(params).then((res)=>{
        this.usualList = res.data.data
        Bus.$emit("getUsualList", this.usualList)
      })
    },
    /**
     * 按钮操作
     */
    goAppCenter() {
      this.$router.push({
        name: "app-center",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-con {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
// .apps__btn {
//   position: absolute;
//   right: 35px;
//   top: 70px;
//   font-size: 16px;
//   line-height: 44px;
//   color: rgba(81, 81, 81, 1);
//   opacity: 1;
//   cursor: pointer;
// }
.no-app {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  font-weight: 600;
  padding: 30px;
  &_img {
    text-align: center;
  }
  img {
    width: 190px;
    height: 140px;
    margin-bottom: 30px;
  }
  &_text {
    display: flex;
    justify-content: center;
    .text-content {
      font-size: 15px;
      cursor: pointer;
    }
  }
  .text-content:hover {
    color: #154ad8;
  }
  .no-app-icon {
    font-weight: 800;
  }
}
</style>
