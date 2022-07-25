<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    center
    top="10vh"
    width="420px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title">
      申请单位
    </span>
    <div class="diy-dialog-body">
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-select
            v-if="item.prop === 'tenantName'"
            v-model="form.tenantCode"
            filterable
            remote
            reserve-keyword
            placeholder="请输入单位名称"
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="item in tenantList"
              :key="item.tenantCode"
              :label="item.tenantName"
              :value="item.tenantCode"
            >
            </el-option>
          </el-select>
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
import { mapState } from "vuex";
import { applyTenantByUserId } from "@api/user";
import { getTenantByName } from "@api/tenant";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "单位名称",
          prop: "tenantName",
        },
      ],
      form: {},
      rules: {
        tenantName: [
          { required: true, message: "请输入单位名称", trigger: "blur" },
        ],
      },
      loading: false,
      tenantList: [],
      timeout: null,
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
      tenantCode: "",
      id: this.userId,
    };
  },
  mounted() {},
  computed: {
    ...mapState("user", ["userId"]),
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },

    handleClick() {
      if (this.form.tenantCode) {
        this.loading = true;
        let params = this.form;
        applyTenantByUserId(params).then(
          (res) => {
            this.loading = false;
            this.$emit("closeDialog", this.dialogShow.key);
            this.$message.success({
              message: "申请成功，等待审核",
              duriation: 700,
            });
            this.$parent.loadData();
          },
          (err) => {
            this.loading = false;
          }
        );
      } else {
        this.$message.warning({
          message: "请选择单位",
          duriation: 700,
        });
      }
    },

    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          let params = {
            tenantName: query,
          };
          getTenantByName(params).then((res) => {
            this.tenantList = res.data.data;
          });
        }, 200);
      } else {
        this.options = [];
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
