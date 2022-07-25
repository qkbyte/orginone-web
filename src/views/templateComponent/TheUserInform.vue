<template>
  <div class="home" style="height:100%;overflow:hidden">
    <div class="row-1 flex-between" style="height:100%">
      <div class="row-1-right block">
        <div style="display:flex;">
          <div class="row-1-right__avatar">
            <img v-if="userPhoto" class="avatar" :src="userPhoto" />
            <div v-else class="avatar2">{{ userHead }}</div>
          </div>
          <div class="row-1-right__content">
            <div class="user-name">{{ userName.realName }}</div>
            <div style="display:flex;">
              <img src="@assets/img/work-icon12.svg" />
              <p style="margin-left:5px;">{{ roleName }}</p>
            </div>
            <div style="display:flex;">
              <img src="@assets/img/work-icon11.svg" />
              <p style="margin-left:5px;">本次登录 {{ showTime() }}</p>
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div class="message">
          <template v-if="hasMessage">
            <div class="message-data flex-column">
              <div
                class="message-data__item"
                @click="messageClick(item)"
                v-for="(item, index) in messageData"
                :key="'message' + item.id"
              >
                <p v-if="index < 5"><i></i>{{ item.title }}</p>
                <span v-if="index < 5">{{ messageDataTime[index] }}</span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="message-no-data">
              <div class="message-no-data__img">
                <img src="@assets/img/work-icon10.svg" />
              </div>
              <div class="message-no-data__tip">暂无数据</div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <template v-for="item in dialogShow">
      <TheMessageDialog
        v-if="item.key === 'view' && item.value"
        :key="item.key"
        :dialogShow="item"
        @closeEdit="handleCloseDialog"
      ></TheMessageDialog>
    </template>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import {
  getallacttodo,
  getallfinishacttodo,
  getallhistoryacttodo,
  getallinitiateacttodo,
  getProcessDefinition,
  getMyMessages,
} from "@api/acttodo";
import DiyApps from "@components/DiyAppBox/index2";
import TheMessageDialog from "./components/messageDialog"
import { randomString } from "@/utils/index.js";
import { isDistributed } from "@api/market";
export default {
  components: { DiyApps },
  data() {
    return {
      dialogShow: [
        {
          value: false,
          key: "view",
        },
      ],
      todoType: ["待办", "已办", "已完结", "我发起的"],
      hasMessage: false,
      isActive: 1,
      todoItem: [],
      todoNum: ["0", "0", "0", "0"],
      appList: [],
      messageData: [],
      messageDataTime: [], // 处理因后台传递的时间包含时分秒的数据
    };
  },
  components: {
    TheMessageDialog,
  },
  created() {
    this.loadData();
    document.getElementById("app").style.overflowX = "hidden";
  },
  computed: {
    ...mapState("user", ["roleName", "userName", "userPhoto", "roleId"]),
    ...mapState("menu", ["menuList"]),
    userHead() {
      return this.userName.realName.substr(0, 1);
    },
  },
  watch: {},
  methods: {
    ...mapActions("menu", ["changeMenu"]),
    //获取当前时间
    showTime() {
      let fnW = function(time) {
        let num;
        time >= 10 ? (num = time) : (num = "0" + time);
        return num;
      };
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let data = date.getDate();
      let hours = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      return (
        year +
        "-" +
        fnW(month + 1) +
        "-" +
        fnW(data) +
        " " +
        fnW(hours) +
        ":" +
        fnW(minute) +
        ":" +
        fnW(second)
      );
    },
    //加载数据
    loadData() {
      let params = {
        current: 1,
        size: 5,
      };
      try {
        getallacttodo(params).then((res) => {
          this.$set(this.todoNum, 0, res.data.data.total);
          this.todoItem = this.handleTodoData(res.data.data.records);
        });
        getallfinishacttodo(params).then((res) => {
          this.$set(this.todoNum, 1, res.data.data.total);
        });
        getallhistoryacttodo(params).then((res) => {
          this.$set(this.todoNum, 2, res.data.data.total);
        });
        getallinitiateacttodo(params).then((res) => {
          this.$set(this.todoNum, 3, res.data.data.total);
        });
        getMyMessages(params).then((res) => {
          const { records, total } = res.data.data;
          console.log(res);
          if (records.length !== 0) {
            this.hasMessage = true;
            this.messageData = records;
            this.handleTime();
          }
        });
      } catch (error) {}
    },
    messageClick(data) {
      this.dialogShow.map((el) => {
        if (el.key == 'view') {
          el.value = true;
          el.sendData = data;
        }
      });
    },
    handleCloseDialog(key) {
      this.dialogShow.map((el) => {
        if (el.key === key) {
          el.value = false;
        }
      });
    },
    handleTime() {
      // 处理日期
      this.messageDataTime = [];
      for (let i = 0; i < this.messageData.length; i++) {
        this.messageDataTime[i] = this.messageData[i].createTime.slice(0, 10);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.row-2 {
  padding: 0px !important;
}
.block {
  padding: 20px;
  background-color: #fff;
}
.line {
  width: 1px;
  background: #ebeef5;
}
.home {
  & > div + div {
    margin-top: 4px;
  }
}
.row-1 {
  height: 300px;
  &-left {
    flex: 1;
    margin-right: 4px;

    &__todo-num {
      width: 55%;
      height: 92px;

      .todo-num {
        display: flex;
        flex-direction: column;
        align-items: center;

        &--active {
          p {
            height: 22px;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            line-height: 22px;
          }
          i {
            margin-top: 6px;
            display: inline-block;
            height: 2px;
            width: 60%;
            background-color: #154ad8;
            border-radius: 100px;
          }
          span {
            height: 45px;
            font-size: 32px;
            font-weight: 600;
            color: #154ad8;
            line-height: 45px;
          }
        }

        &--no-active {
          cursor: pointer;
          p {
            height: 22px;
            font-size: 16px;
            font-weight: 500;
            color: #606266;
            line-height: 22px;
          }
          i {
            margin-top: 6px;
            display: inline-block;
            height: 2px;
          }
          span {
            height: 45px;
            font-size: 32px;
            font-weight: 400;
            color: #909399;
            line-height: 45px;
          }
        }
      }
    }

    &__view-more {
      margin-top: 10px;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #154ad8;
      line-height: 20px;
      cursor: pointer;

      i {
        font-size: 12px;
      }
    }

    .todo-item + .todo-item {
      margin-top: 16px;
    }

    .todo-item {
      height: 20px;
      align-items: center;
      cursor: pointer;

      &:hover p {
        color: #154ad8;
      }

      &--left {
        display: flex;
        line-height: 20px;

        &__icon {
          width: 16px;
          height: 16px;

          img {
            height: 100%;
            width: 100%;
          }
        }

        p {
          max-width: 200px;
          margin-left: 5px;
          height: 20px;
          font-size: 14px;
          font-weight: 600;
          color: #303133;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        span {
          max-width: 200px;
          margin-left: 8px;
          font-size: 12px;
          font-weight: 400;
          color: #909399;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      &--right {
        display: flex;
        min-width: 400px;
        line-height: 20px;
        position: relative;
        span {
          height: 17px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(144, 147, 153, 0.8);
        }

        span:nth-child(2) {
          max-width: 150px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-left: 30px;
        }

        span:nth-child(3) {
          position: absolute;
          right: 0;
          min-width: 135px;
        }
      }
    }

    .todo-no-data {
      height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &__img {
        width: 170px;
        height: 80px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      &__tip {
        margin-top: 20px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(144, 147, 153, 0.8);
      }
    }
  }

  &-right {
    width: 100%;
    &__avatar {
      width: 52px;
      height: 52px;
      margin-top: 10px;
      background-image: linear-gradient(
        148deg,
        rgba(21, 74, 216, 1),
        rgba(255, 255, 255, 1)
      );
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;

      .avatar {
        width: 46px;
        height: 46px;
        background: #fff;
        border-radius: 50%;
        border: 2px solid #ffffff;
      }

      .avatar2 {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: #154ad8;
        border: 2px solid #ffffff;
        text-align: center;
        line-height: 40px;
        font-size: 18px;
        color: #ffffff;
      }
    }

    &__content {
      margin-left: 20px;
      font-size: 12px;
      font-weight: 400;
      color: #909399;
      line-height: 17px;

      div + div {
        margin-top: 5px;
      }

      .user-name {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        line-height: 20px;
      }
    }

    .line {
      margin-top: 12px;
      width: 100%;
      height: 1px;
    }

    .message {
      margin-top: 15px;
      height: 179px;

      &-data {
        div + div {
          margin-top: 16px;
        }
        &__item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 20px;
          cursor: pointer;
          i {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: rgba(21, 74, 216, 1);
            border-radius: 50%;
            margin-right: 16px;
          }
          p {
            right: 0;
            margin-right: 16px;
            color: rgba(48, 49, 51, 1);
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          span {
            min-width: 76px;
            font-size: 12px;
            color: rgba(144, 147, 153, 0.8);
          }
        }
        &__item:hover{
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 20px;
          cursor: pointer;
          i {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: rgba(21, 74, 216, 1);
            border-radius: 50%;
            margin-right: 16px;
          }
          p {
            right: 0;
            margin-right: 16px;
            color: rgba(21, 74, 216, 1);
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          span {
            min-width: 76px;
            font-size: 12px;
            color: rgba(144, 147, 153, 0.8);
          }
        }
      }
      &-no-data {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 41px;

        &__img {
          width: 120px;
          height: 80px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        &__tip {
          margin-top: 20px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(144, 147, 153, 0.8);
        }
      }
    }
  }
}
</style>
