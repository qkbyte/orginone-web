<template>
  <div>
    <div class="message">
      <div class="message__topShow">
        <div class="message__topShow__leftBox">
          <div class="message__topShow__leftBox__list">
            <div class="message__topShow__leftBox__type">综合</div>
            <div class="message__topShow__leftBox__number">
              <el-button
                type="text"
                style="font-size: 2rem"
                @click="onViewAllBtn('待办')"
                >{{ showNum[2] }}
              </el-button>
            </div>
          </div>
          <div class="message__topShow__leftBox__list">
            <div class="message__topShow__leftBox__type">待办</div>
            <div class="message__topShow__leftBox__number">
              <el-button
                type="text"
                style="font-size: 2rem"
                @click="onViewAllBtn('待办')"
                >{{ showNum[0] }}
              </el-button>
            </div>
          </div>
          <div class="message__topShow__leftBox__list">
            <div class="message__topShow__leftBox__type">待阅</div>
            <div class="message__topShow__leftBox__number">
              <el-button
                type="text"
                style="font-size: 2rem"
                @click="onViewAllBtn('待阅')"
                >{{ showNum[1] }}
              </el-button>
            </div>
          </div>
          <div class="message__topShow__leftBox__list">
            <div class="message__topShow__leftBox__type">已办事项</div>
            <div class="message__topShow__leftBox__number">
              <el-button
                type="text"
                style="font-size: 2rem"
                @click="onViewAllBtn('已办')"
                >{{ showNum[3] }}
              </el-button>
            </div>
          </div>
        </div>
        <div class="message__topShow__rightBox">
          <el-button
            size="mini"
            round
            style="font-size: 1rem"
            @click="onViewAllBtn('待办')"
            >查看消息<i class="el-icon-arrow-right el-icon&#45;&#45;right"></i
          ></el-button>
        </div>
      </div>

      <div style="width: 100%;height: 55%">
        <div v-for="(count, key) in message" :key="key" class="message__list">
          <div class="message__list__icon">
            <img src="@assets/store/type-6.png" class="c-img" alt />
          </div>
          <div class="message__list__title">
            {{ count.title | controllength }}
          </div>
          <div class="message__list__content">当前表单没有注释</div>
          <div class="message__list__type">
            {{ count.type | showMessageType }}
          </div>
          <div class="message__list__initiator">{{ count.committer }}发起</div>
          <div class="message__list__date">{{ count.commitTime | dateT }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      message: [],
      //各个消息个数： 待办，待阅，全部，已处理
      showNum: [0, 0, 0, 0],
    };
  },
  computed: {
    ...mapState("tenant", ["defaultTenantCode"]),
    ...mapState("user", ["userId"]),
  },
  filters: {
    showMessageType(type) {
      let name = "待办";
      if (type === 1) name = "待阅";
      else if (type === 3) name = "已办";
      return name;
    },
    dateT(value) {
      let dateT = new Date(value);
      var year = dateT.getFullYear(); //取得4位数的年份
      var month = dateT.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
      var date = dateT.getDate(); //返回日期月份中的天数（1到31）
      return year + "-" + month + "-" + date;
    },
    controllength(data) {
      if (data.length > 6) {
        return data.substring(0, 6) + "...";
      }
      return data;
    },
  },
  created() {
    this.getMessageNum();
    this.getMessageBriefInfo();
  },
  methods: {
    getMessageList(index) {
      var title = "待办";
      if (index == 1) title = "待阅";
      else if (index == 2) title = "办结";
      else if (index == 3) {
        title = "已办";
      }
      let val = {
        num: 5,
        taskType: index | 0,
        userId: this.userId,
        tenantId: this.defaultTenantCode,
        sectionId: "",
        curSectionUsers: "",
      };
      this.post(`/dev-bmp/form_inst/show?page=1&size=5`, val)
        .then((res) => {
          var objList = [];
          for (let key of res.data.obj.list) {
            let temp = {
              id: key.id,
              title: key.title,
            };
            objList.push(temp);
          }
          let obj = {
            id: index,
            title: title,
            number: res.data.obj.total,
            list: objList,
          };
          this.message.push(obj);
          if (index < 3) this.getMessageList(index + 1);
        })
        .catch((err) => {});
    },
    getMessageNum() {
      let params = {
        tenantId: this.defaultTenantCode,
        userId: this.userId,
      };
    },
    getMessageBriefInfo() {
      let params = {
        tenantId: this.defaultTenantCode,
        userId: this.userId,
        page: 1,
        size: 3,
      };
    },
    onViewAllBtn(title) {
      this.$router.push({ name: "message", query: { title: title } });
    },
  },
};
</script>

<style scoped lang="scss">
.messageList {
  padding: 3%;
  width: 1500px;
  height: 400px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.message {
  padding: 3%;
  width: 1000px;
  height: 320px;
  overflow: auto;
  background-color: white;

  &__topShow {
    width: 100%;
    height: 45%;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &__leftBox {
      width: 70%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      &__number::v-deep .el-button {
        color: #909399;
      }

      &__list {
        width: 20%;
        text-align: center;
        padding: 3%;
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #ebeef5;
        color: #909399;
      }

      &__list:hover {
        width: 20%;
        text-align: center;
        padding: 3%;
        color: #154ad8;
      }

      &__list:hover:after {
        content: "___";
      }

      &__list:hover::v-deep .el-button {
        color: #154ad8;
      }
    }

    &__rightBox {
      width: 30%;
      padding: 3%;
      text-align: right;
    }
  }

  &__list {
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 2%;

    &__icon {
      width: 2%;
    }

    &__title {
      color: #303133;
      font-weight: bold;
      width: 10%;
    }

    &__content {
      color: #606266;
      width: 55%;
    }

    &__type {
      color: #2d8cfa;
      width: 10%;
    }

    &__initiator {
      color: #909399;
      width: 13%;
    }

    &__date {
      color: #909399;
      width: 10%;
    }
  }
}

.c-img {
  max-width: 1rem;
  max-height: 1rem;
}
</style>
