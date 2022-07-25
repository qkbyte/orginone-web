<template>
  <el-dialog
    center
    top="10vh"
    width="680px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
  >
    <span slot="title" class="diy-dialog-title"> 创建集团 </span>
    <div class="diy-dialog-body">
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
          :style="item.style"
        >
          <el-input
            v-if="item.prop === 'groupName'"
            v-model="form.groupName"
            placeholder="请输入集团名称"
          ></el-input>
          <el-input
            v-if="item.prop === 'groupDescription'"
            v-model="form.groupDescription"
            placeholder="请输入集团描述"
          ></el-input>
          <el-input
            v-if="item.prop === 'groupCode'"
            v-model="form.groupCode"
            placeholder="请输入集团编码"
          ></el-input>
          <div v-if="item.prop === 'shape'">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="deep" label="层级" width="100">
              </el-table-column>
              <el-table-column
                prop="number"
                label="最大宽度"
                width="320"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.number"
                    size="small"
                    :min="3"
                    :max="10"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column align="right">
                <template slot="header">
                  <el-button @click="handleAddDeep()" size="mini"
                    >新增层级</el-button
                  >
                </template>
                <template slot-scope="scope">
                  <el-button
                    v-if="
                      tableData.length > 4 &&
                        scope.row.deep === tableData.length
                    "
                    type="text"
                    @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createGroup } from "@api/group";

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
          label: "集团编码",
          prop: "groupCode",
        },
        {
          label: "编码规则",
          prop: "shape",
          style: "width:100%",
        },
      ],
      form: {},
      rules: {
        groupName: [
          { required: true, message: "集团名称不能为空", trigger: "blur" },
        ],
        groupDescription: [
          { required: true, message: "集团描述不能为空", trigger: "blur" },
          { max: 150, message: "最多150个字符", trigger: "blur" },
        ],
        groupCode: [
          { required: true, message: "集团标识不能为空", trigger: "blur" },
        ],
      },
      tableData: [{ deep: 1, number: 3 },{ deep: 2, number: 3 },{ deep: 3, number: 3 },{ deep: 4, number: 3 }],
      loading: false,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.form = {
      groupName: "",
      groupDescription: "",
      shape: "",
      groupCode: "",
    };
  },
  computed: {},
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleClick() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return this.$message.error("请输入正确信息");
        }
        this.loading = true;
        let params = this.form;
        params.shape = this.tableData
          .map((obj) => {
            return obj.number;
          })
          .join(",");
        createGroup(params).then(
          (res) => {
            //ATODO 如果是租户已经是集团租户，则handleUpdate；反之，reload更新菜单
            this.$emit("handleUpdate");
            this.$emit("closeDialog", this.dialogShow.key);
            this.loading = false;
            this.$message.success("创建成功");
            location.reload();
          },
          (err) => {
            this.loading = false;
          }
        );
      });
    },
    /**
     * 增加集团深度
     */
    handleAddDeep() {
      this.tableData.push({ deep: this.tableData.length + 1, number: 3 });
    },
    handleDelete(index, row) {
      this.tableData.splice(this.tableData.length - 1, 1);
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
::v-deep .el-dialog__body {
  overflow: auto;
}
.diy-dialog-body {
  justify-content: space-between;
  .el-form {
    justify-content: space-between;
    .el-input {
      width: 250px;
    }
  }
}
</style>
<style lang="scss" scoped>
.body-container ::v-deep .el-form {
  .el-cascader,
  .el-input {
    width: 350px;
  }
}
::v-deep .el-textarea__inner {
  height: 200px;
}
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
::v-deep .el-dialog__body {
  height: 556px;
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
    margin-top: 10px;
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
    width: 50%;
    padding: 16px;
    border: 1px solid rgba(235, 238, 245, 1);
  }
}
.layout-role {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(235, 238, 245, 1);
}
.diy-dialog-body {
  border: 1px solid rgba(235, 238, 245, 1);
  display: flex;
  flex-direction: column;
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

