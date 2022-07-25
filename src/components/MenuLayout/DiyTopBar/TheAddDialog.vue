<template>
  <el-dialog
    v-loading="loading"
    center
    top="10vh"
    width="420px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <span slot="title" class="diy-dialog-title">
      
    </span>
    <div class="diy-dialog-body">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="top"
        status-icon
      >
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-input
            v-if="item.prop === 'tenantName'"
            v-model="form.tenantName"
            placeholder="请输入单位名称"
          ></el-input>
          <el-input
            v-if="item.prop === 'socialCreCode'"
            v-model="form.socialCreCode"
            placeholder="请输入统一社会信用代码"
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
import { mapActions, mapState } from "vuex";
import { applyTenantByUserId } from "@api/user";
import { getTenantByName, addTenant } from "@api/tenant";
import { getRoleIdByTenantId } from "@api/role";
import { validateSocialCreCode } from "@utils/validate";

export default {
  name: "TheAppDialog",
  data() {
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入统一社会信用代码"));
      } else if (!validateSocialCreCode(value)) {
        callback(new Error("请输入符合规范的统一社会信用代码"));
      } else {
        callback();
      }
    };
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "单位名称",
          prop: "tenantName",
        },
        {
          label: "统一社会信用代码",
          prop: "socialCreCode",
        },
      ],
      form: {},
      rules: {
        tenantName: [
          { required: true, message: "请输入单位名称", trigger: "blur" },
        ],
        socialCreCode: [
          { required: true, validator: validateCode, trigger: "blur" },
        ],
      },
      tenantList: [],
      timeout: null,
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
      tenantName: "",
      socialCreCode: "",
      userId: this.userId,
    };
  },
  mounted() {},
  computed: {
    ...mapState("user", ["userId", "userName"]),
  },
  methods: {
    ...mapActions("tenant", ["toggleUnit"]),
    ...mapActions("user", ["changeToken"]),
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },

    handleClick() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.loading = true;
        let params = this.form;
        addTenant(params).then(
          (res) => {
            this.loading = false;
            this.$emit("closeDialog", this.dialogShow.key);
            let params = {
              account: this.userName.accountName,
              tenantCode: res.data.data,
            };
            getRoleIdByTenantId(params).then((res) => {
              const {tenantCode, tokenType, accessToken } = res.data.data;
              this.changeToken(tokenType + " " + accessToken);
              this.$message.success({
                message: "创建成功",
                duriation: 700,
              });
              this.toggleUnit(tenantCode);
            });
          },
          (err) => {
            this.loading = false;
          }
        );
      });
    },

    querySearchAsync(queryString, cb) {
      let params = {
        tenantName: queryString,
      };
      getTenantByName(params).then((res) => {
        this.tenantList = res.data.data;
      });

      let tenantList = this.tenantList;
      let results = queryString
        ? tenantList.filter(this.createStateFilter(queryString))
        : "";

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },

    createStateFilter(queryString) {
      return (state) => {
        return (
          state.tenantName.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },

    handleSelect(item) {
      this.form.tenantCode = item.tenantCode;
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
</style>
