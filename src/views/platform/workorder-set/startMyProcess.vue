<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.processDefinitionName"
        placeholder="流程定义名称"
        style="width: 200px"
        size="small"
        class="filter-item"
        @keyup.enter.native="btnQuery"
      />

      <el-dropdown
        split-button
        type="primary"
        @click="btnQuery"
        class="filter-item"
        size="small"
      >
        <i class="el-icon-search el-icon--left"></i>查询
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-zoom-out" @click.native="btnReset"
            >重置</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-row>
      <el-col :span="12" v-for="(row, index) in records" :key="index">
        <div
          class="filter-container"
          style="margin-right: 3px; margin-bottom: 3px"
        >
          <el-card>
            <div slot="header" class="clearfix">
              <span>{{ row.name }}-v{{ row.version }}</span>
              <div style="position: relative; text-align: right">
                <el-button type="primary" size="mini" @click="btnImage(row.id)"
                  >流程图</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="btnStartInstance(row)"
                  >发起流程
                </el-button>
              </div>
            </div>
            <div class="text item">
              {{ row.description ? row.description : "无描述" }}
            </div>
            <div class="text item">
              {{ row.category ? row.category : "无命名空间" }}
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <pagination
      v-show="total > 0"
      :total="total"
      :current.sync="listQuery.current"
      :size.sync="listQuery.size"
      @pagination="list"
    />

    <el-dialog
      title="流程图"
      fullscreen
      :visible.sync="dialogImageVisible"
      width="80%"
    >
      <img :src="imagePath" alt="流程图" />
    </el-dialog>

    <start-process
      v-if="dialogStartInstanceVisible"
      :visible.sync="dialogStartInstanceVisible"
      :processDefinition="processDefinition"
    ></start-process>
  </div>
</template>

<script>
import Pagination from "@/components/DiyPagination";
import { getAction } from "@/api/workordermanage";
import { Message } from "element-ui";
import StartProcess from "./components/StartProcess";

export default {
  name: "FlowableStartMyProcess",
  components: { StartProcess, Pagination },
  data() {
    return {
      dicts: [],
      records: null,
      selectedRecords: [],
      total: 0,
      listQuery: {
        current: 1,
        size: 8,
        processDefinitionId: undefined,
        processDefinitionName: undefined,
        processDefinitionKey: undefined,
        latestVersion: true,
        suspended: undefined,
      },
      dialogFormVisible: false,
      dialogImportVisible: false,
      dialogImageVisible: false,
      imagePath: "",
      dialogStartInstanceVisible: false,
      formJson: undefined,
      dialogProcessDefinitionIdentityLinkVisible: false,
      selectedProcessDefinitionId: "",
      selectedProcessDefinitionName: "",
      processDefinition: undefined,
    };
  },
  created() {
    this.list();
  },
  methods: {
    list() {
      getAction("/dev-api/asset-work-order/flowable/processDefinition/listMyself", this.listQuery).then(
        (res) => {
          const { data } = res.data;
          this.records = data.records;
          this.total = data.total;
          if (data.total == 0) {
            Message.info("查无可发起的流程");
          }
        }
      );
    },
    btnQuery() {
      this.listQuery.current = 1;
      this.list();
    },
    btnReset() {
      this.listQuery = {
        current: 1,
        size: 8,
        processDefinitionId: undefined,
        processDefinitionName: undefined,
        processDefinitionKey: undefined,
        latestVersion: true,
        suspended: undefined,
      };
      this.list();
    },
    btnImage(processDefinitionId) {
      this.imagePath =
        // `${process.env.VUE_APP_BASE_API}` +
        "/dev-api/asset-work-order/flowable/processDefinition/image?processDefinitionId=" +
        processDefinitionId +
        "&time=" +
        new Date();
      this.dialogImageVisible = true;
      
    },
    btnStartInstance(row) {
      this.processDefinition = row;
      this.dialogStartInstanceVisible = true;
    },
  },
};
</script>
