<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="提交中"
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
          <el-autocomplete
            v-if="item.prop === 'tenantName'"
            v-model="form.tenantName"
            value-key="tenantName"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect"
            placeholder="请输入单位名称"
          ></el-autocomplete>
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
        labelWidth: "100px"
      },
      formItem: [
        {
          label: "单位名称",
          prop: "tenantName"
        }
      ],
      form: {},
      rules: {
        tenantName: [
          { required: true, message: "请输入单位名称", trigger: "blur" }
        ]
      },
      tenantList: [],
      timeout: null,
      loading = false
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {}
    }
  },
  created() {
    this.form = {
      tenantName: "",
      tenantCode: "",
      id: this.userId
    };
  },
  mounted() {},
  computed: {
    ...mapState("user", ["userId"])
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },

    handleClick() {
      this.loading = true
      let params = this.form;
      applyTenantByUserId(params).then(
        res => {
          this.loading = false
          this.$parent.loadlistData();
          this.$emit("closeDialog", this.dialogShow.key);
          this.$message.success({
            message: "申请成功，等待审核",
            duriation: 700
          });
        },
        err => {
          this.loading = false
        }
      );
    },

    querySearchAsync(queryString, cb) {
      let params = {
        tenantName: queryString
      };
      getTenantByName(params).then(res => {
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
      return state => {
        return (
          state.tenantName.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },

    handleSelect(item) {
      this.form.tenantCode = item.tenantCode;
    }
  }
};
</script>

<style lang="scss" scoped>
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
</style>
