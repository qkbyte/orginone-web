<template>
  <div id="app">
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
import { getTodoNumber } from "./api/acttodo.js";
import "element-ui/lib/theme-chalk/display.css";
export default {
  name: "app",
  data() {
    return {
      todoNumIndex: "",
    };
  },
  created() {
    localStorage.setItem("setValApp", 0);
    localStorage.setItem("GD", 0);
  },
  mounted() {
    console.log(">>>>挂载");
    window.addEventListener("visibilitychange", (e) =>
      this.visiBilityChangeHandler(e)
    );
    window.addEventListener("message", (e) => {
      try {
        if (e.data.data.msg === "返回首页") {
          this.$router.push({
            path: "/",
          });
        }
        if (e.data.data.msg === "确认成功") {
          setTimeout(() => {
            getTodoNumber().then((res) => {
              this.todoNumIndex = res.data;
              this.$store.dispatch("changeMutation", this.todoNumIndex);
            });
          }, 2000);
        }
        if (e.data.data.msg === "success") {
          setTimeout(() => {
            getTodoNumber().then((res) => {
              this.todoNumIndex = res.data;
              this.$store.dispatch("changeMutation", this.todoNumIndex);
            });
          }, 300);
          if (localStorage.getItem("setValApp") === "1") {
            setTimeout(() => {
              this.$router.replace({
                path: "/acttodo",
              });
            }, 300);
          }else if(localStorage.getItem("setValApp") === "0" && localStorage.getItem("GD") === "1"){
             setTimeout(() => {
              this.$router.replace({
                path: "/acttodo",
              });
            }, 300);
          }else if (localStorage.getItem("setValApp") === "0" && localStorage.getItem("GD") === "0") {
            setTimeout(() => {
              this.$router.replace({
                path: "/",
              });
            }, 300);
          } else if (localStorage.getItem("setValApp") === "2") {
            this.$router.go(-1);
          }
        }
      } catch (e) {}
    });
  },
  destroyed() {
    console.log(">>>>>destoyed");
    window.removeEventListener("visibilitychange", (e) =>
      this.visiBilityChangeHandler(e)
    );
  },
  methods: {
    visiBilityChangeHandler(e) {
      console.log("界面显示监听事件", document.hidden);
      if (!document.hidden) {
        this.$store.commit("setNotRefresh", true);
      } else {
        this.$store.commit("setNotRefresh", false);
      }
    },
  },
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.el-loading-mask {
  z-index: 1500 !important;
}
</style>
<style lang="scss">
@import "@styles/common.scss";
.el-tree-node:focus > .el-tree-node__content {
  @include background_color("background_color11");
}
.el-tree-node__content:hover {
  @include background_color("background_color12");
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  @include background_color("background_color11");
}
.btn-add,
.el-dialog .el-button--primary,
.box .el-button--primary {
  @include background_color("background_color13");
  border: unset;
}
.el-button--text {
  @include font_color("font_color7");
}
.el-icon-view {
  @include font_color("font_color7");
}
//element UI框架el-table表格不兼容safari浏览器，因此表头thead和表体tbody存在错位问题。
.el-table__body {
  width: 100%;
  // 使表格兼容safari，不错位
  table-layout: fixed !important;
}
</style>
