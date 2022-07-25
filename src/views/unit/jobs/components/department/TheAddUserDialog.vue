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
    <span slot="title" class="diy-dialog-title"> 新增人员 </span>
    <div class="body-container diy-dialog-body">
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-input
            v-if="item.prop === 'name'"
            v-model="form.name"
            placeholder="请输入人员名称"
          ></el-input>
          <el-input
            v-if="item.prop === 'userCode'"
            v-model="form.userCode"
            placeholder="请输入人员编码"
          ></el-input>
          <el-input
            v-if="item.prop === 'phone'"
            v-model="form.phone"
            placeholder="请输入手机号"
          ></el-input>
          <el-select
            v-if="item.prop === 'role'"
            v-model="form.role"
            placeholder="请选择人员角色"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :value="item.roleName"
            >
            </el-option>
          </el-select>
          <el-transfer
            v-if="item.prop === 'depart'"
            :titles="['已有部门', '所选部门']"
            :props="props"
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入部门名"
            v-model="departValue"
            :data="departList"
          >
          </el-transfer>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick('form')">确 定</el-button>
      <el-button @click="handleClose('cancel')">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { getRoleListByTenantId } from "@api/role";
import { marketappnoticeSubmit, getAppInfo } from "@api/market";
import { getUserCode } from "@api/user";
import { getDictItemList } from "@utils/index";
import { addPerson, getDepartmentList } from "@api/department";
import { parse } from 'path-to-regexp';
export default {
  name: "TheAppDialog",
  components: {},
  data() {
    var validatePass = (rule, value, callback) => {
      const phoneReg = /^1|0[3|4|5|7|8|9][0-9]{9}$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 100);
    };
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "人员名称",
          prop: "name",
        },
        {
          label: "人员编码",
          prop: "userCode",
        },
        {
          label: "手机号",
          prop: "phone",
        },
        {
          label: "角色",
          prop: "role",
        },
        {
          label: "部门",
          prop: "depart",
          style: "width:100%",
        },
      ],
      form: {},
      rules: {
        name: [{ required: true, message: "请输入人员名称", trigger: "blur" }],
        userCode:[{ required: true, message: "请输入人员编码", trigger: "blur" }],
        phone: [{ required: true, validator: validatePass, trigger: "blur" }],
        role: [
          { required: true, message: "请选择人员角色", trigger: "change" },
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
      deptTree: [],
      isShow: false,
      deptId: 0,
      deptList: [],
      departList: [], // 部门列表
      departValue: [],
      current: 1,
      size: 999999999,
      fuzzyVal: "",
      props:{
        key:"id",
        label:"agencyName"
      }
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.headName = this.curTenant.name.substr(0, 1);
  },
  mounted() {
    this.getUserCode();
    this.getDepartData();
    this.loadRoleList();
  },
  computed: {
    ...mapState("user", ["userId"]),
    ...mapGetters("tenant", ["curTenantCode", "curTenantId", "curTenant"]),
  },
  methods: {
    getUserCode(){
      let params = {
        tenantCode: this.curTenantCode
      }
      getUserCode(params).then((res)=>{
        this.$set(this.form,"userCode", res.data.data)
      })
    },
    //据关键字筛选部门树
    filterMethod(value, data) {
      if (!value) return true;
      return data.agencyName.indexOf(value) !== -1;
    },
    handleClickTree(data, node, obj) {
      this.deptId = data.id;
    },
    // 获取所有部门列表
    getDepartData() {
      let params = {
        current: this.current,
        size: this.size,
        tenantCode: this.curTenantCode,
        fuzzyVal: this.fuzzyVal,
      };
      getDepartmentList(params).then((res) => {
        console.log("res", res);
        this.departList = res.data.data.records;
      });
    },
    loadRoleList() {
      let params = {
        tenantCode: this.curTenantCode,
      };
      getRoleListByTenantId(params).then((res) => {
        this.roleList = res.data.data;
        console.log("roleList", this.roleList);
      });
    },
    handleClose(data) {
      this.$emit("closeDialog", this.dialogShow.key, data);
    },
    handleClick(ruleForm) {
      this.$refs[ruleForm].validate().then(() => {
        let id;
        let _this = this;
        for (let i = 0; i < this.roleList.length; i++) {
          if (this.form.role === _this.roleList[i].roleName) {
            id = _this.roleList[i].id;
            break;
          }
        }
        let params = {
          tenantCode: this.curTenantCode,
          name: this.form.name,
          phone: this.form.phone,
          userCode: this.form.userCode,
          role:  id,
          depart: this.departValue,
        };
        console.log('params',params);
        addPerson(params).then((res) => {
          this.$message.success("添加人员成功");
          this.$parent.loadData();
          this.$emit("closeDialog", this.dialogShow.key);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  overflow: auto;
}
::v-deep .el-transfer-panel {
  width: 270px;
}
::v-deep .el-transfer-panel__filter {
  width: 245px !important;
}
.diy-dialog-body {
  justify-content: space-between;
  .el-form {
    justify-content: space-between;
    .el-input {
      width: 300px;
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

.node-model__list {
  font-size: 16px;
  margin-left: 10px;
  padding-left: 40px;
  padding: 10px;
  cursor: pointer;
}
.node-model__click {
  background: rgb(236, 241, 252);
}
.node-model__list:hover {
  background: rgb(236, 241, 252);
}
::v-deep .el-tree {
  background: rgba(0, 0, 0, 0);
  font-size: 16px;
}
::v-deep .el-tree-node {
  // margin-top: 8px;
  padding: 4px 0;
}
::v-deep .el-tree-node__content {
  height: 30px;
}
::v-deep .el-tree .is-current {
  color: rgb(62, 120, 255);
}
.headLayout-avatar_img {
  width: 20px;
  height: 20px;
  background: #154ad8;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  margin-right: 5px;
  color: #ffffff;
}
.headLayout-avatar_img2 {
  width: 30px;
  height: 30px;
  background: #154ad8;
  margin-top: 10px;
  margin-left: 10px;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  font-size: 15px;
  color: #ffffff;
  margin-left: 60px;
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
::v-deep .el-input__inner {
  border: 0;
  background-color: rgb(250, 250, 252);
}
::v-deep .el-dialog {
  transform: translate(-20%);
}
.el-icon-search {
  font-size: 20px;
  margin-top: 10px;
}
.flex-row {
  width: 80%;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid rgb(215, 218, 224);
}
.diy-dialog-depart {
  display: flex;
  flex-direction: row;
  &__text {
    font-size: 15px;
    margin: 16px 0 0 20px;
  }
}
.search-list {
  &__search {
    margin-right: 40px;
  }
}
.diy-dialog-body {
  &__row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  &__center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__radio {
    margin-left: 30px;
    margin-top: 15px;
  }
  &__treeBox {
    margin-top: 10px;
  }
  &__tree {
    margin-top: 20px;
    background-color: rgb(250, 250, 252);
    overflow: auto;
    width: 100%;
    height: 430px;
  }
}
</style>
<style lang="scss" scoped>
.body-container ::v-deep .el-form {
  .el-cascader,
  .el-input {
    width: 300px;
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
  transform: translate(-65%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
</style>