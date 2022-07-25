<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
    center
    width="400px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title"> 导入文件 </span>
    <slot name="radio"></slot>
    <div class="diy-dialog-body">
      <div
        v-show="!isShow"
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
      <div class="progress" v-show="isShow">
        <el-progress
          ref="progress"
          type="circle"
          :percentage="percentage"
          :status="status"
        ></el-progress>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { importTenantInfo } from "@api/tenant";
import { getImportProgress, getRemoveProgress } from "@api/user";
export default {
  data() {
    return {
      loading: false,
      drapText: "将文件拖至此处，或",
      flag: true,
      uploadHeaders: {
        Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
        "blade-auth": localStorage.getItem("ZCY_TOKEN"),
      },
      param: {},
      isShow: false,
      myInterval: null,
      percentage: 0,
      progressId: 0,
      status: undefined,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
    uploadUrl: {
      type: String,
      default: "",
    },
    radio: {
      type: String,
      default: "",
    },
    importData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    importData: {
      handler(val) {
        this.param = val;
      },
      deep: true,
      immediate: true,
    },
  },
  mounted(){
    console.log(this.dialogShow);
  },
  beforeDestroy() {
    this.$emit("handleUpdate");
    this.destroyedProgress();
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },

    enentDrop(e) {
      e.stopPropagation();
      e.preventDefault();
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
      // this.loading = true;
      let fileData = data[0];
      let formData = new FormData();
      formData.append("file", fileData);
      if (this.dialogShow.sendData) {
        this.$emit("handleImport", formData, this.dialogShow.sendData, (res) => {
          if (res) {
            this.handleSuccess(res);
          } else {
            this.handleError();
          }
        });
      } else {
        this.$emit("handleImport", formData, (res) => {
          if (res) {
            this.handleSuccess(res);
          } else {
            this.handleError();
          }
        });
      }
    },

    beforeUpload() {
      // this.loading = true;
    },
    handleSuccess(res, file, fileList) {
      // this.$emit("handleUpdate");
      // this.$emit("closeDialog", this.dialogShow.key);
      // this.loading = false;
      // if(res.code == 200){
      //   this.$message.success("上传成功");
      // }else if(res == true){
      //   this.$message.success("上传成功");
      // }
      // else{
      //   this.$message.error(res.msg)
      // }
      if (res) {
        this.isShow = true;
        this.myInterval = setInterval(() => {
          this.getImportProgress(res);
        }, 500);
      }
    },
    getImportProgress(val) {
      this.progressId = val.data;
      let params = {
        progressId: this.progressId,
      };
      getImportProgress(params)
        .then((res) => {
          if (res.data.data.status) {
            this.percentage = res.data.data.value / 2;
            if (this.percentage == 100) {
              // this.loading = false
              this.status = "success";
              clearInterval(this.myInterval);
              this.myInterval = null;
              this.$message.success('导入成功，如有部分错误数据请在导入记录中查看')
            }
          } else {
            this.status = "warning";
            clearInterval(this.myInterval);
            this.myInterval = null;
            this.$message.warning(res.data.data.msg);
            // this.loading = false;
          }
        })
        .catch(() => {
          this.status = "warning";
          clearInterval(this.myInterval);
          this.myInterval = null;
        });
    },
    destroyedProgress() {
      if (this.progressId !== 0) {
        let params = {
          progressId: this.progressId,
        };
        getRemoveProgress(params);
      }
      clearInterval(this.myInterval);
      this.myInterval = null;
    },
    handleError() {
      // this.$message.error("上传失败");
      // this.loading = false;
      this.drapText = "将文件拖至此处，或";
      this.flag = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.progress {
  height: 180px;
  display: flex;
  align-items: center;
}
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
