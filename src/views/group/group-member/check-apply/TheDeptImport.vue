<template>
  <DiyImport
    :tableName="tableName"
    :tableHead="tableHead"
    uploadUrl="/dev-api/asset-system/async/importTenantRelation"
    :importData="importData"
    @handleUpdate="loadData"
    @handleView="loadData"
    @handleImport="handleImport"
    @handleDownloadModel="handleModel"
  >
  <div slot="radio">
    <div class="slot-box">
      <span>导入类型：</span>
      <el-radio v-model="radio" label="1">增加</el-radio>
      <el-radio v-model="radio" label="2">覆盖</el-radio>
    </div>
  </div>
  </DiyImport>
</template>

<script>
import DiyImport from "@components/DiyImport/index";
import { mapGetters } from "vuex";
import {
  getTenantImportHistory,
  importOptionDepartment,
  getOptionDeptModel,
} from "@api/organization";

export default {
  data() {
    return {
      tableName: "集团单位导入记录",
      tableHead: [
        {
          prop: "fileName",
          label: "文件名",
          width: "240",
        },
        {
          prop: "createTime",
          label: "开始时间",
          width: "220",
        },
        {
          prop: "endTime",
          label: "结束时间",
          width: "220",
        },
        {
          type: "slot",
          name: "status",
          prop: "status",
          label: "处理状态",
          minWidth: "160",
        },
        {
          type: "slot",
          label: "操作",
          fixed: "right",
          align: "center",
          width: "80",
          name: "operate",
        },
      ],
      rootId:'',
      radio: '1',
      importData: {}
    };
  },
  watch:{
    radio:{
      handler(val){
        this.importData = {
          type: this.radio,
          sourceGroupId: this.curGroupId,
          tenantCode: this.curTenantCode,
        }
      },
      deep:true,
      immediate:true
    }
  },
  components: { DiyImport },
  mounted(){},
  computed: {
    ...mapGetters("group", ["curGroupId"]),
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
  },
  methods: {
    async loadData(params, callback) {
      let tableName = {
        tableName: '集团单位关系表'
      }
      params = Object.assign(params,tableName);
      const res = await getTenantImportHistory(params);
      callback(res);
    },

    async handleModel(callback) {
      const { data: res } = await getOptionDeptModel();
      let fileName = "集团单位导入模板.xls";
      callback(res, fileName);
    },

    async handleImport(params, callback) {
      params.append("tenantCode", this.curTenantCode)
      params.append("sourceGroupId", this.curGroupId)
      params.append("type", this.radio)
      try{
        this.isImp = false
        const res = await importOptionDepartment(params)
        callback(res.data);
        this.isImp = true
      }catch{
        if(!this.isImp){
          callback(false)
        }else{
          return
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.slot-box{
  margin: 10px;
  span{
    font-weight: bold;
  }
}
</style>
