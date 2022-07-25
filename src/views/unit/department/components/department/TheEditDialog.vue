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
    <span slot="title" class="diy-dialog-title"> 编辑部门 </span>
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
        <TheUserTransfer ref="userTransfer" :type="'edit'" :select="select">
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
import { mapGetters, mapActions } from "vuex";
import { omitDeepLodash } from "@utils/index";
import { DebounceBy } from "@utils/debounce";
import { updateDepartment, getParentDepartmentTree } from "@api/department";
import { getHasSelectUserList } from "@api/user";
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
      loading: false,
      select: [],
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
    this.form = this._.cloneDeep(this.dialogShow.sendData);
    this.loadDepartmentTree();
    this.getSelect();
  },
  computed: {
    ...mapGetters("tenant", ["curTenant", "curTenantCode"]),
  },
  methods: {
    ...mapActions("menu", ["updateAppMenu"]),
    loadDepartmentTree() {
      let params = {
        deptId: this.dialogShow.sendData.id,
      };
      getParentDepartmentTree(params).then((res) => {
        let data = res.data.data;
        this.departmentTree = omitDeepLodash(data[0].children, ["children"]);
      });
    },
    getSelect() {
      let params = {
        tenantCode: this.curTenantCode,
        jobId: "",
        deptId: this.dialogShow.sendData.id,
      };
      getHasSelectUserList(params).then((res) => {
        this.select = res.data.data;
      });
    },
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleClick: DebounceBy(async function(value) {
      this.loading = true;
      if (!this.form.parentId) {
        this.form.parentId = 13;
      }
      let params = {};
      if (this.form.agencyName === this.dialogShow.sendData.agencyName) {
        params = {
          deptId: this.form.id,
          pId: this.form.parentId,
          personIds: [this.$refs.userTransfer.$children[0].value],
        };
      } else {
        params = {
          deptId: this.form.id,
          pId: this.form.parentId,
          deptName: this.form.agencyName,
          personIds: [this.$refs.userTransfer.$children[0].value],
        };
      }
      await updateDepartment(params).then(
        (res) => {
          this.$emit("handleUpdate");
          this.$emit("closeDialog", this.dialogShow.key);
          this.loading = false;

          this.$parent.$refs.deptTree.loadData();
          this.$parent.mainTableData[0].value1 = this.$parent.curNode.agencyName = this.form.agencyName;
          this.$message.success({
            message: "修改成功",
            duriation: 700,
          });
        },
        (err) => {
          this.loading = false;
        }
      );
      this.updateAppMenu();
    }, 1000),
  },
};
</script>

<style lang="scss" scoped>
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
::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
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
</style>
