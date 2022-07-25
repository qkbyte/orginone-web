<template>
  <div style="height:100%;overflow:hidden">
    <div class="row-1-left block" style="height:100%">
      <div class="flex-between">
        <div class="flex-between row-1-left__todo-num ">
          <div
            class="todo-num"
            :class="
              isActive === item ? 'todo-num--active' : 'todo-num--no-active'
            "
            v-for="(item, ind) in 4"
            :key="'todo-num-' + item"
            @click="toggleTodo(item)"
          >
            <p>{{ todoType[ind] }}</p>
            <i></i>
            <span>{{ todoNum[ind] }}</span>
          </div>
        </div>
        <div class="row-1-left__view-more" @click="goTodo">
          查看更多 <i class="iconfont icon-right_blod"></i>
        </div>
      </div>
      <template v-if="todoItem.length !== 0">
        <div
          v-for="(item, index) in todoItem"
          :key="'todo' + index"
          class="flex-between  todo-item"
          @click="goItem(item)"
        >
          <div class="todo-item--left">
            <div class="todo-item--left__icon">
              <img src="@assets/img/Image20.png" />
            </div>
            <p>
              {{ item.appname }}
            </p>
            <span :title="item.todocontent">{{ item.todocontent }}</span>
          </div>
          <div class="todo-item--right">
            <div>
              <img :src="require('@assets/img/agency' + isActive + '.svg')" />
            </div>
            <span> {{ item.todotitle }}</span>
            <span>{{ item.todotime }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="todo-no-data">
          <div class="todo-no-data__img">
            <img src="@assets/img/work-icon9.svg" />
          </div>
          <div class="todo-no-data__tip">暂无数据</div>
        </div>
      </template>
    </div>
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
// import SdkClient from "@assetcloud/asset-sdk";
// 初始化时可设定超时时间（秒）
export default {
  components: { DiyApps },
  data() {
    return {
      todoType: ["待办", "已办", "已完结", "我发起的"],
      hasMessage: false,
      isActive: 1,
      todoItem: [],
      todoNum: ["0", "0", "0", "0"],
      appList: [],
      messageData: [],
      messageDataTime: [], // 处理因后台传递的时间包含时分秒的数据
      // sdk:'',
    };
  },
  created() {
    // this.$nextTick(async ()=>{
    //   this.sdk = new SdkClient(5);
    //   let res = await this.sdk.init();
    // })
    this.loadData();
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
          console.log(this.todoItem);
          debugger;
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
    handleTime() {
      // 处理日期
      this.messageDataTime = [];
      for (let i = 0; i < this.messageData.length; i++) {
        this.messageDataTime[i] = this.messageData[i].createTime.slice(0, 10);
      }
    },
    //处理待办数据
    handleTodoData(data) {
      var newData = [];
      data.forEach((el) => {
        let item = {};
        if (this.isActive === 1 || this.isActive === 2) {
          item.appname = el.todoappname;
          item.todotime = el.todotime;
          item.todoappid = el.todoappid;
        } else {
          item.appname = el.launshappname;
          item.todotime = el.starttime;
          item.todoappid = el.launshappid;
          if (this.isActive === 2) {
            item.appname = el.todoappname;
          }
        }
        item.todotitle = el.todotitle;
        item.pcformlink = el.pcformlink;
        item.todocontent = el.todocontent;
        newData.push(item);
      }, this);
      return newData;
    },

    /**
     *  切换待办类型
     * @param {Number} type -待办类型
     */
    toggleTodo(type) {
      if (type === this.isActive) return;
      this.isActive = type;
      let params = {
        current: 1,
        size: 5,
      };
      switch (type) {
        case 1:
          getallacttodo(params).then((res) => {
            this.todoItem = this.handleTodoData(res.data.data.records);
          });
          break;
        case 2:
          getallfinishacttodo(params).then((res) => {
            this.todoItem = this.handleTodoData(res.data.data.records);
          });
          break;
        case 3:
          getallhistoryacttodo(params).then((res) => {
            this.todoItem = this.handleTodoData(res.data.data.records);
          });
          break;
        case 4:
          getallinitiateacttodo(params).then((res) => {
            this.todoItem = this.handleTodoData(res.data.data.records);
          });
          break;
        default:
          break;
      }
    },

    //跳转至消息中心
    async goTodo() {
      this.$router.push({
        path: "/acttodo",
      });
      localStorage.setItem('GD',1)
      this.$store.commit("changeSkipState", this.isActive.toString());
    },

    //查看待办
    async goItem(item) {
      const { todoappid, pcformlink, launshappid } = item;
      if (todoappid === "0") {
        let url = pcformlink;
        if (url.indexOf("?") == -1) {
          this.$router.push({
            path: url,
          });
        } else {
          let obj = {};
          let link = url.split("?")[0];
          let array = url.split("?")[1].split("&");
          array.forEach((item) => {
            obj[item.split("=")[0]] = item.split("=")[1];
          });
          this.$router.push({
            path: link,
            query: obj,
          });
        }
      } else {
        let menu = {
          id: -1,
          appId: todoappid || launshappid,
          url: pcformlink,
          type: "app",
        };
        this.changeMenu(menu);
      }
    },
    // 查询流程对象及设置appList
    getProcessDefinitionDetail() {
      // 隐藏发起工单代码
      // let lastMenu = {}
      // getProcessDefinition().then(res => {
      //   let processDefinition = res.data.data
      //   if (this.menuList && this.menuList.length > 0 && processDefinition.formKey && processDefinition.id ) {
      //     lastMenu = JSON.parse(JSON.stringify(this.menuList[this.menuList.length - 1]))
      //     lastMenu.children = []
      //     lastMenu.id = randomString(10)
      //     lastMenu.name = '发起工单'
      //     lastMenu.path = `/workorder-launch-flow?formKey=${processDefinition.formKey}&id=${processDefinition.id}`
      //     this.appList = [...this.menuList, lastMenu]
      //   } else {
      //     this.appList = [...this.menuList]
      //   }
      // }).catch(() => {
      //     this.appList = [...this.menuList]
      // })
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
  overflow-x: auto;
  & > div + div {
    margin-top: 4px;
  }
}
.row-1 {
  height: 300px;

  &-left {
    flex: 1;
    // min-width: 800px;
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
        width: 50%;
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
          // max-width: 200px;
          width: 30%;
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
          // max-width: 200px;
          width: 60%;
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
        // min-width: 400px;
        width: 50%;
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
          margin-left: 5%;
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
    width: 368px;
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
