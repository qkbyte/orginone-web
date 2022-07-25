<template>
  <el-dialog
    center
    top="10vh"
    width="700px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <span slot="title" class="diy-dialog-title"> 创建下级节点 </span>
    <div class="body-container diy-dialog-body">
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-input
            v-if="item.prop === 'groupName'"
            v-model="form.groupName"
            placeholder="请输入节点名称"
          ></el-input>
          <el-input
            v-if="item.prop === 'groupDescription'"
            v-model="form.groupDescription"
            placeholder="请输入节点描述"
          ></el-input>
          <el-cascader
            v-if="item.prop === 'groupId'"
            v-model="form.groupId"
            :options="groupTree"
            :show-all-levels="false"
            :props="{
              label: 'groupName',
              value: 'id',
              emitPath: false,
              expandTrigger: 'hover',
              checkStrictly: true,
            }"
            placeholder="请选择上级节点"
          >
          </el-cascader>
          <!-- <el-cascader
            v-if="item.prop === 'tenantCode'"
            v-model="form.tenantCode"
            :options="unitList"
            :show-all-levels="false"
            :props="{
              label: 'unitName',
              value: 'tenantCode',
              emitPath: false,
              expandTrigger: 'hover',
              checkStrictly: true,
            }"
            placeholder="请选择管理单位"
          >
          </el-cascader> -->
          <el-select
            v-if="item.prop === 'tenantCode'"
            v-model="form.tenantCode"
            filterable
            :filter-method="filter"
            placeholder="请选择"
            v-loadmore="incomLoadmore"
          >
            <el-option
              v-for="item in unitList"
              :key="item.value"
              :label="item.unitName"
              :value="item.tenantCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose('cancel')">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { omitDeepLodash } from "@utils/index";
import { addDepartment } from "@api/department";
import {
  createGroup,
  getGroupTree,
  getAllTenantListFromGroup,
} from "@api/group";
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
          label: "节点名称",
          prop: "groupName",
        },
        {
          label: "节点描述",
          prop: "groupDescription",
        },
        {
          label: "上级节点",
          prop: "groupId",
        },
        {
          label: "管理单位",
          prop: "tenantCode",
        },
      ],
      form: {},
      rules: {
        groupName: [
          { required: true, message: "请输入节点名称", trigger: "blur" },
        ],
        groupId: [
          { required: true, message: "请选择上级节点", trigger: "blur" },
        ],
        tenantCode: [
          { required: true, message: "请选择管理单位", trigger: "blur" },
        ],
      },
      groupTree: [],
      unitList: [],
      loading: false,
      current: 1,
      searchName: "",
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
    if (this.$parent.parent === -1) this.$parent.parent = "";
    this.form = {
      groupName: "",
      tenantCode: "",
      groupDescription: "",
      groupId: this.$parent.parent || this.curGroupId,
    };
    this.loadGroupTree();
    this.loadUnitList();
  },
  mounted() {},
  computed: {
    ...mapGetters("group", ["curGroupId"]),
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  methods: {
    filter(val) {
      this.searchName = val;
      this.unitList = [];
      this.loadUnitList();
    },
    incomLoadmore() {
      this.current++;
      this.loadUnitList();
    },
    loadGroupTree() {
      let params = {
        groupId: this.curGroupId,
        sourceGroupId: this.curGroupId,
      };
      getGroupTree(params).then((res) => {
        let data = res.data.data;
        this.groupTree = omitDeepLodash(data, ["children"]);
      });
    },
    loadUnitList() {
      let params = {
        current: this.current,
        size: 20,
        groupId: this.curGroupId,
        name: this.searchName,
      };
      getAllTenantListFromGroup(params).then((res) => {
        this.unitList = this.unitList.concat(res.data.data.records);
      });
    },
    handleClose(data) {
      this.$emit("closeDialog", this.dialogShow.key, data);
    },
    handleClick() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return this.$message.warning("请填写正确信息");
        }
        this.loading = true;
        let params = this.form;
        await createGroup(params).then(
          async (res) => {
            this.loading = false;
            this.$emit("closeDialog", this.dialogShow.key);
            this.$message.success({
              message: "创建成功",
              duriation: 700,
            });
          },
          (err) => {
            this.loading = false;
          }
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-select {
  width: 100% !important;
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
  margin-right: 10px;
}
.body-container {
  margin-top: 10px;

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

<style lang="scss" scoped>
.body-container ::v-deep .el-form {
  .el-cascader,
  .el-input {
    width: 280px;
  }
}
::v-deep .el-dialog__body {
  overflow: auto;
   height: 260px;
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
