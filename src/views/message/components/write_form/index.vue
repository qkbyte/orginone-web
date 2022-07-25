<template>
  <div class="write_form">
    <div class="top">
      <div class="top_title">{{ pageName }}</div>
    </div>

    <div class="firstBody">
      <div class="write_form_title">
        <h1>
          <span style="margin: 0 0.5rem"
            ><img src="@/assets/edit.png" alt=""/></span
          >{{ title }}<span style="color:#000">内容</span>
        </h1>
      </div>

      <div class="write_form_operation">
        <el-button
          type="text"
          style="font-size: 1rem;font-weight: bold;"
          @click="showFlowProgress"
          v-loading.fullscreen.lock="fullscreenLoading"
          >流程进度
        </el-button>
        <el-button
          type="text"
          style="font-size: 1rem;font-weight: bold;"
          @click="goback"
          >返回
        </el-button>
      </div>

      <div class="write_form_firstContent">
        <div class="write_form_firstContent_subtitle">
          单据基础信息
        </div>
        <div class="write_form_firstContent_main">
          <fm-generate-form
            :key="index"
            :data="jsonData"
            :remote="remoteFuncs"
            :value="values"
            ref="generateForm"
          >
          </fm-generate-form>
        </div>

        <div v-if="nodeType === 1" class="write_form_firstContent_button">
          <el-button
            style="width: 10rem; color: #0B3ED3;font-weight:bold;"
            @click="writeProcess"
            >填写完成
          </el-button>
        </div>

        <div v-if="nodeType === 2" class="write_form_firstContent_button">
          <el-button
            style="width: 10rem; color: #0B3ED3;font-weight:bold;"
            @click="approveProcess(1)"
            >同意
          </el-button>

          <span style="margin-left: 1rem">不同意操作：</span>
          <el-select
            v-model="disapproveValue"
            clearable
            placeholder="请选择,默认为结束流程"
          >
            <el-option
              v-for="item in disapproveOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button
            style="width: 10rem; color: #0B3ED3;font-weight:bold;"
            @click="approveProcess(0)"
            >不同意，提交
          </el-button>
        </div>

        <div v-if="nodeType === 3" class="write_form_firstContent_button">
          <el-button
            style="width: 10rem; color: #0B3ED3;font-weight:bold;"
            @click="readProcess"
            >已阅
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog title="审批流程" :visible.sync="dialogVisible" width="66%">
      <div class="flowProgress">
        <div style="margin-top: 1rem">
          <img :src="flowPic" height="275" width="100%" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  getFlowDiagramById,
  getFormInstById,
  approveHTTP,
  readDone,
} from "@api/flow";

export default {
  data() {
    return {
      pageName: "",
      title: "项目审批单批示项目审",
      index: 0,
      jsonData: {
        list: [
          {
            type: "input",
            icon: "icon-input",
            options: {
              width: "100%",
              defaultValue: "",
              required: false,
              dataType: "string",
              pattern: "",
              placeholder: "",
              disabled: false,
              remoteFunc: "func_1581772110000_28532",
            },
            name: "单行文本",
            key: "1581772110000_28532",
            model: "input_1581772110000_28532",
            rules: [
              {
                type: "string",
                message: "单行文本格式不正确",
              },
            ],
          },
          {
            type: "textarea",
            icon: "icon-diy-com-textarea",
            options: {
              width: "100%",
              defaultValue: "",
              required: false,
              disabled: false,
              pattern: "",
              placeholder: "",
              remoteFunc: "func_1581772111000_22509",
            },
            name: "多行文本",
            key: "1581772111000_22509",
            model: "textarea_1581772111000_22509",
            rules: [],
          },
        ],
        config: {
          labelWidth: 100,
          labelPosition: "top",
          size: "small",
        },
      },
      remoteFuncs: {},
      values: {},
      formId: "",
      dialogVisible: false,
      procModelId: "",
      createdBy: "",
      form_inst_value: "",
      //判断是发布表单，还是填写
      flowPic: "",
      task_id: "",
      //判断是 审批、办理、还是阅读。
      nodeType: 1,
      //判读拒绝操作后执行的步骤
      disapproveOptions: [
        {
          value: "0",
          label: "结束当前流程",
        },
        {
          value: "3",
          label: "继续执行",
        },
      ],
      disapproveValue: "",
      //    页面进度条
      fullscreenLoading: false,
    };
  },
  computed: {
    ...mapState("user", ["userId"]),
  },
  methods: {
    showFlowProgress() {
      this.dialogVisible = true;
    },
    getJsonData() {
      this.fullscreenLoading = true;
      let params = {
        taskId: this.task_id,
        userId: this.userId,
        sectionId: "",
        curSectionUsers: "",
      };
      getFormInstById(params)
        .then((res) => {
          if (res.data.code == 200) {
            this.jsonData = JSON.parse(res.data.obj.formInstSheet);
            this.values = JSON.parse(res.data.obj.formInstValue);
            this.nodeType = res.data.obj.nodeType;
          }
          this.fullscreenLoading = false;
        })
        .catch((err) => {
          this.$message.error({
            message: "表单格式数据失败",
            duration: 700,
          });
          this.fullscreenLoading = false;
        });
    },
    //经办节点
    goback() {
      this.$router.push({
        path: "/message",
      });
    },
    writeProcess() {
      this.fullscreenLoading = true;
      this.form_inst_value = "";
      this.$refs.generateForm
        .getData()
        .then((data) => {
          let params = {
            editor: this.userId,
            form_inst_sheet: this.jsonData,
            form_inst_value: JSON.stringify(data),
            form_model_id: this.formId,
            proc_inst_id: this.procModelId,
            task_id: this.task_id,
          };
          this.post("/dev-bmp/form_inst/apply_node", params)
            .then((res) => {
              this.$message.success("填写表单成功");
              this.goback();
            })
            .catch((err) => {
              this.fullscreenLoading = false;
              this.$message.error({
                message: "填写表单失败",
                duration: 700,
              });
            });
        })
        .catch((e) => {
          this.$message.error("数据校验失败");
        });
    },
    approveProcess(approve_result) {
      this.fullscreenLoading = true;
      this.form_inst_value = "";
      this.$refs.generateForm
        .getData()
        .then((data) => {
          let params;
          if (this.disapproveValue === null)
            params = {
              approve_result: approve_result,
              form_inst_sheet: this.jsonData,
              form_inst_value: JSON.stringify(data),
              form_model_id: this.formId,
              proc_inst_id: this.procModelId,
              task_id: this.task_id,
            };
          else
            params = {
              approve_result: approve_result,
              form_inst_sheet: this.jsonData,
              form_inst_value: JSON.stringify(data),
              form_model_id: this.formId,
              proc_inst_id: this.procModelId,
              task_id: this.task_id,
              approve_type: this.disapproveValue,
            };
          approveHTTP(params)
            .then((res) => {
              this.$message.success("审批完成");
              this.goback();
            })
            .catch((err) => {
              this.$message.error({
                message: "审批失败",
                duration: 700,
              });
            });
        })
        .catch((e) => {
          this.fullscreenLoading = false;
          this.$message.error("数据校验失败");
        });
    },
    readProcess() {
      this.fullscreenLoading = true;
      let params = {
        editor: this.userId,
        form_model_id: this.formId,
        proc_inst_id: this.procModelId,
        task_id: this.task_id,
      };
      readDone(params)
        .then((res) => {
          this.$message.success("提交完成");
          this.goback();
        })
        .catch((err) => {
          this.fullscreenLoading = false;
          this.$message.error({
            message: "提交失败",
            duration: 700,
          });
        });
    },
    getPicture() {
      let params = {
        proc_inst_id: this.procModelId,
      };
      getFlowDiagramById(params)
        .then((res) => {
          let reader = new window.FileReader();
          reader.readAsDataURL(res.data);
          reader.onloadend = () => {
            let data = reader.result;
            this.flowPic = data;
          };
        })
        .catch((err) => {
          this.$message.error({
            message: "图片加载失败",
            duration: 700,
          });
        });
    },
  },

  created() {
    this.pageName = this.$route.meta.title;
    this.title = this.$route.query.title;
    this.formId = this.$route.query.id;
    this.procModelId = this.$route.query.procModelId;
    this.getPicture();
    this.task_id = this.$route.query.task_id;
    this.getJsonData();
  },
};
</script>

<style lang="scss" scoped>
.write_form {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 3%;

  .top {
    display: flex;
    flex-direction: row;
    margin-left: 2.5rem;
    padding: 1rem;

    &_title {
      font-size: 2rem;
      font-weight: bold;
      line-height: 50px;
      color: rgba(51, 51, 51, 1);
    }
  }

  .firstBody {
    width: 100%;
    overflow-x: hidden;
    padding: 3%;
    background: white;
  }

  &_title {
    width: 100%;
    height: 4rem;
    text-align: center;
  }

  &_operation {
    width: 100%;
    text-align: right;
  }

  &_firstContent {
    width: 100%;
    padding: 0.5rem;

    &_subtitle {
      font-size: 1.5rem;
      font-weight: bold;
      color: #0b3ed3;
    }

    &_main {
      padding: 1rem;
    }

    &_button {
      width: 100%;
      height: 4rem;
      text-align: center;
    }
  }

  &_secondBody {
    margin-top: 1.5rem;
    max-height: 50%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 3%;
    background: white;

    &_subtitle {
      font-size: 1.5rem;
      font-weight: bold;
      color: #0b3ed3;
    }

    &_main {
      padding: 1rem;
      width: 100%;
    }

    &_button {
      width: 100%;
      height: 4rem;
      text-align: center;
    }
  }

  .flowProgress {
    width: 100%;
    padding: 3%;
    background: white;
  }
}
</style>
