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
      新增用户
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
            v-if="item.prop === 'realName'"
            v-model="form.realName"
            placeholder="请输入姓名"
          ></el-input>
          <el-select
            v-if="item.prop === 'roleIds'"
            multiple
            v-model="form.roleIds"
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-input
            v-if="item.prop === 'phoneNumber'"
            v-model.number="form.phoneNumber"
            placeholder="请输入手机号码"
          ></el-input>
          <el-input
            v-if="item.prop === 'idCard'"
            v-model="form.idCard"
            placeholder="请输入身份证"
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
import { addUser } from "@api/user";
import { getRoleListByTenantId } from "@api/role";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "手机号码",
          prop: "phoneNumber",
        },
        {
          label: "角色",
          prop: "roleIds",
        },
        {
          label: "姓名",
          prop: "realName",
        },
        {
          label: "身份证",
          prop: "idCard",
        },
      ],
      form: {},
      rules: {
        realName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        roleIds: [{ required: true, message: "请选择角色", trigger: "blur" }],
        phoneNumber: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            type: "number",
            message: "手机号必须为数字",
            trigger: "blur",
          },
        ],
        idCard: [{ required: true, message: "请输入身份证", trigger: "blur" }],
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
      params.roleIds = params.roleIds.join(",");
      addUser(params).then(
        (res) => {
          this.loading = false;
          this.$parent.loadlistData();
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
