<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="订阅中"
    top="8vh"
    width="800px"
    class="diy-dialog"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <div slot="title" class="dialog-header">
      <div class="dialog-header__icon">
        <img
          :src="
            dialogShow.sendData.icon
              ? dialogShow.sendData.icon
              : require('@assets/default-head.svg')
          "
          alt=""
        />
      </div>
      <div class="dialog-header__info">
        <div class="detail-title">{{ dialogShow.sendData.appName }}</div>
        <div class="detail-star">
          <el-rate
            v-model="star"
            :colors="['#154AD8', '#154AD8']"
            disabled
          ></el-rate>
        </div>
      </div>
      <div style="flex:1;"></div>
      <div class="dialog-header__btn">
        <el-button
          v-if="!dialogShow.sendData.ifPurchase"
          type="primary"
          size="mini"
          round
          @click="handlePurchase"
        >
          获取
        </el-button>
        <el-button v-else type="primary" size="mini" round @click="handleOpen">
          打开
        </el-button>
      </div>
    </div>
    <div class="dialog-tabs">
      <DiyTabs ref="typeItem" :tabList="tabs" :curTab.sync="curTab"></DiyTabs>
    </div>
    <div class="dialog-main">
      <template v-if="curTab === '1'">
        <AppInfo :sendData="dialogShow.sendData"></AppInfo>
      </template>
      <template v-else-if="curTab === '2'">
        <AppComment :sendData="dialogShow.sendData"> </AppComment>
      </template>
      <template v-else>
        <AppContact :sendData="dialogShow.sendData"> </AppContact>
      </template>
    </div>

    <template v-for="item in dialog">
      <TheGroupDialog
        v-if="item.key === 'group' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
        @handleCloseEmit="handleCloseEmit"
      ></TheGroupDialog>
      <TheChoseUnitDialog
        v-if="item.key === 'choseUnit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @openGroupDialog="openGroupDialog"
        @closeDialog="handleCloseDialog"
        @handleCloseEmit="handleCloseEmit"
        @openCreateGroup="openCreateGroup"
      ></TheChoseUnitDialog>
      <TheCreateGroupDialog
        v-if="item.key === 'apply' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheCreateGroupDialog>
    </template>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import DiyTabs from "@components/DiyTabs/index";
import AppInfo from "./AppInfo";
import AppComment from "./AppComment";
import AppContact from "./AppContact";
import { purchaseApp } from "@api/market";
import TheGroupDialog from "./TheGroupDialog";
import TheChoseUnitDialog from "./TheChoseUnitDialog";
import TheAppDialog from "./TheAppDialog";
import TheCreateGroupDialog from "../../appCenter/components/TheCreateGroupDialog";
export default {
  name: "TheAppDialog",
  data() {
    return {
      tabs: [
        {
          id: "1",
          title: "应用介绍",
        },
        {
          id: "2",
          title: "应用评价",
        },
        {
          id: "3",
          title: "联系方式",
        },
      ],
      curTab: "1",
      star: 3,
      loading: false,
      dialog: [
        {
          key: "group",
          value: false,
        },
        {
          key: "choseUnit",
          value: false,
        },
        {
          key: "apply",
          value: false,
        },
      ],
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
  components: {
    DiyTabs,
    AppInfo,
    AppComment,
    AppContact,
    TheGroupDialog,
    TheChoseUnitDialog,
    TheCreateGroupDialog,
    TheAppDialog,
  },
  created() {},
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
    ...mapGetters("group", ["curGroupId"]),
    ...mapState("group", ["groupList"]),
  },
  methods: {
    handleCloseDialog(val) {
      this.dialog.map((el) => {
        if (el.key == val) {
          el.value = false;
        }
      });
    },
    handleCloseEmit(val) {
      this.dialog.map((el) => {
        if (el.key == val) {
          el.value = false;
        }
      });
      this.$emit("handleClose", this.dialogShow.key);
      this.$message.success({
        message: "应用订阅成功",
        duriation: 700,
      });
      this.$parent.loadAppList();
    },
    openCreateGroup() {
      this.dialog.map((el) => {
        if (el.key == "apply") {
          el.value = true;
        }
      });
    },
    handlePurchase() {
      // if (this.dialogShow.sendData.targetUser == "3") {
      //   debugger;
      //   this.dialog.map((el) => {
      //     if (el.key == "group") {
      //       el.value = true;
      //       el.sendData = this.dialogShow.sendData;
      //     }
      //   });
      // } else {
      //   debugger;
      //   this.dialog.map((el) => {
      //     if (el.key == "choseUnit") {
      //       el.value = true;
      //       el.sendData = this.dialogShow.sendData;
      //     }
      //   });
      // }
      this.dialog.map((el) => {
        if (el.key == "choseUnit") {
          el.value = true;
          el.sendData = this.dialogShow.sendData;
        }
      });
    },
    openGroupDialog() {
      if (this.groupList.length !== 0) {
        this.dialog.map((el) => {
          if (el.key == "group") {
            el.value = true;
            el.sendData = this.dialogShow.sendData;
          }
        });
      } else {
        this.openCreateGroup();
      }
    },
    handleOpen() {
      this.$router.push({
        name: "app-manage-view",
        query: {
          id: this.dialogShow.sendData.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog ::v-deep .el-dialog__header {
  padding-bottom: 20px;
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
