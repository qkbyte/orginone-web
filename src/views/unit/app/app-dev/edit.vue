<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div class="con">
      <TheAppForm
        ref="form"
        :formInfo="formInfo"
        :formData="formData"
      ></TheAppForm>
      <TheRoleMenu :roles="roles" :tree="menuTree"></TheRoleMenu>
      <div class="con__option">
        <div>
          <el-button @click="handleReturn()">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheAppForm from "../components/TheAppForm";
import TheRoleMenu from "../components/TheRoleMenu";
import { getAppInfo } from "@api/market";

export default {
  data() {
    return {
      fullscreenLoading: false,
      formInfo: {
        title: "应用信息",
        icon: "iconyingyongchakan",
      },
      formData: {},
      roles: [],
      menuTree: [],
    };
  },
  components: {
    TheAppForm,
    TheRoleMenu,
  },
  created() {
    this.fullscreenLoading = true;
    this.loadAppAll();
  },
  methods: {
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
        this.roles = action(this.roles);
        this.fullscreenLoading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.con {
  width: 100%;
  margin-top: 30px;

  &__option {
    margin-top: 60px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
  }
}
</style>

<style lang="scss" scoped>
.con__option ::v-deep .el-button {
  width: 150px;
}
.con__option ::v-deep .el-button:hover {
  color: #fff !important;
  background-color: #1549d8e5 !important;
  border-color: #1549d8e5 !important;
  font-weight: 400 !important;
}
</style>
