<template>
  <BaseDialog
    v-if="dialogShow.value"
    :dialogShow="dialogShow.value"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <template>
      <div class="container">
        <div class="container__header">
          <div></div>
          <div class="container__header-title">修改卡片样式信息</div>
          <div class="container__header-close-btn" @click="handleClose">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div class="container__body">
          <el-form ref="form" :model="form" :rules="rules" label-position="top">
            <el-form-item
              v-for="item in formItem"
              v-bind="item"
              :key="item.prop"
              :label-width="options.labelWidth"
            >
              <el-input
                v-if="item.prop === 'name'"
                v-model="form.name"
                placeholder="请输入样式名称"
              ></el-input>
              <el-input
                v-if="item.prop === 'type'"
                v-model="form.type"
                placeholder="样式类型"
              ></el-input>
              <el-input
                v-if="item.prop === 'remarks'"
                v-model="form.remarks"
                placeholder="样式描述"
              ></el-input>
              <el-input
                v-if="item.prop === 'parentid'"
                v-model="form.parentid"
                placeholder="样式父ID"
              ></el-input>
              <el-input-number
                v-if="item.prop === 't_order'"
                v-model="form.t_order"
                placeholder="顺序号"
              ></el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <div class="container__footer">
          <el-button type="primary" @click="handleAddCardstyle"
            >确 定</el-button
          >
          <el-button @click="handleClose">取 消</el-button>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import { mapGetters } from "vuex";
import BaseDialog from "@components/BaseDialog";
import { updatecardstyle } from "@api/card-style";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "样式名称",
          prop: "name",
        },
        {
          label: "样式类型",
          prop: "type",
        },
        {
          label: "样式描述",
          prop: "remarks",
        },
        {
          label: "样式父ID",
          prop: "parentid",
        },
        {
          label: "顺序号",
          prop: "t_order",
        },
      ],
      form: {},
      rules: {
        name: [
          { required: true, message: "请输入卡片样式名称", trigger: "blur" },
        ],
      },
      loading: false,
    };
  },
  components: {
    BaseDialog,
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.form = this._.cloneDeep(this.dialogShow.sendData);
  },
  mounted() {},
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  watch: {},
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleAddCardstyle() {
      this.loading = true;
      let params = this.form;
      params.recid = this.dialogShow.sendData.recid;
      updatecardstyle(params).then(
        (res) => {
          this.loading = false;
          this.$parent.loadlistData();
          this.$emit("closeDialog", this.dialogShow.key);
          this.$message.success({
            message: "修改成功",
            duriation: 700,
          });
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
.container {
  width: 700px;
  height: 650px;
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 20px;

  &__header {
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &-back-btn {
      font-size: 1.25rem;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      cursor: pointer;
    }
    &-title {
      font-size: 1.5rem;
      font-weight: bold;
      line-height: 29px;
      color: rgba(51, 51, 51, 1);
    }
    &-close-btn {
      cursor: pointer;
    }
  }

  &__body {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 30px 10px 20px;

    .el-form {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .el-form-item {
        height: auto;

        .el-input,
        .el-cascader,
        .el-input-number {
          width: 300px;
        }

        .el-textarea {
          width: 300px;
        }
      }
    }
  }

  &__footer {
    flex: 1;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;

    .el-button {
      margin-left: 20px;
    }
  }
}
</style>
