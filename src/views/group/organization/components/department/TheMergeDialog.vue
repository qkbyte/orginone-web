<template>
  <div class="joinGroup">
    <el-dialog
      center
      width="500px"
      :visible.sync="dialogShow.value"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <span slot="title" class="diy-dialog-title"> 合并集团 </span>
      <div v-if="!isShow" class="diy-dialog-body" :style="celHeight">
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item
            v-for="item in formItem"
            v-bind="item"
            :key="item.prop"
            :label-width="options.labelWidth"
          >
            <el-select
              v-if="item.prop === 'groupName'"
              v-model="form.id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入集团名称"
              :remote-method="remoteMethod"
              :loading="loading"
              style="width:100%"
            >
              <el-option
                v-for="item in groupList"
                :key="item.id"
                :label="item.groupName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span v-if="!isShow" slot="footer" class="diy-dialog-footer">
        <el-button type="primary" @click="handleJoinGroup">合并集团</el-button>
      </span>
      <div v-else class="diy-dialog-body" :style="celHeight">
        <el-progress
          ref="progress"
          type="circle"
          :width="200"
          :stroke-width="5"
          :percentage="percentage"
          :status="status"
        ></el-progress>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGroupListByFilter,
  groupApplyGroup,
  realGroupMerge,
} from "@api/group";
import { getImportProgress, getRemoveProgress } from "@api/user";
import { mapGetters } from "vuex";
export default {
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formItem: [
        {
          label: "集团名称",
          prop: "groupName",
        },
      ],
      options: {
        labelWidth: "100px",
      },
      form: {},
      rules: {
        groupName: [
          { required: true, message: "请输入集团名称", trigger: "blur" },
        ],
      },
      groupList: [],
      loading: false,
      isShow: false,
      myInterval: null,
      percentage: 0,
      progressId: 0,
      status: undefined,
      celHeight: "height: 200px",
    };
  },
  computed: {
    ...mapGetters("group", ["curGroupId"]),
  },
  beforeDestroy() {
    this.destroyedProgress();
  },
  methods: {
    async handleJoinGroup() {
      const groupId = this.form.id;
      console.log(groupId);
      if (typeof groupId == 'undefined') {
        this.$message.warning("请选择集团");
      } else {
        let params = {
          sourceGroupId: this.curGroupId,
          parentGroupId: this.dialogShow.sendData.id,
          sonGroupId: groupId,
        };
        let res = await realGroupMerge(params);
        this.isShow = true;
        this.celHeight = "height:300px";
        this.myInterval = setInterval(() => {
          this.getImportProgress(res);
        }, 500);
      }
    },
    getImportProgress(val) {
      this.progressId = val.data.data;
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
    closeDialog() {
      if (this.isShow) {
        this.$emit("closeDialog", this.dialogShow.key);
      }
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          let params = {
            groupName: query,
          };
          getGroupListByFilter(params).then((res) => {
            this.groupList = res.data.data;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    handleClose() {
      this.dialogShow.value = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.joinGroup {
  .dialogTitle {
    height: 28px;
    font-size: 20px;
    font-family: ".PingFang SC";
    font-weight: 600;
    line-height: 28px;
    color: rgba(48, 49, 51, 1);
    opacity: 1;
    text-align: center;
  }
  .el-dialog__body {
    padding: 0;
  }
}
.diy-dialog-body {
  display: flex;
  justify-content: center;
  align-items: center;
}
.diy-dialog-body .el-form {
  height: unset;
}
.progress-box {
  margin-left: 35%;
  transform: translate(-50%);
}
</style>
