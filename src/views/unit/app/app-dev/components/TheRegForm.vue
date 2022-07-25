<template>
  <div class="app-info">
    <div class="diy-dialog-body">
      <div class="app-info_header"></div>
      <div class="app-info_body">
        <el-form ref="form" :model="form" label-position="top" :rules="rules">
          <el-form-item
            v-for="item in formItem"
            v-bind="item"
            :key="item.prop"
            :label-width="options.labelWidth"
            :class="item.class ? item.class : ''"
            :prop="item.prop"
          >
            <el-input
              v-if="item.prop === 'appName'"
              v-model="form.appName"
              placeholder="请输入应用名称"
            ></el-input>
            <el-popover
              v-if="item.prop === 'icon'"
              placement="top-start"
              width="300"
              trigger="hover"
            >
              <div class="popover-box">
                <img
                  class="popover-box__img"
                  width="100%"
                  v-for="(item, index) in popoverImg"
                  @click="onClickImg(item)"
                  :key="index"
                  :src="item.icon"
                  alt
                />
              </div>
              <el-input
                slot="reference"
                v-model="form.icon"
                placeholder="应用图标"
              >
                <img
                  v-show="isImg"
                  style="width:30px;height:30px;margin-left:10px"
                  slot="prefix"
                  :src="inputImg"
                  alt
                />
              </el-input>
            </el-popover>
            <span v-if="item.prop === 'version'" slot="label">
              版本号
              <diy-help
                content="版本号要求的格式为两位小数点,并且不能带有字符,例如: 0.0.1"
              ></diy-help>
            </span>
            <el-input
              v-if="item.prop === 'version'"
              v-model="form.version"
              placeholder="请输入版本号"
              onkeyup="value=value.replace(/[^\d^\.]+/g,'')"
            >
            </el-input>
            <el-select
              v-if="item.prop === 'platform'"
              v-model="form.platform"
              placeholder="请选择适配平台"
            >
              <el-option
                v-for="item in platform"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-if="item.prop === 'appType'"
              v-model="form.appType"
              placeholder="请选择应用类型"
            >
              <el-option
                v-for="item in appType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-if="item.prop === 'appField'"
              v-model="form.appField"
              placeholder="请选择应用领域"
            >
              <el-option
                v-for="item in appField"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-if="item.prop === 'appCategory'"
              v-model="form.appCategory"
              placeholder="请选择应用分类"
            >
              <el-option
                v-for="item in appCategory"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-if="item.prop === 'targetUser'"
              v-model="form.targetUser"
              placeholder="请选择目标用户"
            >
              <el-option
                v-for="item in targetUser"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-if="item.prop === 'contactName'"
              v-model="form.contactName"
              placeholder="请输入负责人姓名"
            ></el-input>
            <el-input
              v-if="item.prop === 'contact'"
              v-model="form.contact"
              placeholder="请输入负责人联系方式"
            ></el-input>
            <el-input
              v-if="item.prop === 'description'"
              type="textarea"
              maxlength="150"
              show-word-limit
              v-model="form.description"
              placeholder="请输入应用介绍"
            ></el-input>
            <el-input
              v-if="item.prop === 'appMail'"
              v-model="form.appMail"
              placeholder="请输入公司邮箱"
            ></el-input>
            <el-input
              v-if="item.prop === 'appAddress'"
              v-model="form.appAddress"
              placeholder="请输入公司官网"
            ></el-input>
            <span v-if="item.prop === 'appPhoto'" slot="label">
              应用图片(只能上传5张)
              <diy-help content="上传的图片会被压缩至 800*426"></diy-help>
            </span>
            <div v-if="item.prop === 'appPhoto'" class="app-info_image">
              <template>
                <div
                  v-for="(item, index) in imageList"
                  :key="index"
                  class="image"
                  v-bind:style="{
                    'background-image': 'url(' + item.url + ')',
                    'background-repeat': 'no-repeat',
                    'background-size': '100% 100%',
                  }"
                  @mousemove="mousemove(index)"
                >
                  <div
                    v-if="isShow && mgindex == index"
                    class="appPhoto-hover"
                    @mouseleave="mouseleave"
                  >
                    <div
                      class="el-icon-zoom-in"
                      @click="handlePictureCardPreview(item)"
                    ></div>
                    <div
                      class="el-icon-delete"
                      @click="handleRemove(item)"
                    ></div>
                  </div>
                </div>
              </template>
            </div>

            <!-- 正式环境 -->
            <template v-if="CURRENT_ENV === 'production'">
              <el-upload
                v-if="item.prop === 'appPhoto'"
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
            <!-- 测试环境 -->
            <template v-else>
              <el-upload
                v-if="item.prop === 'appPhoto'"
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
              </el-upload></template
            >
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="editForm.uploadingurl" alt />
            </el-dialog>
          </el-form-item>
        </el-form>
      </div>
      <div class="con__option box">
        <el-button @click="handleReturn">返回</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          style="margin-left:30px;"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { DebounceBy } from "@utils/debounce";
import { getDictItemList } from "@utils/index";
import { getTenanticonList } from "@api/market";
export default {
  data() {
    var valiVersion = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入版本号"));
      } else {
        var pattern = /^([0-9]\d|[0-9])(.([0-9]\d|\d)){2}$/;
        if (pattern.test(value)) {
          if (this.compareVersion(this.form.version, "0.0.1") < 0) {
            callback(new Error("所输入的版本号不能小于0.0.1"));
          } else {
            callback();
          }
        } else {
          callback(new Error("所输入的版本号格式不对"));
        }
      }
    };
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "应用名称",
          prop: "appName",
        },
        {
          label: "应用图标",
          prop: "icon",
        },
        {
          label: "版本号",
          prop: "version",
        },
        {
          label: "适配平台",
          prop: "platform",
        },
        {
          label: "应用类型",
          prop: "appType",
        },
        {
          label: "目标用户",
          prop: "targetUser",
        },
        {
          label: "应用领域",
          prop: "appField",
        },
        {
          label: "应用分类",
          prop: "appCategory",
        },
        {
          label: "应用介绍",
          prop: "description",
          class: "form-item--all",
        },
        {
          label: "应用图片(只能上传5张)",
          prop: "appPhoto",
          class: "form-item--all",
        },
        {
          label: "负责人姓名",
          prop: "contactName",
        },
        {
          label: "负责人联系方式",
          prop: "contact",
        },
        {
          label: "公司邮箱",
          prop: "appMail",
        },
        {
          label: "公司官网",
          prop: "appAddress",
        },
      ],
      form: {
        appName: "",
        version: "0.0.1",
        icon: "",
        contact: "",
        contactName: "",
        platform: 1,
        description: "",
        tenantId: "",
        targetUser: "",
        saleStatus: 0,
        appType: "",
        appField: "",
        appCategory: "",
        status: "",
        appAddress: "",
        appMail: "",
        appPhoto: "",
      },
      appType: [],
      appField: [],
      appCategory: [],
      targetUser: [],
      platform: [],
      rules: {
        appName: [
          { required: true, message: "请输入应用名称", trigger: "blur" },
        ],
        version: [{ required: true, validator: valiVersion, trigger: "blur" }],
        platform: [
          { required: true, message: "请选择适配平台", trigger: "change" },
        ],
        appType: [
          { required: true, message: "请选择应用类型", trigger: "change" },
        ],
        appField: [
          { required: true, message: "请选择应用领域", trigger: "change" },
        ],
        appCategory: [
          { required: true, message: "请选择应用分类", trigger: "change" },
        ],
        targetUser: [
          { required: true, message: "请选择目标用户", trigger: "change" },
        ],
        contactName: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" },
        ],
        contact: [
          { required: true,message: "请输入负责人联系方式", trigger: 'blur' }
        ],
        description: [
          { required: true, message: "请输入应用介绍", trigger: "blur" },
        ],
      },
      dialogVisible: false,
      productImgs: [],
      imgLimit: 5, //文件个数
      hideUploadEdit: false,
      editForm: {
        uploadingurl: "",
      },
      uploadHeader: {
        Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
        "blade-auth": localStorage.getItem("ZCY_TOKEN"),
      },
      imageUrl: "",
      imageList: [],
      isShow: false,
      mgindex: 0,
      popoverImg: [],
      inputImg: {},
      isImg: false,
      tenantIcon: "",
    };
  },
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    formData: {
      handler(newValue, oldValue) {
        this.form.tenantId = this.formData.tenantId;
      },
      deep: true,
      immediate: true,
    },
    // form:{
    //   handler(newValue){
    //     this.form.version = "0.0.1"
    //     this.form.version = newValue.version
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  mounted() {
    let token = localStorage.getItem("ZCY_TOKEN");
    this.uploadHeader = {
      Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0",
      "blade-auth": token,
    };
    this.getIconList();
  },
  async created() {
    this.appType = await getDictItemList(this.dict.APP_TYPE);
    this.targetUser = await getDictItemList(this.dict.APP_TARGET);
    this.platform = await getDictItemList(this.dict.APP_PLATFORM);
    this.appField = await getDictItemList(this.dict.APP_FIELD);
    this.appCategory = await getDictItemList(this.dict.APP_CATEGORY);
    this.form.tenantId = this.curTenantCode;
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  methods: {
    // 比较版本号
    compareVersion(v1, v2) {
      v1 = v1.split(".");
      v2 = v2.split(".");
      const len = Math.max(v1.length, v2.length);

      while (v1.length < len) {
        v1.push("0");
      }
      while (v2.length < len) {
        v2.push("0");
      }

      for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i]);
        const num2 = parseInt(v2[i]);

        if (num1 > num2) {
          return 1;
        } else if (num1 < num2) {
          return -1;
        }
      }

      return 0;
    },
    // 获取图标
    getIconList() {
      let params = {
        tenantIcon: this.tenantIcon,
      };

      getTenanticonList(params).then((res) => {
        this.popoverImg = res.data.data;
      });
    },
    onClickImg(data) {
      this.inputImg = data.icon;
      this.form.icon = " ";
      this.isImg = true;
    },
    mousemove(index) {
      this.isShow = true;
      this.mgindex = index;
    },
    mouseleave() {
      this.isShow = false;
    },
    handleAvatarSuccess(res, file) {
      let photoUrl = res.data;
      this.productImgs.push(photoUrl);
      this.imageList.push({ url: photoUrl });
      this.form.appPhoto = this.productImgs.join();
    },
    beforeAvatarUpload(file) {
      if (this.imageList.length >= 5) {
        this.$message.error("上传图片只能5张");
        return false;
      } else {
        const isJPG = file.type === "image/jpeg";
        const isPNG = file.type === "image/png";
        if (!isJPG && !isPNG) {
          this.$message.error("上传图片只能是 JPG 或 PNG 格式!");
        }
        return isJPG || isPNG;
      }
    },
    handleReturn() {
      this.$emit("handleReturn");
    },
    handleSubmit: DebounceBy(function(value) {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.$emit("handleSubmit");
      });
    }, 1000),
    handleRemove(file) {
      //移除图片
      console.log(file);
      let del = 0;
      for (let i = 0; i < this.imageList.length; i++) {
        if ((file.url = this.imageList[i].url)) {
          del = i;
        }
      }
      this.imageList.splice(del, 1);
      this.productImgs.splice(del, 1);
      this.form.appPhoto = this.form.appPhoto.replace(file.url, "");
    },
    handlePictureCardPreview(file) {
      //预览图片时调用
      this.editForm.uploadingurl = file.url;
      this.dialogVisible = true;
    },
    handleExceed(files, fileList) {
      //图片上传超过数量限制
      this.$message.error("上传图片不能超过5张!");
      console.log(files, fileList);
    },
    imgUploadError(err, file, fileList) {
      //图片上传失败调用
      console.log(err);
      this.$message.error("上传图片失败!");
    },
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar  
  {  
      width: 4px !important;  
  }
.popover-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 150px;
  overflow: auto;
  &__img {
    width: 40px;
    height: 40px;
    margin: 5px;
    cursor: pointer;
  }
}
.photoBtn {
  .el-button,
  .el-button--default:focus {
    padding: 8px;
    font-size: 10px;
  }
}
.app-info_image {
  display: flex;
  flex-direction: row;
  .image {
    margin-right: 10px;
    width: 130px;
    height: 130px;
    position: relative;
  }
  .appPhoto-hover {
    position: absolute;
    top: 0;
    width: 130px;
    height: 130px;
    background-color: rgba(0, 0, 0, 0.3);
    .el-icon-zoom-in {
      color: #f1f1f1;
      position: absolute;
      left: 35px;
      top: 50%;
      transform: translate(0, -50%);
      cursor: pointer;
    }
    .el-icon-delete {
      color: #f1f1f1;
      position: absolute;
      left: 95px;
      top: 50%;
      transform: translate(0, -50%);
      cursor: pointer;
    }
  }
}
.app-info {
  width: 800px;
  .diy-dialog-body .el-form {
    justify-content: space-between;
  }
  &_header {
    margin-top: 22px;
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .header-icon {
      img {
        height: 40px;
        width: 40px;
      }
      margin-right: 16px;
    }
    .header-name {
      font-size: 16px;
      color: #000;
      line-height: 22px;
      font-weight: bold;
    }
  }
  &_body {
    margin-left: 58px;
    width: 100%;
    color: #58657d;
    font-weight: 600;
    .body-firstFloor {
      display: flex;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 20px;
    }
    .first {
      width: 240px;
    }
    .body-secondFloor {
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 20px;
    }
    .body-thirdFloor {
      display: flex;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 20px;
    }
    .body-fourthFloor {
      display: flex;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 6px;
    }
  }
}
.diy-dialog-body ::v-deep .el-form-item {
  &__label {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: rgba(144, 147, 153, 1);
  }

  &__content {
    .el-input,
    .el-textarea {
      &__inner,
      &__count {
        background: rgba(242, 244, 249, 1);
        border: 0px;
        border-radius: 4px;
      }
    }

    .el-input,
    .el-select {
      width: 340px;
    }

    .el-textarea {
      &__inner {
        height: 80px;
      }
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
