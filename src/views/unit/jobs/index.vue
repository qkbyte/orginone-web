<template>
  <div class="main mainBox" ref="box">
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :append-to-body="false"
      :modal-append-to-body="false"
      :before-close="handleClose"
    >
      <template slot="title">
        <div class="drawer-title">
          <div class="drawer-btn" @click="changeDepart">变更部门</div>
        </div>
      </template>
      <div class="drawer-context">
        <div class="drawer-context-head">
          <div
            v-if="drawerList.userPhoto"
            class="headLayout-avatar_img"
            v-bind:style="{
              'background-image': 'url(' + drawerList.userPhoto + ')',
              'background-repeat': 'no-repeat',
              'background-size': '100% 100%',
            }"
          ></div>
          <div v-else class="headLayout-avatar_img2">
            {{ drawerList.userHead }}
          </div>
          <div class="drawer-context-head__name">{{ drawerList.realName }}</div>
        </div>
        <el-form label-position="top" label-width="80px" :model="form">
          <el-form-item
            v-for="item in formItem"
            v-bind="item"
            :key="item.prop"
            :class="item.class ? item.class : 'formItem'"
            :prop="item.prop"
          >
            <div v-if="item.prop === 'realName'">
              {{ drawerList[item.prop] }}
            </div>
            <div v-if="item.prop === 'phoneNumber'">
              {{ drawerList[item.prop] }}
            </div>
          </el-form-item>
        </el-form>
        <div class="drawer-context__layout"></div>
      </div>
    </el-drawer>
    <div
      class="main--left left box"
      id="line"
      ref="moveDom"
      style="margin-right:4px;"
    >
      <DiyTreeLayout class="flex-column">
        <div class="flex-between" style="margin:5px 0 5px 0">
          <div class="box-head">部门管理</div>
          <div style="display:flex">
            <el-popover placement="bottom-end" width="150" trigger="hover">
              <div slot="reference" class="el-icon-view"></div>
              <el-checkbox-group style="margin-left: 20px" v-model="checkList">
                <el-checkbox
                  style="margin-bottom: 10px"
                  label="部门名"
                ></el-checkbox>
                <el-checkbox label="部门编码"></el-checkbox>
              </el-checkbox-group>
            </el-popover>
            <div class="btn-add" @click="handleAdd">
              <div class="flex-center"><i class="el-icon-plus"></i></div>
            </div>
          </div>
        </div>
        <template>
          <TheSearchInput
            placeholder="输入部门进行搜索"
            :filterText.sync="filterText"
          ></TheSearchInput>
          <div v-show="!searchShow" style="height:100%;overflow:auto">
            <TheDeptTree
              class="main-left-tree"
              ref="deptTree"
              @handle-go="handleGo"
              @handleUpdate="handleUpdateUserList"
              @personSearch="personSearch"
              :curPos.sync="curPos"
              :curDept.sync="curDept"
              :checkList="checkList"
            ></TheDeptTree>
          </div>
          <div v-show="searchShow" style="height:100%;overflow:auto;">
            <DepartSearch
              class="main-left-tree"
              ref="deptSearch"
              :filterText="filterText"
              @appearView="appearView"
              @handleTreeKey="handleTreeKey"
            ></DepartSearch>
          </div>
        </template>
      </DiyTreeLayout>
    </div>
    <div class="resize" title="收缩侧边栏">
      ⋮
    </div>
    <div class="main--right mid box right-FBL">
      <DiyMainTable
        :buttons="buttons"
        :mainTableData="mainTableData"
        :title="title"
        @handleDistribute="handleDistribute"
      >
      </DiyMainTable>
      <DiyBoxLayout class="main--right box">
        <TheUserTable
          ref="table"
          :curTab="curTab"
          :curDept="curDept"
          :curPos="curPos"
        ></TheUserTable>
      </DiyBoxLayout>
    </div>
    <template v-for="item in dialogShow">
      <TheAddDeptDialog
        v-if="item.key === 'addDept' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheAddDeptDialog>
      <TheDeptEditDialog
        v-if="item.key === 'editDept' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheDeptEditDialog>
      <TheEditDialog
        v-if="item.key === 'edit' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheEditDialog>
    </template>
  </div>
</template>

<script>
import DiyTabs from "@components/DiyTabs/index";
import TheUserTable from "./components/TheUserTable";
import TheDeptTree from "./components/department/TheDeptTree";
import DiyTreeLayout from "../../../layout/DiyTreeLayout/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheAddDeptDialog from "./components/department/TheAddDialog";
import { mapGetters } from "vuex";
import DiyMainTable from "@components/DiyMainTable";
import TheDeptEditDialog from "./components/department/TheEditDialog";
import DepartSearch from "./components/department/DepartSearch.vue";
import TheSearchInput from "./components/TheSearchInput";
import TheEditDialog from "./components/TheEditDialog";
export default {
  data() {
    return {
      form: {},
      drawer: false,
      direction: "rtl",
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
          key: "editDept",
          value: false,
        },
        {
          key: "editPos",
          value: false,
        },
        {
          key: "edit",
          value: false,
        },
      ],
      curTab: "1",
      curDept: -1,
      curPos: -1,
      type: [{ id: "1", title: "部门" }, { id: "2", title: "岗位" }],
      total: 0,
      title: "部门信息",
      mainTableData: [
        {
          label1: "名称",
          value1: "",
          label2: "人员数",
          value2: "",
        },
      ],
      curNode: {},
      searchShow: false,
      filterText: "",
      drawerList: {},
      isEdit: false,
      formItem: [
        {
          label: "用户名称",
          prop: "realName",
        },
        {
          label: "手机号",
          prop: "phoneNumber",
        },
      ],
      checkList:[],
      buttons: [],
    };
  },
  components: {
    DiyTreeLayout,
    DiyTabs,
    TheUserTable,
    TheDeptTree,
    TheAddDeptDialog,
    DiyMainTable,
    TheDeptEditDialog,
    DepartSearch,
    TheSearchInput,
    TheEditDialog,
    DiyBoxLayout,
  },
  watch: {
    filterText(val) {
      if (val == "") {
        this.searchShow = false;
      } else {
        this.searchShow = true;
      }
    },
    curDept: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.$refs.table.loadData();
          this.title = "部门信息";
          this.curDept = newValue;
        }
      },
    },
    curPos: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.$refs.table.loadData();
          this.title = "岗位信息";
          this.curPos = newValue;
        }
      },
    },
    total: {
      handler(newVal, oldVal) {
        this.mainTableData[0].value2 = newVal;
      },
    },
  },
  created() {
    this.mainTableData[0].value1 = this.curTenant.name;
  },
  mounted() {
    this.checkList = ["部门名"];
    this.dragControllerDiv();
  },
  computed: {
    ...mapGetters("tenant", ["curTenant", "curTenantCode"]),
  },
  methods: {
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
            if (moveLen < 260) moveLen = 260; // 左边区域的最小宽度为32px
            if (moveLen > 580) moveLen = 580;
            if (moveLen > maxT - 150) moveLen = maxT - 150; //右边区域最小宽度为150px
            resize[i].style.left = moveLen; // 设置左侧区域的宽度
            for (let j = 0; j < left.length; j++) {
              left[0].style.width = moveLen + "px";
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
    handleDistribute() {
      if (this.curTab === "1") {
        this.dialogShow.map((el) => {
          if (el.key === "editDept") {
            el.value = true;
            el.sendData = this.curNode;
          }
        });
      } else {
        this.dialogShow.map((el) => {
          if (el.key === "editPos") {
            el.value = true;
            el.sendData = this.curNode;
            console.log('this.curnode', this.curNode);
          }
        });
      }
    },
    handleTreeKey(data) {
      console.log("data", data);
      this.curDept = data.id;
      this.$nextTick(() => {
        this.$refs.deptTree.$refs.tree.setCurrentKey(data.id);
        this.$refs.table.loadData();
      });
    },
    handleEdit() {
      this.isEdit = true;
    },
    loadData() {
      this.$refs.table.loadData();
    },
    changeDepart() {
      this.drawer = false;
      this.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = true;
          el.sendData = this.drawerList;
        }
      });
    },
    handleClose() {
      this.drawer = false;
    },
    appearView(data, show) {
      this.drawerList = data;
      this.drawer = show;
    },
    //新增部门、岗位
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
    handleCloseDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
          if (key === "addDept") {
            this.$refs.deptTree.loadData();
          } else if (key === "addPos") {
            this.$refs.posTree.current = 1;
            this.$refs.posTree.treeData = [{ id: -1, jobName: "未分配人员" }];
            this.$refs.posTree.loadData();
          } else if (["editDept", "editPos"].includes(key)) {
            this.$refs.table.loadData();
          }
        }
      }, this);
    },

    //跳转到部门岗位管理页面
    handleGo() {
      this.curTab === "1"
        ? this.$router.push({ name: "department-manage" })
        : this.$router.push({ name: "post-manage" });
    },
    handleDistribute() {
      if (this.curTab === "1") {
        this.dialogShow.map((el) => {
          if (el.key === "editDept") {
            el.value = true;
            el.sendData = this.curNode;
          }
        });
      } else {
        this.dialogShow.map((el) => {
          if (el.key === "editPos") {
            el.value = true;
            el.sendData = this.curNode;
            console.log("this.curnode", this.curNode);
          }
        });
      }
    },
    personSearch(val) {
      if (val == "") {
        this.searchShow = false;
      } else {
        this.searchShow = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
.el-icon-view {
  margin: 15px 20px 0 0;
  cursor: pointer;
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
.main ::v-deep .el-drawer__header {
  position: relative;
  height: 50px;
  margin: 0;
  padding: 0;
  font-size: 13px;
  font-weight: normal;
}
.main ::v-deep .el-drawer__close-btn {
  position: absolute;
  left: 20px;
}
.main ::v-deep .el-dialog__wrapper {
  position: absolute;
}
.main ::v-deep .el-drawer__header > :first-child {
  flex: 0;
}
.main ::v-deep .el-form-item__content {
  line-height: 0px;
}
.formItem {
  padding: 0;
  margin-left: 20px;
}
.drawer-context-head {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}
.headLayout {
  &-avatar_img {
    width: 30px;
    height: 30px;
    margin-top: 10px;
    margin-left: 20px;
    border-radius: 50%;
  }
  &-avatar_img2 {
    width: 30px;
    height: 30px;
    background: #154ad8;
    margin-top: 10px;
    margin-left: 20px;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    font-size: 15px;
    color: #ffffff;
  }
}
.drawer-context {
  height: 100%;
  width: 100%;
  &-head {
    &__name {
      margin-top: 16px;
      margin-left: 10px;
    }
  }
}
.drawer-title {
  position: absolute;
  width: 270px;
  right: 0;
  height: 40px;
  display: flex;
  flex-direction: row-reverse;
}
.drawer-btn {
  width: 70px;
  height: 30px;
  border: 1px solid #000000;
  text-align: center;
  line-height: 25px;
  margin-top: 4px;
  margin-right: 10px;
  cursor: pointer;
}
.drawer-btn:hover {
  width: 70px;
  height: 30px;
  border: 1px solid rgba(21, 74, 216, 1);
  color: rgba(21, 74, 216, 1);
  text-align: center;
  line-height: 25px;
  margin-top: 4px;
  margin-right: 10px;
  cursor: pointer;
}
.box-head {
  font-size: 15px;
  font-weight: bold;
  margin: 10px 0 10px 10px;
}
.main {
  display: flex;
  height: 100%;
  .box {
    display: flex;
    flex-direction: column;
  }
  .main-left-tree {
    display: flex;
    flex-direction: column;
  }
  &--left {
    width: 260px;
  }

  &--right {
    flex: 1;
    height: 100%;
  }
}

.btn-add {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-top: 10px;
  cursor: pointer;

  div {
    width: 100%;
    height: 100%;
  }
  i {
    color: #fff;
  }
}
.right-FBL{
   @media screen and (max-width: 1280px) {
     width: 800px;
   }
}
</style>
