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
    <span slot="title" class="diy-dialog-title"> 新增字典 </span>
    <div class="body-container diy-dialog-body">
      <div class="body-container__title">字典信息</div>
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
            placeholder="请输入字典编号"
          ></el-input>
          <el-input
            v-if="item.prop === 'dictValue'"
            v-model="form.dictValue"
            placeholder="请输入字典名称"
          ></el-input>
          <el-input
            v-if="item.prop === 'sort'"
            v-model.number="form.sort"
            placeholder="请输入字典排序"
          ></el-input>
          <el-input
            v-if="item.prop === 'remark'"
            v-model.number="form.remark"
            type="textarea"
            placeholder="请输入字典备注"
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
          label: "字典编号",
          prop: "code",
        },
        {
          label: "字典名称",
          prop: "dictValue",
        },
        {
          label: "字典排序",
          prop: "sort",
        },
        {
          label: "字典备注",
          prop: "remark",
        },
      ],
      form: {},
      rules: {
        code: [{ required: true, message: "请输入字典编号", trigger: "blur" }],
        dictValue: [
          { required: true, message: "请输入字典名称", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入字典排序", trigger: "blur" }],
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
    this.form = {
      code: "",
      dictValue: "",
      sort: "",
      remark: "",
      currversion: 1,
      version:1,
      dictKey: -1,
      dictItem: [],
    };
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleClick() {
      this.loading = true
      let params = this.form;
      submit(params).then(
        (res) => {
          let params3 = {
            filtertext:
              " dict_key=" +
              this.form.dictKey +
              " and code='" +
              this.form.code +
              "'",
          };
          getDictByKey(params3).then((res2) => {
            const {
              id: addparentid,
              currversion: currversion,
            } = res2.data.data[0];
            for (let i = 0; i < this.tableData.length; i++) {
              let params4 = {
                dictValue: this.tableData[i].dictValue,
                code: this.form.code,
                parentId: addparentid,
                version: currversion,
                currversion: currversion,
                dictKey: this.tableData[i].sort,
                sort: this.tableData[i].sort,
              };
              submit(params4).then((res) => {});
            }
          });
          this.$emit("handleUpdate");
          this.$emit("closeDialog", this.dialogShow.key);
          this.loading = false
          this.$message.success({
            message: "新增成功",
            duriation: 700,
          });
        },
        (err) => {
          this.loading = false
        }
      );
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
</style>
