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

      <div class="layout-role">
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="item in roleList"
            :key="item.id"
            :label="item.id"
            >{{ item.roleName }}</el-checkbox
          >
        </el-checkbox-group>
      </div>

      <div class="diy-dialog-box__radio" style="width:100%;margin-top:20px">
        <TheRadio
          ref="radio"
          :tabs="tabs"
          @radioChange="radioChange"
        ></TheRadio>
      </div>
      <div class="diy-dialog-box-treeBox" style="width:100%">
        <div class="diy-dialog-box-left">
          <DiyList
            ref="diyList"
            @handleSelection="handleSelection"
            :radio="radio"
            :title="'name'"
          ></DiyList>
        </div>
        <div class="diy-dialog-box-right">
          <TheCheckTree ref="tree" :selectList="selectOneList"></TheCheckTree>
        </div>
      </div>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick('form')">确 定</el-button>
      <el-button @click="handleClose('cancel')">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { omitDeepLodash } from "@utils/index";
import { getRoleListByTenantId } from "@api/role";
import { marketappnoticeSubmit } from "@api/market";
import { getDictItemList } from "@utils/index";
import TheRadio from "./TheRadio";
import DiyList from "./TheSearchList";
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
          prop: "roleName",
          style: "width:100%",
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
      selectTwoList: [], // 存储此数据中所有集团所选择的单位
      radio: 1,
      tabs: 0,
      roleList: [],
      checkList: [],
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
    this.$set(this.form, "noticeType", this.form.noticeUnitIds[0].type);
    this.announceType = await getDictItemList(this.dict.ANNOUNCE_TYPE);
    this.loadCheckbox();
    this.$nextTick(() => {
      let id = [];
      let unitArr = [];
      this.form.noticeUnitIds.forEach((el) => {
        if (el.groupId == this.curGroupId) {
          id = [...id, el.id];
          unitArr = [...unitArr, el];
        }
      });
      this.$refs.diyList.$refs.tree.setCheckedKeys(id);
      this.selectTwoList = this.form.noticeUnitIds;
      if (unitArr.length !== 0) {
        this.selectOneList = unitArr;
        console.log("select", this.selectOneList);
        this.$refs.tree.selectedList = unitArr;
        this.form.noticeType = unitArr[0].type;
      }
      this.form.noticeRoleIds.forEach((el) => {
        this.checkList.push(el.id);
      });
    });
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenantId"]),
    ...mapGetters("group", ["curGroupId"]),
  },
  methods: {
    async loadCheckbox() {
      let params = {
        tenantCode: "",
      };
      const res = await getRoleListByTenantId(params);
      let arr = res.data.data;
      arr.forEach((el) => {
        if (
          el.roleName == "集团管理员" ||
          el.roleName == "单位管理员" ||
          el.roleName == "普通用户" ||
          el.roleName == "平台超级管理员"
        ) {
          this.roleList.push(el);
        }
      });
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
        if (this.checkList.length !== 0) {
          let check = [];
          this.checkList.forEach((el) => {
            check.push({ id: el });
          });
          let unit = [];
          this.selectTwoList = Array.from(
            new Set(this.selectTwoList.concat(this.selectOneList))
          );
          this.selectTwoList.forEach((el) => {
            unit.push({
              groupId: el.groupId ? el.groupId : this.curGroupId,
              check: el.check ? el.check : el.radio,
              id: el.id,
              label: el.label,
              name: el.name,
              type: this.form.noticeType,
              groupOrUnit: el.type,
            });
          });
          let params = {
            id: this.form.id,
            groupOrUnit: 1,
            noticeTitle: this.form.noticeTitle,
            noticeContent: this.form.noticeContent,
            noticeRoleIds: JSON.stringify(check),
            noticeReleaseStatus: this.form.noticeReleaseStatus,
            noticeReleaseUnitId: this.userId,
            noticeUnitIds: JSON.stringify(unit),
          };
          marketappnoticeSubmit(params).then((res) => {
            this.$message.success("编辑成功");
            this.$parent.loadData();
            this.handleClose();
          });
        } else {
          this.$message.warning("请选择发布角色");
        }
      });
    },
    // radio 改变方法
    radioChange(val) {
      this.radio = val;
    },
    handleSelection(val, select) {
      console.log("select", select);
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
</style>

<style lang="scss" scoped>
.body-container ::v-deep .el-form {
  .el-cascader,
  .el-input {
    width: 280px;
  }
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
::v-deep .el-dialog__body {
  height: 712px;
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
