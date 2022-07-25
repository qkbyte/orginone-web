<template>
  <el-dialog
      title="修改密码"
      :visible.sync="dialogShow.key"
      width="30%"
      class="dialog-person"
      :close-on-click-modal="false"
      @close="handleClose('ruleForm')"
    >
    <div class="login-box__tips">
      密码长度6~16位，数字、字母、字符至少包含两种
    </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="pass">
          <el-input type="password"  v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input type="password"  v-model="ruleForm.newPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="handleClick('ruleForm')">完 成</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { updatePassword } from "@api/user";
import { validatePassword } from "@utils/validate";
export default {
  name: "TheAppDialog",
  data() {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'));
        } else {
          callback();
        }
      };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!validatePassword(value)) {
        callback(new Error("请输入符合规范的密码"));
      } else {
        if (this.ruleForm.newPass !== "") {
          this.$refs.ruleForm.validateField("pwd2");
        }
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (!validatePassword(value)) {
        callback(new Error("请输入符合规范的密码"));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      options: {
        labelWidth: "100px",
      },
      loading: false,
      ruleForm: {
        pass:'',
        newPass: '',
        checkPass:'',
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        newPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass3, trigger: 'blur' }
        ],
      },
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: ()=>{},
    }
  },
  created() {
  },
  mounted() {},
  computed: {
    ...mapState("user", ["userId"]),
  },
  methods: {
    handleClose(formRef) {
      this.$refs[formRef].resetFields();
      this.$parent.closeDialog('password')
    },

    handleClick(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = this.ruleForm
          params.userId = this.userId
          updatePassword(params).then((res) => {
            this.$message.success("修改密码成功");
            this.$parent.closeDialog('password')
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
.demo-ruleForm{
  padding-right: 40px;
  padding-top: 30px;
}
</style>
