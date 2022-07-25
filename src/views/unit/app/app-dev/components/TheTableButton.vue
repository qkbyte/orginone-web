<template>
  <DiyButton>
    <template v-slot:opt>
      <div
        class="diy-button"
        @click="handleView"
        v-if="[1, 3, 4, 6, 7].includes(rowData.status)"
      >
        运维
      </div>
      <div
        class="diy-button"
        @click="handleUncheck"
        v-if="rowData.status === 0"
      >
        取消审核
      </div>
      <div class="diy-button" @click="handleDeploy" v-if="rowData.status === 1">
        部署
      </div>
      <div class="diy-button" @click="handleView" v-if="rowData.status === 2">
        原因
      </div>
      <div
        class="diy-button"
        @click="handleUncheck"
        v-if="rowData.status === 3"
      >
        取消审核
      </div>
      <div
        class="diy-button"
        @click="handleRelease"
        v-if="rowData.status === 4"
      >
        发布
      </div>
      <div class="diy-button" @click="handleView" v-if="rowData.status === 5">
        原因
      </div>
      <div
        class="diy-button"
        @click="handleUncheck"
        v-if="rowData.status === 6"
      >
        取消审核
      </div>
      <div
        class="diy-button"
        @click="handleUp"
        v-if="rowData.status === 7 && rowData.saleStatus === 0"
      >
        上架
      </div>
      <div
        class="diy-button"
        @click="handleDelete"
        v-if="
          (rowData.status !== 7 || rowData.saleStatus !== 1) &&
            rowData.status !== 0
        "
      >
        删除
      </div>
      <div
        class="diy-button"
        @click="handleReRelease"
        v-if="rowData.status === 7 && rowData.saleStatus === 0"
      >
        重新发布
      </div>
      <div
        class="diy-button"
        @click="handleDown"
        v-if="rowData.status === 7 && rowData.saleStatus === 1"
      >
        下架
      </div>
      <div class="diy-button" @click="handleView" v-if="rowData.status === 8">
        原因
      </div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import {
  updateAppOnSale,
  updateAppOffSale,
  deleteApp,
  cancelApply,
} from "@api/market";

export default {
  data() {
    return {};
  },
  components: { DiyButton },
  props: ["rowData"],
  methods: {
    handleView() {
      this.$router.push({
        name: "app-view",
        query: {
          id: this.rowData.id,
        },
      });
    },
    handleDeploy() {
      this.$router.push({
        name: "app-deploy",
        params: { appId: this.rowData.id },
      });
    },
    handleUncheck() {
      this.$confirm("此操作将取消该应用的审核状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            ids: [this.rowData.id].join(","),
          };
          cancelApply([params.ids]).then((res) => {
            this.$message.success("取消审核成功");
            this.$emit("handleUpdate");
          });
        })
        .catch(() => {});
    },
    handleRelease() {
      this.$router.push({
        name: "app-release",
        params: {
          row: this.rowData,
        },
      });
    },
    handleReRelease() {
      this.$router.push({
        name: "app-rerelease",
        query: {
          id: this.rowData.id,
        },
      });
    },
    handleUp() {
      let params = {
        ids: this.rowData.id,
      };
      updateAppOnSale([params.ids]).then((res) => {
        this.$message.success("上架成功");
        this.$emit("handleUpdate");
      });
    },
    handleDown() {
      let params = {
        ids: this.rowData.id,
      };
      updateAppOffSale([params.ids]).then((res) => {
        this.$message.success("下架成功");
        this.$emit("handleUpdate");
      });
    },
    handleDelete() {
      this.$confirm("此操作将永久删除该应用, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            appId: this.rowData.id,
          };
          deleteApp(params).then((res) => {
            this.$message.success("删除成功");
            this.$emit("handleUpdate");
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
