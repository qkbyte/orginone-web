<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
    center
    top="10vh"
    width="540px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title">新增集团</span>
    <div class="diy-dialog-body">
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-input
            class="groupNameInput"
            v-if="item.prop === 'groupName'"
            v-model="form.groupName"
            placeholder="请输入集团名称"
            style="width:480px"
          ></el-input>

          <el-input
            v-if="item.prop === 'groupDescription'"
            v-model.number="form.groupDescription"
            placeholder="请输入集团描述"
            type="textarea"
            style="height:80px;width:480px"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">完 成</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { addUser } from "@api/user";
import { getRoleListByTenantId } from "@api/role";
import { addGroup } from "@api/group";
export default {
  name: "groupAddDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "集团名称",
          prop: "groupName",
        },
        {
          label: "集团描述",
          prop: "groupDescription",
        },
      ],
      form: {},
      rules: {
        realName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        roleIds: [{ required: true, message: "请选择角色", trigger: "blur" }],
      },
      roleList: [],
      loading: false,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.form = {
      realName: "",
      roleIds: [],
      phoneNumber: "",
      idCard: "",
      tenantCode: this.curTenantCode,
    };
    this.loadRoleList();
  },
  mounted() {},
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  watch: {},
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleClick() {
      this.loading = true;
      let params = this.form;
      addGroup(params).then(
        (res) => {
          this.loading = false;
          this.$emit("reloadPage");
          this.$emit("closeDialog", this.dialogShow.key);

          this.$message.success({
            message: "新增成功",
            duriation: 700,
          });
        },
        (err) => {
          this.loading = false;
        }
      );
    },
    loadRoleList() {
      let params = {
        size: 20,
        tenantCode: this.curTenantCode,
      };
      getRoleListByTenantId(params).then((res) => {
        this.roleList = res.data.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
</style>
