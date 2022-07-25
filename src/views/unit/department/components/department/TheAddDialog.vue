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
        <TheUserTransfer
          ref="userTransfer"
          :type="'add'"
        >
        </TheUserTransfer>
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
import { addDepartment, getDepartmentTree } from "@api/department";
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
          label: "上级部门",
          prop: "parentId",
        },
      ],
      form: {},
      rules: {
        agencyName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
        ],
      },
      departmentTree: [],
      loading: false
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
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
  },
  methods: {
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
    handleClick:DebounceBy(function(value){
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return this.$message.warning("请填写正确信息");
        }
        this.loading = true
        if (!this.form.parentId) {
          this.form.parentId = 13;
        }
        this.form.userIds = this.$refs.userTransfer.$children[0].value.join(",");
        let params = this.form;
        addDepartment(params).then(
          (res) => {
            this.loading = false
            this.$emit("closeDialog", this.dialogShow.key);
            this.$parent.loadData()
            this.$message.success({
              message: "新增成功",
              duriation: 700,
            });
          },
          (err) => {
            this.loading = false
          }
        );
      });
    },1000)
  },
};
</script>

<style lang="scss" scoped>
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
</style>
