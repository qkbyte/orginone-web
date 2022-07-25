<template>
  <el-dialog
      title="新增租户信息"
      :visible.sync="dialogShow.value"
      width="50%"
      class="dialog-person"
      :close-on-click-modal='false'
      @close="handleClose('ruleForm')"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="tenantCode" label-width="150px" prop="tenantCode">
          <el-input  v-model="ruleForm.tenantCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="tenantName" label-width="150px" prop="tenantName">
          <el-input  v-model="ruleForm.tenantName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="tenantType" label-width="150px" prop="tenantType">
          <el-input  v-model="ruleForm.tenantType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="status" label-width="150px" prop="status">
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
import { addTenantList } from "@api/tenant";


export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "150px",
      },
      ruleForm: {
        tenantCode:'',
        tenantName: '',
        tenantType: '',
        status: '',
      },
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
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
  },
  created() {
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
      addTenantList(this.ruleForm).then((res) => {
        this.$message.success("添加租户信息成功");
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
