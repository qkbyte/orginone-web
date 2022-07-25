<template>
  <el-dialog
    class="positionEditDialog"
    center
    top="10vh"
    width="700px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <span slot="title" class="diy-dialog-title"> 编辑性质 </span>
    <div class="body-container diy-dialog-body">
      <div class="body-container__title">性质信息</div>
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-input
            class="positionInput"
            v-if="item.prop === 'propertiesName'"
            v-model="form.propertiesName"
            placeholder="请输入性质名称"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="body-container body-item">
      <div class="body-item-header">
        <div class="body-container__title">分配单位</div>
      </div>
      <div class="body-item-main">
        <TheUserTransfer :type="'edit'" :dialogShow="dialogShow" ref="userTransfer"></TheUserTransfer>
      </div>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { distributeProperties } from "@api/group";
import TheUserTransfer from "./TheUserTransfer";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "性质名称",
          prop: "propertiesName",
        },
      ],
      form: {},
      rules: {
        propertiesName: [
          { required: true, message: "请输入性质名称", trigger: "blur" },
        ],
      },
      loading: false
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  components: { TheUserTransfer },
  created() {
    this.form = this._.cloneDeep(this.dialogShow.sendData);
  },
  computed: {
    ...mapGetters("group", ["curGroup"]),
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleClick() {
      this.loading = true;
      let params = {
        propertiesId: this.dialogShow.sendData.id,
        propertiesName: this.form.propertiesName,
        tenantIds: this.$refs.userTransfer.$children[0].value.join(","),
      };
      distributeProperties(params).then(
        (res) => {
          this.loading = false;
          this.$emit("closeDialog", this.dialogShow.key);
          this.$message.success({
            message: "修改成功",
            duriation: 700,
          });
          this.$parent.$refs.table.loadData()
          this.$parent.mainTableData[0].value1 = this.$parent.curData.propertiesName = this.form.propertiesName
        },
        (err) => {
          this.loading = false;
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
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
  margin-right: 20px;
}
.body-container {
  padding: 10px 20px;
  border: 1px solid rgba(235, 238, 245, 1);
  border-radius: 4px;

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
.positionEditDialog {
  width: 100%;
  .is-required {
    width: 100%;
    display: flex;
  }
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .positionInput {
    margin-left: 40px;
  }
}
</style>
