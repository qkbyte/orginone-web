<template>
  <el-dialog
    title="变更部门"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
    top="10vh"
    center
    width="700px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <div class="dialog-body">
      <div class="diy-dialog-body__row">
        <div style="margin-top:12px;margin-left:20px">
          *变更部门将移除相关人员在其他部门下的记录
        </div>
        <div class="search-list__search">
          <el-input
            prefix-icon="el-icon-search"
            v-model="searchInput"
            placeholder="请输入部门名"
          ></el-input>
        </div>
      </div>

      <div class="diy-dialog-body__tree">
        <div class="diy-dialog-body__treeBox">
          <el-tree
            v-show="!isShow"
            class="filter-tree"
            :data="deptTree"
            node-key="id"
            highlight-current
            :check-strictly="true"
            :expand-on-click-node="false"
            default-expand-all
            :filter-node-method="filterNode"
            ref="tree"
            @node-click="handleClickTree"
          >
            <div class="node-model" slot-scope="{ node, data }">
              <div class="node-model--left" v-if="data.id !== -1">
                <div class="node-model__title" :title="data.agencyName">
                  <svg class="icon " aria-hidden="true">
                    <use :xlink:href="'#icon-department'"></use>
                  </svg>
                  {{ data.agencyName }}
                </div>
              </div>
              <div class="node-model--left" v-else>
                <div
                  class="node-model__title"
                  style="display:flex;flex-direction:row"
                  :title="data.agencyName"
                >
                  <div class="headLayout-avatar_img">
                    {{ headName }}
                  </div>
                  <div>{{ data.agencyName }}</div>
                </div>
              </div>
            </div>
          </el-tree>
          <div v-show="isShow" class="tree-list">
            <div
              class="node-model__list"
              :class="
                isCurrent == true && isIndex == index ? 'node-model__click' : ''
              "
              @click="handleDepartList(item, index)"
              v-for="(item, index) in deptList"
              :key="item.id"
              :title="item.agencyName"
            >
              <svg class="icon " aria-hidden="true">
                <use :xlink:href="'#icon-department'"></use>
              </svg>
              {{ item.agencyName }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { addUser } from "@api/user";
import {
  getDepartmentTree,
  changeDepartment,
  searchDeptPerson,
} from "@api/department";
export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      loading: false,
      radio: 1,
      deptTree: [],
      inputValue: "",
      headName: "",
      searchInput: "",
      isShow: false,
      deptList: [],
      isCurrent: false,
      isIndex: 0,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.headName = this.curTenant.name.substr(0, 1);
  },
  mounted() {
    this.loadData();
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
  },
  watch: {
    searchInput(val) {
      if (val == "") {
        this.isShow = false;
        this.loadData();
      } else {
        this.isShow = true;
        this.loadSearchData(val);
      }
    },
  },
  methods: {
    handleDepartList(data, index) {
      // 点击部门执行
      this.deptId = data.id;
      this.isCurrent = true;
      this.isIndex = index;
    },
    loadSearchData(val) {
      // 搜索部门
      let params = {
        name: val,
      };
      searchDeptPerson(params).then((res) => {
        if (res.data.code == 200) {
          const { deptList } = res.data.data;
          this.deptList = deptList;
          console.log("deptList", deptList);
        }
      });
    },
    loadData() {
      let params = {
        tenantCode: this.curTenantCode,
      };
      getDepartmentTree(params).then((res) => {
        let resList = res.data.data[0].children;
        this.deptTree = [
          {
            id: -1,
            agencyName: this.curTenant.name,
            children: [],
          },
        ];
        this.deptTree[0].children = this.deptTree[0].children.concat(resList);
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.$parent.$parent.curDept);
        });
      });
    },
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    //据关键字筛选部门树
    filterNode(value, data) {
      if (!value) return true;
      return data.agencyName.indexOf(value) !== -1;
    },
    handleClick() {
      if (typeof this.deptId == "undefined") {
        this.$message.warning("请选择部门");
      } else {
        let params = {
          deptId: this.deptId,
          type: this.radio,
          personIdList: this.dialogShow.sendData.id,
        };
        changeDepartment(params).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("部门变更成功");
            this.$parent.loadData();
            this.$emit("closeDialog", this.dialogShow.key);
          }
        });
      }
    },
    handleClickTree(data, node, obj) {
      this.deptId = data.id;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  overflow: auto;
}
::v-deep .el-tree-node__content {
  height: 30px;
}
.node-model__list {
  font-size: 16px;
  margin-left: 10px;
  padding-left: 40px;
  padding: 10px;
  cursor: pointer;
}
.node-model__click {
  background: rgb(236, 241, 252);
}
.node-model__list:hover {
  background: rgb(236, 241, 252);
}
::v-deep .el-tree {
  background: rgba(0, 0, 0, 0);
  font-size: 16px;
}
::v-deep .el-tree-node {
  // margin-top: 8px;
  padding: 4px 0;
}
::v-deep .el-tree .is-current {
  color: rgb(62, 120, 255);
}
.headLayout-avatar_img {
  width: 20px;
  height: 20px;
  background: #154ad8;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  margin-right: 5px;
  color: #ffffff;
}
.headLayout-avatar_img2 {
  width: 30px;
  height: 30px;
  background: #154ad8;
  margin-top: 10px;
  margin-left: 10px;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  font-size: 15px;
  color: #ffffff;
  margin-left: 60px;
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
::v-deep .el-input__inner {
  border: 0;
  background-color: rgb(250, 250, 252);
}
::v-deep .el-dialog {
  transform: translate(-20%);
}
.el-icon-search {
  font-size: 20px;
  margin-top: 10px;
}
.flex-row {
  width: 80%;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid rgb(215, 218, 224);
}
.diy-dialog-depart {
  display: flex;
  flex-direction: row;
  &__text {
    font-size: 15px;
    margin: 16px 0 0 20px;
  }
}
.search-list {
  &__search {
    margin-right: 40px;
  }
}
.diy-dialog-body {
  &__row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  &__center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__radio {
    margin-left: 30px;
    margin-top: 15px;
  }
  &__treeBox {
    margin-top: 10px;
  }
  &__tree {
    margin-top: 20px;
    margin-left: 30px;
    background-color: rgb(250, 250, 252);
    overflow: auto;
    width: 90%;
    height: 430px;
  }
}
</style>
<style lang="scss" scoped>
.body-container ::v-deep .el-form {
  .el-cascader,
  .el-input {
    width: 350px;
  }
}
::v-deep .el-textarea__inner {
  height: 200px;
}
::-webkit-scrollbar {
  width: 8px;
  height: 7px;
  background: #ffffff;
}
::-webkit-scrollbar-thumb {
  height: 0px;
  border-radius: 4px;
  background: #90939928;
}
::-webkit-scrollbar-thumb:hover {
  width: 8px;
  background: #90939967;
}
::v-deep.diy-dialog-body {
  border: 0 !important;
}
::v-deep .el-tabs__header {
  margin: 0px !important;
}
::v-deep .el-dialog__body {
  height: 556px;
}
.progress-box {
  width: fit-content;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.tabs {
  width: 490px;
}
.diy-dialog-box {
  border: 1px solid rgba(235, 238, 245, 1);
  padding: 10px;
  display: flex;
  flex-direction: column;
  &__checkBox {
    border: 1px solid rgba(235, 238, 245, 1);
    padding: 10px;
  }
  &__radio {
    margin-top: 10px;
    border: 1px solid rgba(235, 238, 245, 1);
    padding: 10px;
  }
  &-treeBox {
    display: flex;
    flex-direction: row;
    margin-top: 5px;
  }
  &-left,
  &-right {
    width: 50%;
    padding: 16px;
    border: 1px solid rgba(235, 238, 245, 1);
  }
}
.layout-role {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(235, 238, 245, 1);
}
.diy-dialog-body {
  border: 1px solid rgba(235, 238, 245, 1);
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  justify-content: flex-start;
  &--left,
  &--right {
    width: 50%;
    height: 500px;
    padding: 16px;
  }

  &--left {
    border-right: 1px solid rgba(235, 238, 245, 1);
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    height: 20px;
    color: rgba(48, 49, 51, 1);
  }

  &__list {
    height: 440px;
    margin-top: 10px;
    overflow-y: scroll;

    li {
      overflow: hidden;
      height: 26px;
      line-height: 26px;
      display: flex;
      justify-content: space-between;

      i {
        margin-right: 5px;
        color: #c0c4cc;
        cursor: pointer;

        &:hover {
          color: #9da1a8;
        }
      }
    }
  }
}
::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-65%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
</style>
