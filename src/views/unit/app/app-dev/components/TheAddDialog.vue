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
    <span slot="title" class="diy-dialog-title"> 新增图标 </span>
    <div class="body-container">
      <div class="body-container__upload">
        <template v-if="CURRENT_ENV === 'production'">
          <!-- 正式环境 -->
          <el-upload
            class="upload-demo"
            drag
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="uploadHeader"
            :on-remove="handleRemove"
            name="icon"
            action="/dev-api/asset-minio/aliyunoss/uploadIconV2"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过2MB
            </div>
          </el-upload>
        </template>
        <template v-else>
          <!-- 测试环境 -->
          <el-upload
            class="upload-demo"
            drag
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="uploadHeader"
            :on-remove="handleRemove"
            name="icon"
            action="/dev-api/asset-minio/aliyunoss/uploadIconV2"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过2MB
            </div>
          </el-upload>
        </template>
      </div>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { omitDeepLodash } from "@utils/index";
import { tenanticonSubmit } from "@api/market";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      loading: false,
      uploadHeader: {
        Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
        "blade-auth": "",
      },
      imageUrl: "",
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
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
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleAvatarSuccess(res, file) {
      let _this = this;
      let photoUrl = res.data;
      this.imageUrl = [...this.imageUrl, photoUrl];
    },
    handleRemove(file, fileList) {
      let del = file.response.data.split("?")[0];
      let index = this.imageUrl.indexOf(del);
      this.imageUrl.splice(index, 1);
      console.log("imageUrl", this.imageUrl);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片要求为 JPG 或 PNG 格式!");
        this.$emit("closeDialog", this.dialogShow.key);
      }
      if (!isLt2M) {
        this.$message.error("上传icon图片大小不能超过 2MB!");
      }
      return (isJPG || isPNG) && isLt2M;
    },
    handleClick() {
      if (this.imageUrl.length == 0) {
        this.$message.warning('请上传icon')
      } else {
        this.loading = true;
        let arr = this.imageUrl.join(",");
        let params = {
          urls: arr,
          tenantCode: this.curTenantCode,
        };
        console.log("上传图标传递的参数", params);
        tenanticonSubmit(params).then(
          (res) => {
            this.loading = false;
            this.$emit("closeDialog", this.dialogShow.key);
            this.$parent.loadData();
            this.$message.success({
              message: "新增成功",
              duriation: 700,
            });
          },
          (err) => {
            this.loading = false;
          }
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  overflow: auto;
}
.img {
  width: 200px;
  height: 200px;
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
  overflow: auto;
  .img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .avatar_text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: fit-content;
  }
  .avatar_alive {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%);
    width: fit-content;
  }
  &__upload {
    height: 400px;
    width: fit-content;
    margin: 0 auto;
  }
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
::v-deep .el-dialog__body {
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
