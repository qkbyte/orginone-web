<template>
  <DiyImport
    :tableName="tableName"
    :tableHead="tableHead"
    uploadUrl="/dev-api/asset-system/jobs/v1/import/groupjob"
    @handleUpdate="loadData"
    @handleView="loadData"
    @handleImport="handleImport"
    @handleDownloadModel="handleModel"
  >
  </DiyImport>
</template>

<script>
import DiyImport from "@components/DiyImport/index";
import {
  getTenantImportHistory,
  importGroupPosition,
  getGroupPostModel,
} from "@api/position";

export default {
  data() {
    return {
      tableName: "集团岗位导入记录",
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
    };
  },
  components: { DiyImport },
  computed: {},
  methods: {
    async loadData(params, callback) {
      params.tableName = '集团租户岗位表'
      const res = await getTenantImportHistory(params);
      callback(res);
    },

    async handleModel(callback) {
      const { data: res } = await getGroupPostModel();
      let fileName = "集团岗位导入模板.xls";
      callback(res, fileName);
    },

    async handleImport(params, callback) {
      try{
        this.isImp = false
        const res = await importGroupPosition(params);
        callback(true);
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
