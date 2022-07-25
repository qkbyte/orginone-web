<template>
  <div class="role-menu">
    <div class="menu">
      <div class="leftBar">
        <div
          @click="
            changeRole(item);
            selectRole(index);
          "
          :v-model="item"
          v-for="(item, index) in roles"
          :key="'roles' + index"
          class="roleItem"
          :class="[selectRoleClass[index] == 1 ? 'active' : 'noactive']"
        >
          {{ item }}
        </div>
      </div>
      <div class="rightTree">
        <el-tree
          class="filter-tree"
          :data="tree"
          node-key="id"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree"
        >
          <div class="nodeModel" slot-scope="{ node, data }">
            <div class="left">
              <div class="icon">
                <el-upload
                  class="avatar-uploader"
                  action="/api/user/uploadPic"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  disabled
                >
                  <img v-if="img" :src="node.data.icon" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
              <div class="titurl">
                <div class="name">
                  <el-input v-model="data.menuName" disabled></el-input>
                </div>
                <div class="url">
                  <el-input v-model="data.menuUrl" disabled></el-input>
                </div>
              </div>
            </div>
          </div>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      img: "",
      filterValue: "",
      selectRoleClass: [1]
    };
  },
  props: {
    roles: {
      type: Array,
      default: () => []
    },
    tree: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    roles: {
      handler(newValue, oldValue) {
        if (Array.isArray(newValue) && newValue.length !== 0) {
          this.filterValue = newValue[0];
          this.changeRole(this.filterValue);
        } else {
          this.changeRole("NoData");
        }
      },
      deep: true
    },
    tree: {
      handler(newValue, oldValue) {
        this.changeRole(this.filterValue);
      },
      deep: true
    }
  },
  created() {},
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.roleList.includes(value);
    },
    changeRole(val) {
      this.filterValue = val;
      this.$nextTick(() => {
        this.$refs.tree.filter(this.filterValue);
      });
    },
    selectRole(index) {
      if (index === -2) {
        this.selectRoleClass = [1];
      } else {
        this.selectRoleClass = [];
        this.selectRoleClass[index] = 1;
      }
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
    }
  }
};
</script>

<style lang="scss" scoped>
.role-menu {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  box-sizing: border-box;

  .menu {
    margin-top: 30px;
    width: 100%;
    height: 400px;
    border: 1px solid rgba(236, 239, 253, 1);
    border-radius: 4px;
    display: flex;

    .leftBar {
      width: 150px;
      height: 100%;
      background: rgba(248, 250, 251, 1);
      border-radius: 4px 0px 0px 4px;
      overflow: scroll;

      .roleItem {
        font-size: 1.375rem;
        font-weight: 400;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: rgba(51, 51, 51, 1);
      }

      .roleItem:hover {
        background: rgba(21, 74, 216, 1);
        border-radius: 4px 0px 0px 4px;
        color: #fff;
        cursor: pointer;
      }
      .noactive {
        background: transparent;
        color: rgba(51, 51, 51, 1);
      }
      .active {
        background: rgba(21, 74, 216, 1);
        border-radius: 4px 0px 0px 4px;
        color: #fff;
      }
    }

    .rightTree {
      width: 100%;
      display: flex;
      overflow: auto;

      .nodeModel {
        .left {
          display: flex;
          .icon {
            width: 55px;
            height: 55px;

            .avatar-uploader {
              text-align: center;
              margin-top: 20px;

              .el-icon-plus {
                border: 1px solid #979797;
                border-radius: 50px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
              }
              .el-icon-plus:hover {
                border-color: #409eff;
              }
              .avatar-uploader-icon {
                font-size: 24px;
                color: #8c939d;
                width: 35px;
                height: 35px;
                line-height: 35px;
                text-align: center;
              }
              .avatar {
                width: 35px;
                height: 35px;
                border-radius: 50px;
                display: block;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.input ::v-deep .el-input__inner {
  width: 100%;
  border-radius: 0 !important;
  height: 80px;
  border: none !important;
  border-bottom: 1px solid #dcdfe6 !important;
}
.input ::v-deep .el-select {
  width: 100%;
}
.input ::v-deep .el-textarea__inner {
  width: 100%;
  border-radius: 0 !important;
  height: 150px;
  border: none !important;
  border-bottom: 1px solid #dcdfe6 !important;
}

.menu ::v-deep .el-tree-node__content {
  height: 80px;
}

.name ::v-deep .el-input__inner {
  border: none;
  background: transparent;
  font-size: 1.375rem;
  font-weight: bold;
  line-height: 40px;
  color: rgba(51, 51, 51, 1);
}

.url ::v-deep .el-input__inner {
  border: none;
  background: transparent;
  font-size: 1.125rem;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}

.buttons ::v-deep .el-button {
  color: #1549d8e5 !important;
}
.buttons ::v-deep .el-button:hover {
  color: #1549d8be !important;
  background-color: transparent !important;
  border-color: transparent !important;
  font-weight: 400 !important;
}
.buttons ::v-deep .el-button:focus {
  background-color: transparent !important;
  border-color: transparent !important;
}

.role ::v-deep .el-select {
  width: 100%;
  background-color: #fafafa;
  .el-input__inner {
    border: none;
    background: transparent;
  }

  .el-tag {
    height: 30px;
    line-height: 30px;
    color: #333;
    background-color: rgba(21, 74, 216, 0.15);
    border: none;
    padding: 0px 15px;

    .el-tag__close {
      color: #409eff;
      font-weight: bold;
    }

    .el-icon-close {
      background-color: transparent;
    }

    .el-tag__close:hover {
      color: #fff;
      font-weight: bold;
    }

    .el-icon-close:hover {
      background-color: #409eff;
    }
  }
  .el-input__icon {
    visibility: hidden;
  }
}

.rightTree ::v-deep .el-tree {
  width: 100%;
}

.rightTree ::v-deep .el-tree-node__content {
  height: 80px;
}
</style>
