<template>
  <el-dialog
    center
    top="10vh"
    width="420px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title">
      {{ dialogShow.sendData.roleName }}菜单
    </span>
    <div class="diy-dialog-body">
      <el-tree
        :data="treeData"
        default-expand-all
        node-key="id"
        :filter-node-method="filterNode"
        ref="tree"
      >
        <div class="node-model" slot-scope="{ node, data }">
          <div class="node-model__icon">
            <img v-if="img" :src="node.data.icon" class="avatar" />
            <el-avatar
              v-else
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            ></el-avatar>
          </div>
          <div class="node-model__title">{{ data.menuName }}</div>
        </div>
      </el-tree>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TheAppDialog",
  data() {
    return {};
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {}
    },
    treeData: {
      type: Array,
      default: () => []
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs.tree.filter(this.dialogShow.sendData.roleName);
    });
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.roleList.includes(value);
    },
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    }
  }
};
</script>

<style lang="scss" scoped>
.diy-dialog-body {
  border: 1px solid rgba(235, 238, 245, 1);
  border-radius: 4px;
  padding: 10px 20px;
  justify-content: flex-start;

  .node-model {
    display: flex;
    align-items: center;

    div + div {
      margin-left: 10px;
    }
  }
}

.diy-dialog-body ::v-deep .el-tree-node {
  &__content {
    height: 60px;
  }
}
</style>
