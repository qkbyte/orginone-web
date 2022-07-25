<template>
  <el-dialog
    v-loading="loadingDialog"
    center
    width="400px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title"> 角色权限配置 </span>
    <div class="diy-dialog-body">
      <el-tree
        ref="tree"
        v-loading="loading"
        :props="listOption"
        :data="listData"
        :default-expanded-keys="listData"
        :default-checked-keys="authData"
        node-key="id"
        show-checkbox
        :filter-node-method="filterNode"
        @check-change="handleCheckChange"
      >
      </el-tree>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateRoleAuthByRoleId } from "@api/role";
import { getMenuTree, getMenuTreeByRoleId } from "@api/menu";

export default {
  name: "TheAppDialog",
  data() {
    return {
      loading: true,
      loadingDialog: false,
      listOption: {
        label: "name",
        children: "children",
      },
      listData: [],
      authData: [],
      multipleSelection: [],
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.loadMenuTree();
    this.loadAuthTree();
  },
  computed: {},
  watch: {},
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    loadMenuTree() {
      getMenuTree().then((res) => {
        this.listData = res.data.data;
      });
    },
    loadAuthTree() {
      let params = {
        roleIds: this.dialogShow.sendData.id,
      };
      getMenuTreeByRoleId(params).then((res) => {
        this.authData = res.data.data;
        this.$refs.tree.setCheckedKeys(this.authData);
        this.loading = false;
      });
    },
    handleClick() {
      this.loadingDialog = true;
      let str = this.$refs.tree.getCheckedKeys().join(",") + "";
      let new_auth = (str || "").split(".");
      let old_auth = this.authData;
      if (old_auth.sort().toString() !== new_auth.sort().toString()) {
        let params = {
          menuIds: new_auth.toString(),
          roleId: this.dialogShow.sendData.id,
        };
        updateRoleAuthByRoleId(params).then(
          (res) => {
            this.loadingDialog = false;
            this.$message.success("权限修改成功");
            this.handleClose();
          },
          (err) => {
            this.loadingDialog = false;
          }
        );
      } else {
        this.$message.success("未修改");
        this.handleClose();
        this.loadingDialog = false;
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      this.multipleSelection = this.getCheckedNodes();
    },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.roleName.includes(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-body {
  justify-content: flex-start;
  overflow-y: scroll;
  width: 100%;
  height: 330px;
  padding: 5px 0 10px;
  border: 1px solid #e4e7ed;
  border-radius: 5px;
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 10px;
}
</style>
