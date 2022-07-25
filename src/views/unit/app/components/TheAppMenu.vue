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
              <el-popover
                v-if="node.level !== 1"
                placement="top-start"
                width="200"
                trigger="hover">
                <div class="popover-box">
                  <img class="popover-box__img" width="100%" v-for="(item,index) in popoverImg" @click="onClickImg(item,data)" :key="index" :src="item.icon" alt />
                </div>
                <div class="menu-node__header--icon" slot="reference" v-bind:style="{'background-image': 'url(' + data.icon + ')','background-repeat':'no-repeat','background-size':'100% 100%' }">
                  <i v-show="data.icon ==''" class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-popover>
              <div v-else  class="menu-node__header--icon" slot="reference" v-bind:style="{'background-image': 'url(' + data.icon + ')','background-repeat':'no-repeat','background-size':'100% 100%' }">
                <i v-show="data.icon ==''" class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </div>
            <div class="menu-node__header--right">
              <div class="menu-node__title"  style="width:100%">
                <el-input
                  v-if=" node.level == 1"
                  v-model="data.menuName"
                  placeholder="点击输入菜单名称"
                  disabled
                ></el-input>
                <el-input
                  v-else
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
          <div class="menu-node__url" style="margin:10px 0">
            <div class="title">内网URL：</div>
            <el-input
              v-model="data.innerUrl"
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
import { getTenanticonList } from "@api/market";
export default {
  data() {
    return {
      img: "",
      inputVisible: false,
      inputValue: "",
      roles: [],
      list:[],
      menuTree: [
        {
          menuName: "",
          icon: "",
          menuUrl: "",
          roleList: [],
          children: [],
        },
      ],
      popoverImg:[],
      menuData:{},
    };
  },
  props:{
    menuList:{
      type:Array,
      default:()=>[]
    },
    roleList:{
      type:Array,
      default:()=>[]
    },
    listData:{
      type:Object,
      default:()=>{}
    }
  },
  watch:{
    menuList:{
      handler(val){
        if(val.length !== 0){
          this.getMenuTree(val)
        }
      },
      deep:true,
      immediate:true
    },
    roleList:{
      handler(val){
        this.getRole(val)
      },
      deep:true,
      immediate:true
    },
    listData:{
      handler(val){
        this.menuTree[0].icon = val.icon
        this.menuTree[0].menuName = val.appName
      },
      deep:true,
      immediate:true
    }
  },
  created() {
    // if (this.$route.params.menuTree != undefined) {
    //   this.menuTree = this.$route.params.menuTree;
    //   this.roles = this.$route.params.roleList;
    // }
    // this.handleUpdate();
  },
  mounted(){
    this.getIconList()
    // let data = this.$route.params.row
    // this.menuTree[0].icon = data.icon
    // this.menuTree[0].menuName = data.appName
    // console.log('=menuTree=', this.menuTree);
    // this.inputValue = this.menu
  },
  methods: {
    onClickImg(item,data){
      data.icon = item.icon
    },
    // 获取图标
    getIconList(){
      let params = {
        tenantIcon: this.tenantIcon
      };

      getTenanticonList(params).then((res) => {
        this.popoverImg = res.data.data;
      });
    },
    getRole(val){
      for(let i=0;i<val.length;i++){
        this.roles = [...this.roles,val[i]]
      }
      this.handleUpdate()
    },
    getMenuTree(val){
      let tree = []
      for(let i=0;i<val.length;i++){
        let data = {}
        let roleList = val[i].roleList
        data.roleList = []
        data.menuName = val[i].menuName
        data.menuUrl = val[i].menuUrl
        data.icon = val[i].icon
        roleList.forEach(element => {
          data.roleList.push(element)
        });
        data.children = val[i].children
        tree = [...tree, data]
      }
      this.menuTree = tree
    },
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
      let index = children.findIndex((d) => d.$treeNodeId === data.$treeNodeId);
      children.splice(index, 1);
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
::v-deep .el-tree-node:focus > .el-tree-node__content {
  background: unset !important;
}
::v-deep .el-tree-node__content:hover {
  background: unset !important;
}
.popover-box{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 100px;
  overflow: auto;
  &__img{
    width: 40px;
    height: 40px;
    margin: 5px;
    cursor: pointer;
  }
}
.app-menu {
  width: 100%;

  .roles {
    width: 99%;
    overflow: auto;
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(236, 239, 253, 1);

    .head {
      font-size: 12px;
      font-weight: 400;
      width: 50px;
      color: rgba(144, 147, 153, 1);
    }
    .head::before{
      content: '*';
      color: red;
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

        &--icon{
          border: 1px solid #eeeeee;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100px;          
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
