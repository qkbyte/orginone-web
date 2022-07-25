<template>
<div style="background:#FFFFFF;margin-top:4px 0">
  <div class="flex-center">
    <div class="app-info">
      <div class="diy-dialog-body">
        <div class="app-info_body">
          <div class="con__title">
            应用发布
          </div>
          <div class="title">设置角色菜单</div>
          <TheAppMenu ref="menu" @handleUpdate="handleUpdate" :menuList="menuList" :roleNameList="role" :release="release"></TheAppMenu>
          <div class="title">菜单预览</div>
          <TheRoleMenu :roles="roles" :tree="menuTree"></TheRoleMenu>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import TheAppMenu from "./TheViewAppMenu";
import TheRoleMenu from "./TheViewRoleMenu";
import { releaseApp } from "@api/market";

export default {
  data() {
    return {
      roles: [],
      menuTree: [],
      menuList:[],
      role:[],
      release: true // 判断重新发布
    };
  },
  props:{
    menu:{
      type:Array,
      default:()=>[]
    },
    roleList:{
      type:Array,
      default:()=>[]
    }
  },
  watch:{
    roleList:{
      handler(val){
        this.role = val
      },
      deep:true,
      immediate:true,
    },
    menu:{
      handler(val){
        this.menuList = this.getDealMenu(val)
      },
      deep:true,
      immediate:true,
    }
  },
  components: {
    TheRoleMenu,
    TheAppMenu,
  },
  computed: {},
  methods: {
    handleUpdate(roleList, menuList) {
      this.roles = roleList;
      this.menuTree = menuList;
    },
    getDealMenu(arr){
      arr.forEach(function(item) {
        delete item.children;
      });
      let map = {}
      arr.forEach(i => {
        map[i.id] = i;
      });
      let treeData = [];
      arr.forEach(child => {
        const mapItem = map[child.parentId]; //判断当前数据的parentId是否存在map中
        if (mapItem) {
          (mapItem.children || (mapItem.children = [])).push(child); //这里判断mapItem中是否存在child
        } else {
          treeData.push(child);
        }
      });
      return treeData;
    }
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
::v-deep .menu-node__title{
  margin-top: 15px;
}
.con__option ::v-deep .el-button {
  width: 150px;
}
.con__option ::v-deep .el-button:hover {
  color: #fff !important;
  background-color: #1549d8e5 !important;
  border-color: #1549d8e5 !important;
  font-weight: 400 !important;
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
.diy-dialog-body ::v-deep .el-form-item {
  &__label {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: rgba(144, 147, 153, 1);
  }

  &__content {
    .el-input,
    .el-textarea {
      &__inner,
      &__count {
        background: rgba(242, 244, 249, 1);
        border: 0px;
        border-radius: 4px;
      }
    }

    .el-input,
    .el-select {
      width: 340px;
    }

    .el-textarea {
      &__inner {
        height: 80px;
      }
    }
  }
}
.diy-dialog-body ::v-deep .form-item--all {
  width: 100%;
  .el-input,
  .el-textarea {
    width: 100%;
  }
}
</style>
