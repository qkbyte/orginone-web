<template>
  <el-dialog
    title="编辑集团信息"
    :visible.sync="dialogShow.value"
    width="40%"
    class="dialog-person"
    :close-on-click-modal="false"
    @close="handleClose('ruleForm')"
  >
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="groupName" label-width="150px" prop="groupName">
        <el-input v-model="ruleForm.groupName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="groupCode" label-width="150px" prop="groupCode">
        <el-input v-model="ruleForm.groupCode" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="groupDescription"
        label-width="150px"
        prop="groupDescription"
      >
        <el-input
          v-model="ruleForm.groupDescription"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="linkMan" label-width="150px" prop="linkMan">
        <el-input v-model="ruleForm.linkMan" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="linkPhone" label-width="150px" prop="linkPhone">
        <el-input v-model="ruleForm.linkPhone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="status" label-width="150px" prop="status">
        <el-input v-model="ruleForm.status" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="tenantCode" label-width="150px" prop="tenantCode">
        <el-input v-model="ruleForm.tenantCode" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="type" label-width="150px" prop="type">
        <el-input v-model="ruleForm.type" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="unitName" label-width="150px" prop="unitName">
        <el-input v-model="ruleForm.unitName" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose('ruleForm')">取 消</el-button>
      <el-button type="primary" @click="handleClick('ruleForm')"
        >完 成</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
// import { AddGroupList } from "@api/group";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "150px",
      },
      ruleForm: {
        groupName: "",
        groupCode: "",
        groupDescription: "",
        linkMan: "",
        linkPhone: "",
        status: "",
        tenantCode: "",
        type: "",
        unitName: "",
      },
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: false,
    },
    editData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    editData: {
      handler(val) {
        this.loading(val);
      },
    },
    dialogShow: {
      handler(val) {
        this.ruleForm = val.sendData;
        console.log("rule", this.ruleForm);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    loading(val) {
      this.ruleForm.realName = val.realName;
      this.ruleForm.phoneNumber = val.phoneNumber;
    },
    handleClose(formRef) {
      this.$refs[formRef].resetFields();
      this.$emit("closeEdit", this.dialogShow.key);
    },

    handleClick(formName) {
      //   this.ruleForm.id = this.dialogShow.sendData.id
      AddGroupList(this.ruleForm).then((res) => {
        this.$message.success("编辑集团信息成功");
        this.$emit("closeEdit", this.dialogShow.key);
        this.$parent.loadData();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
.demo-ruleForm {
  padding-right: 40px;
  padding-top: 30px;
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
::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>
