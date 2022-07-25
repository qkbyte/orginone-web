<template>
  <div class="con">
    <div class="con__title">
      <i class="el-icon-s-cooperation icon"></i>应用部署
    </div>
    <div class="title">部署方式</div>
    <div class="con__middle">
      <el-radio v-model="radio" label="1">集中部署</el-radio>
      <el-radio v-model="radio" label="2">独立部署</el-radio>
    </div>
    <div class="deploy-upload" v-if="visible">
      <div class="upload-tip">heml文件上传</div>
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
          <div class="upload-text">支持文件格式：rar、zip、doc、docx、pdf</div>
        </div>
      </el-upload>
    </div>
    <div class="con__option">
      <el-button @click="handleReturn">返回</el-button>
      <el-button type="primary" @click="handleDeploy" style="margin-left:30px;">提交审核</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { addApp, deployApp } from "@api/market";
import { DebounceBy } from "@utils/debounce";


export default {
  data() {
    return {
      roles: [],
      menuTree: [],
      radio: "1",
      visible: true,
    };
  },
  watch: {
    radio: {
      handler(val, oldVal) {
        if (val === "1") {
          this.visible = true;
        } else {
          this.visible = false;
        }
      },
      immediate: true
    }
  },
  methods: {
    handleReturn() {
      this.$router.go(-1);
    },
    handleDeploy:DebounceBy(function(value){
      let appId = this.$route.params.appId;
      let params = {
        appId: appId
      };
      deployApp(params).then(res => {
        this.$message.success("部署申请提交成功");
        this.$router.go(-1)
      });
    },1000),
    handleSubmit() {
      let traversal = function handleMenuTree(node, action) {
        if (node.roleList) {
          node.roleList = action(node.roleList);
        }
        if (node.children) {
          let childs = node.children;
          childs.forEach(el => {
            traversal(el, action);
          });
        }
        return node;
      };
      let action = function handleRoleList(roleList) {
        let res = [];
        roleList.forEach(el => {
          let data = {};
          data.roleName = el;
          res.push(data);
        });
        return res;
      };
      let roles = action(this.roles);
      let menu = this._.cloneDeep(this.menuTree);
      menu.forEach(el => {
        traversal(el, action);
      });
      let params = {
        app: this.$refs.form.$data.form,
        roleList: roles,
        menu: menu
      };
      addApp(params).then(res => {
        this.$message.success({
          message: "提交申请成功",
          duriation: 700
        });
        this.$router.push({ name: "app-dev" });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.con {
  width: 100%;
  margin-top: 16px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  padding: 30px 180px;

  &__title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
    margin-top: 30px;
    color: rgba(48, 49, 51, 1);
    .icon {
      margin-right: 12px;
    }
  }
  &__option {
    margin-top: 60px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .devFile {
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
      color: rgba(21, 74, 216, 1);
      .icon {
        margin-right: 8px;
      }
    }
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

.upload-tip {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  color: rgba(144, 147, 153, 1);
}
</style>

<style lang="scss">
.deploy-upload {
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
  .upload-text {
    margin-top: 3px;
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
