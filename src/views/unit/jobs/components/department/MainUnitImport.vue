<template>
  <DiyImport
    ref="import"
    :tableName="tableName"
    :tableHead="tableHead"
    uploadUrl="/dev-api/asset-system/async/importMasterUnit"
    :importData="importData"
    @handleUpdate="loadData"
    @handleView="loadData"
    @handleImport="handleImport"
    @handleDownloadModel="handleModel"
  >
   <!-- <div slot="radio">
    <div class="slot-box" style="margin-bottom:20px">
      <el-checkbox v-model="checked" @change="checkedChange">是否开通</el-checkbox>
    </div>
  </div> -->
  </DiyImport>
</template>

<script>
import DiyImport from "@components/DiyImport/index";
import {
  getTenantImportHistory,
  importMainUnit,
  getMainUnitModel,
} from "@api/user";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tableName: "主单位导入记录",
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
      checked:false,
      importData:{}
    };
  },
  watch:{},
  components: { DiyImport },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
  },
  mounted(){
    this.importData = {
      tenantCode: this.curTenantCode
    } 
  },
  methods: {
    async loadData(params, callback) {
      params.tableName = '主单位表'
    //   const res = await getTenantImportHistory(params);
      this.$refs.import.$refs.table.loading = false;
      callback(res);
    },

    async handleModel(callback) {
      const { data: res } = await getMainUnitModel();
      let fileName = "主单位导入模板.xls";
      callback(res, fileName);
    },

    async handleImport(params, callback) {
      try{
        this.isImp = false
        const res = await importMainUnit(params);
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

<style lang="scss" scoped></style>
