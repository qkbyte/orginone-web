<template>
  <div class="main mainBox" ref="box">
    <div class="main--left left box" id="line" ref="moveDom" style="margin-right:4px">
      <DiyTreeLayout class="flex-column">
        <div class="flex-between">
          <div class="title">岗位管理</div>
          <div class="btn-add" @click="handleAdd">
            <div class="flex-center"><i class="el-icon-plus"></i></div>
          </div>
        </div>
        <div style="height:100%;overflow:auto">
            <ThePositionTree
              class="main-left-tree"
              ref="posTree"
              @handle-go="handleGo"
              @handleUpdate="handleUpdateUserList"
              :curPos.sync="curPos"
              :curDept.sync="curDept"
            ></ThePositionTree>
          </div>
      </DiyTreeLayout>
    </div>
    <div class="resize" title="收缩侧边栏">
      ⋮
    </div>
    <div class="main--right mid box right-FBL">
      <DiyMainTable
        :mainTableData="mainTableData"
        :title="title"
        :buttons="buttons"
        @handleDistribute="handleDistribute"
      >
      </DiyMainTable>
      <DiyBoxLayout class="main--right box">
        <TheUserTable ref="table" :curTab="curTab" :curDept="curDept" :curPos="curPos"></TheUserTable>
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
      <TheDeptEditDialog
        v-if="item.key === 'editDept' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></TheDeptEditDialog>
      <ThePosEditDialog
        v-if="item.key === 'editPos' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeDialog="handleCloseDialog"
      ></ThePosEditDialog>
    </template>
  </div>
</template>

<script>
import DiyTabs from "@components/DiyTabs/index";
import TheUserTable from "./components/TheUserTable";
import TheDeptTree from "./components/department/TheDeptTree";
import ThePositionTree from "./components/position/ThePositionTree";
import DiyTreeLayout from "@layout/DiyTreeLayout/index";
import TheAddDeptDialog from "./components/department/TheAddDialog";
import TheAddPosDialog from "./components/position/TheAddDialog";
import { mapGetters } from "vuex";
import DiyMainTable from "@components/DiyMainTable";
import TheDeptEditDialog from "./components/department/TheEditDialog";
import ThePosEditDialog from "./components/position/TheEditDialog";
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
          key: "editDept",
          value: false,
        },
        {
          key: "editPos",
          value: false,
        },
      ],
      curTab: "2",
      curDept: -1,
      curPos: -1,
      // type: [{ id: "2", title: "岗位管理" }],
      total: 0,
      title: "岗位信息",
      buttons: [
        {
          label: "分配人员",
          event: "handleDistribute",
        },
      ],
      mainTableData: [
        {
          label1: "名称",
          value1: "未分配人员",
          label2: "人员数",
          value2: "",
        },
      ],
      curNode: {},
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
    DiyMainTable,
    TheDeptEditDialog,
    ThePosEditDialog,
    DiyBoxLayout,
  },
  mounted(){
    this.dragControllerDiv();
    // this.topDom = this.$refs.topDom
    //   const _this = this
    //   this.$nextTick(() => {
    //     const moveDom = document.getElementById('line')
    //     moveDom.onmousedown = function(e) {
    //       _this.clientStartX = e.clientY
    //       document.onmousemove = function(e) {
    //         _this.moveHandle(e.clientY, _this.topDom)
    //         return false
    //       }

    //       document.onmouseup = function() {
    //         document.onmousemove = null
    //         document.onmouseup = null
    //       }
    //       return false
    //     }
    //   })
  },
  watch: {
    curDept: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.$refs.table.loadData();
          this.title = "部门信息";
          this.curDept = newValue
        }
      },
    },
    curPos: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.$refs.table.loadData();
          this.title = "岗位信息";
          this.curPos = newValue
        }
      },
    },
    total: {
      handler(newVal, oldVal) {
        this.mainTableData[0].value2 = newVal;
      },
    },
  },
  computed: {
    ...mapGetters("tenant", ["curTenant", "curTenantCode"]),
  },
  methods: {
    dragControllerDiv: function () {
      var _this = this
      var resize = document.getElementsByClassName('resize');
      var left = document.getElementsByClassName('left');
      var mid = document.getElementsByClassName('mid');
      var box = document.getElementsByClassName('mainBox');
      for (let i = 0; i < resize.length; i++) {
        // 鼠标按下事件
        resize[i].onmousedown = function (e) {
          //颜色改变提醒
          resize[i].style.background = '#818181';
          var startX = e.clientX;
          resize[i].left = resize[i].offsetLeft;
          // 鼠标拖动事件
          document.onmousemove = function (e) {
            var endX = e.clientX;
            var moveLen = resize[i].left + (endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
            var maxT = box[i].clientWidth - resize[i].offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
            if (moveLen < 220) moveLen = 220; // 左边区域的最小宽度为32px
            if(moveLen > 580) moveLen = 580
            if (moveLen > maxT - 150) moveLen = maxT - 150; //右边区域最小宽度为150px
            resize[i].style.left = moveLen; // 设置左侧区域的宽度
              for (let j = 0; j < left.length; j++) {
                left[0].style.width = moveLen + 'px';
                if(moveLen - 40 > _this.$refs.deptTree.beginWidth){
                  _this.$refs.deptTree.styleTree = {
                    width: moveLen-50 + 'px'
                  }
                }
                // mid[0].style.width = (box[i].clientWidth - moveLen - 10) + 'px';
              }
          };
            // 鼠标松开事件
          document.onmouseup = function (evt) {
            //颜色恢复
            resize[i].style.background = '#d6d6d6';
            document.onmousemove = null;
            document.onmouseup = null;
            resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
          };
          resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
          return false;
        };
      }
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
            this.$refs.posTree.current = 1
            this.$refs.posTree.treeData = [{ id: -1, jobName: "未分配人员",}]
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
        ? this.$router.push({ name: "dept-manage" })
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
            console.log('this.curnode', this.curNode);
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.title{
  font-size: 16px;
  font-weight: bold;
  margin: 12px 0;
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
  background: rgba(21, 74, 216, 1);
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
