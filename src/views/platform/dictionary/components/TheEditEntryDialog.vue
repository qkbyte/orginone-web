<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
    center
    width="725px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title"> 编辑条目 </span>
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
            placeholder="请输入条目编号"
          ></el-input>
          <el-input
            v-if="item.prop === 'dictValue'"
            v-model="form.dictValue"
            placeholder="请输入条目值"
          ></el-input>
          <el-input
            v-if="item.prop === 'dictKey'"
            v-model.number="form.dictKey"
            placeholder="请输入条目键"
          ></el-input>
          <el-input
            v-if="item.prop === 'sort'"
            v-model.number="form.sort"
            placeholder="请输入条目排序"
          ></el-input>
          <el-select v-loadmore="incomLoadmore" v-if="item.prop === 'entry'" v-model="selectValue" placeholder="请选择上级条目">
            <el-option
                v-for="item in selectData"
                :key="item.id"
                :label="item.dictValue"
                :value="item.id">
            </el-option>
          </el-select>
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
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import TheDictItemTable from "./TheDictItemTable";
import { submit, getDictMax, getDictItem } from "@api/dict";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "条目编号",
          prop: "code",
        },
        {
          label: "条目值",
          prop: "dictValue",
        },
        {
          label: "条目键",
          prop: "dictKey",
        },
        {
          label: "条目排序",
          prop: "sort",
        },
        {
          label: "上级条目",
          prop: "entry",
        },
        {
          label: "条目备注",
          prop: "remark",
        },
      ],
      form: {},
      version: "0",
      tableData: [],
      rules: {
        code: [{ required: true, message: "请输入条目编号", trigger: "blur" }],
        dictValue: [
          { required: true, message: "请输入条目值", trigger: "blur" },
        ],
        dictKey: [
          { required: true, message: "请输入条目键", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入条目排序", trigger: "blur" }],
      },
      loading: false,
      selectData: [],
      selectValue: '',
      currentPage: 1,
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
    this.form = this._.cloneDeep(this.dialogShow.sendData);
    let params2 = {
      parentid: this.form.id,
    };
    getDictMax(params2).then((res) => {
      this.version = res.data;
      let params3 = {
        parentid: this.form.id,
        version: this.version,
      };
      getDictItem(params3).then((res) => {
        let data = res.data.data;
        this.tableData = data;
      });
    });
  },
  mounted(){
    this.getSelectData()
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  methods: {
    // 获取下拉框的数据
    getSelectData(){},
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleClick() {
      this.loading = true;
      let params = this.form;
      console.log(params);
      submit(params).then(
        (res) => {
          // for (let i = 0; i < this.tableData.length; i++) {
          //   let params4 = {
          //     dictValue: this.tableData[i].dictValue,
          //     code: this.form.code,
          //     parentId: this.form.id,
          //     version: this.version,
          //     currversion: this.version,
          //     dictKey: this.tableData[i].dictKey,
          //     sort: this.tableData[i].sort,
          //   };
          //   if (this.tableData[i].id != null) {
          //     params4.id = this.tableData[i].id;
          //   }
          //   submit(params4).then((res) => {});
          // }
          this.$emit("handleUpdate");
          this.$emit("closeDialog", this.dialogShow.key);
          this.loading = false;
          this.$message.success({
            message: "修改成功",
            duriation: 700,
          });
        },
        (err) => {
          this.loading = false;
        }
      );
    },
    // select 滚动到底部时执行
    incomLoadmore(){
      this.currentPage ++
      this.getSelectData()
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .diy-table__body{
  height: 210px;
}
::v-deep .el-textarea__inner{
  min-height: 30px !important;
}
.body-container {
  padding: 10px 20px;
  border: 1px solid rgba(235, 238, 245, 1);
  border-radius: 4px;
}
.form-text{
    width: 635px !important;
}
.body-container {
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

    .diy-table__btn {
      align-items: center;
    }
  }
}
</style>
