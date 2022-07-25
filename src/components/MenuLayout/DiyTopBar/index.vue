<template>
  <div
    class="common-util"
    data-theme="dark"
    :class="menuStyle === 0 ? 'topBar' : 'sideBar'"
  >
    <div v-if="menuStyle === 0">
      <TheTopBarSelect class="top-select"></TheTopBarSelect>
    </div>
    
    <!-- 切换简化边栏时的顶部菜单 -->
    <div
      v-if="menuStyle === 1"
      class="buttons"
      :style="menuStyle === 1 ? 'flex-direction:column' : ''"
    >
      <div class="flex-column" style="margin-bottom:14px">
        <div
          class="buttons__item"
          :class="'a' == curSideBar ? 'buttons__on' : ''"
          :style="getItemBoxStyle('a')"
          @click="handleSelectMenu('a')"
        >
          <!-- <el-tooltip effect="dark" content="首页"> -->
          <svg class="icon el-icon" aria-hidden="true">
            <use xlink:href="#icon-shouye1" />
          </svg>
          <!-- </el-tooltip> -->
        </div>
        <div @click="handleSelectMenu('a')" class="buttons__text">首页</div>
      </div>
      <div class="flex-column" style="margin-bottom:14px">
        <div
          class="buttons__item"
          :class="'b' == curSideBar ? 'buttons__on' : ''"
          @click="handleSelectMenu('b')"
          :style="getItemBoxStyle('b')"
        >
          <!-- <el-tooltip effect="dark" content="消息"> -->
          <el-badge
            :value="todoNum"
            class="item"
            v-if="menuStyle === 0 && todoNum !== 0"
            ref="butMsg"
          >
            <svg class="icon el-icon" aria-hidden="true">
              <use xlink:href="#icon-xiaoxi1" />
            </svg>
          </el-badge>
          <el-badge
            is-dot
            class="item"
            v-else-if="menuStyle === 1"
            ref="butMsg"
          >
            <svg class="icon el-icon" aria-hidden="true">
              <use xlink:href="#icon-xiaoxi1" />
            </svg>
          </el-badge>
          <svg class="icon el-icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-xiaoxi1" />
          </svg>
          <!-- </el-tooltip> -->
        </div>
        <div @click="handleSelectMenu('b')" class="buttons__text">消息</div>
      </div>

      <div class="flex-column" style="margin-bottom:14px">
        <div
          class="buttons__item"
          :class="'c' == curSideBar ? 'buttons__on' : ''"
          :style="getItemBoxStyle('c')"
          @click="handleSelectMenu('c')"
        >
          <!-- <el-tooltip effect="dark" content="我的应用"> -->
          <svg class="icon el-icon" aria-hidden="true">
            <use xlink:href="#icon-quanbuyingyong1" />
          </svg>
          <!-- </el-tooltip> -->
        </div>
        <div @click="handleSelectMenu('c')" class="buttons__text">应用</div>
      </div>
      <div class="buttons__item" v-if="menuStyle === 0">
        <TheCenterSelect></TheCenterSelect>
      </div>
    </div>

    <!-- 首页的顶部菜单 -->
    <div
      v-if="menuStyle === 0"
      class="buttons"
      :style="menuStyle === 1 ? 'flex-direction:column' : ''"
    >
      <div
        class="buttons__item"
        :class="'a' == curSideBar ? 'buttons__on' : ''"
        :style="getItemBoxStyle('a')"
        @click="handleSelectMenu('a')"
      >
        <el-tooltip effect="dark" content="首页">
          <svg class="icon el-icon" aria-hidden="true">
            <use xlink:href="#icon-shouye1" />
          </svg>
        </el-tooltip>
      </div>
      <div
        class="buttons__item"
        :class="'b' == curSideBar ? 'buttons__on' : ''"
        @click="handleSelectMenu('b')"
        :style="getItemBoxStyle('b')"
      >
        <el-tooltip effect="dark" content="消息">
          <el-badge
            :value="todoNum"
            class="item"
            v-if="menuStyle === 0 && todoNum !== 0"
            ref="butMsg"
          >
            <svg class="icon el-icon" aria-hidden="true">
              <use xlink:href="#icon-xiaoxi1" />
            </svg>
          </el-badge>
          <el-badge
            is-dot
            class="item"
            v-else-if="menuStyle === 1"
            ref="butMsg"
          >
            <svg class="icon el-icon" aria-hidden="true">
              <use xlink:href="#icon-xiaoxi1" />
            </svg>
          </el-badge>
          <svg class="icon el-icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-xiaoxi1" />
          </svg>
        </el-tooltip>
      </div>

      <div
        class="buttons__item"
        :class="'c' == curSideBar ? 'buttons__on' : ''"
        :style="getItemBoxStyle('c')"
        @click="handleSelectMenu('c')"
      >
        <el-tooltip effect="dark" content="我的应用">
          <svg class="icon el-icon" aria-hidden="true">
            <use xlink:href="#icon-quanbuyingyong1" />
          </svg>
        </el-tooltip>
      </div>
      <div class="buttons__item" v-if="menuStyle === 0">
        <TheCenterSelect></TheCenterSelect>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
import TheTopBarSelect from "./TheTopBarSelect";
import TheCenterSelect from "./TheCenterSelect";
import { getTodoNumber, getUnReadNumber,getallacttodo } from "@api/acttodo";

export default {
  data() {
    return {
      todoNum: 0,
      setValApp: "1",
    };
  },
  components: {
    TheTopBarSelect,
    TheCenterSelect,
  },
  computed: {
    ...mapState("user", ["userPhoto"]),
    ...mapState("options", ["menuStyle"]),
    ...mapGetters("tenant", ["curTenant"]),
    ...mapState("menu", ["openMenu"]),
    curSideBar: function() {
      let res = "";
      const { path } = this.openMenu;
      if (this.openMenu.id === -1) {
        if (path === "/") {
          res = "a";
        } else if (path === "/acttodo") {
          res = "b";
        } else if (path === "/my-app") {
          res = "c";
        }
      }
      return res;
    },
  },
  watch: {
    "$store.state.work.todoNumIndexSend": function() {
      this.getToDoNum();
    },
    curTenant() {
      this.getToDoNum();
    },
  },
  created() {
    this.getToDoNum();
  },
  methods: {
    ...mapActions("menu", ["changeMenu"]),
    // 获取右上角数量
    getToDoNum() {
      let params = {
          current: 0,
          size: 1,
        };
      getallacttodo(params).then((res) => {
        this.todoNum = parseInt(res.data.data.total);
        getUnReadNumber().then((res) => {
          this.todoNum += res.data.data;
        });
      });
    },
    handleSelectMenu(command) {
      let path = "";
      if (command === "a") {
        path = "/";
        localStorage.setItem("setValApp", 0);
      } else if (command === "b") {
        path = "/acttodo";
        // this.$store.commit('changeSetValApp', this.setValApp)
        localStorage.setItem("setValApp", 1);
      } else {
        path = "/my-app";
      }
      this.changeMenu({
        id: -1,
        type: "platform",
        path,
      });
    },
    getItemBoxStyle(el) {
      if (this.menuStyle === 0) return;
      let menuIndex = "padding-left:" + this.depth * 24 + "px";
      let style =
        (el === this.curSideBar
          ? "background: rgba(242,246,252,1);color: #154ad8;border-left:3px solid #154AD8;"
          : "") + menuIndex;
      return style;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
.common-util {
  font-size: 18px;
  @include background_color("background_color1");
}
.top-select {
  z-index: 1602;
}
.topBar {
  z-index: 1602;
  min-width: 1200px;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 20px 0 0;
  box-shadow: 0px 2px 5px rgba(226, 226, 226, 0.322);

  .buttons {
    display: flex;
    position: relative;
    flex-direction: row;
    height: 100%;
    align-items: center;

    &__item {
      padding: 0px 20px;
      &:last-child {
        padding-right: 0px;
      }
    }
  }
  .el-icon {
    font-size: 18px;
    cursor: pointer;
    @include fill_color("fill_color1");
  }
}

.sideBar {
  width: 100%;

  .buttons {
    width: 100%;
    &__item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 48px;

      &:hover {
        @include background_color("background_color2");
        cursor: pointer;
      }
    }
    &__on{
      @include background_color("background_color3");
      .el-icon {
        @include fill_color("fill_color3");
      }
    }
    &__text {
      width: 100%;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      // color: #303133;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
      font-weight: bold;
      @include font_color("font_color5");
    }
  }

  .el-icon {
    font-size: 22px;
    cursor: pointer;
    @include fill_color("fill_color1");
  }
}
</style>
<style lang="scss" scoped>
.button-search {
  width: 214px;
  border-radius: 25px;
  overflow: hidden;
  background: rgba(249, 249, 249, 1);
}
.button-search ::v-deep .el-input__inner {
  background: transparent;
  border: none;
}
.button-search ::v-deep .el-input__icon {
  color: rgba(153, 153, 153, 1);
  font-size: 18px;
}
</style>
