<template>
  <DiyImport
    ref="import"
    :tableName="tableName"
    :tableHead="tableHead"
    :modelData="true"
    :uploadUrl="uploadUrl"
    :importData="importData"
    @handleUpdate="loadData"
    @handleView="loadData"
    @handleImport="handleImport"
    @handleDownloadModel="handleModel"
  >
    <el-popover
      placement="bottom"
      width="220"
      trigger="manual"
      v-model="visible"
    >
      <el-button type="text" style="margin-left:10px" @click="downModel('4')"
        >下载租户导入模板</el-button
      >
      <el-button type="text" @click="downModel('8')"
        >下载无管理员租户导入模板</el-button
      >
      <el-button type="text" @click="downModel('9')"
        >下载补充管理员导入模板</el-button
      >
      <el-button
        style="margin:0 10px"
        slot="reference"
        type="text"
        @click="visible = !visible"
        >下载模板</el-button
      >
    </el-popover>
    <el-button type="text" @click="handleImportFile('4')">批量导入</el-button>
    <el-button type="text" @click="handleImportFile('8')"
      >无管理员租户导入</el-button
    >
    <el-button type="text" @click="handleImportFile('9')"
      >补充管理员导入</el-button
    >
  </DiyImport>
</template>

<script>
import DiyImport from "@components/DiyImport/index";
import {
  getTenantModel,
  getTenantImportHistory,
  importTenantInfo,
  importNoAdminUnitTenant,
  importReplenish,
  downloadNoMananger,
  downloadMananger,
} from "@api/tenant";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tableName: "租户导入记录",
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
      visible: false,
      uploadUrl: "",
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
      params.tableName = "单位租户表";
      const res = await getTenantImportHistory(params);
      callback(res);
    },
    async downModel(type) {
      this.$refs.import.handleModel(type);
    },
    handleImportFile(val) {
      switch (val) {
        case "4":
          this.uploadUrl = "/dev-api/asset-system/async/importTenant";
          break;
        case "8":
          this.uploadUrl =
            "/dev-api/asset-system/async/importNoAdminUnitTenant";
          break;
        case "9":
          this.uploadUrl =
            "/dev-api/asset-system/async/importReplenishAdmin";
          break;
      }
      this.$refs.import.handleImportFile(val);
    },
    async handleModel(val, callback) {
      let res = "";
      let fileName = "";
      switch (val) {
        case "4":
          res = await getTenantModel();
          fileName = "租户导入模板.xls";
          callback(res.data, fileName);
          break;
        case "8":
          res = await downloadNoMananger();
          fileName = "无管理员租户导入模板.xls";
          callback(res.data, fileName);
          break;
        case "9":
          res = await downloadMananger();
          fileName = "补充管理员导入模板.xls";
          callback(res.data, fileName);
          break;
      }
    },

    async handleImport(params, val, callback) {
      params.append("tenantCode", this.curTenantCode);
      try {
        this.isImp = false;
        let res = "";
        switch (val) {
          case "4":
            res = await importTenantInfo(params);
            break;
          case "8":
            res = await importNoAdminUnitTenant(params);
            break;
          case "9":
            res = await importReplenish(params);
            break;
        }
        callback(res.data);
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
