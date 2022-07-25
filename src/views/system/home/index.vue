<template>
  <div class="base-layout" ref="base">
    <DiyBoxLayout>
      <div class="layout-content">
        <div class="layout-con" id="workSpace">
          <grid-layout
            ref="gridlayout"
            :layout="layout"
            :col-num="12"
            :row-height="27.5"
            :is-draggable="gridLayoutSet.draggable"
            :is-resizable="gridLayoutSet.resizable"
            :vertical-compact="true"
            :margin="[4, 4]"
            :use-css-transforms="true"
            :use-style-cursor="false"
            @layout-created="layoutCreatedEvent"
            @layout-before-mount="layoutBeforeMountEvent"
            @layout-mounted="layoutMountedEvent"
            @layout-ready="layoutReadyEvent"
            @layout-updated="layoutUpdatedEvent"
            @breakpoint-changed="breakpointChangedEvent"
          >
            <grid-item
              v-for="item in layout"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :key="item.i"
              :static="menuListShow ? true : false"
              :use-style-cursor="false"
              :isResizable="item.layoutType == 'fix' ? false : true"
              @resize="resizeEvent"
              @move="moveEvent"
              @resized="resizedEvent(...arguments, item)"
              @moved="movedEvent"
            >
              <span class="text">{{ item.i }}</span>
              <i
                @click="deleteporl(item)"
                v-if="!menuListShow"
                class="deleteIem el-icon-delete"
              ></i>
              <div style="height: 100%">
                <div
                  class="transparent"
                  ref="transparent"
                  v-show="transparentShow"
                ></div>
                <SandBox
                  v-if="item.type == 1"
                  :targetUrl="item.contain_link"
                  :sourceAppId="item.appId"
                ></SandBox>
                <div v-else style="height:100%">
                  <div style="height:100%">
                    <DiyTemplate :containLink="item.contain_link"></DiyTemplate>
                  </div>
                </div>
                <!-- <iframe
                  ref="iframe"
                  scrolling="no"
                  width="100%"
                  height="100%"
                  :src="item.contain_link"
                  style="border: 0"
                ></iframe> -->
              </div>
            </grid-item>
          </grid-layout>
        </div>
      </div>
    </DiyBoxLayout>
    <template v-for="item in dialogShow">
      <ThePasswordDialog
        v-if="item.key == 'password'"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="closeDialog"
      >
      </ThePasswordDialog>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import VueGridLayout from "vue-grid-layout";
import { mapState } from "vuex";
import { addContain, getallcontain } from "@api/home";
import {
  getMarketappcomponentList,
  marketapproledistributionnewGetAppIdByUserId,
  marketappcomponenttemplateSetDefault,
  getMarketappcomponenttemplateGetUserTemplate,
  marketappcomponenttemplateRemove,
  getDefaultTemplate,
} from "@api/portal";
import SandBox from "@/components/Sandbox/index";
import DiyTemplate from "@/components/DiyTemplate/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import ThePasswordDialog from "./components/ThePasswordDialog";
import Template from "../../portal/components/Template.vue";
Vue.use(VueGridLayout);
var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;
let mouseXY = { x: null, y: null };
let DragPos = { x: null, y: null, w: 1, h: 1, i: null };
export default {
  name: "Layout",
  components: {
    GridLayout,
    GridItem,
    DiyBoxLayout,
    SandBox,
    DiyTemplate,
    ThePasswordDialog,
  },
  computed: {
    ...mapState("menu", ["menuState"]),
    ...mapState("user", ["userId"]),
    MenuStyle() {
      // 侧边栏隐藏
      let menu = "";
      if (this.menuShow && this.menuBtnShow) {
        if (this.BtnDirection == "right") {
          menu =
            "right:0px;transition: all 0.5s ease;box-shadow: -5px 10px 10px rgba(0,0,0,0.03);";
        } else {
          menu =
            "margin-left:0px;transition: all 0.5s ease;box-shadow: 5px 10px 10px rgba(0,0,0,0.03);";
        }
      } else if (this.menuShow && !this.menuBtnShow) {
        //移动时
        menu = "width:200px;margin-left:0px;";
      } else {
        // 关闭
        if (this.BtnDirection == "right") {
          menu = "right:-205px;transition: all 0.5s ease;left:unset;";
        } else {
          menu = "transition: all 0.5s ease;margin-left:-205px";
        }
      }
      return menu;
    },
    CustomDataIsDefault() {
      for (let i = 0; i < this.customList.length; i++) {
        if (this.customList[i].isDefault == 1) {
          return this.customList[i].id;
        }
      }
      return false;
    },
    defaultOnClick() {
      if (this.systemIndex === false && this.customIndex === false) {
        return false;
      } else {
        return true;
      }
    },
  },
  data() {
    return {
      dialogShow: [
        {
          key: "save",
          value: false,
        },
        {
          key: "password",
          value: false,
        },
      ],
      menuShow: true,
      menuBtnShow: true,
      menuBtnMove: false,
      BtnDirection: "right",
      baseWdith: 0,
      uniqueGrid: 0,
      filterText: "", // 搜索
      listShow: true, // 控制组件与模板列表的展示
      componentList: [], // 组件列表
      appList: [], // 应用列表
      templateList: [], // 系统模板列表
      customList: [], // 自定义模板列表
      allTemplateList: [],
      userUse: "", // 用户正在使用的模板
      currentPage: 1,
      pageSize: 9999999,
      activeNames: ["1", "2"],
      defaultList: "", // 用户默认设置的模板
      userIdList: [],
      systemShow: false,
      transparentShow: false,
      searchShow: false, // 搜索时展示
      searchList: [], // 搜索列表
      templateData: [], // 用户点击模板的数据
      systemIndex: false, // 系统组件index
      customIndex: false, // 自定义组件index
      menuListShow: true, // 控制自定义模板的显示
      // grid
      layoutI: "",
      screenWidth: document.body.clientWidth,
      screenHig: document.body.clientHeight,
      menuHidden: false,
      isPreview: false,
      gridLayoutSet: {
        draggable: true,
        resizable: true,
      },
      layout: [],
      portalid: "694567114580692992",
      canvasBg: {
        hig: 120,
      },
    };
  },
  watch: {
    menuState(val) {
      if (this.BtnDirection == "right") {
        document.getElementsByClassName("layout-menu")[0].style.left = "unset";
      }
    },
    layout: {
      handler(val) {
        // console.log('val',val);
      },
      deep: true,
    },
    filterText: {
      handler(val) {
        if (val) {
          this.searchShow = true;
          this.handleSearchList(val);
        } else {
          this.searchShow = false;
        }
      },
      deep: true,
    },
    menuBtnMove(val) {
      if (val) {
        this.menuBtnShow = false;
      } else {
        this.menuBtnShow = true;
      }
    },
  },
  async created() {
    // 判断用户密码是否为弱密码
    this.handleUserPassword();
    let href = window.location.href
    if(href.substring(0,13) == '59.202.38.125'){
      localStorage.setItem("ISINNER", true);
    }
  },
  mounted() {
    document.getElementsByClassName("main-box")[0].style.padding = 0 + "px";
    this.getCanvasBg();
    this.loadAppId(); // 获取该用户的应用id
    this.loadTemplateData(); // 加载模板
    document.addEventListener(
      "dragover",
      function(e) {
        mouseXY.x = e.clientX;
        mouseXY.y = e.clientY;
      },
      false
    );
    this.baseWdith = this.$refs.base.clientWidth / 2 - 100;
  },
  methods: {
    closeDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key == key) {
          el.value = false;
        }
      });
    },
    handleUserPassword() {
      let bool = localStorage.getItem("PASSWORD_JUDGE");
      if (bool == "true") {
        this.dialogShow.map((el) => {
          if (el.key == "password") {
            el.value = true;
          }
        });
      }
    },
    handleDeleteCustomList(data) {
      // 删除自定义模板
      this.$confirm("此操作将永久删除该模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            ids: data.id,
          };
          marketappcomponenttemplateRemove([data.id]).then((res) => {
            this.$message.success("删除成功");
            this.loadUserTemplate();
          });
        })
        .catch(() => {
          return;
        });
    },
    deleteporl(o) {
      for (let i = 0; i < this.layout.length; i++) {
        if (this.layout[i].i == o.i) {
          this.layout.splice(i, 1);
        }
      }
    },
    customTemplate() {
      this.menuListShow = false;
    },
    //监听div高度变化
    watchDivHig(id) {
      let hig = document.getElementById(id).clientHeight;
      if (hig > this.screenHig - 150) {
        this.getCanvasBg();
      }
    },
    //绘制canvas背景
    getCanvasBg() {
      //获取canvas元素
      let workSpace = document.getElementById("workSpace");
      let panelWidth = workSpace.clientWidth - 12,
        panelHeight = workSpace.clientHeight - 12;
      let canvas = document.getElementById("canvasBg");
      if (canvas == null) return false;
      canvas.width = panelWidth;
      canvas.height = panelHeight;
      //获取上下文
      let context = canvas.getContext("2d");
      let w = (panelWidth - 50) / 12;
      let hig = this.canvasBg.hig;
      for (let h = panelHeight, j = 0; h > hig; h -= hig, j++) {
        for (let i = 0; i < 12; i++) {
          this.drowJux(
            context,
            i * (w + 3.8) + 5,
            j * (hig + 3.8) + 5,
            w,
            hig - 1
          );
        }
      }
    },
    //绘制矩形
    drowJux(context, left, top, w, h) {
      console.log("top", top, w, h);
      //设定图形边框的样式
      context.strokeStyle = "#E0E5F3";
      //指定线宽
      context.lineWidth = 1;
      context.strokeRect(left, top, w, h);
    },
    loadAppId() {
      let params = {
        userId: this.userId,
      };
      marketapproledistributionnewGetAppIdByUserId(params).then((res) => {
        this.userIdList = res.data.data;
        this.loadlistData();
      });
    },

    getDefaultList() {
      // 获取默认首页
      let params = {
        userId: this.userId,
      };
      getDefaultTemplate(params).then((res) => {
        this.defaultList = res.data.data;
        if (this.defaultList == "") {
          this.$nextTick(() => {
            this.templateList.forEach((el) => {
              if (el.isDefault == 1) {
                this.defaultList = el.id;
                this.getLayoutList(this.templateList);
              }
            });
          });
        } else {
          this.getLayoutList(this.allTemplateList, "default");
        }
      });
    },
    handleUserDefault(data) {
      let params = {
        id: data.id,
      };
      marketappcomponenttemplateSetDefault(params).then((res) => {
        this.loadUserTemplate();
      });
    },
    handleSave() {
      this.dialogShow.map((el) => {
        if (el.key === "save") {
          el.value = true;
          el.sendData = this.layout;
        }
      });
    },
    getLayoutList(list, val) {
      //加载页面时 渲染默认的组件
      if (val) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].id == this.defaultList) {
            let listData = list[i].config;
            this.layout = JSON.parse(listData);
          }
        }
      } else {
        for (let i = 0; i < list.length; i++) {
          if (list[i].isDefault == 1) {
            let listData = list[i].config;
            this.layout = JSON.parse(listData);
          }
        }
      }
    },
    loadUserTemplate(val, str) {
      // 自定义模板
      let params = {
        current: this.currentPage,
        size: this.pageSize,
      };
      getMarketappcomponenttemplateGetUserTemplate(params).then((res) => {
        const { records } = res.data.data;
        console.log("res", res);
        let arr = [];
        records.forEach((el) => {
          if (el.status == 1) {
            arr.push(el);
          }
        });
        this.customList = arr;
        if (str) {
          this.handleDefault(this.customList[this.customList.length - 1]);
        } else {
          this.getDefaultList();
        }
      });
    },
    loadlistData(val) {
      // 组件列表
      let params = {
        current: this.currentPage,
        size: this.pageSize,
      };
      getMarketappcomponentList(params).then((res) => {
        const { records } = res.data.data;
        let arrList = [];
        let arr = [];
        if (this.userIdList.length !== 0) {
          // 将与应用id相关的组件提取出来
          for (let i = 0; i < this.userIdList.length; i++) {
            arr = [];
            records.forEach((el) => {
              if (this.userIdList[i] == el.appId && el.status == 1) {
                arrList.push(el);
              } else if (el.appId === -1 && el.status == 1) {
                arr.push(el);
              }
            });
          }
        } else {
          records.forEach((el) => {
            if (el.appId === -1 && el.status == 1) {
              arr.push(el);
            }
          });
        }
        this.componentList = arr;
        this.appList = arrList;
      });
    },
    loadTemplateData(val, str) {
      // 模板列表
      let params = {
        current: this.currentPage,
        size: this.pageSize,
      };
      getMarketappcomponenttemplateGetUserTemplate(params).then((res) => {
        const { records } = res.data.data;
        this.allTemplateList = records;
        let arr = [];
        records.forEach((el) => {
          if (el.status == -1) {
            arr.push(el);
          }
        });
        this.templateList = arr;
        this.loadUserTemplate();
      });
    },

    handleMenuBtn() {
      this.menuShow = !this.menuShow;
    },
    drag: function(e) {
      let parentRect = document
        .getElementById("workSpace")
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (
        mouseInGrid === true &&
        this.layout.findIndex((item) => item.i === "drop") === -1
      ) {
        this.layout.push({
          x: (this.layout.length * 2) % (this.colNum || 12),
          y: this.layout.length + (this.colNum || 12), // puts it at the bottom
          w: 1,
          h: 1,
          i: "drop",
        });
      }
      let index = this.layout.findIndex((item) => item.i === "drop");
      if (index !== -1) {
        try {
          if (
            this.$refs.gridlayout.$children[
              this.layout.length
            ].$refs.item.getElementsByClassName("text")[0].innerHTML == "drop"
          ) {
            this.$refs.gridlayout.$children[
              this.layout.length
            ].$refs.item.style.display = "none";
          }
        } catch {}
        let el = this.$refs.gridlayout.$children[index];
        el.dragging = {
          top: mouseXY.y - parentRect.top,
          left: mouseXY.x - parentRect.left,
        };
        let new_pos = el.calcXY(
          mouseXY.y - parentRect.top,
          mouseXY.x - parentRect.left
        );
        if (mouseInGrid === true) {
          this.$refs.gridlayout.dragEvent(
            "dragstart",
            "drop",
            new_pos.x,
            new_pos.y,
            1,
            1
          );
          DragPos.i = String(index + 1);
          DragPos.x = this.layout[index].x;
          DragPos.y = this.layout[index].y;
        }
        if (mouseInGrid === false) {
          this.$refs.gridlayout.dragEvent(
            "dragend",
            "drop",
            new_pos.x,
            new_pos.y,
            1,
            1
          );
          this.layout = this.layout.filter((obj) => obj.i !== "drop");
        }
      }
    },
    dragend: function(e) {
      let parentRect = document
        .getElementById("workSpace")
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (mouseInGrid === true) {
        let list = JSON.parse(JSON.stringify(e));
        let config = JSON.parse(list.layoutConfig);
        this.layout.push({
          appId: list.appId,
          x: DragPos.x,
          y: DragPos.y,
          w: config.width,
          h: config.height,
          i: DragPos.i,
          contain_link: list.url,
          contain_name: list.name,
          portal_id: list.portal_id,
          recid: list.recid,
          layoutType: list.layoutType,
          source: list.source,
          type: list.type,
        });
        this.layout.splice(this.layout.length - 2, 1);
        this.$refs.gridlayout.dragEvent(
          "dragend",
          DragPos.i,
          DragPos.x,
          DragPos.y,
          1,
          1
        );
        try {
          this.$refs.gridLayout.$children[
            this.layout.length
          ].$refs.item.style.display = "block";
        } catch {}
      }
    },
    // GridLayout
    handleClick(params) {
      var obj = params;
      obj.portal_id = this.portal_id;
      addContain(obj).then((res) => {
        // 不知道什么用的接口
        this.initprotalResult();
      });
    },
    initprotalResult() {
      let params = {
        filtertext: "",
        portalid: this.portalid,
      };
      getallcontain(params).then((res) => {
        this.layout = res.data.data;
        (this.layout.x = 0),
          (this.layout.y = 0),
          (this.layout.width = 100),
          (this.layout.height = 100);
      });
      this.watchDivHig("workSpace");
    },
    watchDivHig(id) {
      // 监听高度变化
      let hig = document.getElementById(id).clientHeight;
    },
    updateClick(params) {
      // console.log('params', params);
    },

    layoutCreatedEvent: function(newLayout) {},
    layoutBeforeMountEvent: function(newLayout) {},
    layoutMountedEvent: function(newLayout) {},
    layoutReadyEvent: function(newLayout) {},
    layoutUpdatedEvent: function(newLayout) {
      this.layout = newLayout;
      // this.layout.forEach((el) => {
      //   if (el.i == this.layoutI) {
      //     if (el.h % 10 > 5) {
      //       el.h = el.h + (10 - (el.h % 10));
      //     } else if (el.h % 10 < 5 && el.h % 10 !== 0) {
      //       el.h = el.h + (5 - (el.h % 10));
      //     }
      //   }
      // });
      // this.updateClick(newLayout);
    },
    breakpointChangedEvent: function(newBreakpoint, newLayout) {
      console.log(
        "BREAKPOINT CHANGED breakpoint=",
        newBreakpoint,
        ", layout: ",
        newLayout
      );
    },
    moveEvent: function(i, newX, newY) {
      // console.log("MOVE i=" + i + ", X=" + newX + ", Y=" + newY);
    },
    resizeEvent: function(i, newH, newW, newHPx, newWPx) {
      // this.layoutI = i;
    },
    movedEvent: function(i, newX, newY) {
      // console.log('结束移动');
    },
    resizedEvent: function(i, newH, newW, newHPx, newWPx, item) {
      console.log("layout", this.layout);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
.templateText {
  width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-icon-delete {
  margin-right: 10px;
  margin-top: 5px;
}
.el-icon-delete:hover {
  color: rgb(80, 119, 226);
}
.defaultClick {
  background: rgb(236, 241, 252);
}
.transparent {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba($color: #000000, $alpha: 0);
  left: 0;
  top: 0;
}
.row {
  display: flex;
  flex-direction: row;
}
.row:hover {
  display: flex;
  flex-direction: row;
  background: rgb(245, 247, 250);
}
.diy-table-layout {
  background: rgba(238, 240, 244);
  padding: 0;
  margin: 0;
}
.layout {
  &-con {
    width: 100%;
    height: 100%;
  }
  &-content {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  &-shrinkage {
    width: 20px;
    height: 60px;
    border: 1px solid #a8a6a6;
    line-height: 60px;
    position: fixed;
    cursor: pointer;
  }
  &-menu {
    position: absolute;
    right: -200px;
    // left: 50%;
    top: 0;
    margin-left: 200px;
    width: 200px;
    height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    z-index: 99;
    // transition: all 0.5s ease;
    cursor: move;
    &__onClick {
      color: #154ad8;
      border: 1px solid #154ad8;
    }
    &__headTemplate {
      text-align: center;
      font-size: 18px;
      border-bottom: 1px solid #eeeeee;
      padding-bottom: 20px;
      cursor: auto;
    }
    &__head {
      text-align: center;
      font-size: 12px;
      border-bottom: 1px solid #eeeeee;
      padding-bottom: 20px;
      cursor: pointer;
      // display: flex;
      // flex-direction: column;
    }
    &__save {
      height: 80px;
      border: 1px solid #eee;
      text-align: center;
      cursor: pointer;
      line-height: 80px;
    }
    &__row {
      flex: 1;
      height: 1px;
      border: 1px solid #eee;
      display: flex;
      flex-direction: row;
    }
    &__left {
      width: 50%;
      text-align: center;
      line-height: 43px;
      cursor: pointer;
    }
    &__right {
      width: 50%;
      text-align: center;
      line-height: 43px;
      cursor: pointer;
    }
    &__btnTopLeft {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 46%;
      left: 100%;
      transform: translate(0, -50%);
      cursor: pointer;
      background-image: radial-gradient(
        20px at 20px 0px,
        rgba(255, 255, 255, 0) 50px,
        #fff 50px
      );
    }
    &__btnBottomLeft {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 54%;
      left: 100%;
      transform: translate(0, -45%);
      cursor: pointer;
      background-image: radial-gradient(
        20px at 20px 20px,
        rgba(255, 255, 255, 0) 50px,
        #fff 50px
      );
    }
    &__btnLeft {
      box-shadow: 4px 5px 10px rgba(0, 0, 0, 0.04);
      width: 20px;
      height: 80px;
      line-height: 50px;
      // border: 1px solid #9c9c9c;
      border-radius: 0px 20px 20px 0px;
      position: absolute;
      left: 100%;
      top: 50%;
      font-size: 20px;
      transform: translate(0, -50%);
      cursor: pointer;
    }
    &__btnTop {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 46%;
      right: 100%;
      transform: translate(0, -50%);
      cursor: pointer;
      background-image: radial-gradient(
        20px at 0px 0px,
        rgba(255, 255, 255, 0) 50px,
        #fff 50px
      );
    }
    &__btnBottom {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 54%;
      right: 100%;
      transform: translate(0, -45%);
      cursor: pointer;
      background-image: radial-gradient(
        20px at 0px 20px,
        rgba(255, 255, 255, 0) 50px,
        #fff 50px
      );
    }
    &__btnRight {
      box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.04);
      width: 20px;
      height: 80px;
      line-height: 50px;
      // border: 1px solid #9c9c9c;
      border-radius: 20px 0 0 20px;
      position: absolute;
      right: 100%;
      top: 50%;
      font-size: 20px;
      transform: translate(0, -50%);
      cursor: pointer;
    }
    &-body {
      display: flex;
      flex-direction: column;
      flex: 1;
      &__tree {
        display: flex;
        flex-direction: column;
        height: 1px;
        flex: 1;
        cursor: auto;
      }
      &__treeList {
        margin: 10px 0;
        height: 1px;
        flex: 1;
        overflow: auto;
        cursor: auto;
      }
      &__footer {
        border-top: 1px solid rgb(235, 238, 245);
        text-align: center;
        line-height: 100px;
        font-size: 16px;
        color: #154ad8;
        height: 100px;
        cursor: pointer;
      }
    }
  }
}
.vue-grid-layout {
  position: relative;
  @include background_color("background_color4");
  min-height: 100%;
  z-index: 1;
  .vue-grid-item {
    position: absolute;
    width: 1000px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 4px;
    border: 1px solid #efefef;
    .deleteIem {
      position: absolute;
      top: 1px;
      right: 1px;
      padding: 2px;
      background: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      color: #666;
      font-size: 14px;
      z-index: 99;
      &:hover {
        font-size: 15px;
        color: #f56c6c;
      }
    }
  }
}
.tree {
  cursor: pointer;
}
.canvasBg {
  background: rgb(242, 244, 249);
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.el-icon-caret-right {
  transition: all 0.5s ease;
}
.text {
  display: none;
  color: rgba(255, 255, 255, 1);
}
.el-icon-star-off {
  cursor: pointer;
}
.el-icon-star-off {
  cursor: pointer;
}
.el-icon-star-on {
  color: rgb(92, 182, 255);
}
// .vue-grid-item {
//   background: #e2e2e2;
// }
// el-container el-main{
//   height: 100%;
// }
// .layout {
//   height: 100%;
//   width: 100%;
//   .layout-toolbar {
//     margin-top: 10px;
//     height: 56px;
//     width: 100%;
//     background-color: white;
//     border-radius: 4px;
//     padding: 0 20px;
//     display: flex;
//     align-items: center;
//     justify-content: flex-end;
//     .toolbar-item {
//       margin-left: 25px;
//     }
//   }
//   .layout-content {
//     height: 700px;
//     background-color: white;
//     border-radius: 4px;
//     padding: 20px;
//     display: flex;
//     flex-wrap: nowrap;
//     .content-grid-layout {
//       flex: auto;
//       margin-right: 10px;
//     }
//     .content-menu {
//       width: 300px;
//     }
//   }
// }
// .border {
//   border: 1px solid gray;
// }
</style>
