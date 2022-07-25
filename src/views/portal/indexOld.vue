<template>
  <div>
    <div class="btn-toolbar">
      <el-link :underline="false" type="info" class="toolbar-item"
        >取消</el-link
      >
      <el-link :underline="false" class="toolbar-item">暂存</el-link>
      <el-link
        :underline="false"
        type="primary"
        class="toolbar-item"
        @click="preview()"
        v-text="isPreview ? '取消预览' : '预览'"
      ></el-link>
      <el-button
        type="primary"
        size="mini"
        class="toolbar-item"
        @click="complete()"
        >完成</el-button
      >
    </div>

    <div class="con-box">
      <el-container :class="isPreview ? 'preview-con' : ''">
        <el-aside class="aside-left">
          <div class="layout-box" id="workSpace">
            <canvas class="canvasBg" id="canvasBg"  />
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
              :layout="layout"
              :col-num="12"
              :row-height="20"
              :is-draggable="gridLayoutSet.draggable"
              :is-resizable="gridLayoutSet.resizable"
              :vertical-compact="true"
              :margin="[5, 5]"
              :use-css-transforms="true"
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
                @resize="resizeEvent"
                @move="moveEvent"
                @resized="resizedEvent"
                @moved="movedEvent"
              >
                <i
                  @click="deleteporl(item)"
                  class="deleteIem el-icon-delete"
                ></i>
                <div style="height: 100%">
                  <iframe
                    ref="iframe"
                    scrolling="no"
                    width="100%"
                    height="100%"
                    :src="item.contain_link"
                    style="border:0"
                  ></iframe>
                </div>
              </grid-item>
            </grid-layout>
          </div>
        </el-aside>
        <el-aside class="aside-right">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item name="1">
              <template slot="title">
                <span class="collapse-title">系统组件</span>
              </template>
              <div v-for="o in listContain" :key="o.recid">
                <el-popover placement="right" width="400" trigger="hover">
                  <iframe
                    ref="iframe"
                    scrolling="no"
                    width="100%"
                    height="100%"
                    style="border:0"
                    :src="o.contain_link"
                  ></iframe>
                  <div
                    slot="reference"
                    @click="addprotal(o)"
                    v-text="o.contain_name"
                    class="el-icon-setting listContain_item"
                  ></div>
                </el-popover>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-aside>
      </el-container>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueGridLayout from "vue-grid-layout";
import DiyTitle from "@components/DiyTitle/index";
import {
  getpubliccontainbyfilter,
  addContain,
  getallcontain,
  updateContain,
  deleteContain,
} from "@api/home";

Vue.use(VueGridLayout);

var testLayout = [];

var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;

export default {
  name: "Layout",
  components: {
    GridLayout,
    GridItem,
    DiyTitle,
  },
  data() {
    return {
      i: 0,
      listContain: [],
      layout: testLayout,
      newX: 0,
      newY: 0,
      portalid: "694567114580692992",
      canvasBg: {
        hig: 120,
      },
      gridLayoutSet: {
        draggable: true,
        resizable: true,
      },
      screenWidth: document.body.clientWidth,
      screenHig: document.body.clientHeight,
      isPreview: false,
      activeName: "1",
    };
  },
  watch: {
    screenWidth(v, o) {
      //监控浏览器变化
      if (v != o) {
        this.getCanvasBg();
      }
    },
  },
  mounted() {
    let that = this;
    //屏幕改变触发
    window.onresize = () => {
      return (() => {
        that.screenWidth = document.body.clientWidth;
        that.screenHig = document.body.clientHeight;
      })();
    };
    that.loadlistData();
    that.initprotalResult();
    that.getCanvasBg();
  },
  methods: {
    //监听div高度变化
    watchDivHig(id) {
      let hig = document.getElementById(id).clientHeight;
      if (hig > this.screenHig - 150) {
        this.getCanvasBg();
      }
    },
    //预览
    preview() {
      this.isPreview = !this.isPreview;
      this.gridLayoutSet.draggable = !this.gridLayoutSet.draggable;
      this.gridLayoutSet.resizable = !this.gridLayoutSet.resizable;
    },
    //完成
    complete() {
      this.$router.push("/home");
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
      let w = (panelWidth - 50) / 6;
      let hig = this.canvasBg.hig;
      for (let h = panelHeight, j = 0; h > hig; h -= hig, j++) {
        for (let i = 0; i < 6; i++) {
          this.drowJux(context, i * (w + 10), j * (hig + 10), w, hig);
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
    initprotalResult() {
      let params = {
        filtertext: "",
        portalid: this.portalid,
      };
      let that = this;
      getallcontain(params).then((res) => {
        that.layout = res.data.data;
      });
      this.watchDivHig("workSpace");
    },
    addprotal(o) {
      var k = this.i + 1;
      this.i = k;
      var obj = {
        x: 0,
        y: 0,
        w: parseInt(o.width),
        h: parseInt(o.height),
        i: k,
        contain_name: o.contain_name,
        recid: o.recid,
        contain_link: o.contain_link,
        portal_id: this.portalid,
      };
      this.layout.push(obj);
      this.handleClick(obj);
    },
    deleteporl(o) {
      for (let i = 0; i < this.layout.length; i++) {
        if (this.layout[i].i == o.i) {
          this.deleteClick(this.layout[i]);
        }
      }
    },
    loadlistData() {
      let params = {
        current: 0,
        size: 100000,
      };
      getpubliccontainbyfilter(params).then((res) => {
        this.listContain = res.data.data;
      });
    },
    handleClick(params) {
      var obj = {};
      (obj.recid = params.recid),
        (obj.contain_name = params.contain_name),
        (obj.width = params.w),
        (obj.height = params.h),
        (obj.relate_width = params.x),
        (obj.relate_height = params.y),
        (obj.contain_link = params.contain_link),
        (obj.contain_type = params.contain_type),
        (obj.portal_id = this.portalid);

      let that = this;
      addContain(obj).then((res) => {
        that.initprotalResult();
      });
    },
    updateClick(params) {
      var paramsss = [];
      for (let i = 0; i < params.length; i++) {
        var obj = {};
        (obj.recid = params[i].recid),
          (obj.contain_name = params[i].contain_name),
          (obj.width = params[i].w),
          (obj.height = params[i].h),
          (obj.relate_width = params[i].x),
          (obj.relate_height = params[i].y),
          (obj.contain_link = params[i].contain_link),
          (obj.contain_type = params[i].contain_type),
          (obj.portal_id = this.portalid);
        paramsss.push(obj);
      }

      let that = this;
      updateContain(paramsss).then((res) => {
        that.initprotalResult();
      });
    },
    deleteClick(params) {
      let that = this;
      deleteContain(params).then((res) => {
        that.initprotalResult();
      });
    },
    layoutCreatedEvent: function(newLayout) {},
    layoutBeforeMountEvent: function(newLayout) {},
    layoutMountedEvent: function(newLayout) {},
    layoutReadyEvent: function(newLayout) {},
    layoutUpdatedEvent: function(newLayout) {
      this.layout = newLayout;

      this.updateClick(newLayout);
    },
    breakpointChangedEvent: function(newBreakpoint, newLayout){
        console.log("BREAKPOINT CHANGED breakpoint=", newBreakpoint, ", layout: ", newLayout );
    },
    moveEvent: function(i, newX, newY) {},
    resizeEvent: function(i, newH, newW, newHPx, newWPx) {},
    movedEvent: function(i, newX, newY) {},
    resizedEvent: function(i, newH, newW, newHPx, newWPx) {},
  },
};
</script>

<style lang="scss" scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.base-layout {
  position: relative;
  .btn-toolbar {
    margin-top: 10px;
    height: 56px;
    width: 100%;
    background-color: white;
    border-radius: 4px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .toolbar-item {
      margin-left: 25px;
    }
  }
}

.con-box {
  width: 100%;
  margin-top: 10px;
  .preview-con {
    .aside-left {
      width: 100% !important;
      margin-right: 0;
      .layout-box {
        .canvasBg {
          display: none;
        }
        .vue-grid-layout {
          .vue-grid-item {
            .deleteIem {
              display: none;
            }
          }
        }
      }
    }
    .aside-right {
      display: none;
    }
  }
  .aside-left {
    width: 79% !important;
    margin-right: 1%;
    border-radius: 4px;
    overflow: hidden;
    .layout-box {
      margin: -5px;
      position: relative;
      .canvasBg {
        position: absolute;
        left: 0;
        top: 0;
        margin: 5px;
        z-index: 0;
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
            &:hover {
              font-size: 15px;
              color: #f56c6c;
            }
          }
        }
      }
    }
  }
  .aside-right {
    width: 20% !important;
    background: #fff;
    padding: 10px;
    border-radius: 4px;
    .el-collapse {
      border-top: 0;
      .collapse-title {
        font-size: 12px;
        color: #909399;
      }
      .listContain_item {
        width: 100%;
        padding: 8px 0;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        &:before {
          margin: 0 10px;
        }
        &:hover {
          background: #f5f6fc;
        }
      }
    }
  }
}
</style>
