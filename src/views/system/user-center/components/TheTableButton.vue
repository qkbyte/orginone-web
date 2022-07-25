<template>
  <DiyButton>
    <template v-slot:opt>
      <div
        class="diy-button"
        @click="handleTransfer"
        v-if="rowData.isCreated === 2"
      >
        权限转移
      </div>
      <div
        class="diy-button"
        @click="handleDissolution"
        v-if="rowData.isCreated === 2"
      >
        解散
      </div>
      <div class="diy-button" @click="handleOut(rowData.tenantCode)" v-else>
        退出
      </div>
    </template>
  </DiyButton>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import { mapState, mapActions } from "vuex";
import { removeUsersById } from "@api/user";
import { deleteTenantByTenantId } from "@api/tenant";

export default {
  data() {
    return {
      tenant: []
    };
  },
  computed: {
    ...mapState("user", ["userId"]),
    ...mapState("tenant", ["tenantList", "defaultTenantCode"])
  },
  components: { DiyButton },
  props: ["rowData", "userPhone"],
  created(){
    this.tenant = this.tenantList
  },
  methods: {
    ...mapActions("tenant", ["toggleUnit", "lastToggleUnit"]),
    handleDissolution() {
      this.$confirm("此操作将永久解散该单位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            tenantCode: this.rowData.tenantCode,
          };
          deleteTenantByTenantId(params).then((res) => {
            if (res.data.code !== 200) {
              return this.$message.error("解散失败");
            }else{
              this.$message.success("解散成功");
            }
            this.$emit("loadData");
            this.handleRefresh(this.rowData.tenantCode, res.data.data)
            // this.toggleUnit(tenantCode);
            // location.reload();
          });
        })
        .catch(() => {
          return
        });
    },
    handleRefresh(val,res){
      if(this.defaultTenantCode == val){
        let index = 0
        for(let i in this.tenant){
          if(val == this.tenant[i].tenantCode){
            index = i
          }
        }
        this.tenant.splice(index, 1)
        if(this.tenant.length !== 0){
          this.toggleUnit(this.tenant[0].tenantCode);
        }else{
          this.lastToggleUnit(res);
        }
      }else{
        location.reload();
      }
    },
    handleTransfer(){
      this.$emit('handleTransfer', this.rowData)
    },
    async handleOut(tenantCode) {
      console.log('asdsad', this.tenantCode);
      this.$confirm("此操作将永久退出该单位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let params = {
            tenantCode: tenantCode,
            phoneNumber: this.userPhone,
          };
          const { data: res } = await removeUsersById(params);
          console.log('进来了');
          if (res.code !== 200) {
            return this.$message.error("退出失败");
          }
          this.$message.success("退出成功");
          this.$emit("loadData");
          this.handleRefresh(tenantCode, res.data)
          // this.toggleUnit(tenantCode);
        })
        .catch(() => {
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
