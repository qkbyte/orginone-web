<template>
  <div class="login-box">
    <div class="login-box__back" @click="handleBack">
      <div class="back-icon el-icon-arrow-left"></div>
      <div class="back-text">返回</div>
    </div>
    <div class="login-box__title">搜索单位</div>
    <div class="login-box__title-2">输入单位名称，快速加入单位</div>
    <div class="login-box__content">
      <el-input type="text" placeholder="单位名称" v-model="company"></el-input>
    </div>
    <div class="login-box__tips" v-show="visible">
      为您索搜到 {{ tableData.length || 0 }} 家单位
    </div>
    <div class="login-box__table">
      <div
        class="table-item"
        v-for="(item, index) in tableData"
        :key="index"
        @click="join(item)"
      >
        <div class="flex-between" style="align-items:center;">
          <div class="table-item__title">{{ item.tenantName }}</div>
          <div>
            <span class="table-item__btn">加入单位</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="table-item__title-2">管理员：未知</div>
      </div>
      <!-- <el-table
        v-if="visible"
        :data="tableData"
        style="width: 100%"
        :show-header="false"
      >
        <el-table-column
          label="单位名称"
          prop="name"
          width="200"
        ></el-table-column>
        <el-table-column label="加入团队">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="join(scope.$index)"
              type="text"
              size="small"
            >
              加入团队
            </el-button>
          </template>
        </el-table-column>
      </el-table> -->
    </div>
  </div>
</template>

<script>
import { getTenantByName } from "@api/tenant";
import { applyTenantByUserId } from "@api/user";
export default {
  name: "SearchCompany",
  data() {
    return {
      company: "",
      tableData: [],
      tenantCode: [],
      visible: false,
    };
  },
  methods: {
    handleBack() {
      this.company = "";
      this.$emit("handleToggle", 3);
    },
    join(e) {
      const loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let params = { tenantCode: e.tenantCode };
      applyTenantByUserId(params).then(
        (res) => {
          loading.close();
          this.$message.success({
            message: "申请成功，等待审核",
            duriation: 700,
          });
          this.$router.push("/");
        },
        (err) => {
          loading.close();
        },
        this
      );
    },
  },
  mounted() {},
  watch: {
    company(newVal, oldVal) {
      this.visible = true;
      let data = {
        tenantName: newVal,
      };
      if (newVal === "") {
        this.visible = false;
        this.tableData = [];
        this.tenantCode = [];
      } else {
        getTenantByName(data).then((res) => {
          this.tableData = res.data.data;
        }, this);
      }
    },
  },
};
</script>

<style lang="scss">
.login-box {
  &__title {
    margin-top: 10px;
  }
  &__content {
    margin-top: 20px;
  }
  &__tips {
    font-size: 12px;
    color: #909399;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  &__table {
    height: 200px;
    overflow: auto;
  }
  .table-item {
    width: 320px;
    height: 65px;
    background: #eff2f9;
    padding: 10px 20px;

    &__title {
      height: 20px;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      color: #303133;
    }

    &__btn {
      font-size: 13px;
      font-weight: 500;
      line-height: 17px;
      color: #154ad8;
      visibility: hidden;
    }

    i {
      font-weight: bold;
      color: #c0c4cc;
    }

    &__title-2 {
      margin-top: 8px;
      height: 17px;
      font-size: 12px;
      font-weight: 500;
      line-height: 17px;
      color: #606266;
    }

    &:hover {
      cursor: pointer;

      i {
        color: #154ad8;
      }

      .table-item__btn {
        visibility: visible;
      }
    }
  }

  .table-item + .table-item {
    margin-top: 10px;
  }
  ::-webkit-scrollbar {
    width: 4px;
    height: 0px;
    background: #ffffff;
  }
  ::-webkit-scrollbar-thumb {
    height: 0px;
    border-radius: 4px;
    background: #ebeef5;
  }
  ::-webkit-scrollbar-thumb:hover {
    width: 84px;
    background: #90939967;
  }
}
</style>

<style lang="scss" scoped>
.login-box__content ::v-deep .el-input {
  input {
    border-radius: 0;
  }
}
</style>
