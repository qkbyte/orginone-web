<template>
  <div class="joinGroup">
    <el-dialog
      center
      width="400px"
      :visible.sync="dialogShow.value"
      :close-on-click-modal="false"
    >
      <span slot="title" class="diy-dialog-title"> 加入集团 </span>
      <div class="diy-dialog-body">
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item
            v-for="item in formItem"
            v-bind="item"
            :key="item.prop"
            :label-width="options.labelWidth"
          >
            <el-select
              v-if="item.prop === 'unitName'"
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
                v-for="item in unitList"
                :key="item.id"
                :label="item.groupName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="diy-dialog-footer">
        <el-button type="primary" @click="handleJoinGroup">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGroupListByFilter, tenantApplyGroup } from "@api/group";
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
          prop: "unitName",
        },
      ],
      options: {
        labelWidth: "100px",
      },
      form: {},
      rules: {
        unitName: [
          { required: true, message: "请输入集团名称", trigger: "blur" },
        ],
      },
      unitList: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters("tenant", ["curTenant"]),
  },
  methods: {
    async handleJoinGroup() {
      const groupId = this.form.id;
      if (groupId) {
        let params = {
          groupId: groupId,
          tenantId: this.curTenant.tenantId,
          flag: "101",
        };
        const res = await tenantApplyGroup(params);
        if (res.status == 200) {
          this.$message.success("申请成功，请等待审核");
          this.handleClose();
        }
      } else {
        this.$message.warning("请选择要加入的集团");
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
            this.unitList = res.data.data;
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
<style lang="scss">
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
</style>
