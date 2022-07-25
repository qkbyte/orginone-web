<template>
  <div class="login-box">
    <div class="login-box__title">
      欢迎使用{{
        CURRENT_ENV === "production" ? "资产云2.0" : "云原生应用平台"
      }}
    </div>
    <div class="login-box__tips">请选择下一步操作</div>
    <div class="login-box__options" @click="handleNext(4)">
      <div class="options-header">
        <div class="header-title">创建单位</div>
        <i class="el-icon-arrow-right header-next"></i>
      </div>
      <div class="options-content">
        快速创建单位，进行管理单位人员、部门管理，获取应用、分配应用、上架应用等。
      </div>
    </div>
    <div class="login-box__options" @click="handleNext(5)">
      <div class="options-header">
        <div class="header-title">加入单位</div>
        <i class="el-icon-arrow-right header-next"></i>
      </div>
      <div class="options-content">
        单位已创建，通过搜索单位名称快速申请加入单位。
      </div>
    </div>
    <!-- <div class="login-box__options" @click="handleNext()">
      <div class="options-header">
        <div class="header-title">跳过</div>
        <i class="el-icon-arrow-right header-next"></i>
      </div>
      <div class="options-content">
        跳过创建单位、加入单位，直接进入平台。
        <br />可在平台内进行上述操作。
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleNext(e) {
      if (e) {
        this.$emit("handleToggle", e);
      } else {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login-box {
  &__tips {
    margin-top: 8px;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: #606266;
  }
  &__options {
    padding: 12px 20px;
    border: 1px solid #dee0e3;
    margin-top: 20px;

    .options-header {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-next {
        font-size: 10px;
        font-weight: 1000;
        color: #c0c4cc;
      }
    }

    .options-content {
      margin-top: 8px;
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: #303133;
    }

    &:hover {
      cursor: pointer;
      border: 1px solid #154ad8;

      .header-next {
        color: #154ad8;
      }
    }
  }
}
</style>
