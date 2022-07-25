<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="加载中"
    center
    top="10vh"
    width="700px"
    :visible.sync="dialogShow.value"
    :modal-append-to-body="true"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title">
      应用分发
    </span>
    <div v-if="!progressBar">
      <div class="diy-dialog-body">
        <div class="diy-dialog-body__tabs">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="包含节点" name="contains"></el-tab-pane>
            <el-tab-pane label="排除节点" name="remove"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="diy-dialog-box">
        <!-- <div class="diy-dialog-box__checkBox">
        <div class="title" style="margin-bottom:10px">快捷勾选</div>
        <TheCheckBox
          v-if="tabs == 0"
          ref="check"
          :tabs="tabs"
          @checkChange="checkChange"
        ></TheCheckBox>
        <TheCheckBox
          v-else
          ref="removeCheck"
          :tabs="tabs"
          @checkChange="checkChangeRemove"
        ></TheCheckBox>
      </div> -->
        <div class="diy-dialog-box__radio">
          <TheRadio
            v-if="tabs == 0"
            ref="radio"
            :tabs="tabs"
            @radioChange="radioChange"
          ></TheRadio>
          <TheRadio
            v-else
            ref="removeRadio"
            :tabs="tabs"
            @radioChange="radioChangeRemove"
          ></TheRadio>
        </div>
        <div class="diy-dialog-box-treeBox">
          <div class="diy-dialog-box-left">
            <DiyList
              v-if="tabs == 0"
              ref="list"
              @handleSelection="handleSelection"
              :radio="radio"
              :title="'name'"
            ></DiyList>
            <TheRemoveList
              v-else
              ref="removeList"
              @handleSelection="handleSelectionRemove"
              :radio="radioRemove"
              :title="'name'"
            ></TheRemoveList>
          </div>
          <div class="diy-dialog-box-right">
            <TheCheckTree
              v-if="tabs == 0"
              ref="tree"
              :selectList="selectOneList"
            ></TheCheckTree>
            <TheRemoveTree
              v-else
              ref="removeTree"
              :selectList="selectTwoList"
            ></TheRemoveTree>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="progress-box">
      <el-progress
        ref="progress"
        type="circle"
        :width="200"
        :stroke-width="10"
        :percentage="percentage"
        :status="status"
      ></el-progress>
    </div>
    <span v-if="!progressBar" slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleSave">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
    <span v-else slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { simpleGroupTenantTree } from "@api/group";
import { getImportProgress, getRemoveProgress } from "@api/user";
import {
  getHasDestributedUserByAppRoleId,
  distributionGroupApp,
  distributeAppTenantList,
  distributionGetConfig,
  groupAppDistribute,
} from "@api/market";
import DiyList from "./TheSearchList";
import TheCheckBox from "./TheCheckBox";
import TheRadio from "./TheRadio";
import TheCheckTree from "./TheCheckTree";
import TheRemoveList from "./TheRemoveList";
import TheRemoveTree from "./TheRemoveTree";
import _ from "lodash";

export default {
  name: "TheAuthDialog",
  data() {
    let _this = this;
    return {
      loading: false,
      curTab: this.dialogShow.sendData.roleId,
      userList: [], //所有用户
      selectOneList: [], // 包含节点选择用户
      selectTwoList: [], // 排除节点选择用户
      activeName: "contains",
      radio: 1,
      tabs: 0,
      checkBox: [],
      checkBoxRemove: [],
      radioRemove: 1,
      progressBar: false, // 进度条的展示
      percentage: 0,
      progressId: 0,
      status: undefined,
      myInterval: null,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    DiyList,
    TheCheckBox,
    TheRadio,
    TheCheckTree,
    TheRemoveList,
    TheRemoveTree,
  },
  async created() {
    // await this.loadGroupTenantTree();
    // this.$nextTick(() => {
    //   this.loadHasDistributedUserList();
    // });
  },
  mounted() {
    // this.loading = true;
    this.loadData();
  },
  computed: {
    ...mapState("user", ["userId"]),
    ...mapState("group", ["defaultGroupId", "groupList"]),
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  beforeDestroy() {
    this.destroyedProgress();
  },
  watch: {
    // curTab: {
    //   handler(oldValue, newValue) {
    //     this.$refs.list.$refs.tree.setCheckedNodes([]);
    //     this.loadHasDistributedUserList();
    //   },
    // },
    tabs: {
      handler(val) {
        this.$nextTick(() => {
          if (val == 0) {
            if (this.selectOneList.length == 0) {
              this.loadData();
            } else {
              let id = [];
              this.selectOneList.forEach((el) => {
                id = [...id, el.id];
              });
              this.$refs.list.$refs.tree.setCheckedKeys(id);
            }
          } else {
            if (this.selectTwoList.length == 0) {
              this.loadData();
            } else {
              let id = [];
              this.selectTwoList.forEach((el) => {
                id = [...id, el.id];
              });
              this.$refs.removeList.$refs.tree.setCheckedKeys(id);
            }
          }
        });
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapActions("menu", ["updateAppMenu"]),
    loadData() {
      const { appId, groupId } = this.dialogShow.sendData;
      let params = {
        appId: appId,
        groupId: groupId,
      };
      distributionGetConfig(params).then(
        (res) => {
          console.log("res33333333333333333", res);
          let records = res.data.data;
          if (this.tabs == 0) {
            // if(records[0].distributeType == ''){
            //   this.$refs.check.checkUnit = []
            // }else{
            //   this.$refs.check.checkUnit = records[0].distributeType.split(',')
            // }
            let id = [];
            records[0].configList.forEach((el) => {
              id = [...id, el.id];
            });
            this.$refs.list.$refs.tree.setCheckedKeys(id);
            this.selectOneList = records[0].configList;
            this.$refs.tree.selectedList = records[0].configList;
          } else {
            // if(records[0].distributeType == ''){
            //   this.$refs.removeCheck.checkRemove = []
            // }else{
            //   this.$refs.removeCheck.checkRemove = records[1].distributeType.split(',')
            // }
            let id = [];
            records[1].configList.forEach((el) => {
              id = [...id, el.id];
            });
            this.$refs.removeList.$refs.tree.setCheckedKeys(id);
            this.selectTwoList = records[1].configList;
            this.$refs.removeTree.selectedList = records[1].configList;
          }
        },
        (err) => {
          this.loading = false;
          this.$message.warning(err);
        }
      );
    },
    // tabs 切换
    handleClick(tab, event) {
      this.tabs = tab.index;
    },
    // 选择checkbox
    checkChange(val) {
      this.checkBox = val;
    },
    // 排除节点
    checkChangeRemove(val) {
      this.checkBoxRemove = val;
    },
    // radio 改变方法
    radioChange(val) {
      this.radio = val;
    },
    radioChangeRemove(val) {
      this.radioRemove = val;
    },
    /**保存分配*/
    async handleSave() {
      this.progressBar = true;
      this.checkBox = this.checkBox.join(",");
      this.checkBoxRemove = this.checkBoxRemove.join(",");
      let selectOne = [];
      let selectTwo = [];
      for (let i = 0; i < this.selectOneList.length; i++) {
        selectOne.push({
          id: this.selectOneList[i].id,
          type: this.selectOneList[i].type,
          check: this.selectOneList[i].check
            ? this.selectOneList[i].check
            : this.selectOneList[i].radio,
          name: this.selectOneList[i].name,
          label: this.selectOneList[i].label,
        });
      }
      for (let j = 0; j < this.selectTwoList.length; j++) {
        selectTwo.push({
          id: this.selectTwoList[j].id,
          type: this.selectTwoList[j].type,
          check: this.selectTwoList[j].check
            ? this.selectTwoList[j].check
            : this.selectTwoList[j].radio,
          name: this.selectTwoList[j].name,
          label: this.selectTwoList[j].label,
        });
      }
      let params = {
        groupId: this.dialogShow.sendData.groupId,
        appId: this.dialogShow.sendData.appId,
        list: [
          {
            contain: 1,
            distributeType: "",
            configList: selectOne,
          },
          {
            contain: 0,
            distributeType: "",
            configList: selectTwo,
          },
        ],
      };
      groupAppDistribute(params).then((res) => {
        let records = res.data.data;
        if (res.data.code == 200) {
          this.myInterval = setInterval(() => {
            this.getImportProgress(records);
          }, 500);
        }
      });
      // distributionGroupApp(params).then(
      //   (res) => {
      //     this.$message.success({
      //       message: "分配完成",
      //       duriation: 700,
      //     });
      //     this.updateAppMenu();
      //     this.$emit("updateList");
      //     this.loading = false;
      //   },
      //   (err) => {
      //     this.loading = false;
      //     this.handleClose();
      //   }
      // );
    },
    getImportProgress(val) {
      this.progressId = val;
      let params = {
        progressId: this.progressId,
      };
      try {
        getImportProgress(params).then((res) => {
          if (res.data.data.status) {
            this.percentage = res.data.data.value / 2;
            if (this.percentage == 100) {
              // this.loading = false
              this.status = "success";
              clearInterval(this.myInterval);
              this.myInterval = null;
            }
          } else {
            this.status = "warning";
            clearInterval(this.myInterval);
            this.myInterval = null;
            this.$message.warning(res.data.data.msg);
            // this.loading = false;
          }
        });
      } catch (error) {
        // this.loading = false;
        this.$message.warning(error);
        clearInterval(this.myInterval);
        this.myInterval = null;
      }
    },
    destroyedProgress() {
      if (this.progressId !== 0) {
        let params = {
          progressId: this.progressId,
        };
        getRemoveProgress(params);
      }
      clearInterval(this.myInterval);
      this.myInterval = null;
    },
    //关闭对话框
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleSelection(val, select) {
      console.log(select);
      this.selectOneList = select;
    },
    handleSelectionRemove(val, select) {
      this.selectTwoList = select;
    },
    handleRemove(val) {
      this.$refs.list.$refs.tree.setChecked(val.id, false);
    },
  },
};
</script>

<style lang="scss" scoped>
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
.diy-dialog-footer {
  margin-top: 30px;
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
    margin-top: 5px;
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
    height: 334px;
    overflow: auto;
    width: 50%;
    padding: 16px;
    border: 1px solid rgba(235, 238, 245, 1);
  }
}
.diy-dialog-body {
  border: 1px solid rgba(235, 238, 245, 1);
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
::v-deep .el-dialog__body {
  overflow: auto;
  height: 490px;
}
::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
</style>
