<template>
  <div ref="fullscreen" class="sandbox">
    <div
      v-if="fullScreen"
      @mouseenter="firstFull ? true : (fullScreenShow = true)"
      @mouseleave="firstFull ? true : (fullScreenShow = false)"
      @click="handleFullScreenToggle"
      class="full-screen flex-center"
    >
      <transition name="el-fade-in">
        <i v-show="fullScreenShow" class="el-icon-full-screen"></i
      ></transition>
    </div>
    <iframe
      v-if="redirecturl"
      id="myIframe"
      class="iframe"
      ref="myIframe"
      allow="payment"
      allowfullscreen="true"
      :src="redirecturl"
      width="100%"
      height="100%"
      frameborder="0"
    ></iframe>
    <template v-for="item in dialogShow">
      <TheMessageDialog
        v-if="item.key === 'view' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeEdit="handleCloseDialog"
      ></TheMessageDialog>
    </template>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { getGroupIdByAppId } from "@api/sandbox";
async function launchFullscreen(element) {
  if (!element) {
    element = document.documentElement;
  }
  if (element.requestFullscreen) {
    await element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    await element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    await element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    await element.msRequestFullscreen();
  }
}
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
export default {
  data() {
    return {
      redirecturl: "",
      isFullScreen: false,
      firstFull: true,
      fullScreen: false,
      fullScreenShow: true,
      dialogShow: [
        {
          value: false,
          key: "view",
        },
      ],
    };
  },
  props: {
    targetUrl: {
      type: String,
      default: () => "",
    },
    sourceAppId: {
      type: [String, Number],
      default: () => "",
    },
  },
  watch: {
    targetUrl(n, o) {
      this.initData();
    },
  },
  // components: {
  //   TheMessageDialog,
  // },
  created() {
    this.initData();
  },
  mounted() {
    //父页面监听第三方应用
    window.name = `${this.name}`;
    let handler = (event) => {
      const message = event.data;
      console.log("message", message, this.sourceAppId);
      if (
        message &&
        (message.type === "APP_INIT" ||
          message.appId === this.sourceAppId ||
          message.appId === "admin") &&
        message.type
      ) {
        this.data = message;
        this.sendMessage(message.type, message.data, message.checkCode);
      } else {
      }
    };
    window.addEventListener("message", handler);
    this.$once("hook:beforeDestroy", (e) => {
      window.removeEventListener("message", handler);
    });
  },
  computed: {
    ...mapState("menu", ["openMenu"]),
    ...mapState("user", ["userId", "userName", "roleId"]),
    ...mapGetters("menu", ["openUrl"]),
    ...mapState("tenant", ["unitTheme"]),
  },
  methods: {
    ...mapActions("menu", ["changeMenu"]),
    initData() {
      let token = localStorage.getItem("ZCY_TOKEN");
      let redirecturl = "";
      this.redirecturl = "";
      if (this.targetUrl.indexOf("?") != -1) {
        redirecturl =
          this.targetUrl +
          "&userId=" +
          encodeURIComponent(this.userId) +"&tankuang=acttodoDBTK"+
          "&__t__=" +
          new Date().getTime();
      } else {
        redirecturl =
          this.targetUrl +
          "?userId=" +
          encodeURIComponent(this.userId)+"&tankuang=acttodoDBTK"+
          "&__t__=" 
          new Date().getTime();
      }
      this.redirecturl = redirecturl;
    },
    async goItem(item) {
      console.log("item", item);
      const { todoappid, pcformlink } = item;
      if (todoappid === "0") {
        let url = pcformlink;
        if (url.indexOf("?") == -1) {
          this.$router.push({
            path: url,
          });
        } else {
          let obj = {};
          let link = url.split("?")[0];
          let array = url.split("?")[1].split("&");
          array.forEach((item) => {
            obj[item.split("=")[0]] = item.split("=")[1];
          });
          this.$router.push({
            path: link,
            query: obj,
          });
        }
      } else {
        let menu = {
          id: -1,
          appId: todoappid,
          url: pcformlink,
          type: "app",
        };
        this.changeMenu(menu);
      }
    },
    // handleDialog(item) {
    //   this.dialogShow.map((el) => {
    //     if (el.key == item.dialog) {
    //       el.value = true;
    //       el.sendData = item;
    //     }
    //   });
    // },
    async sendMessage(type, data, checkCode) {
      var res = {
        data: {}, //数据
        from: "HOST", //数据发送源
        to: this.targetUrl, //数据接收源
        code: "200",
        success: true,
        msg: "发送成功",
        type, //当前广播类型
        checkCode, //时间戳
        verifyCode: "", //安全性验证
      };
      switch (type) {
        case "GET_THEME":
          res.data = {
            theme: this.unitTheme,
          };
          break;
        case "APP_INIT":
          if (data == "admin") {
            res.data = "admin";
          } else {
            res.data = this.sourceAppId;
          }
          console.log("res", res);
          break;
        case "OPEN_MENU":
          let listData = {};
          if (typeof data.appId !== "undefined") {
            listData = {
              todoappid: data.appId,
              pcformlink: data.pcformlink,
            };
          } else {
            listData = {
              todoappid: this.data.appId,
              pcformlink: data.pcformlink,
            };
          }
          this.goItem(listData);
          break;
        // case "OPEN_DIALOG":
        //   this.handleDialog(data);
        //   break;
        case "GET_MENU":
          res.data = this.openMenu;
          // res.data = {
          //   id: -1,
          //   path: this.targetUrl,
          //   type: "platform",
          // };
          break;
        case "GET_USER":
          res.data = {
            userId: this.userId,
          };
          break;
        case "GET_USER_PHONE":
          res.data = {
            phone: this.userName.accountName,
          };
          break;
        case "GET_GROUP":
          let params = { appId: this.sourceAppId };
          let _res = res;
          await getGroupIdByAppId(params).then(
            (res) => {
              _res.data = {
                groupIds: res.data.data,
              };
            },
            (err) => {
              _res.success = false;
            }
          );
          break;
        case "OPEN_TAB":
          window.open(data, "_blank");
          break;
        case "OPEN_FULLSCREEN":
          launchFullscreen(this.$refs.fullscreen);
          this.fullScreen = true;
          this.isFullScreen = true;
          setTimeout(() => {
            this.firstFull = false;
            this.fullScreenShow = false;
          }, 5000);
          break;
        case "GO_HOME":
          this.changeMenu({
            id: -1,
            type: "platform",
            path: "/",
          });
          break;
        case "GO_TODO":
          if (data) {
            if (
              data == "1" ||
              data == "2" ||
              data == "3" ||
              data == "4" ||
              data == "5" ||
              data == "6"
            ) {
              this.$store.commit("changeSkipState", data);
            }
          }
          this.changeMenu({
            id: -1,
            type: "platform",
            path: "/acttodo",
          });
          break;
        case "GET_ROLEID":
          res.data = {
            role: this.roleId,
          };
          break;
        case "CLOSE_DIALOG":
          this.$emit("closeDialog");
          break;
        default:
          res.success = false;
          res.msg = "消息类型未定义";
          break;
      }
      this.$nextTick(() => {
        if (this.$refs.myIframe && this.$refs.myIframe.contentWindow) {
          const childIframe = this.$refs.myIframe.contentWindow;
          console.log("res", res);
          childIframe.postMessage(res, "*");
        }
      });
    },
    handleFullScreenToggle() {
      if (this.isFullScreen) {
        exitFullscreen();
      } else {
        launchFullscreen(this.$refs.fullscreen);
      }
      this.isFullScreen = !this.isFullScreen;
    },
    // handleCloseDialog(key) {
    //   this.dialogShow.map((el) => {
    //     if (el.key === key) {
    //       el.value = false;
    //     }
    //   });
    // },
  },
};
</script>
<style lang="scss" scoped>
.sandbox {
  width: 100%;
  height: 100%;
  position: relative;

  .full-screen {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;

    i {
      font-size: 20px;
      color: rgb(255, 255, 255);
      text-shadow: 0px 0px 5px rgba($color: #000000, $alpha: 0.7);
    }
  }
}

::-webkit-scrollbar {
  width: 0px !important;
}
.iframe {
  overflow: hidden;
}
</style>
