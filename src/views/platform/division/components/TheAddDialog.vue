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
    <span slot="title" class="diy-dialog-title"> 新增区划 </span>
    <div class="body-container diy-dialog-body">
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
            placeholder="请输入区划简称"
          ></el-input>
          <el-input
            v-if="item.prop === 'allName'"
            v-model="form.allName"
            placeholder="请输入区划全称"
          ></el-input>
          <el-input
            v-if="item.prop === 'code'"
            maxlength="12"
            onkeyup="value=value.replace(/[^\d\.]/g,'')"
            v-model="form.code"
            placeholder="请输入区划编码"
          ></el-input>
          <el-cascader
            v-if="item.prop === 'pid'"
            v-model="form.pid"
            :show-all-levels="false"
            :options="division"
            :props="propsName"
          >
          </el-cascader>
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
import { getAdministrativeTreeV2, administraSubmit } from "@api/tenant";
import { addDepartment } from "@api/department";
import {
  createGroup,
  getGroupTree,
  getAllTenantListFromGroup,
} from "@api/group";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "区划简称",
          prop: "name",
        },
        {
          label: "区划全称",
          prop: "allName",
        },
        {
          label: "区划编码",
          prop: "code",
        },
        {
          label: "父区划",
          prop: "pid",
        },
      ],
      form: {},
      rules: {
        name: [{ required: true, message: "请输入区划简称", trigger: "blur" }],
        allName: [
          { required: true, message: "请输入区划全称", trigger: "blur" },
        ],
        code: [{ required: true, message: "请输入区划编码", trigger: "blur" }],
      },
      groupTree: [],
      unitList: [],
      propsName: { expandTrigger: "hover", checkStrictly: true },
      loading: false,
      current: 1,
      searchName: "",
      division: [],
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.getTree();
  },
  computed: {
    ...mapGetters("group", ["curGroupId"]),
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  methods: {
    async getTree() {
      let res = await getAdministrativeTreeV2();
      this.division = res.data.data;
    },
    handleClose(data) {
      this.$emit("closeDialog", this.dialogShow.key, data);
    },
    handleClick() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let pid = ''
          let params = {
            name: this.form.name,
            allName: this.form.allName,
            code: this.form.code,
          };
          if(this.form.pid){
            pid = this.form.pid[this.form.pid.length -1]
          }else{
            pid = ''
          }
          params.pid = pid
          administraSubmit(params).then((res)=>{
            this.$message.success('添加成功')
            this.$parent.loadlistData()
            this.handleClose()
          })
        }
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
