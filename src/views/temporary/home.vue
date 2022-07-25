<template>
  <div>
    <div class="con-box">
      <div class="layout-box">
        <grid-layout
          :layout="layout"
          :auto-size="true"
          :col-num="12"
          :row-height="24"
          :max-rows="100"
          :is-draggable="gridLayoutSet.draggable"
          :is-resizable="gridLayoutSet.resizable"
          :vertical-compact="false"
          :margin="[8, 8]"
          :use-css-transforms="true"
        >
          <grid-item
            v-for="item in layout"
            :key="item.i"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            @resize="resizeEvent"
            @move="moveEvent"
            @resized="resizedEvent"
            @moved="movedEvent"
          >
            <div style="padding: 0px;height: 100%">
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
    </div>
    <div class="index-dialog">
      <el-dialog title="" :visible.sync="visible" width="30%">
        <span class="dialog-span">
          <div class="dialog-div">
            <img class="span-img" src="../../assets/index-dialog.png" alt="" />
          </div>
          <p class="span-title">帮助您建立单位</p>
          <p class="span-content">
            只需3步帮助您邀请成员、设置部门岗位、添加应用
          </p>
        </span>

        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">稍后设置</el-button>
          <el-button type="primary" @click="setItem">前往设置</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Vue from "vue";
import VueGridLayout from "vue-grid-layout";
import DiyTitle from "@components/DiyTitle/index";
Vue.use(VueGridLayout);
import { getallcontain } from "@api/home";

var testLayout = [
  { x: 0, y: 0, w: 4, h: 7, i: "0" },
  { x: 4, y: 0, w: 4, h: 7, i: "1" },
  { x: 8, y: 0, w: 4, h: 7, i: "2" },
  { x: 0, y: 7, w: 4, h: 6, i: "3" },
  { x: 0, y: 13, w: 4, h: 5, i: "4" },
  { x: 4, y: 7, w: 4, h: 11, i: "5" },
  { x: 8, y: 7, w: 4, h: 6, i: "6" },
  { x: 8, y: 13, w: 4, h: 5, i: "7" },
];

var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;

export default {
  name: "Layout",
  components: {
    DiyTitle,
    GridLayout,
    GridItem,
  },
  data() {
    return {
      visible: false,
      layout: [],
      newX: 0,
      newY: 0,
      portalid: "694567114580692992",
      gridLayoutSet: {
        draggable: false,
        resizable: false,
      },
    };
  },
  mounted() {
    this.initprotalResult();
  },
  computed: {
    ...mapState("user", ["RegLogin"]),
  },
  created() {},
  methods: {
    ...mapActions("user", ["regLogin"]),
    initprotalResult() {
      let params = {
        filtertext: "",
        portalid: this.portalid,
      };
      let that = this;
      getallcontain(params).then((res) => {
        that.layout = res.data.data;
      });
    },
    moveEvent: function(i, newX, newY, e) {},
    resizeEvent: function(i, newH, newW) {},
    movedEvent: function(i, newX, newY, e) {},
    resizedEvent: function(i, newH, newW, newHPx, newWPx) {},
    setItem() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.base-layout {
  margin-top: 0;
}

.con-box {
  width: 100%;
  .layout-box {
    margin: -8px;
    .vue-grid-layout {
      position: relative;
      .vue-grid-item {
        position: absolute;
        padding: 10px;
        background: #fff;
        border-radius: 4px;
      }
    }
  }
}
.index-dialog {
  .el-dialog__body {
    padding-bottom: 0;
  }
  .dialog-span {
    .dialog-div {
      display: flex;
      justify-content: center;
    }
    .span-img {
      width: 165px;
      height: 100px;
      margin-top: -20px;
    }
    .span-title {
      font-size: 24px;
      font-weight: 600;
      margin-top: 30px;
      color: #303133;
      text-align: left;
      margin-left: 20px;
    }
    .span-content {
      font-size: 16px;
      font-weight: 500;
      color: rgba(96, 98, 102, 1);
      text-align: left;
      margin-left: 20px;
      margin-top: 16px;
    }
  }
}
</style>
