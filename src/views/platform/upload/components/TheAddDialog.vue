<template>
  <el-dialog
      v-loading="loading"
      title="新增导入模板"
      :visible.sync="dialogShow.value"
      width="35%"
      class="dialog-person"
      :close-on-click-modal='false'
      @close="handleClose('ruleForm')"
    >
      <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="上传模板" prop="type">
              <el-select v-model="ruleForm.type" placeholder="请选择上传模板">
                  <el-option v-for="(item, index) in selectType" :key="index" :label="item.label" :value="item.key"></el-option>
              </el-select>
          </el-form-item>
      </el-form>
      <div class="diy-dialog-body">
        <div
            class="import"
            @dragenter="dragenter($event)"
            @drop="enentDrop($event)"
            @dragleave="dragleave($event)"
            @dragover="dragover($event)"
        >
            <img class="import__img" src="@assets/upload-icon.png" alt="" />
            <span class="import__text">{{ drapText }}</span>
            <el-upload
              :action="uploadUrl"
              mulitiply
              :show-file-list="false"
              :on-success="handleSuccess"
              :headers="uploadHeaders"
              :before-upload="beforeUpload"
              :on-error="handleError"
              :data="param"
            >
            <el-button size="small" type="text" v-if="flag">点击上传</el-button>
            </el-upload>
        </div>
      </div>
    </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { importUplod } from "@api/upload";


export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "150px",
      },
      ruleForm: {
        type:'1',
      },
      selectType:[
        {
          label:'人员导入模板',
          key: '1'
        },
        {
          label:'部门导入模板',
          key: '2'
        },
        {
          label:'岗位导入模板',
          key: '3'
        },
        {
          label:'租户导入模板',
          key: '4'
        },
        {
          label:'集团关系导入模板',
          key: '5'
        },
        {
          label:'集团单位关系导入模板',
          key: '6'
        },
        {
          label:'集团岗位导入模板',
          key: '7'
        },
        {
          label:'无管理员租户导入模板',
          key: '8'
        },
        {
          label:'补充管理员导入模板',
          key: '9'
        },
        {
          label:'补充手机号导入模板',
          key: '10'
        },
        {
          label:'主单位导入模板',
          key: '11'
        },

      ],
      loading: false,
      drapText: "将文件拖至此处，或",
      flag: true,
      uploadHeaders: {
        Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
        "blade-auth": localStorage.getItem("ZCY_TOKEN"),
      },
      param:{},
      uploadUrl:'/dev-api/asset-minio/aliyunoss/uploadImportTemplate'
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  watch:{
    ruleForm:{
      handler(val){
        this.param = val
      },
      deep:true,
      immediate:true
    }
  },
  created() {},
  mounted() {
    let token = localStorage.getItem("ZCY_TOKEN");
    this.uploadHeader = {
      Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
      "blade-auth": token,
    };
  },
  computed: {
  },
  methods: {
    handleClose(formRef) {
      this.$refs[formRef].resetFields();
      this.$emit('closeDialog', this.dialogShow.key)
    },
    enentDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      console.log('jhinru');
      this.updataFun(e.dataTransfer.files);
    },
    dragleave(e) {
      e.stopPropagation();
      e.preventDefault();
      this.drapText = "将文件拖至此处，或";
      this.flag = true;
    },
    dragenter(e) {
      e.stopPropagation();
      e.preventDefault();
      this.drapText = "松开鼠标完成上传";
      this.flag = false;
    },
    dragover(e) {
      e.stopPropagation();
      e.preventDefault();
    },

    // 拖动文件时，上传函数
    updataFun(data) {
      this.loading = true;
      let fileData = data[0];
      let formData = new FormData();
      formData.append("file", fileData);
      formData.append("type", this.param.type)
      try {
        importUplod(formData).then((res) => {
          this.handleSuccess(res.data)
        })
      }catch (error) {
        this.handleError();
      }
      
      // this.$emit("handleImport", formData, (res) => {
      //   if (res) {
      //     this.handleSuccess(res);
      //   } else {
      //     this.handleError();
      //   }
      // });
    },

    beforeUpload() {
      this.loading = true;
    },
    handleSuccess(res, file, fileList) {
      console.log('res', res);
      this.$emit("handleUpdate");
      this.$emit("closeDialog", this.dialogShow.key);
      this.loading = false;
      if(res.code == 200){
        this.$message.success("上传成功");
      }else if(res == true){
        this.$message.success("上传成功");
      }
      else{
        this.$message.error(res.msg)
      }
    },
    handleError() {
      // this.$message.error("上传失败");
      this.loading = false;
      this.drapText = "将文件拖至此处，或";
      this.flag = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-body .el-form {
  justify-content: space-around;
}
.import {
  background: rgba(235, 238, 245, 1);
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;

  &__img {
    width: 22px;
    height: 22px;
    margin-right: 5px;
    -webkit-user-drag: none;
    pointer-events: none;
  }

  &__text {
    pointer-events: none;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #909399;
  }
}
</style>
