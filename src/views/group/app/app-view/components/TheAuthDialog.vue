<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="加载中"
    center
    top="10vh"
    width="540px"
    :visible.sync="dialogShow.value"
    :modal-append-to-body="true"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title">
      应用分配
    </span>
    <div class="diy-dialog-body">
      <div class="diy-dialog-body--left">
        <DiyList
          ref="list"
          :listData="userList"
          @handleSelection="handleSelection"
          :title="'name'"
        ></DiyList>
      </div>
      <div class="diy-dialog-body--right">
        <div class="diy-dialog-body__title">
          已选择 {{ selectUserList.length }} 家单位
        </div>
        <div class="diy-dialog-body__list">
          <ul>
            <li v-for="(item, index) in selectUserList" :key="index">
              <div>
                {{ item.name }}
              </div>
              <div @click="handleRemove(item)">
                <i class="el-icon-circle-close"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleSave">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { simpleGroupTenantTree } from "@api/group";
import {
  getHasDestributedUserByAppRoleId,
  distributionGroupApp,
  distributeAppTenantList,
} from "@api/market";
import DiyList from "./TheSearchList";
import _ from "lodash";

export default {
  name: "TheAuthDialog",
  data() {
    let _this = this;
    return {
      loading: false,
      userList: [], //所有用户
      selectUserList: [], //当前选择用户
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
  },
  async created() {
    await this.loadUserList();
    this.$nextTick(() => {
      this.loadHasDistributedUserList();
    });
  },
  mounted() {
    this.loading = true;
  },
  computed: {},
  watch: {
    curTab: {
      handler(oldValue, newValue) {
        this.loadHasDistributedUserList();
      },
    },
  },
  methods: {
    ...mapActions("menu", ["updateAppMenu"]),
    /**保存分配*/
    handleSave() {
      let joindata = [];
      this.selectUserList.forEach((el) => {
        if (el.type === 2) joindata.push(el.tenantCode);
      });
      if (joindata.length === 0) {
        return this.$message.warning("请至少选择一个单位节点");
      }
      this.loading = true;
      joindata = this._.uniq(joindata);
      let params = {
        appId: this.$route.query.id,
        groupid: this.$route.query.groupId,
        dataList: joindata
      };
      distributionGroupApp(params)
        .then((res) => {
          this.$message.success({
            message: "分配完成",
            duriation: 700,
          });
          this.updateAppMenu();
          this.loading = false;
          this.$emit("updateList");
          this.handleClose();
        })
        .catch((error) => {
          this.loading = false;
          this.$emit("updateList");
          this.handleClose();
        });
    },

    //关闭对话框
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },

    /**获取集团下所有租户列表 */
    async loadUserList() {
      let params = {
        groupId: this.dialogShow.sendData.groupId,
      };
      await simpleGroupTenantTree(params).then((res) => {
        this.userList = res.data.data;
      });
      this.loading = false;
    },

    /**获取已分配租户列表 */
    loadHasDistributedUserList() {
      let params = {
        appId: this.$route.query.id,
        groupId: this.$route.query.groupId,
      };
      distributeAppTenantList(params).then((res) => {
        let list = res.data.data;
        let arr = _.map(list, "tenantCode");
        this.$refs.list.$refs.tree.setCheckedKeys(list,true);
        if (this._.isArray(list)) {
          list.forEach((el) => this.selectUserList.push(el));
        }
        this.loading = false;
      });
    },
    handleSelection(val) {
      this.selectUserList = val;
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

.tabs {
  width: 490px;
}

.diy-dialog-body {
  border: 1px solid rgba(235, 238, 245, 1);
  border-radius: 4px;
  justify-content: flex-start;
  margin-top: 20px;

  &--left,
  &--right {
    width: 50%;
    height: 350px;
    padding: 16px;
  }

  &--left {
    border-right: 1px solid rgba(235, 238, 245, 1);
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    line-height: 40px;
    color: rgba(48, 49, 51, 1);
  }

  &__list {
    height: 250px;
    margin-top: 20px;
    overflow-y: scroll;

    li {
      overflow: hidden;
      height: 26px;
      line-height: 26px;
      display: flex;
      justify-content: space-between;

      i {
        color: #c0c4cc;
        cursor: pointer;

        &:hover {
          color: #9da1a8;
        }
      }
    }
  }
}
</style>
