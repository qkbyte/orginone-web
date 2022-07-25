<template>
  <el-dialog
    center
    top="10vh"
    width="420px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <span slot="title" class="diy-dialog-title">
      {{ msg }}
    </span>
    <div class="diy-dialog-body">
      <el-select v-model="select" :placeholder="pmsg">
        <el-option
          v-for="item in options"
          :value="item.id"
          :key="item.index"
          :label="curTab === '1' ? item.groupName : item.propertiesName"
          >
        </el-option>
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
import { addUsersToAgency } from "@api/department";
import {
  getGroupTree,
  getGroupProperties,
  addDistributeProperties,
  updateFatherTenant,
  getOrgansList,
} from "@api/group";

export default {
  name: "TheEditDialog",
  data() {
    return {
      msg: "",
      pmsg: "",
      select: "",
      options: [],
      groupId: "",
      propertiesId: "",
      form: {},
      loading: false,
      current:1,
      size:20,
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
      this.msg = "调整组织";
      this.pmsg = "请选择组织";
      this.loadlistData();
    } else if (this.curTab === '2') {
      this.msg = "调整性质";
      this.pmsg = "请选择性质";
      this.loadlistData2();
    }
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
    ...mapGetters("group", ["curGroupId"]),
  },
  watch: {},
  methods: {
    handleClose() {
      this.$parent.closeDialog(this.dialogShow.key)
    },
    loadlistData() {
      let params = {
        groupId: this.curGroupId,
        current: this.current,
        size: this.size,
        name: this.name,
      };
      console.log('params', params);
      getOrgansList(params).then((res) => {
        console.log('res', res);
        this.options = res.data.data.records
      });
    },
    loadlistData2() {
      let params = {
        groupId: this.curGroupId,
      };
      getGroupProperties(params).then((res) => {
        this.options = res.data.data.records;
        console.log(res);
      });
    },
    handleClick() {
      if (this.select != "" && this.curTab === '1') {
        let _this = this;
        for (let i = 0; i < this.options.length; i++) {
          if (_this.options[i].groupName === _this.select) {
            _this.groupId = _this.options[i].id;
          }
        }
        let params = {
          sourceGroupId: this.curGroupId,
          tenantIds: this.dialogShow.sendData.tenantId,
          groupId: this.select,
        };
        this.loading = true;
        updateFatherTenant(params).then(
          (res) => {
            this.loading = false;
            this.$parent.loadData();
            this.$emit("closeDialog", this.dialogShow.key);
            this.$message.success({
              message: "调整成功",
              duriation: 700,
            });
          },
          (err) => {
            this.loading = false;
          }
        );
      } else if (this.select != "" && this.curTab === '2') {
        let params = {
          tenantIds: this.dialogShow.sendData.tenantId,
          propertiesId: this.select,
        };
        this.loading = true;
        addDistributeProperties(params).then(
          (res) => {
            this.loading = false;
            this.$parent.loadData();
            this.$emit("closeDialog", this.dialogShow.key);
            this.$message.success({
              message: "调整成功",
              duriation: 700,
            });
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
