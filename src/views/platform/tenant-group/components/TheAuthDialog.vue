<template>
  <el-dialog
    v-loading="loadingDialog"
    center
    width="360px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title"> 租户组权限配置 </span>
    <div class="diy-dialog-body">
      <el-tree
        ref="tree"
        v-loading="loading"
        :props="listOption"
        :data="roleList"
        :default-expanded-keys="roleList"
        :default-checked-keys="authList"
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
import { mapGetters } from "vuex";
import { getAllRoleList } from "@api/role";
import { getTenantRole, updateTenantRole } from "@api/tenant-group";

export default {
  name: "TheAppDialog",
  data() {
    return {
      loading: false,
      loadingDialog: false,
      listOption: {
        label: "title",
        children: "children",
      },
      roleList: [],
      authList: [],
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
    this.loading = true;
    this.$nextTick(() => {
      this.loadRoleList();
    });
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    loadRoleList() {
      let params = {
        tenantCode: this.curTenantCode,
      };
      getAllRoleList(params).then((res) => {
        let data = res.data.data;
        data.forEach((el) => {
          let node = {
            id: el.id,
            key: el.id,
            title: el.roleName,
            value: el.id,
          };
          this.roleList.push(node);
        });
        this.loadAuthList();
      });
    },
    loadAuthList() {
      let params = {
        attrId: this.dialogShow.sendData.id,
      };
      getTenantRole(params).then((res) => {
        let data = res.data.data;
        data.forEach((el) => this.authList.push(el.id));
        this.$refs.tree.setCheckedKeys(this.authList);
      });
      this.loading = false;
    },
    handleClick() {
      this.loadingDialog = true;
      let str = this.$refs.tree.getCheckedKeys().join(",") + "";
      let new_auth = (str || "").split(".");
      let old_auth = this.authList;
      if (old_auth.sort().toString() !== new_auth.sort().toString()) {
        let params = {
          roleIds: new_auth.toString(),
          attrId: this.dialogShow.sendData.id,
        };
        updateTenantRole(params).then(
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
