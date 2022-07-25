<template>
  <el-dialog
      title="编辑用户信息"
      :visible.sync="dialogShow.value"
      width="40%"
      class="dialog-person"
      :close-on-click-modal='false'
      @close="handleClose('ruleForm')"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="userName" label-width="200px" prop="userName">
          <el-input  v-model="ruleForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="phoneNumber" label-width="200px" prop="phoneNumber">
          <el-input  v-model="ruleForm.phoneNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="pwd" label-width="200px" prop="pwd">
          <el-input  v-model="ruleForm.pwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="tenantCode" label-width="200px" prop="tenantCode">
          <el-input  v-model="ruleForm.tenantCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="tenantApplyingState" label-width="200px" prop="tenantApplyingState">
          <el-input  v-model="ruleForm.tenantApplyingState" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="openId" label-width="200px" prop="openId">
          <el-input  v-model="ruleForm.openId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="isAdmin" label-width="200px" prop="isAdmin">
          <el-input  v-model="ruleForm.isAdmin" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="isCreated" label-width="200px" prop="isCreated">
          <el-input  v-model="ruleForm.isCreated" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="isMaster" label-width="200px" prop="isMaster">
          <el-input  v-model="ruleForm.isMaster" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="status" label-width="200px" prop="status">
          <el-input  v-model="ruleForm.status" autocomplete="off"></el-input>
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
import { addUserList } from "@api/user";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "150px",
      },
      ruleForm: {
        userName:'',
        phoneNumber:'',
        tenantCode:'',
        tenantApplyingState:'',
        openId: '',
        isAdmin: '',
        isCreated: '',
        isMaster: '',
        status: '',
        options: ''
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
    //   this.ruleForm.id = this.dialogShow.sendData.id
      addUserList(this.ruleForm).then((res) => {
        this.$message.success("编辑用户信息成功");
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
