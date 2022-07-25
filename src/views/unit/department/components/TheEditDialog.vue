<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
    center
    top="10vh"
    width="420px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title">
      {{ msg }}
    </span>
    <div class="diy-dialog-body">
      <el-select v-model="select" :placeholder="pmsg">
        <el-option
          v-for="item in options"
          :key="item.index"
          :value="curTab === '1' ? item.agencyName : item.jobName"
          >{{ curTab === '1' ? item.agencyName : item.jobName }}</el-option
        >
      </el-select>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { getDepartmentTree, addUsersToAgency } from "@api/department";
import { getPositionList } from "@api/position";
import { addJobsToUsers } from "@api/user";

export default {
  name: "TheEditDialog",
  data() {
    return {
      msg: "",
      pmsg: "",
      select: "",
      options: [],
      agencyId: "",
      form: {},
      loading: false,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
    curTab: {
      type: String,
    },
  },
  created() {
    this.form = this._.cloneDeep(this.dialogShow.sendData);
    if (this.curTab === '1') {
      this.msg = "调整部门";
      this.pmsg = "请选择部门";
      this.loadlistData();
    } else if (this.curTab === '2') {
      this.msg = "调整岗位";
      this.pmsg = "请选择岗位";
      this.loadlistData2();
    }
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  watch: {},
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
      this.dialogShow.value=false;
    },
    loadlistData() {
      let params = {
        tenantCode: this.curTenantCode,
      };
      getDepartmentTree(params).then((res) => {
        let resList = res.data.data[0].children;
        this.getOptions(resList)
      });
    },
    getOptions(data){
      for (let i = 0; i < data.length; i++) {
        if(data[i].children.length !== 0){
          this.getOptions(data[i].children)
        }else{
          this.options.push(data[i])
        }
      }
    },
    loadlistData2() {
      let params = {
        tenantCode: this.curTenantCode,
      };
      getPositionList(params).then((res) => {
        this.options = res.data.data.records;
      });
    },
    handleClick() {
      if (this.select != "" && this.curTab === '1') {
        let _this = this;
        for (let i = 0; i < this.options.length; i++) {
          if (_this.options[i].agencyName === _this.select) {
            _this.agencyId = _this.options[i].id;
          }
        }
        let params = {
          userIds: this.dialogShow.sendData.id,
          agencyId: this.agencyId,
          oldagencyId:this.$parent.$parent.$parent.curDept
        };
        this.loading = true;
        addUsersToAgency(params).then(
          (res) => {
            this.loading = false;
           // debugger;
           this.$parent.$parent.$parent.handleUpdateUserList();
          //  this.$parent.handleUpdateUserList();
            this.$emit("closeDialog", this.dialogShow.key);
            this.$message.success({
              message: "更新成功",
              duriation: 700,
            });
            this.dialogShow.value=false;
          },
          (err) => {
            this.loading = false;
          }
        );
      } else if (this.select != "" && this.curTab === '2') {
        let _this = this;
        for (let i = 0; i < this.options.length; i++) {
          if (_this.options[i].jobName === _this.select) {
            _this.agencyId = _this.options[i].id;
          }
        }
        let params = {
          userIds: this.dialogShow.sendData.id,
          jobIds: this.agencyId,
        };
        this.loading = true;
        addJobsToUsers(params).then(
          (res) => {
            this.loading = false;
          //  this.$parent.handleUpdateUserList();
          this.$parent.$parent.$parent.handleUpdateUserList();
            this.$emit("closeDialog", this.dialogShow.key);
            this.$message.success({
              message: "更新成功",
              duriation: 700,
            });
          this.dialogShow.value=false;
          },
          (err) => {
            this.loading = false;
          }
        );
      } else {
        this.$message.error("选项不能为空");
      }
      
    },
    
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
</style>

<style lang="scss">
.diy-dialog-body {
  .el-select {
    width: 100%;
  }
}
</style>
