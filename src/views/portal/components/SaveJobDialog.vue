<template>
  <el-dialog
    center
    top="10vh"
    width="500px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <span slot="title" class="diy-dialog-title"> 按集团设为首页 </span>
    <div class="diy-dialog-body">
      <div v-if="!progressBar" style="display:flex;justify-content:center;align-content:center;width:100%">
        <el-select
          style="width:70%;margin-top:50px"
          v-model="selectJob"
          placeholder="请选择"
        >
          <el-option
            v-for="item in jobOption"
            :key="item.value"
            :label="item.name"
            :value="item.groupId"
          >
          </el-option>
        </el-select>
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
    </div>
    <span v-if="!progressBar" slot="footer" class="diy-dialog-footer" style="margin-top:30px">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
    <span v-else slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleCloseEnd">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { setGroupTenantDefaultTemplate } from "@api/home";
import { getImportProgress, getRemoveProgress } from "@api/user";
export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      form: {},
      selectJob: "",
      jobOption: [],
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
  mounted() {
    this.loadData();
  },
  computed: {
    ...mapGetters("group", ["groupCount", "dropGroupList", "curGroup"]),
  },
  methods: {
    handleCloseEnd(){
      this.handleClose()
      this.$router.push({ path: "/" });
    },
    loadData() {
      let arr = JSON.parse(JSON.stringify(this.dropGroupList))
      arr.unshift(this.curGroup)
      this.jobOption = arr
    },
    handleClick() {
      this.progressBar = true;
      let params = {
        templateId: this.dialogShow.sendData.id,
        groupId: this.selectJob,
      };
      setGroupTenantDefaultTemplate(params).then((res) => {
        console.log("res", res);
        if (res.data.code == 200) {
          this.myInterval = setInterval(() => {
            this.getImportProgress(res.data.data);
          }, 500);
        }
      });
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
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-body .el-form {
  justify-content: space-between;
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 20px;
}
.form-shape {
  width: 100%;
}
img {
  width: 200px;
  height: 200px;
}
.photoBtn {
  margin: 20px 0;
  .el-button,
  .el-button--default:focus {
    padding: 8px;
    font-size: 10px;
  }
}
</style>
