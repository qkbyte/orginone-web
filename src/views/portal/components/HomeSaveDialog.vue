<template>
  <el-dialog
    center
    top="10vh"
    width="500px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <span slot="title" class="diy-dialog-title"> 保存模板 </span>
    <div class="diy-dialog-body">
      <div style="margin-top:30px">
        <el-radio v-model="radio" label="1">覆盖</el-radio>
        <el-radio v-model="radio" label="2">新增</el-radio>
      </div>
      <div style="margin-top:30px;margin-right: 52px;">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px"
          v-if="radio == 1"
        >
          <el-form-item label="模板列表" prop="id">
            <el-select v-model="form.id" placeholder="请选择">
              <el-option
                v-for="item in templateList"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px"
          v-if="radio == 2"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="diy-dialog-footer" style="margin-top:20px">
      <el-button type="primary" @click="handleClick('form')">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  marketappcomponenttemplateSubmit,
  getMarketappcomponenttemplateList,
  getMarketappcomponenttemplateGetUserTemplate,
} from "@api/portal";
import { getDictItemList } from "@utils/index";
export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      radio: "1",
      props: { expandTrigger: "hover" },
      form: {},
      loading: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      templateList: [],
      currentPage:1,
      pageSize:9999999,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.loadTemplateData();
  },
  computed: {},
  methods: {
    loadTemplateData() {
      // 模板列表
      let params = {
        current: this.currentPage,
        size: this.pageSize,
      };
      getMarketappcomponenttemplateGetUserTemplate(params).then((res) => {
        const { records } = res.data.data;
        console.log('re', records);
        let arr = []
        records.forEach((el)=>{
          if(el.status == 1){
            arr.push(el)
          }
        })
        this.templateList = arr
      });
    },
    handleClick(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.radio == 1) {
            let params = {
              id: this.form.id,
              config: JSON.stringify(this.dialogShow.sendData),
            };
            marketappcomponenttemplateSubmit(params).then((res) => {
              this.$message.success("添加成功");
              this.$parent.loadTemplateData();
              this.handleClose();
            });
          } else {
            let params = {
              name: this.form.name,
              status: 1,
              config: JSON.stringify(this.dialogShow.sendData),
            };
            marketappcomponenttemplateSubmit(params).then((res) => {
              this.$message.success("添加成功");
              this.$parent.loadUserTemplate('','link');
              this.$parent.menuListShow = true
              this.handleClose();
            });
          }
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-body .el-form {
  justify-content: space-between;
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 20px;
}
.form-shape {
  width: 100%;
}
img {
  width: 200px;
  height: 200px;
}
.photoBtn {
  margin: 20px 0;
  .el-button,
  .el-button--default:focus {
    padding: 8px;
    font-size: 10px;
  }
}
</style>
