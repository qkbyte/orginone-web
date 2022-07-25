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
    <span slot="title" class="diy-dialog-title">
      修改租户组信息
    </span>
    <div class="diy-dialog-body">
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-input
            v-if="item.prop === 'attrName'"
            v-model="form.attrName"
            placeholder="请输入租户组名称"
          ></el-input>
          <el-input
            type="textarea"
            v-if="item.prop === 'attrRemark'"
            v-model="form.attrRemark"
            placeholder="请输入租户组描述"
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
import { addTenantGroup } from "@api/tenant-group";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "租户组名称",
          prop: "attrName",
        },
        {
          label: "租户组描述",
          prop: "attrRemark",
        },
      ],
      form: {},
      rules: {
        attrName: [
          { required: true, message: "请输入租户组名称", trigger: "blur" },
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
  computed: {},
  watch: {},
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleClick() {
      let params = this.form;
      this.loading = true;
      addTenantGroup(params).then(
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

<style lang="scss" scoped></style>
