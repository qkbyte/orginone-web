<template>
<div style="background:#FFFFFF;margin:4px 0">
  <div class="flex-center">
    <div class="app-info">
      <div class="diy-dialog-body">
        <div class="app-info_body">
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
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { addApp, deployApp } from "@api/market";

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
    onProgress() {},
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
        this.$router.go(-1);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.con {
  width: 100%;
  margin-top: 4px;
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
  margin-bottom: 20px;
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
.con__middle{
  margin-bottom: 40px;
}
.app-info {
  width: 800px;
  .diy-dialog-body .el-form {
    justify-content: space-between;
  }
  &_header {
    margin-top: 22px;
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .header-icon {
      img {
        height: 40px;
        width: 40px;
      }
      margin-right: 16px;
    }
    .header-name {
      font-size: 16px;
      color: #000;
      line-height: 22px;
      font-weight: bold;
    }
  }
  &_body {
    margin-left: 58px;
    width: 100%;
    color: #58657d;
    font-weight: 600;
    .body-firstFloor {
      display: flex;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 20px;
    }
    .first {
      width: 240px;
    }
    .body-secondFloor {
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 20px;
    }
    .body-thirdFloor {
      display: flex;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 20px;
    }
    .body-fourthFloor {
      display: flex;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 6px;
    }
  }
}
</style>
