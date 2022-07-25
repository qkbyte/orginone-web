<template>
  <el-dialog
    title="执行任务"
    :visible.sync="dialogExcuteTaskVisibleInChild"
    :fullscreen="false"
  >
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane
        name="taskForm"
        label="任务表单"
        v-if="generateTaskFormVisible"
      >
        <fm-generate-form
          :data="taskFormJson"
          :value="taskFormData"
          ref="generateFormTask"
        ></fm-generate-form>
      </el-tab-pane>
      <el-tab-pane name="processInstanceForm" label="流程表单(只读)">
        <fm-generate-form
          v-if="generateStartFormVisible"
          :data="startFormJson"
          :value="processInstanceFormData"
          ref="generateFormStart"
        ></fm-generate-form>
        <el-form label-width="100px" v-if="showBusinessKey">
          <el-form-item label="业务主键Key:">
            <el-input v-model="businessKey" disabled />
          </el-form-item>
        </el-form>
        <div v-if="!generateStartFormVisible && !showBusinessKey">无</div>
      </el-tab-pane>
    </el-tabs>
    <select-user
      ref="selectUser"
      :visible.sync="selectUserVisible"
      :appendToBody="true"
      :multipleSelect="selectUserMultipleSelect"
      @selectUserFinished="selectUserFinished"
    ></select-user>
    <task-back-nodes
      v-if="dialogTaskBackNodesVisible"
      :visible.sync="dialogTaskBackNodesVisible"
      :executeTaskId="executeTaskId"
      @backTaskFinished="backTaskFinished"
    ></task-back-nodes>

    <div slot="footer" class="dialog-footer" style="padding: 0 15px 0 15px">
      <el-form label-width="100px">
        <el-form-item label="意见:">
          <el-input
            v-model="message"
            :autosize="{ minRows: 2, maxRows: 3 }"
            type="textarea"
            placeholder="请输入意见"
          />
        </el-form-item>
      </el-form>
      <el-button
        icon="el-icon-close"
        @click="dialogExcuteTaskVisibleInChild = false"
        >取消</el-button
      >
      <el-button icon="el-icon-check" type="primary" @click="doComplete"
        >提交</el-button
      >
      <!-- <el-button
        v-if="buttons.length == 0 || buttons.includes('STOP')"
        icon="el-icon-close"
        type="primary"
        @click="doStop"
        >终止
      </el-button> -->
      <el-button
        v-if="buttons.length == 0 || buttons.includes('ASSIGN')"
        icon="el-icon-user"
        type="primary"
        @click="doAssign"
        >转办
      </el-button>
      <!-- <el-button
        v-if="buttons.length == 0 || buttons.includes('DELEGATE')"
        icon="el-icon-user"
        type="primary"
        @click="doDelegate"
        >委派
      </el-button> -->
      <!-- <el-button
        v-if="!initiator && (buttons.length == 0 || buttons.includes('BACK'))"
        icon="el-icon-back"
        type="primary"
        @click="doBack"
        >退回
      </el-button> -->
      <!--<el-button icon="el-icon-back" type="primary" @click="doBackToStart">撤回</el-button>-->
    </div>
  </el-dialog>
</template>

<script>
import { getAction, putAction } from "@/api/workordermanage";
import { Message } from "element-ui";
import CustomError from "@/customError";
import TaskBackNodes from "./TaskBackNodes";
import SelectUser from './SelectUser'

export default {
  name: "ExecuteTask",
  components: { TaskBackNodes, SelectUser },
  props: {
    visible: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    executeTaskId: {
      type: String,
      default: function () {
        return "";
      },
    },
  },
  computed: {
    dialogExcuteTaskVisibleInChild: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  data() {
    return {
      // fullscreen: true,
      activeName: "processInstanceForm",
      startFormKey: undefined,
      taskFormKey: undefined,
      startFormJson: undefined,
      taskFormJson: undefined,
      generateStartFormVisible: false,
      generateTaskFormVisible: false,
      taskFormData: undefined,
      showBusinessKey: false,
      businessKey: undefined,
      processInstanceFormData: undefined,
      startUserId: "",
      initiator: false,
      selectUserVisible: false,
      selectUserMultipleSelect: false,
      selectUserType: "",
      message: "",
      ccToVos: [],
      dialogTaskBackNodesVisible: false,
      buttons: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      getAction("/dev-api/asset-work-order/flowable/task/executeTaskData", {
        taskId: this.executeTaskId,
      }).then((res) => {
        const { data } = res.data;
        this.startUserId = data.startUserId;
        this.showBusinessKey = data.showBusinessKey;
        this.businessKey = data.businessKey;
        this.startFormKey = data.startFormKey;
        this.taskFormKey = data.taskFormKey;
        this.initiator = data.initiator;
        this.buttons = data.buttons || [];
        if (data.renderedStartForm) {
          this.startFormJson = JSON.parse(data.renderedStartForm);
          this.processInstanceFormData = JSON.parse(
            data.variables.processInstanceFormData
          );
          this.generateStartFormVisible = true;
        }
        if (data.renderedTaskForm && typeof data.renderedTaskForm === 'string' ) {
          this.taskFormJson = JSON.parse(data.renderedTaskForm);
          if (
            this.startFormKey &&
            this.taskFormKey &&
            this.startFormKey == this.taskFormKey
          ) {
            this.taskFormData = JSON.parse(
              data.variables.processInstanceFormData
            );
          }
          this.generateTaskFormVisible = true;
        }
        if (this.generateTaskFormVisible) {
          this.activeName = "taskForm";
        }
        // if (!this.generateStartFormVisible && !this.generateTaskFormVisible) {
        //     this.fullscreen = false
        // }
      });
    },
    checkMessage() {
      if (!this.message || this.message === "") {
        Message.error("请输入意见");
        throw new CustomError("请输入意见");
      }
    },
    doComplete() {
      this.checkMessage();
      if (this.$refs.generateFormTask) {
        this.$refs.generateFormTask
          .getData()
          .then((values) => {
            if (values && values != undefined) {
              let realValues = values;
              if (
                this.startFormKey &&
                this.taskFormKey &&
                this.startFormKey == this.taskFormKey
              ) {
                let processInstanceFormData = JSON.stringify(values);
                realValues = Object.assign({ processInstanceFormData }, values);
              }
              return putAction(
                "/dev-api/asset-work-order/flowable/task/complete",
                {
                  taskId: this.executeTaskId,
                  message: this.message,
                  initiator: this.initiator,
                  values: realValues,
                  ccToVos: this.ccToVos,
                }
              ).then(({ data }) => {
                Message.success(data.msg);
                this.dialogExcuteTaskVisibleInChild = false;
                this.$emit("executeTaskFinished");
              });
            }
          })
          .catch((e) => {
            console.info(e);
          });
      } else {
        putAction("/dev-api/asset-work-order/flowable/task/complete", {
          taskId: this.executeTaskId,
          message: this.message,
          ccToVos: this.ccToVos,
        }).then(({ data }) => {
          Message.success(data.msg);
          this.dialogExcuteTaskVisibleInChild = false;
          this.$emit("executeTaskFinished");
        });
      }
    },
    doStop() {
      this.checkMessage();
      putAction("/dev-api/asset-work-order/flowable/task/stopProcessInstance", {
        taskId: this.executeTaskId,
        message: this.message,
      }).then(({ data }) => {
        Message.success(data.msg);
        this.dialogExcuteTaskVisibleInChild = false;
        this.$emit("executeTaskFinished");
      });
    },
    doSelectCcTo() {
      this.selectUserMultipleSelect = true;
      this.selectUserType = "selectCcTo";
    },
    handleCcToClose(tag) {
      this.ccToVos.splice(this.ccToVos.indexOf(tag), 1);
    },
    doAssign() {
      this.checkMessage();
      this.selectUserMultipleSelect = false;
      this.selectUserVisible = true
      this.selectUserType = "assign";
      if (this.$refs.selectUser.treeData.length == 0) {
        this.$refs.selectUser.getTreeData();
      }
    },
    doDelegate() {
      this.checkMessage();
      this.selectUserMultipleSelect = false;
    },
    selectUserFinished(selectData) {
      if (!selectData || selectData.length == 0) {
        Message.error("请先选择用户");
        return;
      }
      console.log('selectData.userId', selectData.userId, this.executeTaskId, this.message)
      if (this.selectUserType === "assign") {
        putAction("/dev-api/asset-work-order/flowable/task/assign", {
          taskId: this.executeTaskId,
          userId: selectData.userId,
          message: this.message,
        }).then(({ data }) => {
          Message.success(data.msg);
          this.dialogExcuteTaskVisibleInChild = false;
          this.$emit("executeTaskFinished");
        });
      } else if (this.selectUserType === "delegate") {
        putAction("/dev-api/asset-work-order/flowable/task/delegate", {
          taskId: this.executeTaskId,
          userId: selectData.userId,
          message: this.message,
        }).then(({ data }) => {
          Message.success(data.msg);
          this.dialogExcuteTaskVisibleInChild = false;
          this.$emit("executeTaskFinished");
        });
      } else if (this.selectUserType === "selectCcTo") {
        this.ccToVos = selectData;
      }
    },
    doBack() {
      this.checkMessage();
      this.dialogTaskBackNodesVisible = true;
    },
    backTaskFinished(backNode) {
      putAction("/dev-api/asset-work-order/flowable/task/back", {
        taskId: this.executeTaskId,
        activityId: backNode.nodeId,
        activityName: backNode.nodeName,
        message: this.message,
      }).then(({ data }) => {
        Message.success(data.msg);
        this.dialogExcuteTaskVisibleInChild = false;
        this.$emit("executeTaskFinished");
      });
    },
  },
};
</script>

