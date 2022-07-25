<template>
    <el-dialog
      title="上传头像"
      :visible.sync="dialogShow.key"
      width="30%"
      class="dialog-person"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <div class="img" v-if="dialogShow.sendData">
        <img :src="dialogShow.sendData">
      </div>
      <div class="img" v-else>
        <div class="default-img">{{name}}</div>
      </div>
      <template v-if="CURRENT_ENV === 'production'">
        <el-upload
          class="upload-demo"
          action="/dev-api/asset-minio/aliyunoss/uploadIconV2"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :show-file-list="false"
          :headers="uploadHeader"
          name="icon"
        >
          <div class="photoBtn">
          <el-button size="mini">上传图片</el-button>
          </div>
        </el-upload>
      </template>
      <template v-else>
        <el-upload
          class="upload-demo"
          action="/dev-api/asset-minio/aliyunoss/uploadIconV2"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :show-file-list="false"
          :headers="uploadHeader"
          name="icon"
        >
          <div class="photoBtn">
          <el-button size="mini">上传图片</el-button>
          </div>
        </el-upload>
      </template>
    </el-dialog>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { updateUserInfoAll } from "@api/user";
export default {
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      loading: false,
      imageUrl:'',
      uploadHeader: {
        Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
        "blade-auth": localStorage.getItem("ZCY_TOKEN"),
      },
      photo: "",
      productImgs:[],
      imageList:[],
      name: ''
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: ()=>{},
    },
  },
  mounted() {
    this.name = this.$parent.userHead
    let token = localStorage.getItem("ZCY_TOKEN");
    this.uploadHeader = {
      Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
      "blade-auth": token,
    };
    console.log(this.dialogShow);
  },
  computed: {
    ...mapState("user", ["userName"])
  },
  methods: {
    ...mapActions("user", ["changeAvatar"]),
    handleClose(){
      this.$parent.closeDialog('head')
    },
    handleAvatarSuccess(res, file) {
      let _this = this;
      let photoUrl = res.data
      this.imageUrl = photoUrl;
      let data = this.$parent.form
      let params = {
        id: data.id,
        userId: data.userId,
        userPhoto: photoUrl,
        phoneNumber: this.userName.accountName
      }
      updateUserInfoAll(params).then((res) => {
        this.changeAvatar(this.imageUrl);
        this.$message.success("头像修改成功");
        this.$parent.closeDialog('head')
        this.$parent.Loading()
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片要求为 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return (isJPG || isPNG) && isLt2M ;
    }
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
.img{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
.default-img{
  width: 200px;
  height: 200px;
  background: #154AD8;
  border-radius: 50%;
  text-align: center;
  line-height: 200px;
  font-size: 50px;
  color: #ffffff;
}
img{
  width: 200px;
  height: 200px;
}
.upload-demo{
  display: flex;
  justify-content: center;
}
.photoBtn{
  margin: 20px 0;
  .el-button,
  .el-button--default:focus {
    padding: 8px;
    font-size: 10px;
  }
}
</style>