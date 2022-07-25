<template>
  <div class="role-item">
    <span class="role-item--top">
      <div class="role-item--left">
        <div class="role-item__icon"><i class="el-icon-user"></i></div>
        <div class="role-item__title">{{ sendData.roleName }}</div>
      </div>
      <div class="role-item__btn">
        <DiyButton>
          <template v-slot:opt>
            <div class="diy-button" @click="handleAuth">权限分配</div>
            <div class="diy-button" @click="handleView">查看菜单</div>
          </template>
          <template v-slot:icon>
            <svg class="icon " aria-hidden="true">
              <use :xlink:href="'#icon-more'"></use>
            </svg> </template
        ></DiyButton>
      </div>
    </span>
    <div class="role-item__number">
      <div
        v-if="sendData.distributeType === 1"
        class="role-item__number--yes flex-center"
      >
        <i class="el-icon-circle-check"></i>
        已分配 {{ sendData.distributionPerson }} 人
      </div>
      <div
        class="role-item__number--yes flex-center"
        v-else-if="sendData.distributeType === 2"
      >
        <i class="el-icon-circle-check"></i>
        已分配 {{ sendData.distributionPerson }} 部门
      </div>
      <div
        class="role-item__number--yes flex-center"
        v-else-if="sendData.distributeType === 3"
      >
        <i class="el-icon-circle-check"></i>
        已分配 {{ sendData.distributionPerson }} 岗位
      </div>
      <div v-else class="role-item__number--no flex-center">
        <i class="el-icon-remove-outline"></i>
        未分配
      </div>
    </div>
    <template v-for="item in dialogShow">
      <TheViewDialog
        v-if="item.key === 'view' && item.value"
        :key="item.key"
        :dialogShow="item"
        :treeData="treeData"
        @closeDialog="handleCloseDialog"
      ></TheViewDialog>
      <TheAuthDialog
        v-if="item.key === 'auth' && item.value"
        :key="item.key"
        :dialogShow="item"
        @updateList="handleUpdate"
        @closeDialog="handleCloseDialog"
      ></TheAuthDialog>
    </template>
  </div>
</template>

<script>
import DiyButton from "@components/DiyButton/index";
import TheViewDialog from "./TheViewDialog";
import TheAuthDialog from "./TheAuthDialog";
import { mapGetters, mapState, mapActions } from "vuex";
import { unsubscribeApp } from "@api/market";

export default {
  data() {
    return {
      dialogShow: [
        {
          key: "view",
          value: false,
        },
        {
          key: "auth",
          value: false,
        },
      ],
      checked: false,
    };
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  components: { DiyButton, TheViewDialog, TheAuthDialog },
  created() {},
  props: {
    sendData: {
      type: Object,
      default: () => {},
    },
    treeData: {
      type: Array,
      default: () => [],
    },
    roleList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleUpdate() {
      this.$parent.$parent.loadAppAll();
    },
    handleView() {
      this.dialogShow.map((el) => {
        if (el.key === "view") {
          el.value = true;
          el.sendData = { roleName: this.sendData.roleName };
        }
      });
    },
    handleAuth() {
      this.dialogShow.map((el) => {
        if (el.key === "auth") {
          el.value = true;
          el.sendData = {
            roleName: this.sendData.roleName,
            roleList: this.roleList,
            roleId: this.sendData.id,
            appId: this.sendData.appId,
          };
        }
      });
    },
    handleDelete() {
      let params = {
        appIds: this.appData.id,
        tenantIds: this.curTenantCode,
      };
      unsubscribeApp([params.appIds]).then((res) => {
        this.$message.success("退订成功");
        this.loadlistData();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.role-item {
  display: inline-block;
  margin-top: 20px;
  max-width: 30%;

  &--top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    div + div {
      margin-left: 5px;
    }
  }

  &--left {
    display: flex;
    align-items: center;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    color: rgba(96, 98, 102, 1);
  }

  &__number {
    width: 100%;
    min-width: 110px;
    height: 30px;

    &--yes,
    &--no {
      margin-top: 10px;
      padding: 6px 15px;
      border-radius: 15px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(48, 49, 51, 1);

      i {
        margin-right: 5px;
      }
    }

    &--yes {
      background: rgba(103, 194, 58, 0.2);
      i {
        color: rgba(103, 194, 58, 1);
      }
    }

    &--no {
      background: rgba(192, 196, 204, 0.2);
      i {
        color: rgba(48, 49, 51, 1);
      }
    }
  }
}

.role-item__btn ::v-deep .diy-button-bg {
  background: white;
  width: 20px;
}
</style>
