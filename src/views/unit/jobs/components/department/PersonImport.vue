<template>
  <DiyImport
    :tableName="tableName"
    :tableHead="tableHead"
    uploadUrl="/dev-api/asset-system/async/importPerson"
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
  importPerson,
  getPersonModel,
} from "@api/user";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tableName: "人员导入记录",
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
      params.tableName = '人员用户表'
      const res = await getTenantImportHistory(params);
      callback(res);
    },

    async handleModel(callback) {
      const { data: res } = await getPersonModel();
      let fileName = "人员导入模板.xls";
      callback(res, fileName);
    },

    async handleImport(params, callback) {
      params.append("tenantCode", this.curTenantCode)
      try{
        this.isImp = false
        const res = await importPerson(params);
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
