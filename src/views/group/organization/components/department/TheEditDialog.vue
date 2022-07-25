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
    <span slot="title" class="diy-dialog-title"> 修改节点 </span>
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
            placeholder="请输入节点名称"
          ></el-input>
          <el-input
            v-if="item.prop === 'groupDescription'"
            v-model="form.groupDescription"
            placeholder="请输入节点描述"
          ></el-input>
          <el-input
            v-if="item.prop === 'socialCreditCode'"
            v-model="form.socialCreditCode"
            placeholder="请输入社会信用统一代码"
          ></el-input>
          <el-cascader
            v-if="item.prop === 'parentId'"
            v-model="form.parentId"
            :options="groupTree"
            :show-all-levels="false"
            :disabled="isRoot"
            :props="{
              label: 'groupName',
              value: 'id',
              emitPath: false,
              expandTrigger: 'hover',
              checkStrictly: true,
            }"
            placeholder="请选择上级节点"
          >
          </el-cascader>
          <el-select
            v-if="item.prop === 'tenantCode'"
            :disabled="isRoot"
            v-model="form.tenantCode"
            @focus="loadUnitList('focus')"
            filterable
            :filter-method="filterSearch"
            placeholder="请选择"
            v-loadmore="incomLoadmore"
            :no-match-text="'杭州聚秀'"
          >
            <el-option
              v-for="item in unitList"
              :key="item.value"
              :label="item.unitName"
              :value="item.tenantCode"
            >
              <span>{{ item.unitName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="diy-dialog-footer">
      <el-button type="primary" @click="handleClick">确 定</el-button>
      <el-button @click="handleCloseDialog">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { omitDeepLodash } from "@utils/index";
import { addDepartment } from "@api/department";
import {
  createGroup,
  getAllTenantListFromGroup,
  modifyGroupInformation,
  updateFatherGroup,
  getUpGroupTree,
} from "@api/group";
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
          label: "节点名称",
          prop: "name",
        },
        {
          label: "节点描述",
          prop: "groupDescription",
        },
        {
          label: "上级节点",
          prop: "parentId",
        },
        {
          label: "管理单位",
          prop: "tenantCode",
        },
        {
          label: "社会信用统一代码",
          prop: "socialCreditCode"
        }
      ],
      form: {},
      rules: {
        groupName: [
          { required: true, message: "请输入节点名称", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "请选择上级节点", trigger: "blur" },
        ],
        tenantCode: [
          { required: true, message: "请选择管理单位", trigger: "blur" },
        ],
      },
      groupTree: [],
      unitList: [],
      loading: false,
      isRoot: false,
      current: 1,
      searchList: "",
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  components: { TheUserTransfer },
  created() {
    this.form = this._.cloneDeep(this.dialogShow.sendData);
    if (this.form.parentId === -1 || typeof this.form.parentId == "undefined") {
      this.isRoot = true;
      delete this.rules.parentId;
      delete this.rules.tenantCode;
    }
    this.loadGroupTree();
  },
  mounted() {
    this.unitList.push({
      unitName: this.form.unitName,
      tenantCode: this.form.tenantCode,
    });
  },
  computed: {
    ...mapGetters("group", ["curGroupId"]),
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  watch: {
    searchList(val) {
      this.current = 1;
    },
  },
  methods: {
    ...mapActions("group", ["changeGroupList"]),
    handleCloseDialog() {
      this.$parent.dialogShow.map((el) => {
        if (el.key === "edit") {
          el.value = false;
        }
      });
    },
    filterSearch(val, str) {
      this.form.tenantCode = val;
      this.searchList = val;
      let params = {
        current: 1,
        size: 10,
        groupId: this.curGroupId,
        name: val,
      };
      getAllTenantListFromGroup(params).then((res) => {
        this.unitList = res.data.data.records;
      });
    },
    incomLoadmore() {
      this.current++;
      this.loadUnitList("scroll");
    },
    loadGroupTree() {
      let params = {
        groupId: this.form.id,
        sourceGroupId: this.curGroupId,
      };
      getUpGroupTree(params).then((res) => {
        const data = res.data.data;
        this.groupTree = omitDeepLodash(data, ["children"]);
      });
    },
    loadUnitList(val) {
      if (val == "focus") {
        this.current = 1;
        this.unitList = [];
        this.searchList = "";
      }
      let params = {
        current: this.current,
        size: 10,
        groupId: this.curGroupId,
        name: this.searchList,
      };
      getAllTenantListFromGroup(params).then((res) => {
        this.unitList = this.unitList.concat(res.data.data.records);
      });
    },
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    async handleClick() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return this.$message.warning("请填写正确信息");
        }
        this.loading = true;
        let data = this.form;
        let params = {
          groupName: data.name,
          parentGroupId: data.parentId,
          sonGroupId: data.id,
          tenantCode: data.tenantCode,
          groupDescription: data.groupDescription,
          socialCreditCode:data.socialCreditCode,
        };
        try {
          await modifyGroupInformation(params).then((res) => {
            this.$parent.parent = data.parentId;
            this.$message.success("修改节点信息成功");
            if (
              this.form.parentId === -1 ||
              typeof this.form.parentId == "undefined"
            ) {
              this.changeGroupList(data.name);
            }
            this.handleClose();
            this.loading = false;
          });
        } catch (error) {
          this.handleClose();
          this.loading = false;
        }
      });
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
}
</style>

<style lang="scss" scoped>
.body-container ::v-deep .el-form {
  .el-cascader,
  .el-input {
    width: 280px;
  }
}
::v-deep .el-dialog__body {
  overflow: auto;
  height: 260px;
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
