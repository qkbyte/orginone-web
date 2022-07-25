<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="订阅中"
    :visible.sync="dialogShow.value"
    width="30%"
    class="diy-dialog"
    title="选择存入应用中心"
    :before-close="handleClose"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <div class="appBox">
      <div class="choseBox" v-if="dialogShow.sendData.targetUser !== 3">
        <div class="choseBox-left">单位应用中心</div>
        <div class="choseBox-right">
          <el-checkbox v-model="unitCheck" @change="handleWatch"></el-checkbox>
        </div>
      </div>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item
          title="集团应用中心"
          name="1"
          v-if="groupList.length > 0"
        >
          <div
            class="departList"
            v-for="(item, index) in groupList"
            :key="index"
          >
            <div class="departList-left">{{ item.name }}</div>
            <div class="departList-right">
              <el-checkbox
                @change="handleWatchDepart(item)"
                v-model="item.check"
              ></el-checkbox>
            </div>
          </div>
        </el-collapse-item>
        <div class="lineCon" v-else>
          <div class="leftCon">
            集团应用中心
          </div>
          <div class="rightCon">
            <span class="title" @click="getOrg">创建集团</span>
          </div>
        </div>
      </el-collapse>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
    <template v-for="item in dialog">
      <TheCreateGroupDialog
        v-if="item.key === 'apply' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheCreateGroupDialog>
    </template>
  </el-dialog>
</template>
]
<script>
import { mapGetters, mapState } from "vuex";
import {
  purchaseByGroups,
  getAppPurchaseConfig,
  purchaseApp,
} from "@api/market";
import TheCreateGroupDialog from "../../appCenter/components/TheCreateGroupDialog";
export default {
  name: "TheAppDialog",
  data() {
    return {
      dialog: [
        {
          key: "apply",
          value: false,
        },
      ],
      form: {},
      options: [],
      loading: false,
      unitCheck: false,
      num: null,
      activeName: "1",
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
  watch: {
    unitCheck(val) {
      if (this.num == 1) {
        if (val) {
          this.groupList.forEach((el) => {
            el.check = false;
          });
        }
      }
    },
    groupList: {
      handler(val) {
        if (this.num == 2) {
          if (this.unitCheck) {
            this.unitCheck = false;
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  components: { TheCreateGroupDialog },
  computed: {
    ...mapGetters("group", [
      "groupCount",
      "dropGroupList",
      "curGroup",
      "curGroupId",
    ]),
    ...mapGetters("tenant", ["curTenantCode"]),
    ...mapState("group", ["groupList"]),
  },
  mounted() {
    this.groupList.forEach((el) => {
      this.$set(el, "check", false);
    });
    this.getListCheck();
  },
  methods: {
    handleCloseDialog(val) {
      this.dialog.map((el) => {
        if (el.key == val) {
          el.value = false;
        }
      });
    },
    getOrg() {
      this.dialog.map((el) => {
        if (el.key == "apply") {
          el.value = true;
        }
      });
    },
    async getListCheck() {
      let params = {
        appId: this.dialogShow.sendData.id,
      };
      const res = await getAppPurchaseConfig(params);
      let list = res.data.data;
      if (JSON.stringify(list.unit) !== "{}") {
        this.unitCheck = true;
        if (list.group.length !== 0) {
          this.groupList.forEach((el) => {
            for (let i = 0; i < list.group.length; i++) {
              if (el.groupId == list.group[i]) {
                el.check = true;
                break;
              }
            }
          });
        }
      } else if (list.group.length !== 0) {
        this.groupList.forEach((el) => {
          for (let i = 0; i < list.group.length; i++) {
            if (el.groupId == list.group[i]) {
              el.check = true;
              break;
            }
          }
        });
      }
    },
    handleWatch() {
      this.num = 1;
    },
    handleWatchDepart() {
      this.num = 2;
    },
    handleSubmit() {
      if (this.unitCheck) {
        let params = {
          appId: this.dialogShow.sendData.id,
          tenantId: this.curTenantCode,
        };
        purchaseApp(params).then((res) => {
          this.$emit("handleCloseEmit", "choseUnit");
        });
      } else {
        let arr = [];
        this.groupList.forEach((el) => {
          if (el.check) {
            arr.push(el.groupId);
          }
        });
        let params = {
          appId: this.dialogShow.sendData.id,
          groupId: arr,
        };
        purchaseByGroups(params).then(
          (res) => {
            this.loading = false;
            this.$emit("handleCloseEmit", "group");
          },
          (err) => {
            this.loading = false;
          }
        );
      }
    },
    handleClose() {
      this.$emit("closeDialog", "choseUnit");
    },
    handleUnit() {
      let params = {
        appId: this.dialogShow.sendData.id,
        tenantId: this.curTenantCode,
      };
      purchaseByGroups(params).then((res) => {
        this.$emit("handleCloseEmit", "choseUnit");
      });
    },
    handleGroup() {
      if (this.groupList.length == 0) {
        this.$emit("openCreateGroup");
      } else {
        this.$emit("closeDialog", "choseUnit");
        this.$emit("openGroupDialog");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-collapse-item__header {
  font-size: 16px;
}
::v-deep .el-collapse {
  margin: 0 20px;
  border-left: 1px solid #ebebeb;
  border-right: 1px solid #ebebeb;
  padding: 0 20px;
}
::v-deep .el-dialog__body {
  max-height: 500px;
  overflow: auto;
}
.departList {
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  &-left {
    font-size: 14px;
  }
}
.departList:hover {
  background: #ebebeb;
}
.appBox {
  width: 100%;
  ::v-deep.el-collapse {
    margin: 0 20px;
    border-left: 1px solid #ebebeb;
    border-right: 1px solid #ebebeb;
    padding: 0 20px;
    height: 213px;
    overflow: auto;
  }
  .lineCon {
    display: flex;
    width: 100%;
    height: 50px;
    justify-content: space-between;
    margin-top: 8px;
    .leftCon {
      font-size: 16px;
      font-weight: 500;
    }
    .rightCon {
      .title {
        color: #154ad8;
        cursor: pointer;
      }
    }
  }
}
.choseBox {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  font-size: 16px;
  border: 1px solid #ebebeb;
  border-bottom: unset;
  margin-right: 20px;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
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
</style>
