<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <el-checkbox v-model="listQuery.processUnfinished"
        >流程未办结</el-checkbox
      >
      <el-checkbox v-model="listQuery.processFinished">流程已办结</el-checkbox>
    </div> -->
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.processInstanceId"
        placeholder="流程实例ID"
        style="width: 200px"
        class="filter-item"
        size="small"
        @keyup.enter.native="btnQuery"
      /> -->
      <el-input
        v-model="listQuery.taskName"
        placeholder="任务名称"
        style="width: 200px"
        class="filter-item"
        size="small"
        @keyup.enter.native="btnQuery"
      />
      <!-- <el-input
        v-model="listQuery.processInstanceBusinessKey"
        placeholder="业务主键Key"
        style="width: 200px"
        size="small"
        class="filter-item"
        @keyup.enter.native="btnQuery"
      /> -->
      <el-date-picker
        v-model="listQuery.taskCreatedAfter"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="开始时间"
        type="datetime"
        size="small"
        style="width: 200px"
        class="filter-item"
      ></el-date-picker>
      <!-- <el-date-picker
        v-model="listQuery.taskCreatedBefore"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="创建时间结束"
        type="datetime"
        size="small"
        style="width: 200px"
        class="filter-item"
      ></el-date-picker> -->
      <!-- <el-date-picker
        v-model="listQuery.taskCompletedAfter"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="完成时间开始"
        type="datetime"
        style="width: 200px"
        size="small"
        class="filter-item"
      ></el-date-picker> -->
      <el-date-picker
        v-model="listQuery.taskCompletedBefore"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="完成时间"
        type="datetime"
        style="width: 200px"
        size="small"
        class="filter-item"
      ></el-date-picker>
      <el-dropdown
        split-button
        type="primary"
        @click="btnQuery"
        size="small"
        class="filter-item"
      >
        <i class="el-icon-search el-icon--left"></i>查询
        <el-dropdown-menu slot="dropdown" size="small">
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
      size="small"
      highlight-current-row
      style="width: 99%"
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
        width="185px"
      >
        <template slot-scope="scope"
          ><span>{{ scope.row.createTime }}</span></template
        >
      </el-table-column>
      <el-table-column
        label="完成时间"
        prop="endTime"
        align="center"
        width="185px"
      >
        <template slot-scope="scope"
          ><span>{{ scope.row.endTime }}</span></template
        >
      </el-table-column>
      <!-- <el-table-column label="工作耗时" prop="workTimeInMillis" align="center">
        <template slot-scope="scope"
          ><span>{{ scope.row.workTimeInMillis }}</span></template
        >
      </el-table-column> -->
      <el-table-column label="总耗时" prop="durationInMillis" align="center">
        <template slot-scope="scope"
          ><span>{{ getDuration(scope.row.durationInMillis) }}</span></template
        >
      </el-table-column>
      <!-- <el-table-column label="所有人" prop="owner" align="center">
        <template slot-scope="scope"
          ><span>{{ scope.row.owner }}</span></template
        >
      </el-table-column> -->
      <el-table-column label="执行人" prop="assignee" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.assignee }}</span> -->
          <span>{{ scope.row.assigneeName }}</span>
        </template>
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
                @click.native="btnView(row.processInstanceId)"
                >查看详情
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

    <process-detail
      v-if="dialogViewVisible"
      :visible.sync="dialogViewVisible"
      :processInstanceId="processInstanceId"
    ></process-detail>
  </div>
</template>

<script>
import Pagination from "@/components/DiyPagination";
import { getAction } from "@/api/workordermanage";
import ProcessDetail from "./components/ProcessDetail";

export default {
  name: "FlowableTaskDone",
  components: { ProcessDetail, Pagination },
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
        taskName: undefined,
        processInstanceBusinessKey: undefined,
        taskCreatedAfter: undefined,
        taskCreatedBefore: undefined,
        taskCompletedAfter: undefined,
        taskCompletedBefore: undefined,
        processUnfinished: false,
        processFinished: false,
      },
      formJson: undefined,
      processInstanceId: "",
      dialogViewVisible: false,
    };
  },
  created() {
    this.list();
  },
  methods: {
    list() {
      getAction("/dev-api/asset-work-order/flowable/task/listDone", this.listQuery).then((res) => {
        const { data } = res.data;
        this.records = data.records;
        this.total = data.total;
      });
    },
    getDuration(time) {  
      var days    = time / 1000 / 60 / 60 / 24;
      var daysRound = Math.floor(days);
      var hours = time / 1000 / 60 / 60 - (24 * daysRound);
      var hoursRound = Math.floor(hours);
      var minutes = time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
      var minutesRound = Math.floor(minutes);
      var seconds = time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
      console.log('daysRound', daysRound)
      var time = `${daysRound ? daysRound + '天' : ''}${hoursRound ? hoursRound + 
      '时' : ''}${minutesRound ? minutesRound + '分' : ''}${Math.ceil(seconds) ? Math.ceil(seconds) + '秒' : '0秒'  }`
      return time;
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
        taskCreatedAfter: undefined,
        taskCreatedBefore: undefined,
        taskCompletedAfter: undefined,
        taskCompletedBefore: undefined,
        processUnfinished: false,
        processFinished: false,
      };
      this.list();
    },
    btnView(processInstanceId) {
      this.processInstanceId = processInstanceId;
      this.dialogViewVisible = true;
    },
  },
};
</script>
