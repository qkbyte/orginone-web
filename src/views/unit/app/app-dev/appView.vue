<template>
  <div class="con">
    <div class="row-1">
      <div class="con__title">
        应用查看
      </div>
      <div>
        <TheRegForm
          ref="form"
        ></TheRegForm>
      </div>
    </div>
    <div class="row-2">
      <deploy
        ref="deploy"
        v-if="status < 6 && status > 2"
      ></deploy>
    </div>
    <div class="row-3">
      <release
        v-if="status >= 6 && status <= 8"
        ref="release"
        :menu="menu"
        :roleList="roleList"
      >
      </release>
    </div>
    <div class="con__option">
        <el-button @click="handleReturn">返回</el-button>
    </div>
  </div>
</template>
<script>
import TheRegForm from "./components/TheViewRegForm";
import deploy from "./components/TheViewDeploy";
import release from "./components/TheViewRelease";
import { registerApp,getAllAppInfo } from "@api/market";
export default {
  data() {
    return {
      roles: [],
      menuTree: [],
      formData: {},
      deploy:{},
      menu:[],
      roleList:[],
      status:0
    };
  },
  components: {
    TheRegForm,
    deploy,
    release,
  },
  created() {
    this.getApp();
    this.loadData()
    this.status = this.$route.query.status
  },
  computed: {},
  methods: {
    // handleDeploy() {
    //   let appId = this.$route.params.appId;
    //   let params = {
    //     appId: appId
    //   };
    //   deployApp(params).then(res => {
    //     this.$message.success("部署申请提交成功");
    //     this.$router.push("/app/index/bridge/app-dev");
    //   });
    // },
    async  loadData(){
      let params = {
        id: this.$route.query.id,
      };
      await  getAllAppInfo(params).then((res) => {
        console.log('res', res);
        //获取数据
        let formData = res.data.data.app
        let menu = res.data.data.menu
        let roleList = res.data.data.roleNameList
        this.menu = menu
        this.roleList = roleList
        this.setInputImage(formData)
      });
    },
    setInputImage(formData){
      this.$refs.form.form =  formData
      if(this.status >= 6 && this.status <= 8){
        this.$refs.release.$refs.menu.appData  = formData
      }
        if(formData.icon != ''){
          this.$refs.form.isImg = true
          this.$refs.form.inputImg = formData.icon
          this.$refs.release.$refs.menu.inputImg = formData.icon
          this.$refs.form.form.icon = ' '
        }
    },
    handleReturn() {
      this.$router.go(-1);
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
      let params = this.$refs.form.$data.form;
      console.log(params);
      await registerApp(params).then((res) => {
        this.$message.success({
          message: "注册申请提交成功",
          duriation: 700,
        });
      });
      this.$router.go(-1);
    },
    /*
    如果是修改app信息，先获取appInfo
    */
    getApp() {
      console.log('this.$route.params.appInfo', this.$route.params.appInfo);
      if (this.$route.params.appInfo != undefined) {
        let data = this.$route.params.appInfo;
        console.log('data', data);
        this.formData = data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-center{
  display: flex;
  flex-direction: column;
}
.row-1{
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
    padding: 20px 0;
    background: #ffffff;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
  }
}
</style>

<style lang="scss" scoped></style>
