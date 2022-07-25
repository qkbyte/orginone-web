<template>
  <div class="continer flex">
    <div class="apps">
      <div>
        <div v-if="backShow" class="el-icon-arrow-left" @click="back"></div>
        <span class="apps__title">{{ listName }}</span>
      </div>
      <div class="apps__list">
        <diyAppsList
          ref="diyApp"
          :appListData="handleAppData(applist)"
          @changeTitle="changeTitle"
        ></diyAppsList>
      </div>
    </div>
  </div>
</template>

<script>
import diyAppsList from "./TheAppsList";

export default {
  data() {
    return {
      backShow: false,
    };
  },
  components: { diyAppsList },
  props: {
    applist: {
      type: Array,
      default: () => [],
    },
    listName:{
      type: String,
      default:'常用应用'
    }
  },
  methods: {
    goMyapp() {
      this.$router.push({
        name: "my-app",
      });
    },
    back() {
      this.$refs.diyApp.isShow = false;
      this.backShow = false;
      this.listName = "常用应用";
    },
    changeTitle(data) {
      this.listName = data.name;
      this.backShow = true;
    },
    handleAppData(data) {
      let _this = this;
      function addProp(obj) {
        for (var i in obj) {
          _this.$set(obj[i], "showSubData", false);
          if (obj[i].children) {
            addProp(obj[i].children);
          }
        }
      }
      addProp(data);
      return data;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-icon-arrow-left {
  font-size: 20px;
  margin-right: 10px;
  cursor: pointer;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.continer {
  height: 100%;
  align-items: flex-start;
  background: rgba(255, 255, 255, 1);
  opacity: 1;
  border-radius: 4px;
  padding: 25px 27px 25px 22px;
  .apps {
    height: 100%;
    width: 100%;
    .apps__title {
      font-weight: 600;
      color: rgba(48, 49, 51, 1);
      font-size: 22px;
      opacity: 1;
    }
    .apps__list{
      height: 100%;
      overflow: hidden;
    }
    .editx {
      border-radius: 13px;
      border: 1px solid rgba(21, 74, 216, 0.5);
      color: #154ad8;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      padding: 4px 8px;
      cursor: pointer;
    }
  }
}
@media screen and (max-width: 1500px) {
  .continer {
    border-radius: 4px;
    padding: 16px 19px 16px 18px;
    .apps {
      .apps__title {
        font-size: 16px;
        opacity: 1;
      }
    }
  }
}
</style>
