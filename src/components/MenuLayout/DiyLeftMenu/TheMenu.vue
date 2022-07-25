<template>
  <ul class="menu">
    <li
      class="menu-item"
      v-for="(item, index) in menuData"
      :key="'item-' + item.id + index"
    >
      <template v-if="menuState === 1">
        <template v-if="item.children && item.children.length !== 0">
          <el-popover width="200" placement="right" trigger="hover">
            <TheMenuItemCascader :listData="item.children">
            </TheMenuItemCascader>
            <TheMenuItem :item="item" slot="reference"></TheMenuItem>
          </el-popover>
        </template>
        <template v-else>
          <el-tooltip effect="dark" :content="item.name" placement="right">
            <TheMenuItem :item="item"></TheMenuItem>
          </el-tooltip>
        </template>
      </template>
      <template v-else>
        <TheMenuItem :item="item" :depth="depth"></TheMenuItem>
        <template v-if="item.children">
          <el-collapse-transition>
            <diymenu
              class="sub-menu"
              :menuData="item.children"
              :depth="depth + 1"
              v-show="item.showSubMenu && menuState === 0"
            ></diymenu>
          </el-collapse-transition>
        </template>
      </template>
    </li>
  </ul>
</template>

<script>
import { mapActions, mapState } from "vuex";
import TheMenuItem from "./TheMenuItem";
import TheMenuItemCascader from "./TheMenuItemCascader";

export default {
  name: "diymenu",
  props: ["menuData", "depth"],
  data() {
    return {};
  },
  computed: {
    ...mapState("menu", ["menuState"]),
  },
  components: { TheMenuItem, TheMenuItemCascader },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.menu {
  width: 100%;

  li + li {
    margin-top: 10px;
  }

  .menu-item {
    display: flex;
    flex-direction: column;
  }
}
</style>
