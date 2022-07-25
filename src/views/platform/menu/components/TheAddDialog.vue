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
    <span slot="title" class="diy-dialog-title"> 新增菜单 </span>
    <div class="diy-dialog-body">
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-input
            v-if="item.prop === 'name'"
            v-model="form.name"
            placeholder="请输入名称"
          ></el-input>
          <el-input
            v-if="item.prop === 'path'"
            v-model="form.path"
            placeholder="请输入路由"
          ></el-input>
          <div v-if="item.prop === 'type'" class="form-radio">
            <el-radio v-model="form.category" label="1">菜单</el-radio>
            <el-radio v-model="form.category" label="2">按钮</el-radio>
          </div>
          <el-input
            v-if="item.prop === 'icon'"
            v-model="form.icon"
            placeholder="请输入图标"
          ></el-input>
          <el-cascader
            v-if="item.prop === 'parentId'"
            v-model="form.parentId"
            :options="menuTree"
            :props="{
              label: 'name',
              value: 'id',
              emitPath: false,
              expandTrigger: 'hover',
              checkStrictly: true,
            }"
            placeholder="请选择上级菜单"
            clearable
          >
          </el-cascader>
          <el-input
            v-if="item.prop === 'alias'"
            v-model="form.alias"
            placeholder="请输入别名"
          ></el-input>
          <el-input-number
            v-if="item.prop === 'sort'"
            v-model="form.sort"
            :min="0"
          ></el-input-number>
          <el-input
            type="textarea"
            v-if="item.prop === 'remark'"
            v-model="form.remark"
            placeholder="请输入备注信息"
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
import { addMenu, getMenuTree } from "@api/menu";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "名称",
          prop: "name",
        },
        {
          label: "别名",
          prop: "alias",
        },
        {
          label: "类型",
          prop: "type",
        },
        {
          label: "路由",
          prop: "path",
        },
        {
          label: "图标",
          prop: "icon",
        },
        {
          label: "上级菜单",
          prop: "parentId",
        },
        {
          label: "排序",
          prop: "sort",
        },
        {
          label: "备注",
          prop: "remark",
        },
      ],
      form: {},
      rules: {
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        path: [{ required: true, message: "请输入菜单路由", trigger: "blur" }],
        source: [
          { required: true, message: "请输入菜单图标", trigger: "blur" },
        ],
        alias: [{ required: true, message: "请输入菜单别名", trigger: "blur" }],
        type: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
      },
      menuTree: [],
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
      action: 0,
      category: "1",
      isDeleted: 0,
      isOpen: 0,
      name: "",
      path: "",
      alias: "",
      source: "",
      parentId: 0,
      sort: "0",
      code: "",
      remark: "",
      tenantCode: this.curTenantCode,
    };
    this.loadData();
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  methods: {
    loadData() {
      getMenuTree().then((res) => {
        this.menuTree = res.data.data;
      });
    },
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleClick() {
      this.loading = true;
      let params = this.form;
      if (!this.form.parentId) {
        this.form.parentId = 0;
      }
      this.form.code = this.form.alias;
      addMenu(params).then(
        (res) => {
          this.$emit("handleUpdate");
          this.$emit("closeDialog", this.dialogShow.key);
          this.loading = false;
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
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-body .el-form {
  justify-content: space-around;
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 20px;
}
::v-deep .el-dialog__body {
  overflow: auto;
  height: 480px;
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
