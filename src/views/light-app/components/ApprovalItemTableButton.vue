<template>
  <DiyButton>
    <template v-slot:opt>
      <div class="diy-button" @click="handleView">查看</div>
      <div class="diy-button" @click="handleBinding">停止流程</div>
      <div class="diy-button" @click="handleEdit">删除</div>
      <div class="diy-button" @click="handleDelete">....</div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "./DiyButton/index";


export default {
  data() {
    return {};
  },

  components: { DiyButton },
  created() {},
  props: {

  },
  methods: {
    /**查看 */
    handleView() {
    },

    /**绑定流程 */
    handleBinding() {
    },
    //编辑分组
    handleEdit() {
    },
    /**删除 */
    handleDelete() {
    },

  },
};
</script>

<style lang="scss" scoped>
  .diy-button {
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background: rgba(235, 238, 245, 1);
      border-radius: 4px;
    }
  }
</style>
