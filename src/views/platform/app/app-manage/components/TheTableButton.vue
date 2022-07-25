<template>
  <DiyButton>
    <template v-slot:opt>
      <div
        class="diy-button"
        @click="handleDismount"
        v-if="app.saleStatus === 1 && app.saleStatus === -1"
      >
        下架
      </div>
      <div  v-else>
        <div class="diy-button">
           <div @click="handleDelete">删除</div> 
        </div>
        <div class="diy-button" @click="handlefreeze">
          冻结
        </div>
      </div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { mapGetters,mapActions } from "vuex";
import { updateAppOffSale, checkRedeploy, deleteApp, getfreezeApp } from "@api/market";

export default {
  data() {
    return {};
  },
  components: {
    DiyButton,
  },
  props: ["app"],
  methods: {
    ...mapActions("menu", ["updateAppMenu"]),
    /**下架应用 */
    handleDismount() {
      let params = {
        ids: this.app.id,
      };
      updateAppOffSale([params.ids]).then((res) => {
        this.$emit("loadlistData");
        this.$message.success("下架成功");
      });
    },
    handleDelete(app) {
      this.$confirm("此操作将永久删除该应用, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            appId: this.app.id,
          };
          deleteApp(params).then((res) => {
            console.log("params", params);
            this.$message.success('删除成功')
            this.$emit("loadlistData");
            this.updateAppMenu();
          });
        })
        .catch(() => {});
    },
    handlefreeze(app){
       this.$confirm("冻结后，该应用将停止使用，确定要继续冻结应用吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            ids: this.app.id,
          };
          getfreezeApp(params).then((res) => {
            console.log("params", params);
            this.$message.success('冻结成功')
            this.$emit("loadlistData");
            this.updateAppMenu();
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
