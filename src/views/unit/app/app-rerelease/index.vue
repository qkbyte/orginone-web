<template>
  <div class="con">
    <div class="row-1">
      <div class="con__title">
        重新发布
      </div>
      <div>
        <TheRegForm ref="form" :version="version"></TheRegForm>
      </div>
    </div>
    <div class="row-2">
      <deploy ref="deploy"></deploy>
    </div>
    <div class="row-3">
      <release
        v-if="isShow"
        ref="release"
        :menu="menu"
        :roleList="roleList"
        :componentList="componentList"
        :appId="appId"
      >
      </release>
    </div>
    <div class="con__option box">
      <el-button @click="handleReturn">返回</el-button>
      <el-button type="primary" @click="handleSubmit" style="margin-left:30px;"
        >提交</el-button
      >
    </div>
  </div>
</template>
<script>
import { DebounceBy } from "@utils/debounce";
import TheRegForm from "./components/TheRegForm";
import deploy from "./components/deploy";
import release from "./components/release";
import { appRedeploy, getAllAppInfo } from "@api/market";
export default {
  data() {
    return {
      roles: [],
      menuTree: [],
      formData: {},
      deploy: {},
      menu: [],
      roleList: [],
      componentList: [],
      isShow: false,
      menuList: [],
      judge: true,
      isEmpty: false,
      version: "",
      appId: 0,
    };
  },
  components: {
    TheRegForm,
    deploy,
    release,
  },
  created() {
    this.getApp();
    this.loadData();
  },
  mounted() {
    this.appId = this.$route.query.id;
  },
  computed: {},
  methods: {
    async loadData() {
      let params = {
        id: this.$route.query.id,
      };
      await getAllAppInfo(params).then((res) => {
        //获取数据
        console.log("res", res);
        let formData = res.data.data.app;
        let menu = res.data.data.menu;
        let roleList = res.data.data.roleNameList;
        let componentList = res.data.data.componentList;
        this.menu = menu;
        this.roleList = roleList;
        this.componentList = componentList;
        this.setInputImage(formData);
        this.isShow = true;
        this.version = formData.version;
      });
    },
    setInputImage(formData) {
      this.$refs.form.form = formData;
      if (formData.icon != "") {
        this.$refs.form.isImg = true;
        this.$refs.form.inputImg = formData.icon;
        this.$refs.form.form.icon = " ";
      }
    },
    handleReturn() {
      this.$router.push({ name: "app-dev" });
    },
    handleIsRoles(tree, data) {
      // tree.forEach((el)=>{
      //   if(el.roleNameList.indexOf(data) < 0){
      //     this.judge = true
      //     let role = data
      //     if(el.children && el.children.length > 0){
      //       this.handleIsRoles(el.children, role)
      //     }
      //   }else{
      //     this.judge = false
      //   }
      // })
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].parentId == -1) {
          this.judge = false;
        } else {
          if (tree[i].roleNameList.indexOf(data) < 0) {
            this.judge = true;
            let role = data;
            if (tree[i].children && tree[i].children.length > 0) {
              this.handleIsRoles(tree[i].children, role);
            }
          } else {
            this.judge = false;
            break;
          }
        }
      }
      return this.judge;
    },
    traverseTree(tree) {
      tree.forEach((el) => {
        if (el.roleNameList.length == 0) {
          this.isEmpty = true;
        } else if (el.children && el.children.length > 0) {
          this.traverseTree(el.children);
        }
      });
    },
    handleSubmit: DebounceBy(function(value) {
      this.$refs.form.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.warning('请在注册信息中填写相应要求的数据')
          return;
        } else {
          let isRoles = true;
          if (this.$refs.release.$refs.menu.roles.length == 0) {
            this.$message.warning("请设置角色");
          } else {
            let tree = this.$refs.release.$refs.menu.menuTree;
            tree[0].parentId == -1;
            let roles = this.$refs.release.roles;
            for (let i = 0; i < roles.length; i++) {
              isRoles = this.handleIsRoles(tree, roles[i]);
              if (isRoles == true) {
                break;
              }
            }
            if (isRoles) {
              this.$message.warning("存在角色未设置菜单");
            } else {
              if (tree[0].children && tree[0].children.length > 0) {
                this.traverseTree(tree[0].children);
                if (this.isEmpty) {
                  this.$confirm("存在菜单未设置角色，是否继续提交?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                  })
                    .then(() => {
                      this.submit();
                    })
                    .catch(() => {
                      return;
                    });
                } else {
                  this.submit();
                }
              } else {
                this.submit();
              }
            }
          }
        }
      });
    }, 1000),
    submit() {
      let roles = this.$refs.release.roles;
      let app = this.$refs.form.form;
      let componentList = this.$refs.release.$refs.appRelease.tableData;
      this.menuList = this.$refs.release.menuTree;
      let menu = [];
      let arr = [];
      let menuList = [];
      app.icon = this.$refs.form.inputImg;
      roles.forEach((element) => {
        let data = {};
        (data.appId = this.menu[0].appId), (data.roleName = element);
        arr = [...arr, data];
      });
      this.getMenu(this.menuList);
      var objString = JSON.stringify(this.menuList);
      var obj2 = JSON.parse(objString);
      componentList.forEach((el) => {
        if (el.newTemplate) {
          delete el.id;
        }
      });
      let params = {
        app: app,
        appId: this.menu[0].appId,
        roleList: arr,
        menu: obj2,
        componentList: componentList,
      };
      appRedeploy(params).then((res) => {
        this.$message.success({
          message: "重新发布申请提交成功",
          duriation: 700,
        });
        this.$router.push({ name: "app-dev" });
      });
    },
    getMenu(menuTree) {
      menuTree.forEach((element) => {
        element.roleList = [];
        element.roleNameList.forEach((el) => {
          let obj = {};
          (obj.appId = this.menu[0].appId), (obj.roleName = el);
          element.roleList.push(obj);
        });
        delete element.roleNameList;
        if (element.id) {
          delete element.id;
        }
        if (element.children && element.children.length > 0) {
          this.getMenu(element.children);
        }
      });
    },
    // getMenuList(menuTree){
    //   menuTree.forEach(element => {
    //     let data = {}
    //     data.roleList = []
    //     data.icon = element.icon,
    //     data.menuName = element.menuName,
    //     data.menuUrl = element.menuUrl,
    //     element.roleNameList.forEach((el)=>{
    //       let obj = {}
    //       obj.appId = this.menu[0].appId,
    //       obj.roleName = el
    //       data.roleList.push(obj)
    //     })
    //     data.children = element.children
    //     if(data.children.length !== 0){
    //       this.getMenuList(data.children)
    //     }
    //     this.menuList = [...this.menuList, data]
    //   });
    //   return this.menuList
    // },
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
.flex-center {
  display: flex;
  flex-direction: column;
}
.row-1 {
  background: #ffffff;
  width: 100%;
  margin-top: 4px;
  padding: 30px 100px;
}
.con {
  width: 100%;
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
    background: #ffffff;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
  }
}
::v-deep .el-button {
  margin: 20px;
}
</style>
