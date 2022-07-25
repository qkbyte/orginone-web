<template>
  <div id="menu" class="left-menu" :style="leftMenuStyle">
    <div class="fold-arrow">
      <div><span v-if="menuState === 0">平台菜单</span></div>
      <div
        class="fold-arrow__button"
        :class="menuState === 2 ? 'fold-arrow__button-expand' : ''"
        @click.stop="toggleMenuState"
      >
        <i class="el-icon-arrow-left" style="margin-right:-6px;"></i>
        <i class="el-icon-arrow-left"></i>
        <span v-if="menuState !== 2">收起</span>
      </div>
    </div>
    <div
      ref="menuList"
      class="real-menu"
      :style="
        menuState !== 2
          ? 'padding: 0px 10px 50px 10px;'
          : 'padding: 0px 0px 50px;'
      "
    >
      <TheMenu :depth="0" :menuData="platformMenu"></TheMenu>
      <div class="fold-arrow" style="padding:0px;" v-if="appMenu.length !== 0">
        <div class="fold-box">
          <span v-if="menuState === 0">应用菜单</span>
          <span v-else-if="menuState === 1">应用</span>
          <div class="fold-box__sort" @click="handleSort">排序</div>
        </div>
      </div>
      <TheMenu :depth="0" :menuData="appMenu"></TheMenu>
    </div>
    <template v-for="item in dialogShow">
      <TheSortDialog
        v-if="item.key === 'sort' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheSortDialog>
    </template>
  </div>
</template>

<script>
import TheSortDialog from "./components/sortDialog";
import { mapActions, mapState } from "vuex";
import TheMenu from "./TheMenu";
export default {
  data() {
    return {
      sortShow: false,
      dialogShow: [
        {
          key: "sort",
          value: false,
        },
      ],
    };
  },
  components: {
    TheMenu,
    TheSortDialog,
  },
  computed: {
    ...mapState("menu", ["menuState", "menuList"]),
    leftMenuStyle() {
      let temp = "";
      switch (this.menuState) {
        case 0:
          temp = "width:220px;";
          break;
        case 1:
          temp = "width:63px;";
          break;
        default:
          temp = "width:0;";
      }
      return temp;
    },
    platformMenu() {
      return this.menuList.filter((el) => el.type !== "app");
    },
    appMenu() {
      return this.menuList.filter((el) => el.type === "app");
    },
  },
  activated() {
    this.$refs.menuList.scrollTop = parseFloat(
      sessionStorage.getItem("menuScroll")
    );
  },
  created() {
    let handler = (event) => {
      let scroll = 0;
      if (this.$refs.menuList && this.$refs.menuList.scrollTop)
        scroll = this.$refs.menuList.scrollTop;
      sessionStorage.setItem("menuScroll", scroll);
    };
    window.addEventListener("scroll", handler, true);
    this.$once("hook:beforeDestroy", (e) => {
      window.removeEventListener("scroll", handler);
    });
  },
  mounted() {},
  methods: {
    ...mapActions("menu", ["toggleMenuState"]),
    handleSort() {
      this.dialogShow.map((el) => {
        if (el.key == "sort") {
          el.value = true;
        }
      });
    },
    handleCloseDialog(val) {
      this.dialogShow.map((el) => {
        if (el.key == val) {
          el.value = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
::-webkit-scrollbar {
  width: 8px;
  height: 0px;
  background: unset;
}
::-webkit-scrollbar-thumb {
  height: 0px;
  border-radius: 4px;
  background: #90939928;
}
::-webkit-scrollbar-thumb:hover {
  width: 8px;
  background: #90939967;
}
.left-menu {
  z-index: 1601;
  @include background_color("background_color2");
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  max-height: 100%;
  transition: all 0.5s ease;
  border-top: 1px solid rgba(242, 246, 252, 1);
  .fold-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    &__sort {
      color: $theme-color;
      cursor: pointer;
    }
  }
  .fold-arrow {
    width: 100%;
    height: 40px;
    min-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    @include font_color("font_color1");
    padding: 0 10px;
    transition: all 0.5s;
    margin-bottom: 2px;

    &__button {
      &:hover {
        cursor: pointer;
      }

      &-expand {
        transition: all 0.5s;
        position: fixed;
        width: 18px;
        height: 17px;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(180deg);
        background: rgba(21, 74, 216, 0.2);
        color: white;
        border-radius: 5px 0px 0px 5px;
      }

      &-expand:hover {
        background: rgba(21, 74, 216, 1);
      }
    }
  }

  .real-menu {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-self: flex-start;
    flex-direction: column;
    transition: all 0.5s;

    &:hover {
      overflow-y: scroll;
      overflow-y: overlay;
    }
  }
}
</style>
