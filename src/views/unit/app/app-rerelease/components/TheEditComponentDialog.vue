<template>
  <el-dialog
    center
    top="10vh"
    width="680px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <span slot="title" class="diy-dialog-title"> 编辑组件 </span>
    <div class="diy-dialog-body">
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
          :style="item.style"
        >
          <el-input
            v-if="item.prop === 'name'"
            v-model="form.name"
            placeholder="请输入组件名称"
          ></el-input>
          <el-input
            v-if="item.prop === 'url'"
            v-model="form.url"
            placeholder="请输入组件链接"
          ></el-input>
          <el-select
            v-if="item.prop === 'type'"
            v-model="form.type"
            placeholder="请选择组件类型"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="item.prop === 'layoutType'"
            v-model="form.layoutType"
            placeholder="请选择组件类型"
          >
            <el-option
              v-for="item in layoutTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span v-if="item.prop === 'width'"  slot="label">
              组件宽度
              <diy-help content="基于grid布局实现栅格化分为12格"></diy-help>
          </span>
           <el-input-number
            v-if="item.prop === 'width'"
            v-model="form.width"
            :min="1"
            :max="12"
            label="描述文字"
          ></el-input-number>
          <el-input
            v-if="item.prop === 'height'"
            v-model="form.height"
            placeholder="请输入组件高度"
          ></el-input>
          <div v-if="item.prop === 'previewPic'" slot="label">
            <div class="row" style="display:flex">
              <div style="color:rgb(245, 131, 184);margin-right:5px">*</div>
              <div>预览图</div>
            </div>
            <div class="img" v-show="imageUrl !== ''">
              <img :src="imageUrl" />
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
          </div>
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
import { mapState, mapActions, mapGetters } from "vuex";
import { marketappcomponentSubmit } from "@api/portal";
import { getDictItemList } from "@utils/index";
export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      props: { expandTrigger: "hover" },
      formItem: [
        {
          label: "组件名称",
          prop: "name",
        },
        {
          label: "组件链接",
          prop: "url",
        },
        {
          label: "组件布局",
          prop: "layoutType",
        },
        {
          label: "组件类型",
          prop: "type",
        },
        
        {
          label: "组件宽度(px)",
          prop: "width",
        },
        {
          label: "组件高度(像素)",
          prop: "height",
        },
        {
          label: "预览图",
          prop: "previewPic",
        },
      ],
      form: {},
      rules: {
        name: [
          { required: true, message: "组件名称不能为空", trigger: "blur" },
        ],
        url: [{ required: true, message: "组件链接不能为空", trigger: "blur" }],
        type: [
          { required: true, message: "组件类型为必选", trigger: "change" },
        ],
        layoutType: [{ required: true, message: "组件布局为必选", }],
        width: [{ required: true, message: "组件宽度不能为空", }],
        height: [{ required: true, message: "组件高度不能为空", }],
      },
      options: [{ value: 1, label: "iframe" }],
      layoutTypeOption: [
        {
          value: "fix",
          label: "固定尺寸",
        },
        {
          value: "adaptive",
          label: "自适应",
        },
      ],
      tableData: [{ deep: 1, number: 1 }],
      loading: false,
      imageUrl: "",
      appSource: "",
      uploadHeader: {},
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  watch:{
    form(val){
      console.log('val',val);
    }
  },
  async created() {
    this.appSource = await getDictItemList(this.dict.APP_COMPONENT);
  },
  mounted() {
    this.form = JSON.parse(JSON.stringify(this.dialogShow.sendData))
    this.imageUrl = this.form.previewPic
    let obj = JSON.parse(this.form.layoutConfig)
    this.$set(this.form,"width",obj.width)
    this.$set(this.form,"height",obj.height * 30)
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
    handleClick(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$parent.$refs.table.loading = true
          let layoutType = "";
          let layoutConfig = {
            width: this.form.width,
            height: this.form.height / 30,
          };
          if (this.imageUrl == "") {
            this.$message.warning("请选择预览图");
            return;
          }
          let params = {
            id:this.form.id,
            appId: this.form.appId,
            url: this.form.url,
            type: this.form.type,
            name: this.form.name,
            status: this.form.status,
            tenantCode: this.curTenantCode,
            layoutConfig: JSON.stringify(layoutConfig),
            layoutType: this.form.layoutType,
            previewPic: this.imageUrl,
            source: this.form.source,
            newTemplate: this.form.newTemplate,
          };
          this.$emit('handleEditTableList', params)
          this.handleClose()
        } else {
          return false;
        }
      });
    },
    handleAvatarSuccess(res, file) {
      let _this = this;
      let photoUrl = res.data;
      this.imageUrl = photoUrl;
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片要求为 JPG 或 PNG 格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return (isJPG || isPNG) && isLt5M;
    },

    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  overflow: auto;
}
.diy-dialog-body .el-form {
  justify-content: space-between;
}
::v-deep .el-input__inner{
  background: white  !important;
  border: 1px solid #DCDFE6 !important;
}
::v-deep .el-input,
::v-deep .el-select{
  width: 300px  !important;
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
