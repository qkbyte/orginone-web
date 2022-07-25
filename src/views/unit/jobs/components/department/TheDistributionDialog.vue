<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
    center
    top="10vh"
    width="420px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title">
      角色分配
    </span>
    <div class="diy-dialog-body">
      <el-select
        v-model="value"
        :placeholder="tableData[index].roleName"
        :style="{ width: '100%' }"
      >
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :value="item.roleName"
        >
          {{ item.roleName }}
        </el-option>
      </el-select>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { getRoleListByTenantId, updateRolesToUsers } from "@api/role";

export default {
  name: "TheEditDialog",
  data() {
    return {
      form: {},
      roleList: [],
      value: "",
      loading: false,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.form = this._.cloneDeep(this.dialogShow.sendData);
    this.loadRoleList();
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  watch: {},
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    loadRoleList() {
      let params = {
        tenantCode: this.curTenantCode,
      };
      getRoleListByTenantId(params).then((res) => {
        let _this = this;
        this.roleList = res.data.data;
        this.roleList.forEach((el) => {
          if (this.dialogShow.sendData.roleName === el.roleName) {
            _this.form.roleIds = [];
            _this.form.roleIds.push(el.id);
          }
        });
      });
    },
    handleClick() {
      this.loading = true;
      let id;
      let _this = this;
      for (let i = 0; i < this.roleList.length; i++) {
        if (this.value === _this.roleList[i].roleName) {
          id = _this.roleList[i].id;
          break;
        }
      }
      if (typeof id !== "undefined") {
        let data = {
          roleId: id,
          userId: _this.tableData[_this.index].userId,
        };
        console.log("data", data);
        updateRolesToUsers(data).then(
          (res) => {
            this.loading = false;
            this.$message.success({
              message: "更新成功",
              duriation: 700,
            });
            this.$parent.loadData();
            this.$emit("closeDialog", this.dialogShow.key);
          },
          (err) => {
            this.loading = false;
          }
        );
      }else{
        this.$message.warning('请选择要分配的角色')
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
</style>
