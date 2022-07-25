<template>
  <el-dialog
    top="15vh"
    width="540px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <div slot="title">
      <div class="title">编辑单位信息</div>
    </div>
    <!-- 第二行 -->
    <el-row :gutter="20" style="margin-top:16px">
      <el-form :model="form" :rules="rules" ref="unitEditForm">
        <el-col :span="12">
          <div>
            <div class="editLabel">单位名称</div>
            <div class="editInput">
              <el-form-item prop="unitName">
                <el-input v-model="form.unitName" size="small" disabled></el-input>
              </el-form-item>
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <div>
            <div class="editLabel">联系方式</div>
            <div class="editInput">
              <el-form-item prop="linkPhone">
                <el-input v-model="form.linkPhone" size="small" disabled></el-input>
              </el-form-item>
            </div>
          </div>
        </el-col>
      </el-form>
    </el-row>
    <!-- 第三行 -->
    <el-row style="margin-top:16px">
      <div class="editLabel">单位地址</div>
      <el-row
        type="flex"
        justify="space-between"
        style="padding-left:12px;padding-right:25px"
      >
        <div class="addressBox">
          <div class="addressText">省</div>
          <el-select v-model="province" placeholder="请选择" size="small">
            <el-option
              v-for="(item, index) in provinces"
              :key="index"
              :value="item.province"
            ></el-option>
          </el-select>
        </div>
        <div class="addressBox">
          <div class="addressText">市</div>
          <el-select v-model="city" placeholder="请选择" size="small">
            <el-option
              v-for="(item, index) in citys"
              :key="index"
              :value="item.name"
            ></el-option>
          </el-select>
        </div>
        <div class="addressBox">
          <div class="addressText">区</div>
          <el-select v-model="street" placeholder="请选择" size="small">
            <el-option
              v-for="(item, index) in streets"
              :key="index"
              :value="item"
            ></el-option>
          </el-select>
        </div>
      </el-row>
    </el-row>
    <!-- 第四行 -->
    <el-row
      type="flex"
      justify="space-between"
      style="padding-left:12px;padding-right:11px;margin-top:16px"
    >
      <div class="addressText">详细地址</div>
      <div class="editInput" style="width:420px">
        <el-input v-model="detailAddress" size="small"></el-input>
      </div>
    </el-row>
    <!-- 第五行 -->
    <el-row style="margin-top:16px">
      <div class="editLabel">其他信息</div>
      <div style="margin-left:12px;margin-right:24px">
        <el-input v-model="form.name" size="small"></el-input>
      </div>
    </el-row>
    <div slot="footer" style="margin-right:24px">
      <el-button type="primary" style="width:112px" @click="handleEdit"
        >完成</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import _ from "lodash";
import { unitUpdate } from "@api/tenant";
import { mapGetters } from "vuex";
import { areaData } from "@utils/area.js";
import { isvalidatemobile } from "@utils/validate";

export default {
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
    tenantInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters("tenant", ["curTenant"]),
  },
  mounted(){
    console.log('curTenant', this.curTenant);
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      let res = isvalidatemobile(value);
      if (!res[0]) {
        callback(new Error(res[1]));
      } else {
        callback();
      }
    };
    return {
      flag: false,
      form: {},
      province: "",
      city: "",
      street: "",
      detailAddress: "",
      imageUrl: "",
      provinces: [],
      citys: [],
      streets: [],
      rules: {
        unitName: [
          { required: true, message: "单位名称不能为空", trigger: "blur" },
        ],
        linkPhone: [{ validator: validatePhone, trigger: "blur" }],
      },
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
    this.provinces = areaData;
    this.flag = true;
  },
  methods: {
    init() {
      /**
       * 处理一下street 分成区和详细地址 能显示在输入框中
       */
      let data = _.cloneDeep(this.tenantInfo);
      let { id, linkPhone, city, province, streetAddress, unitName } = {
        ...data,
      };
      this.province = data.province;
      this.city = data.city;
      this.form = { id, linkPhone, city, province, streetAddress, unitName };
      let address = "";
      address = streetAddress;
      if (address != "") {
        let index = address.indexOf("区");
        if (index === -1) {
          index = address.indexOf("县");
        }
        let street = address.substring(0, index + 1);
        this.street = street;
        let detailAddress = address.substring(index + 1, address.length);
        this.detailAddress = detailAddress;
      } else {
        this.street = "";
        this.detailAddress = "";
      }
    },
    async handleEdit() {
      /**
       * 处理一下street 和 detailAddress 要存到form里面
       */
      this.$refs.unitEditForm.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请输入正确的信息");
        }
        let street = this.street;
        let detailAddress = this.detailAddress;
        let streetAddress = street.concat(detailAddress);
        this.form.streetAddress = streetAddress;
        this.form.province = this.province;
        this.form.city = this.city;
        let form = this.form;
        let data = {
          id: form.id ? form.id : "",
          tenantId: this.tenantInfo.tenantId,
          city: form.city ? form.city : "",
          linkPhone: form.linkPhone ? form.linkPhone : "",
          logo: this.imageUrl ? this.imageUrl : "",
          province: form.province ? form.province : "",
          streetAddress: form.streetAddress ? form.streetAddress : "",
          unitName: form.unitName ? form.unitName : "",
        };
        this.$loading({ fullscreen: true, text: "修改中" });
        let res = await unitUpdate(data);
        if (res.data.code == "200") {
          this.$message.success("修改成功");
          setTimeout(() => {
            this.$loading().close();
          }, 500);
        } else {
          this.$message.warning("修改失败");
          setTimeout(() => {
            this.$loading().close();
          }, 500);
        }
        this.$emit("freshUnitInfo");
        this.$emit("closeDialog", "editTenant");
      });
    },
  },
  watch: {
    province: {
      handler(newVal, oldVal) {
        let _this = this;
        if (oldVal === "") {
          _this.provinces.forEach((item) => {
            if (item.province === newVal) {
              _this.citys = item.city;
            }
          });
          _this.citys.forEach((item) => {
            if (item.name === _this.city) {
              _this.streets = item.county;
            }
          });
        } else if (oldVal !== newVal) {
          _this.provinces.forEach((item) => {
            if (item.province === newVal) {
              _this.citys = item.city;
              _this.streets = [];
            }
          });
          _this.city = "";
          _this.street = "";
        }
      },
    },
    city: {
      handler(newVal, oldVal) {
        let _this = this;
        if (newVal != "" && this.flag && oldVal != "") {
          _this.citys.forEach((item) => {
            if (item.name === _this.city) {
              _this.streets = item.county;
            }
          });
          _this.street = "";
        } else if (newVal != "") {
          _this.citys.forEach((item) => {
            if (item.name === _this.city) {
              _this.streets = item.county;
            }
          });
        }
      },
    },
  },
};
</script>
<style scoped lang="scss">
.title {
  font-size: 20px;
  height: 28px;
  line-height: 28px;
  width: 100%;
  font-weight: 600;
}
.editLabel {
  font-size: 14px;
  color: rgba(48, 49, 51, 1);
  font-weight: 600;
  padding: 12px;
}
.editInput {
  width: 230px;
  padding-left: 15px;
  padding-right: 15px;
}
.addressBox {
  width: 28%;
  display: inline-flex;
}
.addressText {
  width: 50px;
  height: 32px;
  line-height: 32px;
  white-space: nowrap;
}
.img-box {
  padding: 20px;
  width: 50px;
  height: 50px;

  img {
    width: 100%;
    height: 100%;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: auto;
  height: auto;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 20px;
  color: #8c939d;
  width: auto;
  height: auto;
  line-height: auto;
  text-align: center;
}
.avatar {
  width: auto;
  height: auto;
  display: block;
}
</style>
