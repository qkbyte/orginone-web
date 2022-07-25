<template>
  <div class="con">
    <div class="con__title">
      应用注册
    </div>
    <div class="flex-center">
      <TheRegForm
        ref="form"
        @handleReturn="handleReturn"
        @handleSubmit="handleSubmit"
        :formData="formData"
      ></TheRegForm>
    </div>
  </div>
</template>
<script>
import TheRegForm from "./components/TheRegForm";
import { registerApp } from "@api/market";

export default {
  data() {
    return {
      roles: [],
      menuTree: [],
      formData: {},
    };
  },
  components: {
    TheRegForm,
  },
  created() {
    this.getApp();
  },
  computed: {},
  methods: {
    handleReturn() {
      this.$router.push({name:'app-dev'});
    },
    async handleSubmit() {
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
      let params = this.$refs.form.$data.form
      params.icon = this.$refs.form.$data.inputImg
      if(JSON.stringify(params.icon) == '{}'){
        delete params.icon
      }
      await registerApp(params).then((res) => {
        this.$message.success({
          message: "注册申请提交成功",
          duriation: 700,
        });
      });
      this.$router.push({ name: "app-dev" });
    },
    /*
    如果是修改app信息，先获取appInfo
    */
    getApp() {
      if (this.$route.params.appInfo != undefined) {
        let data = this.$route.params.appInfo;
        this.formData = data;
      }
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
  padding: 30px 100px;
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
</style>

<style lang="scss" scoped></style>
