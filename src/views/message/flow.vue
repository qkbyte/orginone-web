<template>
  <div class="wel">
    <div class="welMain">
      <div class="sep">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: '消息' }">消息</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: '审批单据' }"
            >单据审批</el-breadcrumb-item
          >
          <el-breadcrumb-item>流程详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="con">
        <div class="info">
          <div class="tit">
            <div>
              <i class="el-icon-s-check"></i>
              <span>XX业务审批流程</span>
            </div>
          </div>
          <div class="head">业务框图</div>
          <div class="row">
            <img src="@assets/test1.png" alt />
          </div>
          <div class="head">审核列表</div>
          <div class="row">
            <img src="@assets/test2.png" alt />
          </div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        name: "",
        tag: "",
        phone: "",
        type: "",
        con: "",
        file: []
      }
    };
  },
  mounted: function() {},
  methods: {
    //返回
    handleReturn() {
      this.$router.go(-1);
    },
    toFlow() {
      this.$router.push({ name: "flow" });
    }
  }
};
</script>
<style lang="scss" scoped>
.wel {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  .welMain {
    display: flex;
    flex-direction: column;
    padding: 3%;

    .con {
      width: 100%;
      margin-top: 30px;

      .info {
        width: 100%;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 6px 10px rgba(5, 36, 83, 0.12);
        border-radius: 4px;
        border-top: 6px solid rgba(21, 74, 216, 1);
        box-sizing: border-box;
        padding: 0 4% 4%;

        .tit {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;

          i {
            font-size: 2.125rem;
            color: rgba(21, 74, 216, 1);
          }
          span {
            margin-left: 5px;
            font-size: 2.125rem;
            color: rgba(21, 74, 216, 1);
            font-weight: bold;
          }
        }

        .head {
          font-size: 1.875rem;
          font-weight: bold;
          color: rgba(102, 102, 102, 1);
        }

        .row {
          margin-top: 30px;
          margin-bottom: 30px;
          width: 100%;

          img {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.input ::v-deep .el-input__inner {
  width: 100%;
  border-radius: 0 !important;
  height: 80px;
  border: none !important;
  border-bottom: 1px solid #dcdfe6 !important;
}
.input ::v-deep .el-select {
  width: 100%;
}
.input ::v-deep .el-textarea__inner {
  width: 100%;
  border-radius: 0 !important;
  height: 150px;
  border: none !important;
  border-bottom: 1px solid #dcdfe6 !important;
}

.opinion ::v-deep .el-input__inner {
  width: 100%;
  border-radius: 0 !important;
  height: 120px;
  border: none !important;
  border-bottom: 1px solid #dcdfe6 !important;
}

.option ::v-deep .el-button {
  width: 150px;
}
.option ::v-deep .el-button:hover {
  color: #fff !important;
  background-color: #1549d8e5 !important;
  border-color: #1549d8e5 !important;
  font-weight: 400 !important;
}
</style>
