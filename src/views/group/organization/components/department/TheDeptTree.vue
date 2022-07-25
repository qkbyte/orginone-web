<template>
  <div class="flex-column">
    <TheSearchInput
      ref="search"
      placeholder="输入组织名称进行搜索"
      :filterText.sync="filterText"
    ></TheSearchInput>
    <el-scrollbar
      v-if="!isShow"
      style="flex:1;height:1px;margin-top:10px;padding-bottom:10px"
    >
      <div ref="treeBox" class="tree" :style="styleTree">
        <el-tree
          v-show="checkValue !== 0"
          class="filter-tree"
          :props="listOption"
          :data="deptTree"
          node-key="id"
          highlight-current
          :filter-node-method="filterNode"
          ref="tree"
          :load="loadNode"
          :default-expanded-keys="expandedList"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
          lazy
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
        >
          <div
            class="node-model"
            @click.stop="handleClick(data)"
            slot-scope="{ node, data }"
          >
            <div class="node-model--left">
              <div
                v-show="checkValue == 1"
                class="node-model__title"
                :title="data.groupName"
              >
                <!-- <svg v-if="data.type == 1" class="icon " aria-hidden="true">
                  <use :xlink:href="'#icon-zuzhiguanli1'"></use>
                </svg>
                <div v-else class="el-icon-s-home"></div> -->
                <span v-if="data.type == 1">
                  <i
                    style="color:rgba(37,110,255,0.8);"
                    class="el-icon-office-building"
                  ></i>
                </span>
                <span v-else>
                  <i
                    style="color:rgba(16,182,255,0.8);"
                    class="el-icon-school"
                  ></i
                ></span>
                {{ data.name }}
              </div>

              <div
                v-show="checkValue == 2"
                class="node-model__title"
                :title="data.groupName"
              >
                <span v-if="data.type == 1">
                  <i
                    style="color:rgba(37,110,255,0.8);"
                    class="el-icon-office-building"
                  ></i>
                </span>
                <span v-else>
                  <i
                    style="color:rgba(16,182,255,0.8);"
                    class="el-icon-school"
                  ></i
                ></span>
                {{ data.code }}
              </div>

              <div
                v-show="checkValue == 3"
                class="node-model__title"
                :title="data.groupName"
              >
                <span v-if="data.type == 1">
                  <i
                    style="color:rgba(37,110,255,0.8);"
                    class="el-icon-office-building"
                  ></i>
                </span>
                <span v-else>
                  <i
                    style="color:rgba(16,182,255,0.8);"
                    class="el-icon-school"
                  ></i
                ></span>
                {{ data.code }} {{ data.name }}
              </div>
            </div>
            <div
              class="node-model__btn"
              v-if="node.data.id !== -1 && node.data.id !== curGroupId"
            ></div>
          </div>
        </el-tree>
      </div>
    </el-scrollbar>
    <div v-else style="flex:1;height:1px;margin-top:10px;overflow:auto">
      <div class="departSearch" v-show="orgList.length !== 0">
        <div class="departSearch-head">集团信息</div>
        <div
          class="departSearch-box"
          :class="orgIndex === index ? 'departSearch-click' : ''"
          v-for="(item, index) in orgList"
          :key="item.id"
        >
          <div
            class="departSearch-title"
            @click="handleClick(item, index, 'orgList')"
          >
            <div class="departSearch-title__text" :title="item.name">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="departSearch" v-show="unitList.length !== 0">
        <div class="departSearch-head">单位信息</div>
        <div
          class="departSearch-box"
          :class="unitIndex === index ? 'departSearch-click' : ''"
          v-for="(item, index) in unitList"
          :key="item.id"
        >
          <div
            class="departSearch-title"
            @click="handleClick(item, index, 'unitList')"
          >
            <div class="departSearch-title__text" :title="item.name">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="noList" v-show="orgList.length == 0 && unitList.length == 0">
        暂无数据
      </div>
    </div>
    <div
      style="height:46px;border-top:1px solid #EBEEF5;margin-bottom:8px"
      class="flex-center"
    >
      <el-button
        type="text"
        style="width:100%;font-size:16px;"
        @click="$emit('handle-go')"
        >组织维护</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TheSearchInput from "../TheSearchInput";
import TheEditDialog from "./TheEditDialog";
import TheDistributeDialog from "./TheDistributeDialog";
import DiyButton from "@components/DiyButton/index";
import {
  getGroupTree,
  disbandGroup,
  getGroupData,
  getBelowGroup,
  getBelowLayer,
  searchGroupUnit,
  sortLazyTree,
  getAllgroup,
} from "@api/group";

export default {
  name: "TheDeptTree",
  data() {
    return {
      listOption: {
        label: "",
        children: "children",
        isLeaf: "leaf",
      },
      filterText: "",
      deptTree: [],
      deptName: "",
      checkValue: 1,
      expandedList: [],
      onCheck: {},
      beginWidth: 0,
      styleTree: {},
      isShow: false,
      orgList: [],
      unitList: [],
      orgIndex: false,
      unitIndex: false,
      time: null,
    };
  },
  watch: {
    filterText(val) {
      if (val == "") {
        this.isShow = false;
      } else {
        this.isShow = true;
        this.handleSearchList(val);
      }
    },
    checkList(val) {
      if (val.indexOf("组织名") !== -1 && val.indexOf("组织编码") !== -1) {
        this.checkValue = 3;
      } else {
        if (val.indexOf("组织名") !== -1) {
          this.checkValue = 1;
        } else if (val.indexOf("组织编码") !== -1) {
          this.checkValue = 2;
        } else {
          this.checkValue = 0;
        }
      }
    },
  },
  props: {
    checkList: {
      type: Array,
      default: () => [],
    },
    unitShow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters("group", ["curGroupId"]),
  },
  components: { TheSearchInput, DiyButton, TheEditDialog, TheDistributeDialog },
  destroyed() {
    clearTimeout(this.time);
    this.time = null;
  },
  methods: {
    handleSearchList(val) {
      // 搜索函数
      let params = {
        sourceGroupId: this.curGroupId,
        name: val,
      };
      try {
        searchGroupUnit(params).then((res) => {
          let list = res.data.data;
          this.orgList = [];
          this.unitList = [];
          list.forEach((el) => {
            if (el.type == 1) {
              this.orgList.push(el);
            } else {
              this.unitList.push(el);
            }
          });
          this.$emit("forTreeData", list);
        });
      } catch (error) {
        this.$message(error);
      }
    },
    nodeExpand(data) {
      this.expandedList.push(data.id); // 在节点展开是添加到默认展开数组
    },
    nodeCollapse(data) {
      this.expandedList.splice(this.expandedList.indexOf(data.id), 1); // 收起时删除数组里对应选项
    },
    loadNode(node, resolve) {
      // 加载 树数据
      let that = this;
      if (node.level === 0) {
        that.loadtreeData(resolve);
      }
      if (node.level >= 1) {
        this.getChildByList(node.data.id, resolve);
        // return resolve([]); // 加上这个，防止在该节点没有子节点时一直转圈的问题发生。
      }
    },
    loadtreeData(resolve) {
      // 获取loadtreeData 就是父节点数据，getChildByList就是异步获取子节点数据
      let params = {
        groupId: this.curGroupId,
      };
      getAllgroup(params).then((res) => {
        if (res.data.success == true) {
          let data = [res.data.data];
          this.$nextTick(() => {
            if (
              this.$parent.$parent.curDept === -1 &&
              this.$parent.$parent.curPos === ""
            ) {
              this.$emit("update:curDept", data[0].id);
              this.$parent.$parent.parent = data[0].parentId;
            }
            this.$refs.tree.setCurrentKey(this.$parent.$parent.curDept);
            this.$emit("forTreeData", data);
          });
          resolve(data);
        } else {
          return false;
        }
      });
    },
    getChildByList(_parentID, resolve) {
      // 获取子节点请求
      let params = {
        groupId: _parentID,
      };
      getBelowLayer(params).then((res) => {
        if (res.data.success == true) {
          let list = res.data.data;
          let data = [];
          if (this.unitShow) {
            list.forEach((el) => {
              if (el.type == 1) {
                data.push(el);
              }
            });
          } else {
            data = list;
          }
          data.forEach((el) => {
            if (el.below) {
              el.leaf = false;
            } else {
              el.leaf = true;
            }
          });
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.$parent.$parent.curDept);
            this.$emit("forTreeData", data);
          });
          resolve(data);
          this.time = setTimeout(() => {
            this.beginWidth = document.getElementsByClassName(
              "el-tree-node__content"
            )[0].clientWidth;
          }, 2000);
        } else {
          return false;
        }
      });
    },
    /**
     *  载入集团树数据
     */
    loadData(str) {
      let params = {
        groupId: this.curGroupId,
      };
      getAllgroup(params).then((res) => {
        console.log("res", res);
        let resList = res.data.data;
        this.deptTree = [];
        this.deptName = resList.groupName;
        this.deptTree.push(resList);
        this.$nextTick(() => {
          if (
            this.$parent.$parent.curDept === -1 &&
            this.$parent.$parent.curPos === ""
          ) {
            this.$emit("update:curDept", resList[0].id);
            this.$parent.$parent.parent = resList[0].parentId;
          }
          this.$refs.tree.setCurrentKey(this.deptTree[0].id);
          if (!str) {
            this.handleClick(
              Object.keys(this.onCheck).length !== 0
                ? this.onCheck
                : this.deptTree[0]
            );
          }else{
            this.$refs.search.filterText = ''
            console.log('========', this.deptTree);
          }
          // this.$emit("forTreeData", this.deptTree);
        });
      });
    },
    /**
     *  点击不显示单位时执行函数 其调用重新加载树形但不执行点击树形功能
     */
    unitOnClick(str) {
      let params = {
        groupId: this.curGroupId,
      };
      getAllgroup(params).then((res) => {
        console.log("res", res);
        let resList = res.data.data;
        this.deptTree = [];
        this.deptName = resList.groupName;
        this.deptTree.push(resList);
        this.onCheck = {
          id: this.curGroupId,
          type: 1,
        };
        this.handleClick(
          Object.keys(this.onCheck).length !== 0
            ? this.onCheck
            : this.deptTree[0]
        );
      });
    },

    switchLoadData() {
      this.expandedList = [];
      let params = {
        groupId: this.curGroupId,
      };
      getGroupData(params).then((res) => {
        let resList = res.data.data;
        this.deptTree = [];
        this.deptName = resList.groupName;
        resList.code = resList.groupCode;
        resList.name = resList.groupName;
        this.deptTree.push(resList);
        console.log('55555555555555');
        this.$emit("forTreeData", this.deptTree);
        this.handleClick(resList);
      });
    },
    // loadData() {
    //   let params = {
    //     groupId: this.curGroupId,
    //     sourceGroupId: this.curGroupId,
    //   };
    //   getGroupTree(params).then((res) => {
    //     let resList = res.data.data;
    //     this.deptTree = [];
    //     this.deptName = resList[0].name
    //     this.deptTree.push.apply(this.deptTree, resList);
    //     this.$nextTick(() => {
    //       if (
    //         this.$parent.$parent.curDept === -1 &&
    //         this.$parent.$parent.curPos === ""
    //       ) {
    //         this.$emit("update:curDept", resList[0].id);
    //         this.$parent.$parent.parent = resList[0].parentId;
    //       }
    //       // this.$refs.tree.setCurrentKey(this.deptTree[0].id);
    //       this.handleClick(this.deptTree[0])
    //       this.$emit("forTreeData", this.deptTree);
    //     });
    //   });
    // },
    /**
     * @method 设置当前选中部门节点
     */
    handleClick(data, index, val) {
      if (val == "orgList") {
        this.orgIndex = index;
        this.unitIndex = false;
      } else if (val == "unitList") {
        this.unitIndex = index;
        this.orgIndex = false;
      }
      if (this.$parent.$parent.$refs.table) {
        this.$parent.$parent.$refs.table.$refs.table.page.currentPage = 1;
      } else {
        this.$parent.$parent.$refs.unitTable.$refs.table.page.currentPage = 1;
      }
      this.$nextTick(() => {
        if (this.$refs.tree) {
          this.$refs.tree.setCurrentKey(data.id);
        }
        this.onCheck.id = data.id;
        this.onCheck.type = data.type;
        this.$parent.$parent.parent = data.parentId;
      });
      this.$emit("update:curDept", data.id);
      this.$emit("update:curPos", "");
      this.$parent.$parent.unitType = data.type;
      this.$parent.$parent.unitData = data;
    },

    /**
     * @method 根据关键字筛选部门树
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.groupName.indexOf(value) !== -1;
    },
    /**
     * @method 删除单位
     */
    handleDelete(data) {
      this.$confirm("此操作将永久删除该节点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: "删除中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          let params = {
            groupId: data.id,
            sourceGroupId: this.curGroupId,
          };
          disbandGroup(params).then(
            (res) => {
              loading.close();
              this.$nextTick(() => {
                this.handleClick({ id: -1 });
                this.loadData();
              });
              this.$message.success({
                message: "删除成功",
                duriation: 700,
              });
            },
            (err) => {
              loading.close();
            }
          );
        })
        .catch(() => {
          return;
        });
    },
    handleCloseDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
        }
      });
      this.loadData();
      this.$emit("handleUpdate");
    },
    handleDragStart(node, ev) {},
    handleDragEnter(draggingNode, dropNode, ev) {},
    handleDragLeave(draggingNode, dropNode, ev) {},
    handleDragOver(draggingNode, dropNode, ev) {},
    handleDragEnd(draggingNode, dropNode, dropType, ev) {},
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("tree drop: ", draggingNode, dropNode, dropType, ev);
      let params = {
        sourceGroupId: this.curGroupId,
        beforeId: draggingNode.key,
        afterId: dropNode.key,
        orderStatus: dropType,
      };
      sortLazyTree(params).then((res) => {
        console.log("res", res);
      });
      // let obj = {
      //   aboveId: "",
      //   arr: [],
      // };
      // obj.aboveId = dropNode.data.aboveId;
      // for (let item of dropNode.parent.childNodes) {
      //   obj.arr.push(item.data.id);
      // }
      // this.updateOrderMe(obj);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.data.parentId === dropNode.data.parentId) {
        //aboveId是父节点id
        return type === "prev" || type === "next";
      } else {
        // 不同级进行处理
        return false;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.parentId == -1 ? false : true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
::v-deep .is-vertical {
  display: none;
}
::v-deep .el-scrollbar__wrap {
  overflow: auto;
}
.flex-column {
  flex: 1;
  height: 1px;
}
.noList {
  margin-top: 20px;
  text-align: center;
}
.tree {
  @include background_color("background_color3");
  min-width: 255px;
  display: inline-block;
  padding-top: 5px;
  // flex:auto;
  background: white;
  .el-tree-node {
    .el-tree-node__content {
      height: 40px;
      min-width: 100%;
      display: inline-flex;
    }
    .el-tree-node__children {
      overflow: unset;
      width: 100%;
    }
  }
}
.departSearch {
  &-click {
    background: rgb(236, 241, 252);
  }
  &-box:hover {
    background: rgb(249, 250, 255);
  }
  &-head {
    margin-top: 10px;
    min-width: 230px;
    height: 29.6px;
    background: rgb(245, 246, 252);
    line-height: 29.6px;
    padding-left: 10px;
    color: rgb(114, 116, 119);
  }
  &-title {
    font-size: 16px;
    padding: 10px 0 0 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #eeeeee;
    cursor: pointer;
    &__text {
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.filter-tree {
  @include background_color("background_color3");
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
  .node-model {
    width: 100%;
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;

    &--left {
      flex: 1;
    }

    &__title {
      overflow: hidden;

      svg {
        margin-right: 5px;
      }
    }
    &__btn {
      width: 20px;
      display: flex;
      align-items: center;
    }
  }
}
.filter-tree ::v-deep .el-tree-node__content {
  height: 30px;
}
.node-model__btn ::v-deep .diy-button-bg {
  background-color: transparent;
}
</style>
