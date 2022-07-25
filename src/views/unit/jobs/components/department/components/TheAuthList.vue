<template>
  <div style="width:100%;margin-top:20px">
    <div>
      请选择分配方式：
      <template>
        <el-radio-group v-model="selectType">
          <el-radio :label="0">按人员</el-radio>
          <el-radio :label="1">按岗位</el-radio>
          <el-radio :label="2">按部门</el-radio>
        </el-radio-group>
      </template>
    </div>
    <div class="diy-dialog-body">
      <template v-if="selectType === 0">
        <div class="diy-dialog-body--left">
          <DeptTree
            ref="tree"
            :listData="departmentList"
            @handleSelection="handleSelection"
            @handleNode="handleNode"
            :title="'agencyName'"
            :type="1"
          ></DeptTree>
        </div>
        <div class="diy-dialog-body--center">
          <DiyList
            ref="list"
            :listData="allList"
            :allListData="allListData"
            :total="total"
            @handleSelection="handleSelection"
            :title="'realName'"
            :isChoose="isChoose"
            :searchId="searchId"
            :type="0"
          ></DiyList>
        </div>
        <div class="diy-dialog-body--right">
          <div class="diy-dialog-body--layout">
            <div class="diy-dialog-body__title">
              已选择 {{ selectList.length }} 人
            </div>
            <div class="diy-dialog-body__clear" @click="handleClear('user')">
              清空
            </div>
          </div>
          <div class="diy-dialog-body__list">
            <el-scrollbar style="height:100%;" id="scroll">
              <ul>
                <li v-for="item in selectList" :key="item.userId">
                  <div @click="handleRemove(item)">
                    <i class="el-icon-circle-close"></i>
                  </div>
                  <div class="diy-dialog-body__name">
                    {{ item.realName }}
                  </div>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </template>
      <template v-else-if="selectType === 1">
        <div class="diy-dialog-body--leftType">
          <DiyList
            :key="1"
            ref="list"
            :allListData="allListData"
            :selectType="selectType"
            :listData="allList"
            :total="total"
            @handleSelection="handleSelection"
            :title="'jobName'"
            :type="1"
          ></DiyList>
        </div>
        <div class="diy-dialog-body--rightType">
          <div class="diy-dialog-body--layout">
            <div class="diy-dialog-body__title">
              已选择 {{ selectList.length }} 个岗位
            </div>
            <div class="diy-dialog-body__clear" @click="handleClear('job')">
              清空
            </div>
          </div>
          <div class="diy-dialog-body__list">
            <el-scrollbar style="height:100%;" id="scroll">
              <ul>
                <li v-for="item in selectList" :key="item.id">
                  <div @click="handleRemoveid(item)">
                    <i class="el-icon-circle-close"></i>
                  </div>
                  <div class="diy-dialog-body__name">
                    {{ item.jobName }}
                  </div>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="diy-dialog-body--leftType">
          <DiyList
            :key="2"
            ref="list"
            :allListData="allListData"
            :selectType="selectType"
            :listData="allList"
            @handleSelection="handleSelection"
            :title="'agencyName'"
            :type="1"
          ></DiyList>
        </div>
        <div class="diy-dialog-body--rightType">
          <div class="diy-dialog-body--layout">
            <div class="diy-dialog-body__title">
              已选择 {{ selectList.length }} 个部门
            </div>
            <div class="diy-dialog-body__clear" @click="handleClear('agency')">
              清空
            </div>
          </div>
          <div class="diy-dialog-body__list">
            <el-scrollbar style="height:100%;padding-top:10px" id="scroll">
              <ul>
                <li v-for="item in selectList" :key="item.id">
                  <div @click="handleRemoveid(item)">
                    <i class="el-icon-circle-close"></i>
                  </div>
                  <div class="diy-dialog-body__name">
                    {{ item.agencyName }}
                  </div>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import {
  getUserList,
  getUserListByDeptIdOrPosId,
  getUserListByDeptIdOrPosIdV2,
} from "@api/user";
import { getDepartmentTree } from "@api/department";
import { getPositionList, getSearchJobList } from "@api/position";
import {
  getHasDestributedUserByAppRoleId,
  getHasDestributedAgencyByAppRoleId,
  getHasDestributedJobByAppRoleId,
  tenantDistributeApp,
  getAppInfo,
  getDistributedPersonListByAppId,
  getAppDistributedRole,
} from "@api/market";
import DiyTabs from "@components/DiyTabs/index";
import DiyList from "./TheSearchList";
import DeptTree from "./TheDeptTree";
export default {
  name: "TheAuthDialog",
  data() {
    let _this = this;
    return {
      loading: false,
      allList: [], //所有用户
      selectList: [], //当前选择用户
      selectType: 0, //分配方式
      current: 1,
      expandedKeys: [],
      departmentList: [], //所有部门
      isCurrent: false,
      isChoose: true,
      deptId: -1,
      determin: [],
      searchId: "",
      searchName: "",
      allListData: [],
      tabSwitch: false,
      total: 0,
    };
  },
  watch: {
    selectType: {
      async handler(o, n) {
        this.loading = true;
        this.current = 1;
        this.allList = [];
        this.selectList = [];
        this.isCurrent = false;
        await this.loadAllList();
        // this.handleSwitch(this.curTab)
        this.$nextTick(() => {
          this.$refs.list.getChoseTree();
        });
      },
    },
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    DiyList,
    DeptTree,
  },
  async created() {
    this.loadAllList();
  },
  mounted() {
    this.allListData.push({
      userIds: [],
      jobIds: [],
      agencyIds: [],
    });
  },
  computed: {
    ...mapState("user", ["userId"]),
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
    ...mapState("tenant", ["defaultTenantCode", "groupList"]),
  },
  methods: {
    handleClear(clear){
      switch (clear) {
        case 'user': 
          for (let i = 0; i < this.allListData.length; i++) {
            if(this.allListData[i].roleId == this.curTab){
              this.allListData[i].userIds = []
              this.selectList = []
              this.$refs.list.$refs.tree.setCheckedKeys([])
            }
          }
          break;
        case 'job': 
          for (let i = 0; i < this.allListData.length; i++) {
            if(this.allListData[i].roleId == this.curTab){
              this.allListData[i].jobIds = []
              this.selectList = []
              this.$refs.list.$refs.tree.setCheckedKeys([])
            }
          }
          break;
        case 'agency': 
          for (let i = 0; i < this.allListData.length; i++) {
            if(this.allListData[i].roleId == this.curTab){
              this.allListData[i].agencyIds = []
              this.selectList = []
              this.$refs.list.$refs.tree.setCheckedKeys([])
            }
          }
          break;
      }     
    },
    handleRemove(val) {
      let index = this.selectList.indexOf(val)
      this.selectList.splice(index,1)
      this.$refs.list.$refs.tree.setChecked(val.userId, false);
    },
    handleRemoveid(val) {
      if(this.selectType == 0){
        this.$refs.list.$refs.tree.setChecked(val.id, false);
      }else if(this.selectType == 1){
        this.$refs.list.$refs.tree.setChecked(val.jobId, false);
      }else{
        this.$refs.list.$refs.tree.setChecked(val.agencyId, false);
      }
    },
    handleSelection(data, check, arrList) {
      if (this.selectType == 0) {
        this.selectList = this.allListData[0].userIds;
        let checkKey = this.$refs.list.$refs.tree.getCheckedKeys();
        this.$refs.list.checkList = checkKey;
        if (checkKey.length !== this.allList.length) {
          let checkedCount = checkKey.length;
          this.$refs.list.checkAll = false;
          this.$refs.list.isIndeterminate =
            checkedCount > 0 && checkedCount < this.allList.length;
        } else if (this.total == 0) {
          this.$refs.list.checkAll = false;
          this.$refs.list.isIndeterminate = false;
        } else {
          this.$refs.list.checkAll = true;
          this.$refs.list.isIndeterminate = false;
        }
      } else if (this.selectType == 1) {
        this.selectList = this.allListData[0].jobIds;
        if (this.selectList.length !== this.allList.length) {
          let checkedCount = this.selectList.length;
          this.$refs.list.checkAll = false;
          this.$refs.list.isIndeterminate =
            checkedCount > 0 && checkedCount < this.allList.length;
        } else {
          this.$refs.list.checkAll = true;
          this.$refs.list.isIndeterminate = false;
        }
      } else {
        this.selectList = this.allListData[0].agencyIds;
      }
    },
    /**获取全部列表 */
    async loadAllList(data) {
      if (this.selectType === 0) {
        let data = {
          tenantCode: this.curTenantCode,
        };
        await getDepartmentTree(data).then((res) => {
          let resList = res.data.data[0].children;
          this.departmentList = [
            {
              id: -1,
              agencyName: this.curTenant.name,
              children: [],
            },
          ];
          this.departmentList[0].children = this.departmentList[0].children.concat(
            resList
          );
          if (data) {
            for (let i = 0; i < data.length; i++) {
              if (this.curTab == data[i].roleId) {
                let select = JSON.parse(JSON.stringify(data[i].userIds));
                this.$refs.list.multipleSelection = select;
                this.$refs.list.setCheckedNodes();
              }
            }
          }
          this.$nextTick(function() {
            this.$refs.tree.$refs.tree.setCurrentKey(this.departmentList[0].id);
            // 获取默认的未分配人员
            this.handleNode(this.departmentList[0].id);
          });
        });
      } else if (this.selectType === 1) {
        let params = {
          current: this.current,
          size: 20,
          tenantCode: this.curTenantCode,
        };
        await getPositionList(params).then((res) => {
          this.allList = this.allList.concat(res.data.data.records);
          this.total = res.data.data.total;
          this.loading = false;
          if (data) {
            for (let i = 0; i < data.length; i++) {
              if (this.curTab == data[i].roleId) {
                let select = JSON.parse(JSON.stringify(data[i].jobIds));
                this.$refs.list.multipleSelection = select;
                this.$refs.list.setCheckedNodes();
              }
            }
          }
        });
      } else {
        let params = {
          tenantCode: this.curTenantCode,
        };
        await getDepartmentTree(params).then((res) => {
          this.allList = res.data.data[0].children;
          this.loading = false;
        });
      }
    },
    // 获取点击的部门人员
    handleNode(val) {
      this.searchId = val;
      if (this.isCurrent == false) {
        let jobId = null;
        let select = this.selectList;
        if (val == -1) {
          jobId = -1;
        } else {
          jobId = null;
        }
        let params = {
          current: 1,
          size: 20,
          tenantCode: this.curTenantCode,
          count: 5,
          jobId: jobId,
          deptId: this.deptId,
          fuzzyVal: this.searchName,
        };
        getUserListByDeptIdOrPosIdV2(params).then((res) => {
          this.allList = res.data.data.records;
          this.total = res.data.data.total;
          this.loading = false;
        });
      } else {
        let jobId = null;
        let select = JSON.parse(JSON.stringify(this.selectList));
        if (val == -1) {
          jobId = -1;
        } else {
          jobId = null;
        }
        let params = {
          current: this.current,
          size: 20,
          tenantCode: this.curTenantCode,
          count: 5,
          jobId: jobId,
          deptId: this.deptId,
          fuzzyVal: this.searchName,
        };
        getUserListByDeptIdOrPosIdV2(params).then((res) => {
          let list = res.data.data.records;
          this.allList = this.allList.concat(list);
          this.isCurrent = false;
          this.$nextTick(() => {
            this.$refs.list.multipleSelection = select;
            this.$refs.list.setCheckedNodes();
          });
        });
      }
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

.tabs {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 490px;
  &__tit {
    min-width: 100px;
    padding: 0 0 15px;
  }
}

.diy-dialog-body {
  border: 1px solid rgba(235, 238, 245, 1);
  box-sizing: border-box;
  border-radius: 4px;
  justify-content: flex-start;
  margin-top: 20px;
  &__clear {
    margin-top: 12px;
    cursor: pointer;
  }
  &__clear:hover {
    margin-top: 12px;
    color: cornflowerblue;
    cursor: pointer;
  }
  &--layout {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  &--left,
  &--center,
  &--right {
    width: 33%;
    height: 350px;
    padding: 16px;
  }

  &--leftType,
  &--rightType {
    width: 50%;
    height: 350px;
    padding: 16px;
  }

  &--left,
  &--leftType {
    border-right: 1px solid rgba(235, 238, 245, 1);
  }

  &--center {
    border-right: 1px solid rgba(235, 238, 245, 1);
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    line-height: 40px;
    color: rgba(48, 49, 51, 1);
  }

  &__name {
    white-space: nowrap;
  }

  &__list {
    height: 268px;
    margin-top: 10px;

    li {
      height: 26px;
      line-height: 26px;
      display: flex;
      i {
        color: #c0c4cc;
        cursor: pointer;
        margin-right: 20px;
        &:hover {
          color: #9da1a8;
        }
      }
    }
  }
}
::v-deep .is-vertical {
  display: none;
}
::v-deep .el-scrollbar__view {
  display: inline-block;
}
::v-deep .el-scrollbar__wrap {
  overflow: auto;
}
</style>
