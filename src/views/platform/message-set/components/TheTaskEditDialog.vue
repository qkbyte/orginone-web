<template>
  <el-dialog
    center
    top="10vh"
    width="700px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <span slot="title" class="diy-dialog-title"> 编辑预警消息 </span>
    <div class="body-container diy-dialog-body">
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-input
            v-if="item.prop === 'alertTitle'"
            v-model="form.alertTitle"
            placeholder="请输入标题"
          ></el-input>
          <el-input
            v-if="item.prop === 'alertBusiness'"
            v-model="form.alertBusiness"
            placeholder="请输入业务"
          ></el-input>
          <el-select
            v-if="item.prop === 'alertEmergencyLevel'"
            v-model="form.alertEmergencyLevel"
            placeholder="请选择"
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
            v-if="item.prop === 'alertStatus'"
            v-model="form.alertStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in optionStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-if="item.prop === 'alertContent'"
            style="width:100%"
            type="textarea"
            maxlength="400"
            show-word-limit
            v-model="form.alertContent"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick('form')">确 定</el-button>
      <el-button @click="handleClose('edit')">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import {
  marketappalertSubmit
} from "@api/market";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "标题",
          prop: "alertTitle",
        },
        {
          label: "业务",
          prop: "alertBusiness",
        },
        {
          label: "紧急程度",
          prop: "alertEmergencyLevel",
        },
        {
          label: "预警消息状态",
          prop: "alertStatus",
        },
        {
          label: "内容",
          prop: "alertContent",
          style: "width:100%",
        },
      ],
      form: {},
      rules: {
        alertTitle: [
          { required: true, message: "请输入标题", trigger: "blur" },
        ],
        alertBusiness: [
          { required: true, message: "请输入业务", trigger: "blur" },
        ],
        alertEmergencyLevel: [
          { required: true, message: "请选择紧急程度", trigger: "change" },
        ],
        alertStatus: [
          { required: true, message: "请选择预警消息状态", trigger: "change" },
        ],
        alertContent: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
      },
      groupTree: [],
      unitList: [],
      loading: false,
      current: 1,
      searchName: "",
      options: [
        {
          value: 1,
          label: "低",
        },
        {
          value: 2,
          label: "中",
        },
        {
          value: 3,
          label: "高",
        },
      ],
      optionStatus: [
        {
          value: 0,
          label: "未读",
        },
        {
          value: 1,
          label: "已读",
        },
      ],
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.form = this.dialogShow.sendData;
  },
  computed: {
    ...mapGetters("group", ["curGroupId"]),
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  methods: {
    filter(val) {
      this.searchName = val;
      this.unitList = [];
      this.loadUnitList();
    },
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleClick(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            id: this.dialogShow.sendData.id,
            alertTitle:this.form.alertTitle,
            alertBusiness: this.form.alertBusiness,
            alertEmergencyLevel: this.form.alertEmergencyLevel,
            alertStatus: this.form.alertStatus,
            alertContent: this.form.alertContent
          }
          marketappalertSubmit(params).then((res)=>{
            this.$parent.loadData()
            this.$message.success('添加成功')
            this.handleClose()
          })
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-select {
  width: 100% !important;
}
.diy-dialog-body {
  justify-content: space-between;
  .el-form {
    justify-content: space-between;
    .el-input {
      width: 250px;
    }
  }
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 10px;
}
.body-container {
  margin-top: 10px;

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 30px;
    color: rgba(48, 49, 51, 1);
  }
}
.body-item {
  margin-top: 10px;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-main {
    width: 100%;
    margin-top: 10px;
  }

  .diy-table {
    padding: 0;
  }
}
</style>

<style lang="scss" scoped>
.body-container ::v-deep .el-form {
  .el-cascader,
  .el-input {
    width: 280px;
  }
}
::v-deep .el-dialog__body {
  overflow: auto;
  height: 380px;
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
