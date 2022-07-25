<template>
  <div class="app-info">
    <div class="diy-dialog-body">
      <el-form ref="form" :model="form" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
          :class="item.class ? item.class : ''"
        >
          <el-input
            v-if="item.prop === 'contact'"
            v-model="form.contact"
            placeholder="请输入联系方式"
          ></el-input>
          <el-select
            v-if="item.prop === 'platform'"
            v-model="form.platform"
            placeholder="请选择所属平台"
          >
            <el-option
              v-for="item in platform"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="item.prop === 'status'"
            v-model="form.status"
            placeholder="请选择应用类型"
          >
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-if="item.prop === 'appName'"
            v-model="form.appName"
            placeholder="请输入应用名称"
          ></el-input>
          <el-input
            v-if="item.prop === 'version'"
            v-model="form.version"
            placeholder="请输入版本号"
          ></el-input>
          <el-input
            v-if="item.prop === 'description'"
            type="textarea"
            maxlength="150"
            show-word-limit
            v-model="form.description"
            placeholder="请输入应用介绍"
          ></el-input>
          <el-input
            v-if="item.prop === 'file'"
            v-model="form.file"
            disabled=""
            placeholder="请上传文件"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "应用名称",
          prop: "appName",
        },
        {
          label: "版本号",
          prop: "version",
        },
        {
          label: "联系方式",
          prop: "contact",
        },
        {
          label: "应用类型",
          prop: "status",
        },
        {
          label: "所属平台",
          prop: "platform",
        },
        {
          label: "应用介绍",
          prop: "description",
          class: "form-item--all",
        },
      ],
      form: {
        appName: "",
        version: "",
        contact: "",
        status: 0,
        platform: 1,
        description: "",
        file: "",
        tenantId: "",
        saleStatus: 0,
      },
      types: [
        {
          value: 0,
          label: "无",
        },
        {
          value: 1,
          label: "资产应用",
        },
        {
          value: 2,
          label: "人事应用",
        },
        {
          value: 3,
          label: "其他",
        },
      ],
      platform: [
        {
          value: 0,
          label: "移动端",
        },
        {
          value: 1,
          label: "PC端",
        },
        {
          value: 2,
          label: "自适应",
        },
      ],
    };
  },
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    formData: {
      handler(newValue, oldValue) {
        this.form = this.formData;
      },
      deep: true,
    },
  },
  created() {
    this.form.tenantId = this.curTenantCode;
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
};
</script>

<style lang="scss" scoped>
.app-info {
  width: 100%;
  .diy-dialog-body .el-form {
    justify-content: space-between;
  }
}
</style>

<style lang="scss" scoped>
.diy-dialog-body ::v-deep .el-form-item {
  &__label {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: rgba(144, 147, 153, 1);
  }

  &__content {
    .el-input,
    .el-textarea {
      &__inner,
      &__count {
        background: rgba(242, 244, 249, 1);
        border: 0px;
        border-radius: 4px;
      }
    }

    .el-input,
    .el-select {
      width: 340px;
    }

    .el-textarea {
      &__inner {
        height: 80px;
      }
    }
  }
}
.diy-dialog-body ::v-deep .form-item--all {
  width: 100%;
  .el-input,
  .el-textarea {
    width: 100%;
  }
}
</style>
