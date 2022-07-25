<template>
  <div class="con">
    <div class="con__title">
      应用新增
    </div>
    <div class="title">基本信息</div>
    <TheAppForm ref="form"></TheAppForm>
    <div class="title">设置角色菜单</div>
    <TheAppMenu @handleUpdate="handleUpdate"></TheAppMenu>
    <div class="title">菜单预览</div>
    <TheRoleMenu :roles="roles" :tree="menuTree"></TheRoleMenu>
    <div class="con__option">
      <el-button @click="handleReturn">返回</el-button>
      <el-button type="primary" @click="handleSubmit" style="margin-left:30px;"
        >提交</el-button
      >
    </div>
  </div>
</template>
<script>
import TheAppForm from "../components/TheAppForm";
import TheAppMenu from "../components/TheAppMenu";
import TheRoleMenu from "../components/TheRoleMenu";
import { addApp } from "@api/market";

export default {
  data() {
    return {
      roles: [],
      menuTree: [],
    };
  },
  components: {
    TheAppForm,
    TheRoleMenu,
    TheAppMenu,
  },
  created() {},
  computed: {},
  methods: {
    handleUpdate(roleList, menuList) {
      this.roles = roleList;
      this.menuTree = menuList;
    },
    handleReturn() {
      this.$router.go(-1);
    },
    handleSubmit() {
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
      let params = {
        app: this.$refs.form.$data.form,
        roleList: roles,
        menu: menu,
      };
      addApp(params).then((res) => {
        this.$message.success({
          message: "新增成功",
          duriation: 700,
        });
        this.$router.go(-1);
      });
    },
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
    margin-top: 30px;
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
  font-weight: 500;
  line-height: 22px;
  color: rgba(48, 49, 51, 1);
  padding-left: 10px;
  border-left: 4px solid rgba(21, 74, 216, 1);
  margin: 30px 0 20px;
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
