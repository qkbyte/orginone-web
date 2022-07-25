<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <DiyBoxLayout class="info">
      <div class="info-btn-back" @click="handleReturn">
        <i class="el-icon-back"></i> 返回
      </div>
      <div class="info-main">
        <div class="info-main--left">
          <div class="info-main__icon">
            <img src="@assets/store/app-icon-2.png" />
          </div>
          <div class="info-main__con main-con">
            <div class="main-con__title">{{ formData.appName }}</div>
            <div class="main-con__desc">{{ formData.description }}</div>
            <div class="main-con__version">
              <span>{{ formData.version }}</span>
              <span>开发者：{{ formData.contact }}</span>
            </div>
          </div>
        </div>
        <div class="info-main__btn">
          <DiyButton class="btn-bg">
            <template v-slot:opt>
              <div class="diy-button" @click="handleDelete">退订</div>
            </template>
            <template v-slot:icon>
              <svg class="icon " aria-hidden="true">
                <use :xlink:href="'#icon-more'"></use>
              </svg>
            </template>
          </DiyButton>
        </div>
      </div>
    </DiyBoxLayout>
    <!-- <DiyBoxLayout class="auth">
      <div class="auth__title">权限分配</div>
      <div class="auth__btn"></div>
      <div class="auth__role-list">
        <div class="flex-wrap">
          <TheRoleItem
            :sendData="item"
            :treeData="menuTree"
            :roleList="roles"
            v-for="item in roles"
            :key="item.id"
          ></TheRoleItem>
          <i v-for="index in 12" :key="'i-' + index" />
        </div>
      </div>
    </DiyBoxLayout> -->
  </div>
</template>

<script>
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import DiyButton from "@components/DiyButton/index";
import TheRoleItem from "./components/TheRoleItem";
import { mapActions, mapGetters } from "vuex";
import { getAppInfo, unsubscribeApp } from "@api/market";

export default {
  data() {
    return {
      fullscreenLoading: false,
      img: "",
      formData: {},
      roles: [],
      menuTree: [],
    };
  },
  components: { DiyBoxLayout, DiyButton, TheRoleItem },
  created() {
    this.fullscreenLoading = true;
    this.loadAppAll();
  },
  methods: {
    /**退订应用 */
    handleDelete() {
      let params = {
        appIds: this.appId,
        tenantIds: this.curTenantCode,
      };
      unsubscribeApp([params.appIds]).then((res) => {
        this.$message.success("退订成功");
        this.loadlistData();
      });
    },
    handleReturn() {
      this.$router.go(-1);
    },
    /**
     * 加载数据
     */
    loadAppAll() {
      let params = {
        id: this.$route.query.id,
      };
      getAppInfo(params).then((res) => {
        //获取数据
        const { app, roleList, menu } = res.data.data;
        this.formData = app;
        this.roles = roleList;
        this.menuTree = menu;
        //数据处理
        let listToTree = function listToTree(oldArr) {
          oldArr.forEach((el) => {
            let parentId = el.parentId;
            if (el.roleList) {
              el.roleList = action(el.roleList);
            }
            if (parentId !== -1) {
              oldArr.forEach((ele) => {
                if (ele.id === parentId) {
                  ele.children.push(el);
                }
              });
            }
          });
          oldArr = oldArr.filter((el) => el.parentId === -1);
          return oldArr;
        };
        let traversal = function handleMenuTree(node, action) {
          if (node.children) {
            let childs = node.children;
            childs.forEach((el) => {
              traversal(el, action);
            });
          }
          return node;
        };
        let action = function handleRoleList(val) {
          let res = [];
          val.forEach((el) => {
            res.push(el.roleName);
          });
          return res;
        };
        this.menuTree = listToTree(this.menuTree);
        this.fullscreenLoading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.info {
  padding-top: 20px;
  padding-bottom: 30px;

  .info-btn-back {
    width: 60px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: rgba(144, 147, 153, 1);
  }

  .info-main {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;

    &--left {
      display: flex;
    }

    &__icon {
      width: 55px;
      height: 55px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    &__con {
      display: flex;
      flex-direction: column;
      margin-left: 20px;

      .main-con {
        &__title {
          height: 25px;
          font-size: 18px;
          font-weight: 600;
          line-height: 25px;
          color: rgba(48, 49, 51, 1);
        }

        &__desc {
          max-width: 80%;
          margin-top: 10px;
          font-size: 14px;
          font-weight: 400;
          line-height: 25px;
          color: rgba(96, 98, 102, 1);
        }

        &__version {
          margin-top: 8px;
          font-size: 12px;
          font-weight: 400;
          line-height: 17px;
          color: rgba(144, 147, 153, 1);

          span + span {
            margin-left: 10px;
          }
        }
      }
    }

    &__btn {
      margin-top: 20px;
      margin-right: 40px;
      font-size: 20px;
    }
  }
}

.btn-bg ::v-deep .diy-button-bg {
  background: white;
}

.auth {
  padding-top: 20px;
  padding-bottom: 30px;

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: rgba(48, 49, 51, 1);
  }
}
</style>
