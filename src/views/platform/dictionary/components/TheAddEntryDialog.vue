<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
    center
    width="725px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    class="abow_dialog"
  >
    <span slot="title" class="diy-dialog-title"> 新增条目 </span>
    <div class="body-container diy-dialog-body">
      <div class="body-container__title">条目信息</div>
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-input
            v-if="item.prop === 'code'"
            v-model="form.code"
            placeholder="请输入条目编码"
          ></el-input>
          <el-input
            v-if="item.prop === 'dictValue'"
            v-model="form.dictValue"
            placeholder="请输入条目名称"
          ></el-input>
          <el-input
            v-if="item.prop === 'dictKey'"
            v-model="form.dictKey"
            placeholder="请输入条目值"
          ></el-input>
          <el-input
            v-if="item.prop === 'sort'"
            v-model.number="form.sort"
            placeholder="请输入条目排序"
          ></el-input>
          <el-input
            v-if="item.prop === 'remark'"
            v-model.number="form.remark"
            type="textarea"
            placeholder="请输入条目备注"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick('form')">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import TheDictItemTable from "./TheDictItemTable";
import { submit, getDictByKey } from "@api/dict";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      version: "0",
      tableData: [],
      formItem: [
        {
          label: "条目编码",
          prop: "code",
        },
        {
          label: "条目名称",
          prop: "dictValue",
        },
        {
          label: "条目Key",
          prop: "dictKey",
        },
        {
          label: "条目排序",
          prop: "sort",
        },
        {
          label: "条目备注",
          prop: "remark",
          class: "form-item--all",
        },
      ],
      form: {},
      rules: {
        code: [{ required: true, message: "请输入条目编号", trigger: "blur" }],
        dictKey: [{ required: true, message: "请输入条目值", trigger: "blur" }],
        dictValue: [
          { required: true, message: "请输入条目名称", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入条目排序", trigger: "blur" }],
      },
      loading: false
    };
  },
  components: { TheDictItemTable },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    //debugger;
    this.form = {
      code:this.$parent.dictData.code,
      dictValue: '',
      dictKey:'',
      sort: '',
      remark: ''
    };
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleClick(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          debugger
          console.log('asd', this.dialogShow.sendData);
          let params = this.form
          params.parentId = this.dialogShow.sendData.id
          params.version=this.dialogShow.sendData.currversion
          params.currversion=this.dialogShow.sendData.currversion
         console.log(params);
          // debugger;
          submit(params).then((res) => {
            if(res.data.code == 200){
              this.$message.success('添加条目成功')
              this.$parent.loadData()
              this.handleClose()
            }
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
.diy-dialog-body {
  justify-content: space-between;
  .el-form {
    justify-content: space-between;
  }
}
.body-item {
  margin-top: 10px;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .diy-table {
    padding: 0;
  }
}

.abow_dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    .el-dialog {
        margin: 0 auto !important;
        height: 90%;
        overflow: hidden;
        .el-dialog__body {
            position: absolute;
            left: 0;
            top: 54px;
            bottom: 0;
            right: 0;
            padding: 0;
            z-index: 1;
            overflow: hidden;
            overflow-y: auto;
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
