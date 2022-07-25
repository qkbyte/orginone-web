<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
    center
    width="400px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title"> 编辑角色信息 </span>
    <div class="diy-dialog-body">
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-input
            v-if="item.prop === 'roleName'"
            v-model="form.roleName"
            placeholder="请输入角色名称"
          ></el-input>
          <el-input
            v-if="item.prop === 'roleAlias'"
            v-model="form.roleAlias"
            placeholder="请输入角色标识"
          ></el-input>
          <el-input
            type="textarea"
            v-if="item.prop === 'roleDescription'"
            v-model="form.roleDescription"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { updateRole } from "@api/role";

export default {
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "角色名称",
          prop: "roleName",
        },
        {
          label: "角色标识",
          prop: "roleAlias",
        },
        {
          label: "角色描述",
          prop: "roleDescription",
        },
      ],
      form: {},
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleAlias: [
          { required: true, message: "请输入角色标识", trigger: "blur" },
        ],
      },
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
    this.form = this._.cloneDeep(this.dialogShow.sendData);
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
      let params = this.form;
      this.loading = true;
      updateRole(params).then(
        (res) => {
          this.$emit("handleUpdate");
          this.$emit("closeDialog", this.dialogShow.key);
          this.loading = false;
          this.$message.success({
            message: "修改成功",
            duriation: 700,
          });
        },
        (err) => {
          this.loading = false;
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-body .el-form {
  justify-content: space-around;
}
</style>
