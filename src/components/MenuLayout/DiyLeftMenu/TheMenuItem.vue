<template>
  <div
    ref="menuItem"
    class="item-box"
    @click.stop="showSubMenu(item)"
    :style="getItemBoxStyle(item)"
    :class="getItemBoxClass(item)"
  >
    <svg
      v-if="!item.appId"
      :style="item.id === openMenuId ? 'opacity: 1;' : ''"
      class="icon munu-item-img"
      aria-hidden="true"
    >
      <use :xlink:href="'#' + item.icon"></use>
    </svg>
    <svg
      v-else-if="item.icon === 'icon-linshitubiao'"
      :style="item.id === openMenuId ? 'opacity: 1;' : ''"
      class="icon munu-item-img"
      aria-hidden="true"
    >
      <use :xlink:href="'#' + item.icon + '1'"></use>
    </svg>
    <img v-else :src="item.icon" alt="" class="munu-item-img" />
    <span class="menu-item-title" :title="(item.status = item.name)">{{
      item.name
    }}</span>
    <img
      class="menu-item-image"
      v-if="item.reformStatus == 0"
      src="../../../assets/yirenzheng1.svg"
      alt="已认证"
      title="已认证"
    />
    <img
      class="menu-item-image"
      v-if="item.reformStatus == 1"
      src="../../../assets/weirenzheng.svg"
      alt="整改中"
      title="整改中"
    />
    <i
      v-if="menuState === 0 && item.children && item.children.length !== 0"
      class="menu-item-arr el-icon-arrow-down"
      :style="
        item.showSubMenu
          ? 'transform: rotate(180deg);'
          : 'transform: rotate(0);'
      "
    ></i>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      appIdInfo: "",
    };
  },
  props: ["item", "depth"],
  computed: {
    ...mapState("menu", ["menuState"]),
    ...mapGetters("menu", ["openMenuId"]),
    ...mapState("router", ["appRouter"]),
  },
  mounted() {},
  methods: {
    ...mapActions("menu", ["changeMenu", "handleShow"]),
    ...mapActions("router", ["handleRouter"]),
    showSubMenu(obj) {
      if (obj.children && obj.children.length !== 0) {
        obj.showSubMenu = !obj.showSubMenu;
      } else {
        localStorage.setItem("setValApp", 2);
        if (obj.appId) {
          if (obj.appId !== sessionStorage.getItem("APPID")) {
            sessionStorage.setItem("APPID", obj.appId);
            this.handleShow();
            // 暂时关闭有问题
            this.handleRouter(obj);
          }
        }
        this.changeMenu(obj);
      }
    },
    getItemBoxStyle(el) {
      let menuIndex = "padding-left:" + this.depth * 24 + "px";
      let style =
        (el.id === this.openMenuId
          ? "background: rgba(242,246,252,1);color: #154ad8;"
          : "") + menuIndex;
      return style;
    },
    getItemBoxClass(item) {
      if (item.id === this.openMenuId) {
        return "onItemBox item-box";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
.item-box {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  color: rgba(51, 51, 51, 1);

  &:hover {
    @include background_color("background_color5");
    @include font_color("font_color4");
    cursor: pointer;
    .munu-item-img {
      @include fill_color("fill_color3");
    }
    .menu-item-title {
      @include font_color("font_color4");
    }
  }
}
.onItemBox {
  border-radius: 5px;
  @include background_color("background_color6");
  @include font_color("font_color2");
  .munu-item-img {
    @include fill_color("fill_color1");
  }
  .menu-item-title {
    @include font_color("font_color2");
  }
}
.onItemBox:hover {
  @include background_color("background_color6");
  @include font_color("font_color2");
  .munu-item-img {
    @include fill_color("fill_color1");
  }
  .menu-item-title {
    @include font_color("font_color2");
  }
}
.menu-item-icon {
  opacity: 0.75;
  margin-left: 15px;
  margin-right: 10px;
  font-size: 16px;
}
.menu-item-image {
  width: 15px;
  height: 15px;
}
.munu-item-img {
  margin-left: 15px;
  margin-right: 10px;
  opacity: 0.75;
  width: 20px;
  height: 20px;
  @include fill_color("fill_color2");
}
.menu-item-title {
  @include font_color("font_color1");
  flex: 1;
  max-width: calc(100% - 70px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 400;
  transition: all 0.5s;
}

.menu-item-arr {
  transition: all 0.5s;
}
.boxprohibit {
  background-color: lightgray;
  &:hover {
    cursor: no-drop;
  }
}
</style>
