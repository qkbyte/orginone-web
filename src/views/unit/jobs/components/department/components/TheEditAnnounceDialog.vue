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
    <span slot="title" class="diy-dialog-title"> 编辑公告 </span>
    <div class="body-container diy-dialog-body">
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-input
            v-if="item.prop === 'noticeTitle'"
            v-model="form.noticeTitle"
            placeholder="请输入标题"
          ></el-input>
          <el-select
            v-if="item.prop === 'noticeType'"
            v-model="form.noticeType"
            placeholder="请选择公告类型"
          >
            <el-option
              v-for="item in announceType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-if="item.prop === 'noticeContent'"
            style="width:100%"
            type="textarea"
            maxlength="400"
            show-word-limit
            v-model="form.noticeContent"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- <div class="layout-role">
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="item in roleList"
            :key="item.id"
            :label="item.id"
            >{{ item.roleName }}</el-checkbox
          >
        </el-checkbox-group>
      </div>

      <div class="diy-dialog-box-treeBox" style="width:100%">
        <DiyList
          ref="diyList"
          @handleSelection="handleSelection"
          :radio="radio"
          :title="'name'"
          :dialogShow="dialogList"
        ></DiyList>
      </div> -->
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick('form')">确 定</el-button>
      <el-button @click="handleClose('cancel')">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters,mapState } from "vuex";
import { omitDeepLodash } from "@utils/index";
import { getRoleListByTenantId } from "@api/role";
import { marketappnoticeSubmit, getAppInfo } from "@api/market";
import { getDictItemList } from "@utils/index";
import TheRadio from "./TheRadio";
import DiyList from "./TheAuthList";
import roleList from "./TheRoleList";
import TheCheckTree from "./TheCheckTree";

import {
  createGroup,
  getGroupTree,
  getAllTenantListFromGroup,
} from "@api/group";

export default {
  name: "TheAppDialog",
  components: {
    TheRadio,
    DiyList,
    TheCheckTree,
    roleList,
  },
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "标题",
          prop: "noticeTitle",
        },
        {
          label: "公告类型",
          prop: "noticeType",
        },
        {
          label: "内容",
          prop: "noticeContent",
          style: "width:100%",
        },
      ],
      form: {},
      rules: {
        noticeTitle: [
          { required: true, message: "请输入标题", trigger: "blur" },
        ],
        noticeType: [
          { required: true, message: "请选择公告类型", trigger: "change" },
        ],
        noticeContent: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
      },
      groupTree: [],
      unitList: [],
      loading: false,
      current: 1,
      searchName: "",
      selectOneList: [], // 包含节点选择用户
      radio: 1,
      tabs: 0,
      roleList: [],
      checkList: [],
      dialogList: {},
      announceType: [],
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  created() {},
  async mounted() {
    this.form = JSON.parse(JSON.stringify(this.dialogShow.sendData));
    this.form.noticeRoleIds = JSON.parse(this.form.noticeRoleIds);
    this.$set(this.form,"noticeType",this.form.noticeUnitIds[0].type)
    // this.form.noticeType = this.form.noticeUnitIds[0].type;
    this.announceType = await getDictItemList(this.dict.ANNOUNCE_TYPE);
    this.loadCheckbox();
  },
  computed: {
    ...mapState("user", ["userId"]),
    ...mapGetters("tenant", ["curTenantCode", "curTenantId"]),
    ...mapGetters("group", ["curGroupId"]),
  },
  methods: {
    async loadCheckbox() {
      let params = {
        tenantCode: "",
      };
      const res = await getRoleListByTenantId(params);
      this.roleList = res.data.data;
    },
    filter(val) {
      this.searchName = val;
      this.unitList = [];
      this.loadUnitList();
    },
    incomLoadmore() {
      this.current++;
      this.loadUnitList();
    },
    handleClose(data) {
      this.$emit("closeDialog", this.dialogShow.key, data);
    },
    handleClick(ruleForm) {
      this.$refs[ruleForm].validate().then(() => {
        let arr = [];
        this.roleList.forEach((el) => {
          arr.push({id:el.id});
        });
        let unitId = [{ type: this.form.noticeType }];
        let params = {
          groupOrUnit: 2,
          id: this.form.id,
          noticeTitle: this.form.noticeTitle,
          noticeContent: this.form.noticeContent,
          noticeUnitIds: JSON.stringify(unitId),
          noticeRoleIds: JSON.stringify(arr),
          noticeReleaseStatus: this.form.noticeReleaseStatus,
          noticeReleaseUnitId: this.userId,
        };
        marketappnoticeSubmit(params).then((res) => {
          this.$message.success("编辑成功");
          this.$parent.loadData();
          this.handleClose();
        });
      });
    },
    // radio 改变方法
    radioChange(val) {
      this.radio = val;
    },
    handleSelection(val, select) {
      this.selectOneList = select;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-select {
  width: 100% !important;
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
.diy-dialog-footer .el-button:first-child {
  margin-right: 10px;
}
.body-container {
  margin-top: 10px;

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 30px;
    color: rgba(48, 49, 51, 1);
  }
}
.body-item {
  margin-top: 10px;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-main {
    width: 100%;
    margin-top: 10px;
  }

  .diy-table {
    padding: 0;
  }
}
::v-deep .el-dialog__body {
  overflow: auto;
}
.diy-dialog-body {
  justify-content: space-between;
  .el-form {
    justify-content: space-between;
    .el-input {
      width: 150px;
    }
  }
}
</style>

<style lang="scss" scoped>
.body-container ::v-deep .el-form {
  .el-cascader,
  .el-input {
    width: 280px;
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

<style lang="scss" scoped>
.body-container ::v-deep .el-form {
  .el-cascader,
  .el-input {
    width: 250px;
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
