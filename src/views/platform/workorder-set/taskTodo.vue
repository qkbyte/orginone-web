<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.taskName"
        placeholder="任务名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="btnQuery"
      />
      <el-dropdown
        split-button
        type="primary"
        @click="btnQuery"
        class="filter-item"
      >
        <i class="el-icon-search el-icon--left"></i>查询
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-zoom-out" @click.native="btnReset"
            >重置</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      :data="records"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :cell-style="{ padding: '3px' }"
    >
      <el-table-column
        label="流程实例名称"
        prop="processInstanceName"
        align="center"
      >
        <template slot-scope="scope"
          ><span>{{ scope.row.processInstanceName }}</span></template
        >
      </el-table-column>
      <el-table-column label="任务名称" prop="name" align="center">
        <template slot-scope="scope"
          ><span>{{ scope.row.name }}</span></template
        >
      </el-table-column>
      <el-table-column
        label="开始时间"
        prop="createTime"
        align="center"
        width="165px"
      >
        <template slot-scope="scope"
          ><span>{{ scope.row.createTime }}</span></template
        >
      </el-table-column>
      <el-table-column label="执行人" prop="assignee" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.assignee }}</span> -->
          <span>{{ scope.row.assigneeName }}</span>
          </template
        >
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-dropdown>
            <span class="el-dropdown-link"
              >操作<i class="el-icon-arrow-down el-icon--right"></i
            ></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-view"
                @click.native="btnView(row)"
                >查看详情
              </el-dropdown-item>
              <el-dropdown-item
                v-if="row.assignee == null || row.assignee == ''"
                icon="el-icon-edit"
                divided
                @click.native="btnClaim(row)"
                >认领并执行
              </el-dropdown-item>
              <!-- row.assignee === $store.getters.sysUser.userId -->
              <el-dropdown-item
                v-if="row.endTime == null"
                icon="el-icon-edit"
                divided
                @click.native="btnUnclaim(row)"
                >取消签收
              </el-dropdown-item>
              <el-dropdown-item
                v-if="
                  !row.endTime &&
                  row.assignee != null &&
                  row.assignee != ''
                "
                icon="el-icon-edit"
                divided
                @click.native="btnExcuteTask(row)"
                >执行
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :current.sync="listQuery.current"
      :size.sync="listQuery.size"
      @pagination="list"
    />

    <!-- 执行任务 -->
    <execute-task
      v-if="dialogExcuteTaskVisible"
      :visible.sync="dialogExcuteTaskVisible"
      :executeTaskId="executeTaskId"
      @executeTaskFinished="list"
    ></execute-task>
    <process-detail
      v-if="dialogViewVisible"
      :visible.sync="dialogViewVisible"
      :processInstanceId="processInstanceId"
      :taskId="taskId"
    ></process-detail>
  </div>
</template>

<script>
import Pagination from "@/components/DiyPagination";
import { getAction, putAction } from "@/api/workordermanage";
import { Message } from "element-ui";
import ExecuteTask from "./components/ExecuteTask";
import ProcessDetail from "./components/ProcessDetail";

export default {
  name: "FlowableTaskTodo",
  components: { Pagination, ExecuteTask, ProcessDetail },
  data() {
    return {
      dicts: [],
      records: null,
      selectedRecords: [],
      total: 0,
      listQuery: {
        current: 1,
        size: 10,
        processInstanceId: undefined,
        taskName: undefined
      },
      dialogExcuteTaskVisible: false,
      formJson: undefined,
      executeTaskId: "",
      processInstanceId: "",
      dialogViewVisible: false,
      dialogReplyVisible: false,
      taskId: ''
    };
  },
  created() {
    this.list();
  },
  methods: {
    list() {
      getAction("/dev-api/asset-work-order/flowable/task/listTodo", this.listQuery).then((res) => {
        const { data } = res.data;
        console.log('data', data)
        this.records = data.records;
        this.total = data.total;
      });
    },
    btnQuery() {
      this.listQuery.current = 1;
      this.list();
    },
    btnReset() {
      this.listQuery = {
        current: 1,
        size: 10,
        processInstanceId: undefined,
        taskName: undefined,
        processInstanceBusinessKey: undefined,
        taskDueAfter: undefined,
        taskDueBefore: undefined,
      };
      this.list();
    },
    btnClaim(row) {
      putAction("/dev-api/asset-work-order/flowable/task/claim", { taskId: row.id })
        .then(({ msg }) => {
          this.list();
          this.btnExcuteTask(row);
        })
        .catch((response) => {
          this.list();
        });
    },
    btnUnclaim(row) {
      putAction("/dev-api/asset-work-order/flowable/task/unclaim", { taskId: row.id }).then(
        ({ data }) => {
          Message.success(data.msg);
          this.list();
        }
      );
    },
    btnExcuteTask(row) {
      this.executeTaskId = row.id;
      this.dialogExcuteTaskVisible = true;
    },
    btnView(row) {
      this.processInstanceId = row.processInstanceId;
      this.taskId = row.id
      this.dialogViewVisible = true;
    }
  },
};
</script>
