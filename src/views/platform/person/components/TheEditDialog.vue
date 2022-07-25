<template>
  <el-dialog
      title="编辑人员信息"
      :visible.sync="dialogShow.value"
      width="40%"
      class="dialog-person"
      :close-on-click-modal='false'
      @close="handleClose('ruleForm')"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="realName" label-width="150px" prop="realName">
          <el-input  v-model="ruleForm.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="tenantCode" label-width="150px" prop="tenantCode">
          <el-input  v-model="ruleForm.tenantCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="phoneNumber" label-width="150px" prop="phoneNumber">
          <el-input  v-model="ruleForm.phoneNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="idCard" label-width="150px" prop="idCard">
          <el-input  v-model="ruleForm.idCard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="gender" label-width="150px" prop="gender">
          <el-input  v-model="ruleForm.gender" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="city" label-width="150px" prop="city">
          <el-input  v-model="ruleForm.city" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="province" label-width="150px" prop="province">
          <el-input  v-model="ruleForm.province" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="status" label-width="150px" prop="status">
          <el-input  v-model="ruleForm.status" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="streetAddress" label-width="150px" prop="streetAddress">
          <el-input  v-model="ruleForm.streetAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="updateUser" label-width="150px" prop="updateUser">
          <el-input  v-model="ruleForm.updateUser" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="userBirthday" label-width="150px" prop="userBirthday">
          <el-input  v-model="ruleForm.userBirthday" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="userCode" label-width="150px" prop="userCode">
          <el-input  v-model="ruleForm.userCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="userEmail" label-width="150px" prop="userEmail">
          <el-input  v-model="ruleForm.userEmail" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="userPhoto" label-width="150px" prop="userPhoto">
          <el-input  v-model="ruleForm.userPhoto" autocomplete="off"></el-input>
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
import { AddEditPersonInfo } from "@api/user";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "150px",
      },
      ruleForm: {
        realName:'',
        tenantCode:'',
        phoneNumber: '',
        idCard: '',
        gender: '',
        city: '',
        province:'',
        status:'',
        streetAddress: '',
        updateUser:'',
        userBirthday:'',
        userCode:'',
        userEmail:'',
        userPhoto:'',
      },
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: false,
    },
    editData:{
      type:Object,
      default: () => {},
    }
  },
  watch:{
    editData:{
      handler(val){
        this.loading(val)
      }
    },
    dialogShow:{
      handler(val){
        console.log('val',val);
        this.ruleForm = val.sendData
      },
      deep:true,
      immediate:true
    }
  },
  created() {
  },
  mounted(){
  },
  computed: {
  },
  methods: {
    loading(val){
      this.ruleForm.realName = val.realName
      this.ruleForm.phoneNumber = val.phoneNumber
    },
    handleClose(formRef) {
      this.$refs[formRef].resetFields();
      this.$emit('closeEdit', this.dialogShow.key)
    },

    handleClick(formName) {
      console.log('rule0', this.ruleForm);
      AddEditPersonInfo(this.ruleForm).then((res) => {
        this.$message.success("编辑人员信息成功");
        this.$emit('closeEdit', this.dialogShow.key)
        this.$parent.loadData()
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
::v-deep .el-dialog{
       display: flex;
       flex-direction: column;
       margin:0 !important;
       position:absolute;
       top:50%;
       left:50%;
       transform:translate(-50%,-50%);
       /*height:600px;*/
       max-height:calc(100% - 30px);
       max-width:calc(100% - 30px);
   }
::v-deep .el-dialog .el-dialog__body{
       flex:1;
       overflow: auto;
   }
</style>
