<template>
  <el-dialog
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
    center
    width="700px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
  >
    <span slot="title" class="diy-dialog-title"> 修改字段信息 </span>
    <div class="diy-dialog-body">
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
            placeholder="请输入字段名称"
          ></el-input>
          <el-input
            v-if="item.prop === 'title'"
            v-model="form.title"
            placeholder="请输入字段标识"
          ></el-input>
          <el-select
            v-if="item.prop === 'datatype'"
            v-model="form.datatype"
            placeholder="请选择字段类型"
          >
            <el-option
              v-for="item in dataTypeList"
              :key="item.id"
              :label="item.dictValue"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-input
            v-if="item.prop === 'length'"
            v-model="form.length"
            placeholder="请输入字段长度"
          ></el-input>
          <el-input
            v-if="item.prop === 'precision_'"
            v-model="form.precision_"
            placeholder="请输入字段精度"
          ></el-input>
          <el-select
            v-if="item.prop === 'dict_identfy'"
            v-model="form.dict_identfy"
            placeholder="请选择枚举字典"
          >
            <el-option
              v-for="item in dictList"
              :key="item.id"
              :label="item.dictValue"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="item.prop === 'mastertable'"
            v-model="form.mastertable"
            placeholder="请选择对应数据表"
          >
            <el-option
              v-for="item in masterTableList"
              :key="item.id"
              :label="item.dictValue"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-input
            v-if="item.prop === 't_order'"
            v-model.number="form.t_order"
            placeholder="请输入字段排序"
          ></el-input>
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
import { mapGetters } from "vuex";
import { updateField } from "@api/field";
import { getDictList, getDictItem } from "@api/dict";

export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "120px",
      },
      formItem: [
        {
          label: "字段名称",
          prop: "name",
        },
        {
          label: "字段标识",
          prop: "title",
        },
        {
          label: "字段类型",
          prop: "datatype",
        },
        {
          label: "字段排序",
          prop: "t_order",
        },
        {
          label: "字段长度",
          prop: "length",
        },
        {
          label: "字段精度",
          prop: "precision_",
        },
        {
          label: "枚举字典",
          prop: "dict_identfy",
        },
        {
          label: "对应数据表",
          prop: "mastertable",
        },
      ],
      form: {},
      rules: {
        name: [{ required: true, message: "请输入字段编号", trigger: "blur" }],
        datatype: [
          { required: true, message: "请选择字段类型", trigger: "blur" },
        ],
        title: [{ required: true, message: "请输入字段名称", trigger: "blur" }],
        t_order: [
          { required: true, message: "请输入字段排序", trigger: "blur" },
        ],
      },
      dataTypeList: [],
      dictList: [],
      masterTableList: [],
      loading: false,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  created() {
    this.form = this._.cloneDeep(this.dialogShow.sendData);
    this.loadDictList();
    this.loaddataTypeList();
    this.loadDataTableList();
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleClick() {
      this.loading = true;
      let params = this.form;
      updateField(params).then(
        (res) => {
          this.$emit("handleUpdate");
          this.$emit("closeDialog", this.dialogShow.key);
          this.loading = false;
          this.$message.success({
            message: "修改成功",
            duriation: 700,
          });
        },
        (err) => {
          this.loading = false;
        }
      );
    },
    /**
     * 获取所有枚举字典
     */
    loadDictList() {
      let params = {
        current: 1,
        size: 200,
        tenantCode: this.curTenantCode,
      };
      getDictList(params).then((res) => {
        let data = res.data.data;
        this.dictList = data.records;
      });
    },
    /**
     * 获取所有数据类型
     */
    loaddataTypeList() {
      let params = {
        parentid: 44,
        version: 1,
      };
      getDictItem(params).then((res) => {
        this.dataTypeList = res.data.data;
      });
    },
    /**
     * 获取所有数据表
     */
    loadDataTableList() {
      let params = {
        parentid: 41,
        version: 1,
      };
      getDictItem(params).then((res) => {
        this.masterTableList = res.data.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-body .el-form {
  justify-content: space-around;
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 20px;
}
</style>
