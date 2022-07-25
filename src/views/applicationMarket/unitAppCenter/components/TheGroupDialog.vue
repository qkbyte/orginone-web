<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="订阅中"
    :visible.sync="dialogShow.value"
    width="30%"
    class="diy-dialog"
    :before-close="handleClose"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <el-select v-model="form.groupId" placeholder="请选择集团">
      <el-option
        v-for="item in options"
        :key="item.groupId"
        :label="item.name"
        :value="item.groupId"
      >
      </el-option>
    </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSub">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { purchaseApp } from "@api/market";
export default {
  name: "TheAppDialog",
  data() {
    return {
      form: {},
      options: [],
      loading: false,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
    rowData: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.loadData();
  },
  computed: {
    ...mapGetters("group", [
      "groupCount",
      "dropGroupList",
      "curGroup",
      "curGroupId",
    ]),
    ...mapState("group", ["groupList"]),
  },
  methods: {
    loadData() {
      this.options = this.groupList;
      // dropGroupList
    },
    handleSub() {
      this.loading = true;
      let params = {
        appId: this.dialogShow.sendData.id,
        groupId: this.form.groupId,
      };
      purchaseApp(params).then(
        (res) => {
          this.loading = false;
          this.$emit("handleCloseEmit", "group");
        },
        (err) => {
          this.loading = false;
        }
      );
    },
    handleClose() {
      this.$emit("closeDialog", "group");
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog ::v-deep .el-dialog__header {
  padding-bottom: 20px;
}
::v-deep .el-dialog__body {
  padding: unset;
  height: 175px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog-header {
  height: 76px;
  display: flex;

  &__icon {
    width: 70px;
    height: 70px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  &__info {
    margin-left: 30px;
    max-width: 500px;

    .detail-title {
      font-size: 24px;
      font-weight: 400;
      line-height: 33px;
      color: rgba(48, 49, 51, 1);
    }

    .detail-star {
      margin-top: 10px;
      img {
        width: 18px;
        height: 17px;
      }

      img + img {
        margin-left: 10px;
      }
    }
  }

  &__btn {
    margin-top: 30px;
    height: 30px;
    display: flex;
    flex-direction: row-reverse;

    .el-button {
      background-color: #fff !important;
      color: #154ad8;
      border: 1px solid #154ad8;
      &:hover {
        background-color: #154ad8 !important;
        color: #fff;
      }
    }
  }
}
.diy-dialog ::v-deep .el-dialog__body {
  padding-top: 0;
}
.dialog-main {
  margin-top: 15px;
  width: 100%;
  height: 550px;
  overflow: auto;
}

::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  background: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  height: 8px;
  border-radius: 4px;
  background: rgba(235, 238, 245, 1);
}
</style>
