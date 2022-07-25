<template>
  <DiyImport
    :tableName="tableName"
    :tableHead="tableHead"
    uploadUrl="/dev-api/asset-system/async/importPhoneNumber"
    :importData="importData"
    @handleUpdate="loadData"
    @handleView="loadData"
    @handleImport="handleImport"
    @handleDownloadModel="handleModel"
  >
  </DiyImport>
</template>

<script>
import { mapGetters } from "vuex";
import DiyImport from "@components/DiyImport/index";
import {
  getTenantImportHistory,
  getTelSuppleModel,
  importTelSupple,
} from "@api/user";

export default {
  data() {
    return {
      tableName: "手机号导入记录",
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
      importData: {},
    };
  },
  components: { DiyImport },
  computed: {
    ...mapGetters("tenant", ["curTenantCode", "curTenant"]),
  },
  mounted() {
    this.importData = {
      tenantCode: this.curTenantCode,
    };
  },
  methods: {
    async loadData(params, callback) {
      params.tableName = "补充手机号";
      const res = await getTenantImportHistory(params);
      callback(res);
    },

    async handleModel(callback) {
      const { data: res } = await getTelSuppleModel();
      let fileName = "补充手机号导入模板.xls";
      callback(res, fileName);
    },

    async handleImport(params, callback) {
      try {
        this.isImp = false;
        params.append("tenantCode", this.curTenantCode);
        const res = await importTelSupple(params);
        callback(true);
        this.isImp = true;
      } catch {
        if (!this.isImp) {
          callback(false);
        } else {
          return;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
