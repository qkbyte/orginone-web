<template>
  <div class="main mainBox" ref="box">
    <div
      class="main--left left box"
      id="line"
      ref="moveDom"
      style="margin-right:4px"
    >
      <DiyTreeLayout class="main--box">
        <div class="main-select">
          <TheGroupSelect
            ref="groupSelect"
            @handleUpdate="loadData"
            @getState="getGroupState"
          ></TheGroupSelect>
        </div>
        <div class="flex-between main-tabs">
          <DiyTabs
            ref="typeList"
            :tabList="type"
            :curTab.sync="curTab"
          ></DiyTabs>
          <div class="flex-row">
            <el-popover
              placement="bottom-end"
              width="150"
              trigger="hover"
              v-show="curTab == '1'"
            >
              <div slot="reference" class="el-icon-view"></div>
              <el-checkbox-group style="margin-left: 20px" v-model="checkList">
                <el-checkbox
                  style="margin-bottom: 10px"
                  label="组织名"
                ></el-checkbox>
                <el-checkbox
                  style="margin-bottom: 10px"
                  label="组织编码"
                ></el-checkbox>
                <el-checkbox
                  @change="checkChange"
                  label="不显示单位"
                ></el-checkbox>
              </el-checkbox-group>
            </el-popover>
            <div class="btn-add" @click="handleAdd">
              <div class="flex-center"><i class="el-icon-plus"></i></div>
            </div>
          </div>
        </div>
        <template v-if="curTab === '1'">
          <TheDeptTree
            ref="deptTree"
            @handleUpdate="handleUpdateUserList"
            @handle-go="handleGo"
            @forTreeData="forTreeData"
            :curPos.sync="curPos"
            :curDept.sync="curDept"
            :checkList="checkList"
            :unitShow="unitShow"
          ></TheDeptTree>
        </template>
        <template v-else>
          <ThePositionTree
            ref="posTree"
            @handleUpdate="handleUpdateUserList"
            @handle-go="handleGo"
            :curPos.sync="curPos"
            :curDept.sync="curDept"
          ></ThePositionTree>
        </template>
      </DiyTreeLayout>
    </div>
    <div class="resize" title="收缩侧边栏">
      ⋮
    </div>
    <div class="main--right mid box right-FBL">
      <DiyBoxLayout v-show="curPos === ''" style="height:200px">
        <div class="main-form" v-show="unitType == 1">
          <div class="title">
            <div class="title-left">节点信息</div>
            <div>
              <span @click="handleMerge">合并集团</span>
              <span @click="handleEdit">编辑信息</span
              ><span @click="handleDistribute">分配单位</span>
            </div>
          </div>
          <div class="table">
            <div class="table-tr">
              <div class="table__left">节点名称</div>
              <div class="table__column">{{ curData.name }}</div>
              <div class="table__left">节点编码</div>
              <div class="table__column">{{ curData.code }}</div>
            </div>
            <div class="table-tr">
              <div class="table__left">上级节点</div>
              <div class="table__column">{{ parentName }}</div>
              <div class="table__left">管理单位</div>
              <div class="table__column">{{ curData.unitName }}</div>
            </div>
            <div class="table-tr">
              <div class="table__left">社会信用统一代码</div>
              <div class="table__column">{{ curData.socialCreditCode }}</div>
              <div class="table__left">节点描述</div>
              <div class="table__all">
                {{ curData.groupDescription }}
              </div>
            </div>
          </div>
        </div>
        <div class="main-form" v-show="unitType == 2">
          <div class="title">
            <div class="title-left">单位信息</div>
            <div style="display:flex">
              <div>
                <span v-if="!curData.managerTenant" @click="unitDelete"
                  >将单位移出整个集团</span
                >
              </div>
              <div>
                <span v-if="!curData.managerTenant" @click="unitHidden"
                  >隐藏单位</span
                >
              </div>
            </div>
          </div>
          <div class="table">
            <div class="table-tr">
              <div class="table__left">单位名称</div>
              <div class="table__column">{{ curData.name }}</div>
              <div class="table__left">统一社会信用代码</div>
              <div class="table__column">{{ curData.socialCreditCode }}</div>
            </div>
            <div class="table-tr">
              <div class="table__left">单位管理员</div>
              <div class="table__column">{{ curData.linkMan }}</div>
              <div class="table__left">管理员手机号</div>
              <div class="table__column">{{ curData.linkPhone }}</div>
            </div>
          </div>
        </div>
      </DiyBoxLayout>
      <DiyMainTable
        v-show="curPos !== ''"
        :mainTableData="mainTableData"
        :title="title"
        :buttons="buttons"
        @handleDisProperty="handleDisProperty"
      ></DiyMainTable>
      <DiyBoxLayout class="main--right box" style="padding-top:5px;">
        <div style="height:100%">
          <TheUserTable
            v-if="unitType == 1"
            style="height:100%;"
            ref="table"
            :curTab="curTab"
          ></TheUserTable>
          <TheUnitTable
            v-else
            style="height:100%;"
            ref="unitTable"
            :unitData="unitData"
          ></TheUnitTable>
        </div>
      </DiyBoxLayout>
    </div>
    <template v-for="item in dialogShow">
      <TheAddDeptDialog
        v-if="item.key === 'addDept' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAddDeptDialog>
      <TheAddPosDialog
        v-if="item.key === 'addPos' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAddPosDialog>
      <TheEditDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheEditDialog>
      <TheDistributeDialog
        v-if="item.key === 'distribute' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheDistributeDialog>
      <TheMergeDialog
        v-if="item.key === 'merge' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheMergeDialog>
      <EditDialog
        v-if="item.key === 'editP' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></EditDialog>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { groupRemoveTenantLeaf, hideUnitInGroup } from "@api/group";
import DiyTabs from "@components/DiyTabs/index";
import TheUserTable from "./components/TheUserTable";
import TheUnitTable from "./components/TheUnitTable";
import TheDeptTree from "./components/department/TheDeptTree";
import ThePositionTree from "./components/position/ThePositionTree";
import DiyTreeLayout from "@layout/DiyTreeLayout/index";
import TheAddDeptDialog from "./components/department/TheAddDialog";
import TheAddPosDialog from "./components/position/TheAddDialog";
import TheGroupSelect from "../components/TheGroupSelectMenber";
import TheEditDialog from "./components/department/TheEditDialog";
import TheDistributeDialog from "./components/department/TheDistributeDialog";
import TheMergeDialog from "./components/department/TheMergeDialog";
import DiyMainTable from "@components/DiyMainTable";
import EditDialog from "./components/position/TheEditDialog";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";

export default {
  data() {
    return {
      dialogShow: [
        {
          key: "addDept",
          value: false,
        },
        {
          key: "addPos",
          value: false,
        },
        {
          key: "edit",
          value: false,
        },
        {
          key: "distribute",
          value: false,
        },
        {
          key: "editP",
          value: false,
        },
        {
          key: "merge",
          value: false,
        },
      ],
      curTab: "1",
      curDept: -1,
      curPos: "",
      type: [{ id: "1", title: "组织" }, { id: "2", title: "性质" }],
      deptTreeList: [],
      posTreeList: [],
      curData: {},
      parentName: "",
      mainTableData: [
        {
          label1: "名称",
          value1: "未分配单位",
          label2: "单位数",
          value2: "",
        },
      ],
      buttons: [
        {
          label: "分配单位",
          event: "handleDisProperty",
        },
      ],
      title: "性质信息",
      total: "",
      parent: "",
      checkList: [],
      unitType: 1,
      unitData: {},
      unitShow: false,
    };
  },
  components: {
    DiyTreeLayout,
    DiyTabs,
    TheUserTable,
    TheDeptTree,
    ThePositionTree,
    TheAddDeptDialog,
    TheAddPosDialog,
    TheGroupSelect,
    TheEditDialog,
    TheDistributeDialog,
    DiyMainTable,
    EditDialog,
    TheUnitTable,
    TheMergeDialog,
    DiyBoxLayout,
  },
  watch: {
    curData: {
      handler(newValue) {
        console.log("---------", newValue);
      },
      deep: true,
      immediate: true,
    },
    curDept: {
      handler(newValue, oldValue) {
        let _this = this;
        this.$nextTick(() => {
          if (newValue) {
            if (this.$refs.table) {
              this.$refs.table.loadData();
            }
            this.deptTreeList.forEach((item) => {
              if (this.curDept === item.id) {
                this.curData = item;
              }
            });
            this.parentName = "";
            this.deptTreeList.forEach((item) => {
              if (this.curData.parentId === item.id) {
                this.parentName = item.name;
              }
            });
          }
        });
      },
    },
    curPos: {
      handler(newValue, oldValue) {
        if (newValue) {
          if (this.$refs.table) {
            this.$refs.table.loadData();
          }
          this.posTreeList.forEach((item) => {
            if (this.curPos === item.id) {
              this.curData = item;
            }
          });
          this.mainTableData[0].value1 = this.curData.propertiesName;
        }
      },
      deep: true,
      immediate: true,
    },
    unitData: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            if (this.$refs.unitTable) {
              this.$refs.unitTable.loadData();
            }
          });
        }
      },
      deep: true,
    },
    total: {
      handler(val) {
        this.mainTableData[0].value2 = val;
      },
    },
    curTab(val) {
      if (val == 1) {
        this.$nextTick(() => {
          this.$refs.deptTree.loadData();
        });
      } else {
        this.unitType = 1;
      }
    },
    checkList(val) {
      this.saveGroupState(val);
    },
  },
  created() {
    this.getGroupState();
  },
  mounted() {
    this.dragControllerDiv();
  },
  computed: {
    ...mapGetters("group", ["curGroup", "curGroupId"]),
    ...mapState("group", ["groupList", "defaultGroupId"]),
  },
  methods: {
    ...mapActions("group", ["saveGroupState"]),
    getGroupState() {
      this.$nextTick(() => {
        let state = JSON.parse(localStorage.getItem("groupState"));
        if (!state) {
          this.checkList = ["组织名"];
        } else {
          state.forEach((el) => {
            if (el.groupId == this.defaultGroupId) {
              if (typeof el.groupState === "undefined") {
                this.checkList = ["组织名"];
              } else {
                this.checkList = el.groupState;
                if (this.checkList.indexOf("不显示单位") !== -1) {
                  this.unitShow = true;
                }
              }
            }
          });
        }
      });
    },
    unitHidden() {
      let params = {
        sourceGroupId: this.curGroupId,
        tenantId: this.curData.tenantId,
        type: 1,
      };
      hideUnitInGroup(params).then(() => {
        this.deptTreeList = [];
        this.$refs.deptTree.filterText = "";
        this.$refs.deptTree.loadData();
      });
    },
    checkChange(val) {
      if (val) {
        this.deptTreeList = [];
        this.$refs.deptTree.unitOnClick();
        this.unitShow = true;
        this.curDept = this.curGroupId;
      } else {
        this.deptTreeList = [];
        this.$refs.deptTree.unitOnClick();
        this.unitShow = false;
        this.curDept = this.curGroupId;
      }
    },
    unitDelete() {
      this.$confirm("此操作将移除该单位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            groupId: this.curGroupId,
            tenantIds: this.curData.tenantId,
          };
          groupRemoveTenantLeaf(params).then((res) => {
            this.$message.success("移除成功");
            this.deptTreeList = [];
            this.$refs.deptTree.filterText = "";
            this.$refs.deptTree.loadData();
          });
        })
        .catch(() => {});
    },
    dragControllerDiv: function() {
      var _this = this;
      var resize = document.getElementsByClassName("resize");
      var left = document.getElementsByClassName("left");
      var mid = document.getElementsByClassName("mid");
      var box = document.getElementsByClassName("mainBox");
      for (let i = 0; i < resize.length; i++) {
        // 鼠标按下事件
        resize[i].onmousedown = function(e) {
          //颜色改变提醒
          resize[i].style.background = "#818181";
          var startX = e.clientX;
          resize[i].left = resize[i].offsetLeft;
          // 鼠标拖动事件
          document.onmousemove = function(e) {
            var endX = e.clientX;
            var moveLen = resize[i].left + (endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
            var maxT = box[i].clientWidth - resize[i].offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
            if (moveLen < 300) moveLen = 300; // 左边区域的最小宽度为32px
            if (moveLen > 580) moveLen = 580;
            if (moveLen > maxT - 150) moveLen = maxT - 150; //右边区域最小宽度为150px
            resize[i].style.left = moveLen; // 设置左侧区域的宽度
            for (let j = 0; j < left.length; j++) {
              left[0].style.width = moveLen + "px";
              console.log(
                "_this.$refs.deptTree.beginWidth",
                _this.$refs.deptTree.beginWidth
              );
              if (moveLen - 40 > _this.$refs.deptTree.beginWidth) {
                _this.$refs.deptTree.styleTree = {
                  width: moveLen - 45 + "px",
                };
              }
              // mid[0].style.width = (box[i].clientWidth - moveLen - 10) + 'px';
            }
          };
          // 鼠标松开事件
          document.onmouseup = function(evt) {
            //颜色恢复
            resize[i].style.background = "#d6d6d6";
            document.onmousemove = null;
            document.onmouseup = null;
            resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
          };
          resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
          return false;
        };
      }
    },

    //跳转到部门岗位管理页面
    handleGo() {
      this.curTab === "1"
        ? this.$router.push({
            name: "organization-department",
            params: this.$refs.deptTree.name,
          })
        : this.$router.push({ name: "organization-position" });
    },

    // handleUpload(){
    //   this.$router.push({ name: 'organization-import'})
    // },
    forTreeData(data) {
      let _this = this;
      console.log(this.deptTreeList);
      for (let i of data) {
        this.deptTreeList.push(i);
        if (i.children) {
          _this.forTreeData(i.children);
        }
      }
      // this.$refs.table.loadData()
      this.changeCurData();
    },
    changeCurData() {
      for (let i of this.deptTreeList) {
        if (i.id === this.curDept) {
          this.curData = i;
        }
      }
      for (let i of this.deptTreeList) {
        if (i.id === this.curData.parentId) {
          this.parentName = i.groupName;
        }
      }
    },
    loadData() {
      if (this.curTab === "1") {
        this.$refs.deptTree.switchLoadData();
      } else {
        this.$refs.posTree.loadData();
      }
    },
    handleAdd() {
      let key = this.curTab === "1" ? "addDept" : "addPos";
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = true;
        }
      });
    },
    handleUpdateUserList() {
      this.$refs.table.loadData();
    },
    handleCloseDialog(key, val) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
          if (val == "close") {
            return;
          } else if (val !== "cancel") {
            if (key === "addDept") {
              this.deptTreeList = [];
              // this.forTreeData(this.$refs.deptTree.deptTree);
              this.$refs.deptTree.loadData();
            } else if (key === "addPos" || key === "editP") {
              this.$refs.posTree.current = 1;
              this.$refs.posTree.loadData();
              this.posTreeList = this.$refs.posTree.treeData;
            } else if (key === "edit") {
              this.deptTreeList = [];
              this.$refs.deptTree.loadData();
            } else if (key === "merge") {
              this.deptTreeList = [];
              this.$refs.deptTree.loadData();
            } else if (key === "distribute") {
              this.deptTreeList = [];
              this.$refs.deptTree.loadData();
              this.$refs.table.loadData();
            } else {
              this.$refs.table.loadData();
            }
          }
        }
      }, this);
    },
    /**
     * @method 打开编辑组织信息弹窗
     */
    handleEdit() {
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = this.curData;
        }
      });
    },

    /**
     * @method 打开分配单位弹窗
     */
    handleDistribute() {
      this.dialogShow.map((el) => {
        if (el.key === "distribute") {
          el.value = true;
          el.sendData = this.curData;
        }
      });
    },
    /*
     * 打开分配单位窗口
     */
    handleDisProperty() {
      this.dialogShow.map((el) => {
        if (el.key === "editP") {
          el.value = true;
          el.sendData = this.curData;
        }
      });
    },
    /*
     * 打开合并集团窗口
     */
    handleMerge() {
      this.dialogShow.map((el) => {
        if (el.key === "merge") {
          el.value = true;
          el.sendData = this.curData;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
.flex-row {
  display: flex;
  flex-direction: row;
  .el-icon-view {
    color: #154ad8;
    margin: 15px 20px 0 0;
    cursor: pointer;
  }
}
.resize {
  cursor: col-resize;
  float: left;
  position: relative;
  left: -2px;
  top: 45%;
  background-color: #d6d6d6;
  border-radius: 5px;
  width: 4px;
  height: 50px;
  background-size: cover;
  background-position: center;
  /*z-index: 99999;*/
  font-size: 12px;
  padding-top: 16px;
  padding-left: 1px;
  color: white;
}
/*拖拽区鼠标悬停样式*/
.resize:hover {
  color: #444444;
}
.main {
  display: flex;

  .box {
    // min-height: 620px;
    // padding-top: 20px;
    // padding-bottom: 20px;
    display: flex;
    flex-direction: column;
  }
  &--box {
    display: flex;
    flex-direction: column;
    padding-top: 20px;
  }
  &--left {
    // width: 300px;
    // flex:1;
    width: 300px;
  }

  &--right {
    flex: 1;
    // margin-left: 4px;
    height: 100%;
  }
}

.main-select {
  height: 60px;
  margin-left: -20px;
}

.main-tabs {
  margin-top: 5px;
}
.btn-upload {
  width: 20px;
  height: 20px;
  margin-top: 12px;
  margin-left: 80px;
  cursor: pointer;
  div {
    width: 100%;
    height: 100%;
  }
  i:hover {
    color: rgba(21, 74, 216, 1);
  }
  .el-icon-upload {
    font-size: 25px;
  }
}
.btn-add {
  width: 20px;
  height: 20px;
  background: rgba(21, 74, 216, 1);
  border-radius: 50%;
  margin-top: 12px;
  cursor: pointer;

  div {
    width: 100%;
    height: 100%;
  }
  i {
    color: #fff;
  }
}
.main-form {
  padding: 15px 0 25px 0;
  .title {
    display: flex;
    justify-content: space-between;
    .title-left {
      font-size: 16px;
      font-weight: 600;
      color: rgba(48, 49, 51, 1);
      margin-bottom: 20px;
    }
    span {
      margin-left: 12px;
      @include font_color("font_color7");
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
  }
}
.table-mytable {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  height: 100%;
}
td,
tr {
  border: 1px solid rgba(239, 242, 247);
  color: #666;
  height: 45px;
}
// .left {
//   background: rgb(245, 246, 252);
//   width: 10.4%;
//   min-width: 110px;
// }
.column {
  width: 39.6%;
  text-align: left;
  padding: 0 20px;
}
.all {
  width: 39.6%;
  text-align: left;
  padding: 0 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  height: 100%;
  display: flex;
  flex-direction: column;
  &-tr {
    display: flex;
    flex-direction: row;
    border: 1px solid rgba(239, 242, 247);
    color: #666;
    height: 45px;
  }
  &__left {
    background: rgb(245, 246, 252);
    width: 10%;
    min-width: 110px;
    text-align: center;
    line-height: 45px;
  }
  &__column {
    flex: 1;
    width: 1px;
    text-align: left;
    padding: 0 20px;
    line-height: 45px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__all {
    flex: 1;
    width: 1px;
    text-align: left;
    padding: 0 20px;
    line-height: 45px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.right-FBL {
  @media screen and (max-width: 1280px) {
    width: 750px;
  }
}
</style>
