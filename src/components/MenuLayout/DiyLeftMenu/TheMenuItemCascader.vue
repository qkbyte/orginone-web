<template>
  <ul>
    <li v-for="item in listData" :key="'list-item-' + item.id">
      <template v-if="item.children && item.children.length !== 0">
        <el-popover width="200" placement="right" trigger="hover">
          <DiyCascader :listData="item.children"></DiyCascader>
          <TheMenuItem :item="item" slot="reference"></TheMenuItem>
        </el-popover>
      </template>
      <template v-else>
        <TheMenuItem :item="item" :title="item.name"> </TheMenuItem>
      </template>
    </li>
  </ul>
</template>

<script>
import TheMenuItem from "./TheMenuItem";

export default {
  name: "DiyCascader",
  data() {
    return {};
  },
  components: { TheMenuItem },
  props: {
    listData: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="scss" scoped></style>
