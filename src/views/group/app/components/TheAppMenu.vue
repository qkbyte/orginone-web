<template>
  <div class="app-menu">
    <div class="roles">
      <div class="head">角色:</div>
      <el-tag
        :key="'tag-' + tag"
        v-for="tag in roles"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
        class="bg"
        >{{ tag }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      ></el-input>
      <el-button
        v-else
        class="button-new-tag bg"
        size="mini"
        @click="showInput"
      >
        +
      </el-button>
    </div>
    <div class="menu">
      <el-tree
        :data="menuTree"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <div class="menu-node" slot-scope="{ node, data }">
          <div class="menu-node__header">
            <div class="menu-node__header--left icon">
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">
                  点击上传图片
                  <br />支持格式：png、jpg
                </div>
                <el-upload
                  class="avatar-uploader"
                  action="/test"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="img" :src="node.data.icon" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-tooltip>
            </div>
            <div class="menu-node__header--right">
              <div class="menu-node__title">
                <el-input
                  v-model="data.menuName"
                  placeholder="点击输入菜单名称"
                ></el-input>
              </div>
              <div class="menu-node__btn">
                <el-button type="text" size="small" @click="() => append(data)">
                  <i class="el-icon-circle-plus-outline"></i> 新增
                </el-button>
                <el-button
                  v-if="node.level !== 1"
                  type="text"
                  size="small"
                  @click="() => remove(node, data)"
                >
                  <i class="el-icon-remove-outline"></i> 删除
                </el-button>
              </div>
            </div>
          </div>
          <div class="menu-node__url">
            <div class="title">设置URL：</div>
            <el-input
              v-model="data.menuUrl"
              placeholder="点击输入URL"
            ></el-input>
          </div>
          <div class="menu-node__role">
            <div class="title">设置角色：</div>
            <el-select
              v-model="data.roleList"
              multiple
              placeholder="点击添加角色"
              @change="handleUpdate"
            >
              <el-option
                v-for="item in roles"
                :key="'selectRole-' + data.menuName + item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      img: "",
      inputVisible: false,
      inputValue: "",
      roles: [],
      menuTree: [
        {
          menuName: "",
          icon: "",
          menuUrl: "",
          roleList: [],
          children: [],
        },
      ],
    };
  },
  methods: {
    handleUpdate() {
      this.$emit("handleUpdate", this.roles, this.menuTree);
    },
    changeTree(node) {
      let tree = {
        menuName: "",
        icon: "",
        router: "/test",
        menuUrl: "",
        children: [],
      };
      if (node !== null) {
        tree.menuName = node.menuName;
        tree.icon = node.icon;
        tree.menuUrl = node.menuUrl;
        let childrens = node.children;
        childrens.forEach((el) => {
          tree.children.push(this.changeTree(el));
        });
      }
      return tree;
    },
    append(data) {
      let newChild = {
        menuName: "",
        icon: "",
        menuUrl: "",
        roleList: [],
        children: [],
      };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
      this.handleUpdate();
    },
    remove(node, data) {
      let parent = node.parent;
      let children = parent.data.children || parent.data;
      let index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
    edit(data) {
      let newChild = {
        menuName: "",
        icon: "",
        menuUrl: "",
        roleList: [],
        children: [],
      };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
      this.handleUpdate();
    },

    /**
     * 角色
     * handleClose 删除角色回调
     * showInput 显示新增角色
     * handleInputConfirm 新增角色
     */
    handleClose(tag) {
      let changeTree = function deepTraversal(node, key) {
        let nodes = [];
        if (node !== null) {
          if (node.roleList.includes(key)) {
            node.roleList.splice(node.roleList.indexOf(key), 1);
          }
          nodes.push[node];
          node.children.forEach((el) => {
            changeTree(el, key);
          });
        }
        return nodes;
      };
      this.roles.splice(this.roles.lastIndexOf(tag), 1);
      this.handleUpdate();
      this.menuTree.forEach((el) => {
        changeTree(el, tag);
      });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      let hasRole = this.roles.includes(inputValue);
      if (hasRole) {
        this.$message({
          type: "error",
          message: "角色已存在",
        });
      } else if (inputValue) {
        this.roles.push(inputValue);
        this.handleUpdate();
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    /**
     * 图标
     * handleAvatarSuccess 图片成功上传回调
     * beforeAvatarUpload 限制图片上传条件
     */
    handleAvatarSuccess(res, file) {
      this.img = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-menu {
  width: 100%;

  .roles {
    width: 99%;
    overflow: auto;
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(236, 239, 253, 1);

    & > .head {
      font-size: 12px;
      font-weight: 400;
      color: rgba(144, 147, 153, 1);
    }

    .bg {
      margin-left: 20px;
      border-radius: 4px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      background: rgba(235, 238, 245, 1);
      border: 0px;
    }

    .el-tag + .el-tag {
      margin-left: 20px;
    }

    .button-new-tag {
      margin-left: 20px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }

    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
  }

  .menu {
    .menu-node {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      &__header {
        display: flex;
        align-items: center;
        height: 60px;

        &--left {
          width: 70px;
        }

        &--right {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
      }

      &__url,
      &__role {
        height: 60px;
        display: flex;
        align-items: center;
        padding-left: 70px;
      }
    }
  }

  .icon {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .avatar-uploader {
      .el-icon-plus {
        border: 1px solid #ebeef5;
        border-radius: 50px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
          border-color: #409eff;
        }
      }
      .avatar-uploader-icon {
        font-size: 24px;
        color: #c0c4cc;
        width: 35px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        &:hover {
          color: #409eff;
        }
      }
      .avatar {
        width: 35px;
        height: 35px;
        border-radius: 50px;
        display: block;
      }
    }
  }

  .title {
    font-size: 14px;
    font-weight: 400;
    color: rgba(144, 147, 153, 1);
  }
}
</style>

<style lang="scss" scoped>
.menu ::v-deep .el-tree-node {
  &__content {
    height: 230px;
    &:hover {
      cursor: default;
      background-color: #fff;
    }
  }

  &:focus > .el-tree-node__content {
    background-color: #fff;
  }

  &__expand-icon {
    font-size: 20px;
  }
}
.menu-node__title ::v-deep .el-input {
  &__inner {
    border: 0px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(144, 147, 153, 1);
  }
}
.menu-node__url ::v-deep .el-input {
  &__inner {
    border: 0px;
    background: rgba(242, 244, 249, 1);
    border-radius: 4px;
  }
}

.menu-node__role ::v-deep .el-select {
  width: 100%;
  .el-input {
    &__inner {
      border: 0px;
      background: rgba(242, 244, 249, 1);
      border-radius: 4px;
    }
  }
}
</style>
