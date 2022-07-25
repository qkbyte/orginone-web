<template>
  <div class="base-layout" ref="base">
    <DiyBoxLayout>
      <div class="layout-content">
        <div class="layout-con" id="workSpace">
          <canvas class="canvasBg" id="canvasBg" />
          <!-- layout 网格初始化布局
             col  网格多少列
             row  一行的高度
            // is-dragg 网格是否可以拖动
            // is-resizeble 网格是否可以改变带大小
            // use-css 是否使用css的tansforms来排版
            // created 布局创建事件
            // before-mount 布局安装以前事件
            // mounted 布局安装事件
            // ready 布局准备活动
            // updated 格子位置 大小更新
            // i 唯一值 （重复时设置会导致一块放大或缩小）string类型
            // resize 当元素被放大或缩小的事件
            // move 该元素移动时触发的事件
            // resize 放大缩小结束 触发事件 必须当大小相对上一次发生改变时结束才会触发
            // move 移动结束触发 只有当相对于上一次位置发生过改变时才会触发 -->
          <grid-layout
            ref="gridlayout"
            :layout="layout"
            :col-num="12"
            :row-height="20"
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
              :use-style-cursor="false"
              :isResizable="item.layoutType == 'fix' ? false : true"
              @resize="resizeEvent"
              @move="moveEvent"
              @resized="resizedEvent"
              @moved="movedEvent"
            >
              <span class="text">{{ item.i }}</span>
              <i @click="deleteporl(item)" class="deleteIem el-icon-delete"></i>
              <div style="height: 100%">
                <div
                  class="transparent"
                  ref="transparent"
                  v-show="transparentShow"
                ></div>
                <SandBox
                  :targetUrl="item.contain_link"
                  :sourceAppId="item.appId"
                ></SandBox>
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

        <div
          class="layout-menu"
          :style="MenuStyle"
          style="background: white"
          @mousedown="move"
        >
          <div class="layout-menu__head">组件列表</div>
          <div class="layout-menu-body__tree" v-show="listShow">
              <TheSearchInput
                placeholder="输入组件名"
                :filterText.sync="filterText"
              ></TheSearchInput>
              <div class="layout-menu-body__treeList" v-show="!searchShow">
                <el-collapse v-model="activeNames">
                  <el-collapse-item title="系统组件" name="1">
                    <div
                      class="tree"
                      @drag="drag"
                      @dragend="dragend(item)"
                      draggable="true"
                      unselectable="on"
                      @click="addprotal(item)"
                      v-for="item in componentList"
                      :key="item.recid"
                    >
                      <el-popover placement="right" width="400" trigger="hover">
                        <el-image :src="item.previewPic"></el-image>
                        <div
                          slot="reference"
                          class="el-icon-setting listContain_item"
                        >
                          {{ item.name }}
                        </div>
                      </el-popover>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="应用组件" name="2">
                    <div
                      class="tree"
                      @drag="drag"
                      @dragend="dragend(item)"
                      draggable="true"
                      unselectable="on"
                      @click="addAppProtal(item)"
                      v-for="item in appList"
                      :key="item.recid"
                    >
                      <el-popover placement="right" width="400" trigger="hover">
                        <el-image :src="item.previewPic"></el-image>
                        <div
                          slot="reference"
                          class="el-icon-setting listContain_item"
                        >
                          {{ item.name }}
                        </div>
                      </el-popover>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div v-show="searchShow" class="layout-menu-body__treeList">
                <div
                  class="tree"
                  @drag="drag"
                  @dragend="dragend(item)"
                  draggable="true"
                  unselectable="on"
                  @click="addAppProtal(item)"
                  v-for="item in searchList"
                  :key="item.recid"
                >
                  <el-popover placement="right" width="400" trigger="hover">
                    <el-image :src="item.previewPic"></el-image>
                    <div
                      slot="reference"
                      class="el-icon-setting listContain_item"
                    >
                      {{ item.name }}
                    </div>
                  </el-popover>
                </div>
              </div>
            </div>
          <div
            style="height:45px;border-top:1px solid #EBEEF5;margin-bottom:8px"
            class="flex-center"
          >
            <el-button
              type="text"
              style="width:100%;font-size:16px;padding-top:30px"
              @click="back"
              >返回</el-button
            >
            <div style="width:1px;height:100%;border:1px solid #eeeeee;margin-top:20px"></div>
            <el-button
              type="text"
              style="width:100%;font-size:16px;padding-top:30px"
              @click="handleSave"
              >保存</el-button
            >
          </div>
          <div
            class="layout-menu__btnTopLeft"
            v-show="menuBtnShow && BtnDirection == 'left'"
          ></div>
          <div
            class="layout-menu__btnBottomLeft"
            v-show="menuBtnShow && BtnDirection == 'left'"
          ></div>
          <div
            class="layout-menu__btnLeft flex-center"
            style="background:white"
            @click="handleMenuBtn"
            v-show="menuBtnShow && BtnDirection == 'left'"
          >
            <div
              class="el-icon-caret-right "
              :style="
                menuShow ? 'transform: rotate(180deg)' : 'transform: rotate(0)'
              "
            ></div>
          </div>
          <div
            class="layout-menu__btnTop"
            v-show="menuBtnShow && BtnDirection == 'right'"
          ></div>
          <div
            class="layout-menu__btnBottom"
            v-show="menuBtnShow && BtnDirection == 'right'"
          ></div>
          <div
            class="layout-menu__btnRight flex-center"
            style="background:white;"
            @click="handleMenuBtn"
            v-show="menuBtnShow && BtnDirection == 'right'"
          >
            <div
              class="el-icon-caret-left"
              :style="
                menuShow ? 'transform: rotate(180deg)' : 'transform: rotate(0)'
              "
            ></div>
          </div>
        </div>
      </div>
    </DiyBoxLayout>
    <template v-for="item in dialogShow">
      <TheSaveDialog
        v-if="item.key === 'save' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheSaveDialog>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import VueGridLayout from "vue-grid-layout";
import { mapState } from "vuex";
import {
  addContain,
  getallcontain,
} from "@api/home";
import {
  getMarketappcomponentList,
  marketapproledistributionnewGetAppIdByUserId,
  marketappcomponenttemplateSetDefault,
  marketappusertemplateSubmit,
  getMarketappcomponenttemplateGetUserTemplate,
  getDefaultTemplate,
  setDefaultTemplate,
} from "@api/portal";
import SandBox from "@/components/Sandbox/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheSearchInput from "./components/TheSearchInput";
import TheSaveDialog from "./components/HomeSaveDialog";
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
    TheSearchInput,
    TheSaveDialog,
    SandBox,
  },
  computed: {
    ...mapState("menu", ["menuState"]),
    ...mapState("user", ["userId"]),
    MenuStyle() {
      // 侧边栏隐藏
      let menu = "";
      if (this.menuShow && this.menuBtnShow) {
        if (this.BtnDirection == "right") {
          menu = "right:0px;transition: all 0.5s ease;box-shadow: -5px 10px 10px rgba(0,0,0,0.03);";
        } else {
          menu = "margin-left:0px;transition: all 0.5s ease;box-shadow: 5px 10px 10px rgba(0,0,0,0.03);";
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
  },
  data() {
    return {
      dialogShow: [
        {
          key: "save",
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
      pageSize: 20,
      activeNames: ["1"],
      defaultList: "", // 用户默认设置的模板
      userIdList: [],
      systemShow: false,
      transparentShow: false,
      searchShow: false, // 搜索时展示
      searchList: [], // 搜索列表
      // grid
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
    menuState(val){
      if(this.BtnDirection == 'right'){
        document.getElementsByClassName('layout-menu')[0].style.left = 'unset'
      }
    },
    layout: {
      handler(val) {},
      deep: true,
    },
    filterText: {
      handler(val) {
        if (this.listShow) {
          if (val) {
            this.searchShow = true;
            this.handleSearchList(val);
          } else {
            this.searchShow = false;
          }
        } else {
          if (val) {
            this.searchShow = true;
            this.handleSearchList(val);
          } else {
            this.searchShow = false;
          }
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
    screenWidth(v, o) {
      //监控浏览器变化
      if (v != o) {
        this.getCanvasBg();
      }
    },
  },
  async created() {
    // this.getUserUse()
  },
  mounted() {
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
    // this.initprotalResult();
    this.baseWdith = this.$refs.base.clientWidth / 2 - 100;
  },
  methods: {
    back(){
      this.$router.push({name:'home/homePortal'})
    },
    customTemplate(){
     this.$router.push({name:'home/homeComponent'})
    },
    handleSearchList(val) {
      if (this.listShow) {
        let params = {
          current: this.currentPage,
          name: val,
          size: this.pageSize,
        };
        getMarketappcomponentList(params).then((res) => {
          const { records } = res.data.data;
          let arr = [];
          records.forEach((el) => {
            if (el.appId !== -1) {
              if (this.userIdList.indexOf(el.appId) !== -1) {
                arr.push(el);
              }
            } else {
              arr.push(el);
            }
          });
          this.searchList = arr;
          console.log("sear0", this.searchList);
        });
      } else {
        // 搜索时执行   搜索模板
        let params = {
          current: this.currentPage,
          name: val,
          size: this.pageSize,
        };
        getMarketappcomponenttemplateGetUserTemplate(params).then((res) => {
          const { records } = res.data.data;
          this.searchList = records;
        });
      }
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
          this.drowJux(context, i * (w + 3.8) + 5, j * (hig + 3.8) + 5, w, hig -1);
        }
      }
    },
    //绘制矩形
    drowJux(context, left, top, w, h) {
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

    handleDefault(data, index) {
      // 点击设为首页
      let params = {
        userId: this.userId,
        templateId: data.id,
      };
      setDefaultTemplate(params).then((res) => {
        this.getDefaultList();
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
    handleCloseDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
        }
      });
    },
    gotoPortalMent() {
      this.$router.push({ name: "portalMement" });
    },
    move(e) {
      if (e.target.className == "layout-menu") {
        this.transparentShow = true;
        // 判断是否为按钮
        this.menuBtnMove = true;
        let odiv = e.target; //获取目标元素
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft;
        odiv.style.left = e.clientX - disX + "px";
        document.onmousemove = (e) => {
          //鼠标按下并移动的事件
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX;
          //绑定元素位置到positionX和positionY上面
          this.positionX = top;
          this.positionY = left;
          // //移动当前元素
          odiv.style.left = left + "px";
        };
        document.onmouseup = (e) => {
          let left = e.clientX - disX;
          if (left > this.baseWdith) {
            odiv.style.left = this.$refs.base.clientWidth - 400 + "px";
            this.BtnDirection = "right";
          } else {
            odiv.style.left = 0 + "px";
            this.BtnDirection = "left";
          }
          this.transparentShow = false;
          this.menuBtnMove = false;
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    },
    addprotalTemplate(data) {
      // 点击模板事件
      var config = JSON.parse(data.config);
      this.layout = config;
    },
    addprotal(data) {
      // 点击组件事件
      let list = JSON.parse(JSON.stringify(data));
      let config = JSON.parse(list.layoutConfig);
      if (this.layout.length !== 0) {
        this.uniqueGrid = this.layout[this.layout.length - 1].i;
      }
      // 点击侧边栏
      this.uniqueGrid += 1;
      var obj = {
        x: 0,
        y: 0,
        w: parseInt(config.width),
        h: parseInt(config.height),
        i: this.uniqueGrid,
        contain_name: list.name,
        recid: list.id,
        contain_link: list.url,
        portal_id: this.portalid,
        layoutType: list.layoutType,
        source: list.source,
      };
      this.layout.push(obj);
    },
    addAppProtal(data) {
      // 点击应用组件事件
      let list = JSON.parse(JSON.stringify(data));
      let config = JSON.parse(list.layoutConfig);
      // 点击侧边栏
      this.uniqueGrid += 1;
      var obj = {
        x: 0,
        y: 0,
        w: parseInt(config.width),
        h: parseInt(config.height),
        i: this.uniqueGrid,
        contain_name: list.name,
        recid: list.id,
        contain_link: list.url,
        portal_id: this.portalid,
        layoutType: list.layoutType,
        source: list.source,
      };
      this.layout.push(obj);
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
    loadUserTemplate(val, str) {
      // 自定义模板
      let params = {
        current: this.currentPage,
        size: this.pageSize,
      };
      getMarketappcomponenttemplateGetUserTemplate(params).then((res) => {
        const { records } = res.data.data;
        let arr = [];
        records.forEach((el) => {
          if (el.status == 1) {
            arr.push(el);
          }
        });
        this.customList = arr;
        this.getDefaultList();
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
            if ( el.appId === -1 && el.status == 1) {
              arr.push(el);
            }
          });
        }
        console.log('arr', arr);
        this.componentList = arr;
        this.appList = arrList;
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
    deleteporl(o) {
      for (let i = 0; i < this.layout.length; i++) {
        if (this.layout[i].i == o.i) {
          this.layout.splice(i, 1);
        }
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
    resizeEvent: function(i, newH, newW, newHPx, newWPx, item) {},
    movedEvent: function(i, newX, newY) {
      // console.log('结束移动');
    },
    resizedEvent: function(i, newH, newW, newHPx, newWPx) {
      // this.updateClick(i, newH, newW)
    },
  },
};
</script>

<style lang="scss" scoped>
.defaultClick{
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
.diy-table-layout {
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
    &__head {
      text-align: center;
      font-size: 18px;
      border-bottom: 1px solid #eeeeee;
      padding-bottom: 20px;
      cursor: auto;
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
      box-shadow: 4px 5px 10px rgba(0,0,0,0.04);
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
      box-shadow: -4px 5px 10px rgba(0,0,0,0.04);
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
  min-height: calc(100vh - 150px);
  z-index: 1;
  .vue-grid-item {
    position: absolute;
    width: 1000px;
    padding: 10px;
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
  padding: 5px 0;
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
</style>
