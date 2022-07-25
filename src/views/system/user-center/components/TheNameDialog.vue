<template>
  <el-dialog
    title="修改信息"
    :visible.sync="dialogShow.key"
    width="30%"
    class="dialog-person"
    :close-on-click-modal="false"
  >
    <div class="login-box">
      <div class="login-box__form">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="nameForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="姓名：" prop="name">
            <el-input
              style="width:100%"
              type="text"
              placeholder="请输入姓名"
              v-model="ruleForm.name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="diy-dialog-footer">
        <el-button type="primary" @click="handleReg">确 定</el-button>
        <el-button @click="handleClose('nameForm')">取 消</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions,mapState } from "vuex";
import { isvalidatemobile } from "@utils/validate";
import { updatePersonInform } from "@api/tenant";
import { updateRealName } from "@api/user";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入名称"));
      }
    };
    return {
      form: {},
      rules: {
        phone: [{ validator: validatePass, trigger: "blur" }],
      },
      ruleForm: {
        phone: "",
      },
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },

  mounted() {
    this.$set(this.ruleForm,'name', this.userName.realName)
  },
  computed: {
    ...mapState("user", ["userName"])
  },
  methods: {
    ...mapActions("user", ["changeName"]),
    handleBack() {
      this.$emit("handleToggle", 0);
    },
    handleClose(formRef) {
      this.$refs[formRef].resetFields();
      this.$parent.closeDialog("name");
    },
    handleReg() {
      let _this = this;
      this.$refs.nameForm.validate((valid) => {
        if (valid) {
          let params = {
            realName: this.ruleForm.name,
            userId: this.dialogShow.sendData.userId,
            userCode: this.dialogShow.sendData.userCode,
          };
          updateRealName(params).then((res) => {
            this.changeName(this.ruleForm.name);
            this.$message.success("修改用户信息成功");
            this.$parent.closeDialog("name");
            this.$parent.Loading();
            this.$parent.$parent.$parent.$refs.table.loadData();
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-footer {
  padding-top: 20px;
}
.login-box {
  width: 100%;
  height: 200px;
  &__title {
    color: #606266;
    font-size: 15px;
    margin-left: 30px;
  }
  &__form {
    padding-top: 55px;
    padding-right: 30px;
  }
  &__title {
    margin-top: 10px;
  }
  &__button {
    margin-top: 60px !important;
    display: flex;
    flex-direction: row-reverse;
  }
}
</style>
