<template>
  <el-dialog
      title="编辑单位信息"
      :visible.sync="dialogShow.value"
      width="40%"
      class="dialog-person"
      :close-on-click-modal='false'
      @close="handleClose('ruleForm')"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="unitName" label-width="150px" prop="unitName">
          <el-input  v-model="ruleForm.unitName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="tenantCode" label-width="150px" prop="tenantCode">
          <el-input  v-model="ruleForm.tenantCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="tenantId" label-width="150px" prop="tenantId">
          <el-input  v-model="ruleForm.tenantId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="unitNameEn" label-width="150px" prop="unitNameEn">
          <el-input  v-model="ruleForm.unitNameEn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="socialCreditCode" label-width="150px" prop="socialCreditCode">
          <el-input  v-model="ruleForm.socialCreditCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="unitCode" label-width="150px" prop="unitCode">
          <el-input  v-model="ruleForm.unitCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="unitRemark" label-width="150px" prop="unitRemark">
          <el-input  v-model="ruleForm.unitRemark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="unitTypeCode" label-width="150px" prop="unitTypeCode">
          <el-input  v-model="ruleForm.unitTypeCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="unitTypeName" label-width="150px" prop="unitTypeName">
          <el-input  v-model="ruleForm.unitTypeName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="linkMan" label-width="150px" prop="linkMan">
          <el-input  v-model="ruleForm.linkMan" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="linkPhone" label-width="150px" prop="linkPhone">
          <el-input  v-model="ruleForm.linkPhone" autocomplete="off"></el-input>
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
import { AddOrgansList } from "@api/organization";

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
      this.$emit('closeDialog', this.dialogShow.key)
    },

    handleClick(formName) {
      delete this.ruleForm.sort
      AddOrgansList(this.ruleForm).then((res) => {
        this.$message.success("编辑单位信息成功");
        this.$emit('closeDialog', this.dialogShow.key)
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
