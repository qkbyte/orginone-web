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
            :row-height="27.5"
            :is-draggable="gridLayoutSet.draggable"
            :is-resizable="gridLayoutSet.resizable"
            :vertical-compact="true"
            :margin="[5, 5]"
            :use-css-transforms="true"
            :useStyleCursor="false"
            @layout-created="layoutCreatedEvent"
            @layout-before-mount="layoutBeforeMountEvent"
            @layout-mounted="layoutMountedEvent"
            @layout-ready="layoutReadyEvent"
            @layout-updated="layoutUpdatedEvent"
            @breakpoint-changed="breakpointChangedEvent"
          >
            <grid-item
              ref="gridItem"
              v-for="item in layout"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :key="item.i"
              :use-style-cursor="false"
              :isResizable="item.layoutType == 'fix' ? false : true"
              @resize="resizeEvent(...arguments, item)"
              @move="moveEvent"
              @resized="resizedEvent"
              @moved="movedEvent"
            >
              <span class="text">{{ item.i }}</span>
              <i @click="deleteporl(item)" class="deleteIem el-icon-delete"></i>
              <div style="height: 100%;overflow:hidden">
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
              </div>
            </grid-item>
          </grid-layout>
        </div>

        <div
          class="layout-menu box"
          :style="MenuStyle"
          style="background:white"
          @mousedown="move"
        >
          <div v-show="listShow" class="layout-menu__head">系统模板</div>
          <div class="layout-menu-body">
            <!-- 模板组件 -->
            <div class="layout-menu-body__tree" v-show="listShow">
              <TheSearchInput
                placeholder="输入模板名称"
                :filterText.sync="filterText"
              ></TheSearchInput>
              <div class="layout-menu-body__treeList">
                <!-- <div class="templateManage" @click="gotoPortalMent">
                  <div
                    class="el-icon-setting listContain_item"
                    style="margin:5px 0px 0 0px;"
                  ></div>
                  模板管理
                </div> -->
                <div
                  class="tree"
                  @drag="drag"
                  @dragend="dragend(item)"
                  draggable="true"
                  unselectable="on"
                  @click="addprotalTemplate(item)"
                  v-for="(item, index) in templateList"
                  :class="item.isDefault == 1 ? 'defaultClick' : ''"
                  :key="item.id"
                >
                  <div class="row-speace" style="padding:10px 0">
                    <div class="row">
                      <div
                        title="设为默认"
                        class="el-icon-star-off"
                        style="margin-right:5px;margin-left:5px"
                        @click="handleDefault(item, index)"
                        :class="item.isDefault == 1 ? 'el-icon-star-on' : ''"
                      ></div>
                      <div>
                        {{ item.name }}
                      </div>
                    </div>
                    <div
                      class="el-icon-delete"
                      @click.stop="handleDelTemplate(item)"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 组件列表 -->
            <el-button
              v-show="!listShow"
              type="primary"
              icon="el-icon-s-check"
              @click="clearAll"
              >清空</el-button
            >
            <div class="layout-menu-body__tree" v-show="!listShow">
              <TheSearchInput
                placeholder="输入组件名"
                :filterText.sync="filterText"
              ></TheSearchInput>
              <div class="layout-menu-body__treeList">
                <div class="templateManage" @click="gotoPortalMent">
                  <div
                    class="el-icon-setting listContain_item"
                    style="margin:5px 0px 0 0px;"
                  ></div>
                  组件管理
                </div>
                <el-collapse v-model="activeNames">
                  <el-collapse-item title="系统组件" name="1">
                    <div
                      class="tree"
                      @drag="drag(item)"
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
                          class="row"
                          slot="reference"
                          style="padding:10px 0"
                        >
                          <div
                            class="el-icon-setting listContain_item"
                            style="margin:5px 5px 0 5px;"
                          ></div>
                          <div>
                            {{ item.name }}
                          </div>
                        </div>
                      </el-popover>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="应用组件" name="2">
                    <div
                      class="tree"
                      @drag="drag(item)"
                      @dragend="dragend(item)"
                      draggable="true"
                      unselectable="on"
                      @click="addprotal(item)"
                      v-for="item in appList"
                      :key="item.recid"
                    >
                      <el-popover placement="right" width="400" trigger="hover">
                        <el-image :src="item.previewPic"></el-image>
                        <div
                          class="row"
                          slot="reference"
                          style="padding:10px 0"
                        >
                          <div
                            class="el-icon-setting listContain_item"
                            style="margin:2px 5px 0 5px;"
                          ></div>
                          <div>
                            {{ item.name }}
                          </div>
                        </div>
                      </el-popover>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>

            <div
              v-show="listShow"
              class="layout-menu-body__footer"
              @click="changeMenu"
            >
              配置系统模板
            </div>
            <div
              v-show="!listShow"
              style="height:45px;border-top:1px solid #EBEEF5;margin-bottom:8px"
              class="flex-center"
            >
              <el-button
                type="text"
                style="width:100%;font-size:16px;padding-top:30px"
                @click="back"
                >返回</el-button
              >
              <div
                style="width:1px;height:100%;border:1px solid #eeeeee;margin-top:20px"
              ></div>
              <el-button
                type="text"
                style="width:100%;font-size:16px;padding-top:30px"
                @click="handleSave"
                >保存</el-button
              >
            </div>
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
import { addContain, getallcontain } from "@api/home";
import {
  getMarketappcomponentList,
  marketappcomponenttemplateSubmit,
  getMarketappcomponenttemplateGetUserTemplate,
  marketappcomponenttemplateSetDefault,
  marketappcomponenttemplateRemove,
} from "@api/portal";
import { mapGetters, mapState } from "vuex";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheSearchInput from "./components/TheSearchInput";
import TheSaveDialog from "./components/SaveDialog";
import SandBox from "@/components/Sandbox/index";
import DiyTemplate from "@/components/DiyTemplate/index";
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
    DiyTemplate,
  },
  computed: {
    ...mapState("user", ["userId"]),
    ...mapState("menu", ["menuState"]),
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
      templateList: [], // 模板列表
      currentPage: 1,
      pageSize: 9999999,
      transparentShow: false,
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
      activeNames: ["1", "2"],
      appList: [],
    };
  },
  watch: {
    menuState(val) {
      if (this.BtnDirection == "right") {
        document.getElementsByClassName("layout-menu")[0].style.left = "unset";
      }
    },
    layout: {
      handler(val) {},
      deep: true,
    },
    filterText: {
      handler(val) {
        if (!this.listShow) {
          this.loadlistData(val);
        } else {
          this.loadTemplateData(val);
        }
      },
      deep: true,
    },
    listShow(val) {
      this.loadlistData();
    },
    menuBtnMove(val) {
      if (val) {
        this.menuBtnShow = false;
      } else {
        this.menuBtnShow = true;
      }
    },
  },
  mounted() {
    this.getCanvasBg();
    this.loadlistData(); // 加载组件
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
    back() {
      this.listShow = true;
    },
    clearAll() {
      this.layout = [];
    },
    //监听div高度变化
    watchDivHig(id) {
      let hig = document.getElementById(id).clientHeight;
      if (hig > this.screenHig - 150) {
        this.getCanvasBg();
      }
    },
    handleDelTemplate(item) {
      this.$confirm("此操作将删除该模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          marketappcomponenttemplateRemove([item.id]).then((res) => {
            this.$message.success("删除成功");
            this.loadTemplateData();
          });
        })
        .catch(() => {});
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
            j * (hig + 8) + 5,
            w,
            hig + 2
          );
        }
      }
    },
    //绘制矩形
    drowJux(context, left, top, w, h) {
      console.log("123-=", top, w, h);
      //设定图形边框的样式
      context.strokeStyle = "#E0E5F3";
      //指定线宽
      context.lineWidth = 1;
      context.strokeRect(left, top, w, h);
    },

    handleDefault(data, index) {
      let params = {
        id: data.id,
      };
      marketappcomponenttemplateSetDefault(params).then((res) => {
        this.loadTemplateData();
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
    cancelTemplate(data) {
      // 取消其他默认
      this.templateList.forEach((el) => {
        if (el.isDefault == 1 && data.id !== el.id) {
          let params = {
            id: el.id,
            isDefault: -1,
            config: el.config,
          };
          marketappcomponenttemplateSubmit(params).then((res) => {
            this.loadTemplateData();
          });
        }
      });
    },
    changeMenu() {
      this.listShow = false;
    },
    gotoPortalMent() {
      if (!this.listShow) {
        this.$router.push({ name: "portalMement" });
      } else {
        this.$router.push({ name: "TemplateMement" });
      }
    },
    move(e) {
      if (e.target.className == "layout-menu box") {
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
        appId: list.appId,
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
        type: list.type,
      };
      this.layout.push(obj);
    },
    getLayoutList() {
      //加载页面时 渲染默认的组件
      for (let i = 0; i < this.templateList.length; i++) {
        if (this.templateList[i].isDefault == 1) {
          let list = this.templateList[i].config;
          this.layout = JSON.parse(list);
        }
      }
    },
    loadlistData(val) {
      // 组件列表
      let params = {
        current: this.currentPage,
        name: val,
        size: this.pageSize,
      };
      getMarketappcomponentList(params).then((res) => {
        const { records } = res.data.data;
        let arr = [];
        let app = [];
        records.forEach((el) => {
          if (el.status == 1 && el.appId == -1) {
            arr.push(el);
          } else {
            app.push(el);
          }
        });
        this.componentList = arr;
        this.appList = app;
      });
    },
    loadTemplateData(val) {
      // 模板列表
      let params = {
        name: val,
        current: this.currentPage,
        size: this.pageSize,
      };
      getMarketappcomponenttemplateGetUserTemplate(params).then((res) => {
        const { records } = res.data.data;
        let arr = [];
        records.forEach((el) => {
          if (el.status == -1) {
            arr.push(el);
          }
        });
        this.templateList = arr;
        this.getLayoutList();
      });
    },
    handleMenuBtn() {
      this.menuShow = !this.menuShow;
    },
    drag: function(e) {
      let list = JSON.parse(JSON.stringify(e));
      let config = JSON.parse(list.layoutConfig);
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
          w: config.width,
          h: config.height,
          i: "drop",
        });
      }
      let index = this.layout.findIndex((item) => item.i === "drop");
      if (index !== -1) {
        try {
          this.$refs.gridlayout.$children[
            this.layout.length
          ].$refs.item.style.display = "none";
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
            config.height,
            config.width
          );
          DragPos.i = String(index);
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
        (mouseXY.y > parentRect.top && mouseXY.y < parentRect.bottom)
      ) {
        mouseInGrid = true;
      }
      if (mouseInGrid === true) {
        // alert(`Dropped element props:\n${JSON.stringify(DragPos, ['x', 'y', 'w', 'h'], 2)}`);
        // this.$refs.gridlayout.dragEvent('dragend', 'drop', DragPos.x, DragPos.y, 1, 1);
        // this.layout = this.layout.filter(obj => obj.i !== 'drop');
        // UNCOMMENT below if you want to add a grid-item
        let list = JSON.parse(JSON.stringify(e));
        let config = JSON.parse(list.layoutConfig);
        this.layout.push({
          appId: list.appId,
          x: DragPos.x,
          y: DragPos.y,
          w: config.width,
          h: config.height,
          i: DragPos.i + "drag",
          contain_link: list.url,
          contain_name: list.name,
          portal_id: list.portal_id,
          recid: list.recid,
          layoutType: list.layoutType,
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
      let hig = document.getElementById(id).clientHeight;
      if (hig > this.screenHig - 150) {
        this.getCanvasBg();
      }
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
    resizeEvent: function(i, newH, newW, newHPx, newWPx, item) {
      // this.$refs.gridItem[0].maxH = this.$refs.gridItem[0].h
      // console.log('this.$refs.gridItem', this.$refs.gridItem);
      // console.log('i',i,'newH', newH,'newW', newW,'newHPx', newHPx, 'newWPx', newWPx,item);
    },
    movedEvent: function(i, newX, newY) {
      // console.log('结束移动');
    },
    resizedEvent: function(i, newH, newW, newHPx, newWPx) {
      // this.updateClick(i, newH, newW)
      // this.layoutI = i;
    },
  },
};
</script>

<style lang="scss" scoped>
.row-speace {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .el-icon-delete {
    margin-right: 10px;
  }
  .el-icon-delete:hover {
    color: $theme-color;
  }
}
.row-speace:hover {
  background: rgb(245, 247, 250);
}
.templateManage {
  width: 100%;
  border-bottom: 1px solid #eeeeee;
  height: 40px;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  padding-right: 20px;
  color: $theme-color;
  cursor: pointer;
}
::v-deep .el-collapse {
  flex: 1;
  height: 1px;
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
    &__head {
      cursor: auto;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
    &__onClick {
      color: #154ad8;
      border: 1px solid #154ad8;
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
      }
      &__footer {
        border-top: 1px solid rgb(235, 238, 245);
        text-align: center;
        line-height: 53px;
        font-size: 16px;
        color: #154ad8;
        height: 53px;
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
