<template>
  <div class="con">
    <div class="con__title">
      应用发布
    </div>
    <div class="title">设置角色菜单</div>
    <TheAppMenu
      ref="appMenu"
      @handleUpdate="handleUpdate"
      :listData="list"
    ></TheAppMenu>
    <div class="title">菜单预览</div>
    <TheRoleMenu :roles="roles" :tree="menuTree"></TheRoleMenu>
    <div class="title">应用组件</div>
    <TheAppRelease ref="appRelease" :appId="appId"></TheAppRelease>
    <div class="con__option">
      <el-button @click="handleReturn">返回</el-button>
      <el-button type="primary" @click="handleSubmit" style="margin-left:30px;"
        >提交</el-button
      >
    </div>
  </div>
</template>
<script>
import TheAppMenu from "../components/TheAppMenu";
import TheRoleMenu from "../components/TheRoleMenu";
import TheAppRelease from "./components/TheAppRelease";
import { DebounceBy } from "@utils/debounce";
import { releaseApp } from "@api/market";

export default {
  data() {
    return {
      roles: [],
      menuTree: [],
      list: {},
      judge: true,
      appId: "",
    };
  },
  components: {
    TheRoleMenu,
    TheAppMenu,
    TheAppRelease,
  },
  created() {
    this.appId = this.$route.params.row.id;
  },
  mounted() {
    this.list = this.$route.params.row;
  },
  computed: {},
  methods: {
    handleUpdate(roleList, menuList) {
      this.roles = roleList;
      this.menuTree = menuList;
    },
    handleReturn() {
      this.$router.go(-1);
    },
    handleIsRoles(tree, data) {
      tree.forEach((el) => {
        if (el.parentId == -1) {
          this.judge = false;
        } else {
          if (el.roleList.indexOf(data) < 0) {
            this.judge = true;
            let role = data;
            if (el.children && el.children.length > 0) {
              this.handleIsRoles(el.children, role);
            }
          } else {
            this.judge = false;
          }
        }
      });
      return this.judge;
    },
    handleSubmit: DebounceBy(async function(value) {
      let isRoles = true;
      if (this.$refs.appMenu.roles.length == 0) {
        this.$message.warning("请设置角色");
      } else {
        let tree = this.$refs.appMenu.menuTree;
        tree[0].parentId = -1;
        let roles = this.$refs.appMenu.roles;
        let componentList = this.$refs.appRelease.tableData;
        console.log("tree", tree, roles, componentList);
        for (let i = 0; i < roles.length; i++) {
          isRoles = await this.handleIsRoles(tree, roles[i]);
          if (isRoles == true) {
            break;
          }
        }
        if (isRoles) {
          this.$message.warning("存在角色未设置菜单");
        } else {
          let traversal = function handleMenuTree(node, action) {
            if (node.roleList) {
              node.roleList = action(node.roleList);
            }
            if (node.children) {
              let childs = node.children;
              childs.forEach((el) => {
                traversal(el, action);
              });
            }
            return node;
          };
          let action = function handleRoleList(roleList) {
            let res = [];
            roleList.forEach((el) => {
              let data = {};
              data.roleName = el;
              res.push(data);
            });
            return res;
          };
          let roles = action(this.roles);
          let menu = this._.cloneDeep(this.menuTree);
          menu.forEach((el) => {
            traversal(el, action);
          });
          let app = this.$route.params.row;
          componentList.forEach((el) => {
            delete el.id;
          });
          let params = {
            app: app,
            appId: app.id,
            roleList: roles,
            menu: menu,
            componentList: componentList,
          };
          releaseApp(params).then((res) => {
            this.$message.success({
              message: "发布申请提交成功",
              duriation: 700,
            });
            this.$router.push({ name: "app-dev" });
          });
        }
      }
    }, 1000),
  },
};
</script>

<style lang="scss" scoped>
.con {
  width: 100%;
  margin-top: 4px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  padding: 30px 180px;
  overflow: auto;
  &__title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
    margin-top: 10px;
    color: rgba(48, 49, 51, 1);
  }
  &__option {
    margin-top: 60px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
  }
}

.title {
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: rgba(48, 49, 51, 1);
  padding-left: 10px;
  border-left: 4px solid rgba(21, 74, 216, 1);
  margin: 20px 0 20px;
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
