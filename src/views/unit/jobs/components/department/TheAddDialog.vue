<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
    center
    top="10vh"
    width="700px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title"> 新增部门 </span>
    <div class="body-container diy-dialog-body">
      <div class="body-container__title">部门信息</div>
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-input
            v-if="item.prop === 'agencyName'"
            v-model="form.agencyName"
            placeholder="请输入部门名称"
          ></el-input>
          <el-input
            v-if="item.prop === 'agencyCode'"
            v-model="form.agencyCode"
            placeholder="请输入部门编码"
          ></el-input>
          <el-cascader
            v-if="item.prop === 'parentId'"
            v-model="form.parentId"
            :options="departmentTree"
            :show-all-levels="false"
            :props="{
              label: 'agencyName',
              value: 'id',
              emitPath: false,
              expandTrigger: 'hover',
              checkStrictly: true,
            }"
            placeholder="请选择上级部门"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
    </div>
    <div class="body-container body-item">
      <div class="body-item-header">
        <div class="body-container__title">分配人员</div>
      </div>
      <div class="body-item-main">
        <TheUserTransfer ref="userTransfer" :type="'add'"> </TheUserTransfer>
      </div>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { omitDeepLodash } from "@utils/index";
import { DebounceBy } from "@utils/debounce";
import { addDepartment, getDepartmentTree, getDeptCode } from "@api/department";
import TheUserTransfer from "./TheUserTransfer";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "部门名称",
          prop: "agencyName",
        },
        {
          label: "部门编码",
          prop: "agencyCode",
        },
        {
          label: "上级部门",
          prop: "parentId",
        },
      ],
      form: {},
      rules: {
        agencyName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
        ],
        agencyCode:[
          { required: true, message: "请输入部门编码", trigger: "blur" },
        ],
      },
      departmentTree: [],
      loading: false,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  components: { TheUserTransfer },
  created() {
    this.form = {
      agencyName: "",
      parentId: 13,
      userIds: "",
      tenantCode: this.curTenantCode,
    };
    this.loadDepartmentTree();
  },
  mounted() {
    this.getDepartCode();
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
  },
  methods: {
    // 获取部门id
    getDepartCode() {
      let params = {
        tenantCode: this.curTenantCode,
      };
      getDeptCode(params).then((res) => {
        this.$set(this.form, "agencyCode", res.data.data);
      });
    },
    loadDepartmentTree() {
      let params = {
        tenantCode: this.curTenantCode,
      };
      getDepartmentTree(params).then((res) => {
        let data = res.data.data;
        this.departmentTree = omitDeepLodash(data[0].children, ["children"]);
      });
    },
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleClick: DebounceBy(function(value) {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return this.$message.warning("请填写正确信息");
        }
        this.loading = true;
        if (!this.form.parentId) {
          this.form.parentId = 13;
        }
        this.form.userIds = this.$refs.userTransfer.$children[0].value.join(
          ","
        );
        let params = this.form;
        addDepartment(params).then(
          (res) => {
            this.loading = false;
            this.$emit("closeDialog", this.dialogShow.key);
            this.$parent.loadData();
            this.$message.success({
              message: "新增成功",
              duriation: 700,
            });
          },
          (err) => {
            this.loading = false;
          }
        );
      });
    }, 1000),
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-cascader .el-input {
  width: 250px !important;
}
.diy-dialog-body {
  justify-content: space-between;
  .el-form {
    justify-content: space-between;

    .el-input {
      width: 250px;
    }
  }
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 20px;
}
.body-container {
  padding: 10px 20px;
  border: 1px solid rgba(235, 238, 245, 1);
  border-radius: 4px;

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 30px;
    color: rgba(48, 49, 51, 1);
  }
}
.body-item {
  margin-top: 10px;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-main {
    width: 100%;
    margin-top: 10px;
  }

  .diy-table {
    padding: 0;
  }
}
::v-deep .el-dialog__body {
  overflow: auto;
}
.diy-dialog-body {
  justify-content: space-between;
  .el-form {
    justify-content: space-between;
    .el-input {
      width: 150px;
    }
  }
}
</style>
<style lang="scss" scoped>
.body-container ::v-deep .el-form {
  .el-cascader,
  .el-input {
    width: 250px;
  }
}
::v-deep .el-textarea__inner {
  height: 200px;
}
::-webkit-scrollbar {
  width: 8px;
  height: 7px;
  background: #ffffff;
}
::-webkit-scrollbar-thumb {
  height: 0px;
  border-radius: 4px;
  background: #90939928;
}
::-webkit-scrollbar-thumb:hover {
  width: 8px;
  background: #90939967;
}
::v-deep.diy-dialog-body {
  border: 0 !important;
}
::v-deep .el-tabs__header {
  margin: 0px !important;
}
::v-deep .el-dialog__body {
  height: 556px;
}
.progress-box {
  width: fit-content;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.tabs {
  width: 490px;
}
.diy-dialog-box {
  border: 1px solid rgba(235, 238, 245, 1);
  padding: 10px;
  display: flex;
  flex-direction: column;
  &__checkBox {
    border: 1px solid rgba(235, 238, 245, 1);
    padding: 10px;
  }
  &__radio {
    margin-top: 10px;
    border: 1px solid rgba(235, 238, 245, 1);
    padding: 10px;
  }
  &-treeBox {
    display: flex;
    flex-direction: row;
    margin-top: 5px;
  }
  &-left,
  &-right {
    width: 50%;
    padding: 16px;
    border: 1px solid rgba(235, 238, 245, 1);
  }
}
.layout-role {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(235, 238, 245, 1);
}
.diy-dialog-body {
  border: 1px solid rgba(235, 238, 245, 1);
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  justify-content: flex-start;
  &--left,
  &--right {
    width: 50%;
    height: 500px;
    padding: 16px;
  }

  &--left {
    border-right: 1px solid rgba(235, 238, 245, 1);
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    height: 20px;
    color: rgba(48, 49, 51, 1);
  }

  &__list {
    height: 440px;
    margin-top: 10px;
    overflow-y: scroll;

    li {
      overflow: hidden;
      height: 26px;
      line-height: 26px;
      display: flex;
      justify-content: space-between;

      i {
        margin-right: 5px;
        color: #c0c4cc;
        cursor: pointer;

        &:hover {
          color: #9da1a8;
        }
      }
    }
  }
}
::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
</style>
