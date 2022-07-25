<template>
  <el-dialog
    center
    top="10vh"
    width="700px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <span slot="title" class="diy-dialog-title"> 分配单位 </span>
    <div class=" body-item">
      <div class="body-item-main">
        <TheUserTransfer ref="userTransfer" :sendData="dialogShow.sendData"></TheUserTransfer>
      </div>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { omitDeepLodash } from "@utils/index";
import { addDepartment } from "@api/department";
import { distributeTenantToGroup } from "@api/group";
import TheUserTransfer from "./TheUserTransfer";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "集团名称",
          prop: "groupName",
        },
        {
          label: "集团描述",
          prop: "groupDescription",
        },
        {
          label: "上级集团",
          prop: "groupId",
        },
        {
          label: "管理单位",
          prop: "tenantCode",
        },
      ],
      form: {},
      rules: {
        groupName: [
          { required: true, message: "请输入集团名称", trigger: "blur" },
        ],
        groupId: [
          { required: true, message: "请选择上级集团", trigger: "blur" },
        ],
        tenantCode: [
          { required: true, message: "请选择管理单位", trigger: "blur" },
        ],
      },
      groupTree: [],
      unitList: [],
      loading: false,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  components: { TheUserTransfer },
  created() {},
  computed: {
    ...mapGetters("group", ["curGroupId"])
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key,'close');
    },
    handleClick() {
      this.loading = true;
      let params = {
        sourceGroupId: this.curGroupId,
        groupId: this.dialogShow.sendData.id,
        tenantIds: this.$refs.userTransfer.$children[0].value.join(","),
      };
      distributeTenantToGroup(params).then(
        async (res) => {
          this.loading = false;
          this.$emit("closeDialog", this.dialogShow.key);
          this.$message.success({
            message: "分配成功",
            duriation: 700,
          });
        },
        (err) => {
          this.loading = false;
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body{
  padding: 10px 40px;
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 10px;
}

.body-item {
  margin-top: 10px;

  &-main {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 10px;
  }
}
::v-deep .el-dialog__body {
  overflow: auto;
   height: 420px;
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
