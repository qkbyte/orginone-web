<template>
  <DiyButton>
    <template v-slot:opt>
      <div
        v-if="row.status === -1"
        class="diy-button"
        @click="handlePass(0, row)"
      >
        启用
      </div>
      <div v-else class="diy-button" @click="handlePass(0, row)">停用</div>
      <div class="diy-button" @click="handleEdit(0, row)">编辑</div>
      <div class="diy-button" @click="handleDelete(0, row)">删除</div>
      <div class="diy-button" @click="handleView(0, row)">预览</div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import {
  marketappcomponentSubmit,
  marketappcomponentRemove,
} from "@api/portal";
export default {
  data() {
    return {};
  },
  computed: {},
  components: { DiyButton },
  created() {
    console.log("load", this.$parent);
  },
  props: ["row", "index"],
  methods: {
    /**通过人员 */
    handlePass(index, row) {
      if (row.status === -1) {
        // 启用
        let params = {
          id: row.id,
          layoutConfig: row.layoutConfig,
          status: 1,
        };
        console.log(params);
        try {
          marketappcomponentSubmit(params).then((res) => {
            if (res.data.code == 200) {
              this.$emit("handlePass");
            }
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        // 停用
        let params = {
          id: row.id,
          layoutConfig: row.layoutConfig,
          status: -1,
        };
        try {
          marketappcomponentSubmit(params).then((res) => {
            if (res.data.code == 200) {
              this.$emit("handlePass");
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该组件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          marketappcomponentRemove([row.id]).then((res) => {
            if (res.data.code == 200) {
              this.$message.success('删除成功')
              this.$emit("handlePass");
            }
          });
        })
        .catch(() => {
          return;
        });
    },
    handleEdit(index, row) {
      this.$emit("handleEdit", row);
    },
    handleView(index, row) {
      // 预览
      this.$emit("handleView", row);
    },
  },
};
</script>

<style lang="scss" scoped></style>
