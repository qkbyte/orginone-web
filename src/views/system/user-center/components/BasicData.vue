<template>
  <div class="basic">
    <div class="basic-main">
      <div class="basic-header">
        <div class="basic-title">用户信息</div>
      </div>
      <div class="basic-content">
        <div class="basic-content-avatar">
          <div 
            v-if="user.userPhoto"
            class="avatar_img" 
            @mouseover="mouseover"
            v-bind:style="{'background-image': 'url(' + user.userPhoto + ')','background-repeat':'no-repeat','background-size':'100% 100%' }"
          ></div>
          <div
            v-else 
            class="avatar_img2" 
            @mouseover="mouseover"
          >{{userHead}}</div>
          <div @mouseleave="mouseleave" v-show="isOverShow" class="avatar_over">
            <div @click="changeNewAvatar" class="avatar_font">修改头像</div>
          </div>
          <div class="basic-content-name">
            <span class="avatar_name">{{ user.realName }}</span>
            <div>
              <el-button type="text" @click="handleName">修改信息</el-button>
              <el-button type="text" @click="handlePhone">修改手机号</el-button>
              <el-button type="text" @click="handlePassword">修改密码</el-button>
            </div>
          </div>
        </div>
        <div class="basic-content-body">
          <div class="body-first">
            <span class="first_phone">登录手机：{{ user.phoneNumber }}</span>
          </div>
        </div>
      </div>
    </div>
    <template v-for="item in dialogShow">
      <avatarDialog 
        v-if="item.value === 'head' && item.key "
        :Avatar="userHead"
        :dialogShow="item"
        :key="item.key"
      ></avatarDialog>
      <passwordDialog
        v-if="item.value === 'password' && item.key "
        :dialogShow="item"
        :key="item.key"
      ></passwordDialog>
      <phoneDialog
        v-if="item.value === 'phone' && item.key "
        :dialogShow='item'
        :key="item.key"
      ></phoneDialog>
      <nameDialog
        v-if="item.value === 'name' && item.key "
        :dialogShow='item'
        :key="item.key"
      ></nameDialog>
    </template>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { getUserInfoById, updateUserInfoAll } from "@api/user";
import TheEditPhone from "./TheEditPhone";
import TheEditEmail from "./TheEditEmail";
import { validateEmail, isMobile } from "@utils/validate";
import  avatarDialog  from "./ChangeAvatar"
import passwordDialog from "./ThePasswordDialog"
import nameDialog from "./TheNameDialog"
import phoneDialog from './ThePhoneDialog'

export default {
  name: "BasicData",
  components:{
    avatarDialog,
    passwordDialog,
    phoneDialog,
    nameDialog
  },
  props: {
    getUser: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      let res = isMobile(value);
      if (!res) {
        callback(new Error("请填写正确的手机号"));
      } else {
        callback();
      }
    };
    var isEmail = (rule, value, callback) => {
      let res = validateEmail(value);
      if (!res) {
        callback(new Error("请输入合法的邮箱地址"));
      } else {
        callback();
      }
    };
    return {
      gender: "",
      form: {},
      imageUrl: "",
      dialogVisible: false,
      mobilePhoneVisible: false,
      emailVisible: false,
      configTitle: "",
      configName: "",
      uploadHeader: {
        Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
        "blade-auth": "",
      },
      info: [
        {
          name: "realName",
          label: "姓名",
          edit: {
            show: false,
            label: "",
          },
        },
        {
          name: "gender",
          label: "性别",
          edit: {
            show: false,
            label: "",
          },
        },
        {
          name: "phoneNumber",
          label: "电话号码",
          edit: {
            show: true,
            label: "更换手机号",
            icon: "el-icon-mobile-phone",
          },
        },
        {
          name: "userEmail",
          label: "电子邮箱",
          edit: {
            show: true,
            label: "更换邮箱号",
            icon: "el-icon-message",
          },
        },
        {
          name: "userAddress",
          label: "家庭地址",
          edit: {
            show: false,
            label: "",
          },
        },
      ],
      user: {},
      rules: {
        phoneNumber: [
          {
            validator: validatePhone,
            trigger: "blur",
          },
        ],
        userEmail: [
          {
            validator: isEmail,
            trigger: "blur",
          },
        ],
      },
      isOverShow:false,
      avatarShow:false,
      passwordShow:false,
      dialogShow:[
        {
          value: 'head',
          key: false
        },
        {
          value: 'password',
          key: false
        },
        {
          value: 'phone',
          key: false
        },
        {
          value: 'name',
          key: false
        }
      ],
      userHead: ''
    };
  },
  computed: {
    message() {
      let val = new Array();
      for (let sum of this.info) {
        if (this.user[sum.name] !== undefined) {
          if (sum.name === "gender") {
            let sex = ["女", "男"];
            val.push({
              data: sex[this.user[sum.name]],
              name: sum.name,
              label: sum.label,
              edit: sum.edit,
            });
          } else {
            val.push({
              data: this.user[sum.name],
              name: sum.name,
              label: sum.label,
              edit: sum.edit,
            });
          }
        }
      }
      return val;
    },
  },
  mounted() {
    this.Loading();
    let token = localStorage.getItem("ZCY_TOKEN");
    this.uploadHeader = {
      Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
      "blade-auth": token,
    };
  },
  methods: {
    ...mapActions("user", ["changeAvatar"]),
    /**
     * 初始化获取用户信息
     */
    async Loading() {
      let _this = this;
      let userId = _this.$store.state.user.userId;
      let info = await getUserInfoById({
        id: userId,
      });
      _this.user = info.data.data;
      let str = _this.user.userBirthday.substring(
        0,
        _this.user.userBirthday.indexOf(" ")
      );
      _this.user.userBirthday = str;
      _this.form = _this._.cloneDeep(_this.user);
      this.userHead = _this.user.realName.substr(0, 1)
    },
    handlePassword(){
      this.dialogShow.map((el)=>{
        if(el.value == 'password'){
          el.key = true
        }
      })
    },
    handleName(){
      this.dialogShow.map((el)=>{
        if(el.value == 'name'){
          el.key = true,
          el.sendData = this.user
        }
      })
    },
    closeDialog(val){
      this.dialogShow.map((el)=>{
        if(el.value == val){
          el.key = false
        }
      })
    },
    changeNewAvatar(){
      this.dialogShow.map((el)=>{
        if(el.value === 'head'){
          el.key = true,
          el.sendData = this.user.userPhoto
        }
      })
    },
    handlePhone(){
      this.dialogShow.map((el)=>{
        if(el.value === 'phone'){
          el.key = true
          el.sendData = this.user
        }
      })
    },
    mouseover(){
      this.isOverShow = true
    },
    mouseleave(){
      this.isOverShow = false
    },
    /**
     * 修改对应的dialog信息
     */
    config(data, title, name) {
      let _this = this;
      console.log(_this[data]);
      if (_this[data] !== undefined) {
        _this[data] = true;
        _this.configTitle = title;
        _this.configName = name;
      }
    },
    /**
     * 对某个字段进行修改
     */
    handleEdit(index, row) {
      let _this = this;
      if (row.name === "phoneNumber") {
        _this.config("mobilePhoneVisible", "", row.name);
      } else if (row.name === "userEmail") {
        _this.config("emailVisible", "", row.name);
      }
    },
    /*
      编辑个人信息
    */
    editPersonInfo() {
      let _this = this;
      this.$loading({ fullscreen: true, text: "修改中" });
      let formData = this.form;
      let data = {};
      this.$refs.basicForm.validate((valid) => {
        if (valid) {
          for (let i in formData) {
            data[i] = formData[i];
          }
          if (data["gender"] === "男") {
            data["gender"] = 1;
          } else {
            data["gender"] = -1;
          }
          if (data.userBirthday) {
            data.userBirthday = new Date(data.userBirthday);
            let year = data.userBirthday.getFullYear();
            let month = data.userBirthday.getMonth() + 1;
            let day = data.userBirthday.getDate();
            if (month > 0 && month < 10) {
              month = "0" + month.toString();
            }
            if (day > 0 && day < 10) {
              day = "0" + day.toString();
            }
            data.userBirthday = `${year}-${month}-${day} 00:00:00`;
          }
          updateUserInfoAll(data).then((res) => {
            this.$loading().close();
            this.$message.success("修改个人信息成功");
            _this.dialogVisible = false;
          });
        } else {
          this.$loading().close();
        }
      });
    },
    handleEditPerson() {
      this.form = this._.cloneDeep(this.user);
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
      let _this = this;
      let photoUrl = res.data.split("?")[0];
      console.log(res);
      this.imageUrl = photoUrl;
      this.form.userPhoto = photoUrl;
      let formData = this.form;
      let data = {};
      for (let i in formData) {
        data[i] = formData[i];
      }
      if (data["gender"] === "男") {
        data["gender"] = 1;
      } else {
        data["gender"] = -1;
      }
      if (data.userBirthday) {
        data.userBirthday = new Date(data.userBirthday);
        let year = data.userBirthday.getFullYear();
        let month = data.userBirthday.getMonth() + 1;
        let day = data.userBirthday.getDate();
        if (month > 0 && month < 10) {
          month = "0" + month.toString();
        }
        if (day > 0 && day < 10) {
          day = "0" + day.toString();
        }
        data.userBirthday = `${year}-${month}-${day} 00:00:00`;
      }
      updateUserInfoAll(data).then((res) => {
        this.changeAvatar(this.imageUrl);
        this.$loading().close();
        this.$message.success("头像修改成功");
        _this.dialogVisible = false;
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    dialogClose() {
      this.$refs.basicForm.resetFields();
      this.Loading();
    },
  },
};
</script>

<style lang="scss">
.basic {
  width: 100%;
  height: 200px;
  padding: 20px 0;
  background: white;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .basic-title {
    font-weight: bold;
    text-align: left;
    color: #303133;
    font-size: 16px;
  }
  .basic-content {
    width: 100%;
    padding-top: 20px;
    &-name{
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    &-avatar {
      margin-bottom: 20px;
      display: flex;
      .avatar_img {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        margin-right: 16px;
        img {
          width: 46px;
          height: 46px;
          border-radius: 50%;
        }
      }
      .avatar_img2 {
        width: 48px;
        height: 46px;
        background: #154AD8;
        border-radius: 50%;
        margin-right: 16px;
        text-align: center;
        line-height: 46px;
        font-size: 18px;
        color: #ffffff;
      }
      .avatar_over{
        position: absolute;
        background: rgba(0, 0, 0, 0.5);
        width: 46px;
        height: 46px;
        border-radius: 50%;
        margin-right: 16px;
      }
      .avatar_font{
        color: #ffffff;
        font-size: 10px;
        line-height: 46px;
        white-space: nowrap;
        cursor: pointer;
      }
      .avatar_name {
        font-size: 16px;
        font-weight: bold;
        line-height: 45px;
        color: rgba(48, 49, 51, 1);
      }
    }
    &-body {
      padding-left: 62px;
      .body-first {
        margin-bottom: 20px;
        span {
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          color: rgba(96, 98, 102, 1);
          margin-right: 70px;
        }
      }
      .body-second {
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        color: rgba(96, 98, 102, 1);
        margin-bottom: 20px;
      }
    }
    .basic-content-box {
      width: 1vw;
      flex: auto;
    }
    .content {
      border: 1px solid #cbd0d7;
      border-radius: 5px;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background: rgba(0, 0, 0, 0);
    }
  }
  .basic-dialog {
    box-shadow: 0 0 10px rgba(50, 81, 125, 0.3);
    border-radius: 5px;
  }
  .dialog-person {
    .el-dialog__body {
      padding: 0 20px;
    }
  }
}
.form-avatar {
  display: flex;
  align-items: center;
  img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
  }
  .avatar_text {
    margin-left: 16px;
    font-size: 13px;
    font-weight: 500;
    line-height: 17px;
    color: rgba(21, 74, 216, 1);
    cursor: pointer;
  }
  .el-button,
  .el-button--default:focus {
    padding: 8px;
    font-size: 10px;
  }
}
.dialog-row {
  .el-col {
    margin-bottom: 8px;
  }
  .left {
    padding-right: 10px;
  }
  .right {
    padding-left: 10px;
  }
}
</style>
