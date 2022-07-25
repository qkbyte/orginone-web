<template>
  <div class="flow-wrap">
    
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        工单详情
      </div>
      <div v-if="generateStartFormVisible">
        <fm-generate-form
          :data="startFormJson"
          :value="variables"
          ref="generateStartForm"
        >
        </fm-generate-form>
      </div>
      <!-- <el-form label-width="100px" v-if="showBusinessKey">
        <el-form-item label="业务主键Key:">
          <el-input v-model="businessKey" disabled />
        </el-form-item>
      </el-form>
      <div v-if="!generateStartFormVisible && !showBusinessKey">无</div> -->
      <el-form label-width="100px">
        <el-form-item label="回复列表:">
          <div class="reply_wrap">
            <div class="reply-list" id="scrolldIV">
              <li
                v-for="(item, index) in replyList"
                :key="index"
                :class="[item.userId == userId ? 'right' : '']"
              >
                <div>
                  <p v-if="item.userId == userId">{{ item.createTime }}&nbsp;&nbsp;{{ item.userName ? item.userName : '匿名' }}</p>
                  <p v-else>{{ item.userName ? item.userName : '匿名' }} &nbsp;&nbsp; {{ item.createTime }}</p>
                  <div class="poptip">
                    {{ item.content }}<i>{{ item.userName ? item.userName.slice(0, 1) : '匿名' }}</i>
                  </div>
                </div>
              </li>
              <div
                id="msgEnd"
                ref="msgEnd"
                style="height: 0px; overflow: hidden"
              ></div>
            </div>
            <el-input
              v-if="!isFinished"
              v-model="replyMessage"
              type="textarea"
              :rows="5"
              placeholder="回复工单"></el-input>
            <el-button v-if="!isFinished" type="primary" style="margin-top: 10px" @click="add">回复</el-button>
            <el-button v-if="!isFinished" type="primary" style="margin-top: 10px; margin-left: 50px" @click="doComplete">完成工单</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getAction, postAction, putAction } from "@/api/workordermanage";
import { mapState } from "vuex";
export default {
  name: "ProcessDetail",
  props: {
    taskId: {
      type: String,
      default: function () {
        return "";
      },
    },
  },
  computed: {
    ...mapState("user", ['userId', 'userName']),
    isFinished() {
      if(this.comments && this.comments.length > 0) {
        return this.comments[this.comments.length - 1].type === 'WC' || this.comments[this.comments.length - 1].type === 'ZZ'
      }
      return false
    }
  },
  data() {
    return {
      processInstanceId: this.$route.query.id,
      comments: [],
      replyMessage: "",
      isShowProcessInstanceForm: false,
      generateStartFormVisible: false,
      startFormJson: undefined,
      variables: undefined,
      showBusinessKey: false,
      businessKey: undefined,
      isFirstEnter: true,
      replyList: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.listComments();
      this.showProcessInstanceForm();
      this.getReplyedList()
      this.pollingReplyList()
    },
    pollingReplyList () {
      var timer = setTimeout(() => {
        this.getReplyedList()
        this.pollingReplyList()
      }, 1000)
      if (this.isFinished) {
        clearTimeout(timer)
      }
      this.$once('hook:beforeDestroy', () => {
        clearTimeout(timer)
      })
    },
    showProcessInstanceForm() {
      if (!this.isShowProcessInstanceForm) {
        getAction("/dev-api/asset-work-order/flowable/processInstance/formData", {
          processInstanceId: this.processInstanceId,
        }).then((res) => {
          const { data } = res.data;
          this.showBusinessKey = data.showBusinessKey;
          this.businessKey = data.businessKey;
          if (data && data.renderedStartForm) {
            this.startFormJson = JSON.parse(data.renderedStartForm);
            this.variables = JSON.parse(data.variables.processInstanceFormData);
            this.generateStartFormVisible = true;
          }
          this.isShowProcessInstanceForm = true;
        });
      }
    },
    listComments() {
      getAction("/dev-api/asset-work-order/flowable/processInstance/comments", {
        processInstanceId: this.processInstanceId,
      }).then((res) => {
        const { data } = res.data;
        this.comments = data;
      });
    },
    getReplyedList() {
      getAction("/dev-api/asset-work-order/flowable/work/order/list", {
        processInstanceId: this.processInstanceId,
        // taskId: this.taskId,
      }).then((res) => {
        this.replyList = res.data.data;
        this.$nextTick(() => {
          if (this.isFirstEnter) {
            this.isFirstEnter = false
            this.scrollIntoView();
          }
        });
      });
    },
    scrollIntoView() {
      let msgEnd = document.getElementById("msgEnd");
      msgEnd.scrollIntoView();
    },
    add() {
      if (!this.replyMessage.trim()) {
        this.$message.error("请输入回复内容");
        return;
      }
      let parentId = 0;
      if (this.replyList && this.replyList.length) {
        let length = this.replyList.length;
        parentId = this.replyList[length - 1].id;
      }
      let params = {
        processInstanceId: this.processInstanceId,
        // taskId: this.taskId,
        userName: this.userName.realName,
        content: this.replyMessage,
        parentId: parentId,
        type: 0,
      };
      postAction("/dev-api/asset-work-order/flowable/work/order/reply", params).then((res) => {
        this.replyList.push(res.data.data);
        this.replyMessage = "";
        setTimeout(() => {
          // scrollV.scrollTop = scrollV.scrollHeight
          this.scrollIntoView();
        }, 50);
      });
    },
    // 结束工单
    doComplete() {
      postAction('/dev-api/asset-work-order/flowable/processInstance/stopProcessInstance', { processInstanceId: this.processInstanceId }).then(res => {
        if (res.data.data) {
          this.$message.success('结束成功')
          this.listComments()
        }
      })
    }
  },
};
</script>
<style scoped lang="scss">
.flow-wrap {
  padding: 30px 0;
  overflow: auto;
}
.box-card {
  width: 1000px;
  margin: 0 auto;
}
.flow-footer {
  display: flex;
  justify-content: end;
}
.reply_wrap {
  margin-top: -10px;
}
.tabs_wrap {
  width: 1200px;
  margin: 0 auto;
}
.reply-list {
  margin: 20px 0;
  border: 1px solid #dfe6ec;
  border-radius: 4px;
  min-height: 100px;
  height: 300px;
  overflow: auto;
  padding: 0 30px 30px;
}
li {
  list-style: none;
  padding: 10px 62px;
  overflow: hidden;
  &.right {
    color: #ff7063;
    text-align: right;
    & > div {
      float: right;
      .poptip {
        width: 300px;
        margin-left: auto;
        border: 1px solid #ff7063;
        text-align: left;
        i {
          right: -60px;
          left: auto;
          background: #ff7063;
        }
        &::before {
          border-left: 10px solid #ff7063;
          border-right: 0;
          left: auto;
          right: 0;
          margin-left: 0;
          margin-right: -11px;
        }
        &::after {
          border-left: 10px solid #fff;
          border-right: 0;
          left: auto;
          right: 0;
          margin-left: 0;
          margin-right: -10px;
        }
      }
    }
  }
  & > div {
    float: left;
    width: 48%;
    p {
      font-size: 13px;
      color: #34495e;
      padding-bottom: 5px;
      span {
        padding-right: 10px;
      }
    }
    .poptip {
      width: 300px;
      padding: 9px 18px;
      border: 1px solid #2fd4a4;
      position: relative;
      //   height: 62px;
      border-radius: 4px;
      &::before {
        content: "";
        border-right: 10px solid #2fd4a4;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 0;
        position: absolute;
        left: 0;
        top: 30%;
        margin-left: -10px;
        margin-top: -10px;
      }
      &::after {
        content: "";
        border-right: 10px solid #fff;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 0;
        position: absolute;
        left: 0;
        top: 30%;
        margin-left: -9px;
        margin-top: -10px;
      }
      i {
        position: absolute;
        left: -60px;
        background: #2fd4a4;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        line-height: 40px;
        top: 0;
        font-style: normal;
      }
      a {
        font-size: 14px;
        color: #34495e;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  }
}
</style>


