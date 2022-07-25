<template>
  <div style="height:100%;background:white;overflow:hidden">
    <div class="layout">
      <div class="layout-title">事项</div>
      <div class="layout-content">
        <div class="layout-content__todo">
          <div class="layout-content__titleBox">
            <div class="layout-content__title">
              待办事项
            </div>
            <div class="layout-content__icon">
              <div class="todo"></div>
            </div>
          </div>
          <div class="layout-content__iconBox">
            <div class="layout-content__row">
              <div v-if="todoNum[0] < 10000" class="layout-content__text" @click="goTodo('1')">{{ todoNum[0] }}</div>
              <div v-else class="layout-content__text" @click="goTodo('1')">9999+</div>
              <div class="layout-content__tiao">条</div>
            </div>
          </div>
        </div>
        <div class="layout-content__todo">
          <div class="layout-content__titleBox">
            <div class="layout-content__title">
              已办事项
            </div>
            <div class="layout-content__iconHave">
              <div class="havetodo"></div>
            </div>
          </div>
          <div class="layout-content__iconBox">
            <div class="layout-content__row">
              <div v-if="todoNum[1] < 10000" class="layout-content__text" @click="goTodo('2')">{{ todoNum[1] }}</div>
              <div v-else class="layout-content__text" @click="goTodo('2')">9999+</div>
              <div class="layout-content__tiao">条</div>
            </div>
          </div>
        </div>
        <div class="layout-content__todo" style="border:0">
          <div class="layout-content__titleBox">
            <div class="layout-content__title">
              办结事项
            </div>
            <div class="layout-content__iconTransfer">
              <div class="transferr"></div>
            </div>
          </div>
          <div class="layout-content__iconBox">
            <div class="layout-content__row">
              <div v-if="todoNum[2] < 10000" class="layout-content__text" @click="goTodo('3')">{{ todoNum[2] }}</div>
              <div v-else class="layout-content__text" @click="goTodo('3')">9999+</div>
              <div class="layout-content__tiao">条</div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="flex-between" style="border:1px solid red">
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
      </div> -->
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
// 初始化时可设定超时时间（秒）
export default {
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
        });
        getallfinishacttodo(params).then((res) => {
          this.$set(this.todoNum, 1, res.data.data.total);
        });
        getallhistoryacttodo(params).then((res) => {
          this.$set(this.todoNum, 2, res.data.data.total);
        });
        // getallinitiateacttodo(params).then((res) => {
        //   this.$set(this.todoNum, 3, res.data.data.total);
        // });
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
    async goTodo(str) {
      this.$router.push({
        path: "/acttodo",
      });
      this.$store.commit("changeSkipState", this.isActive.toString());
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
          item.todotime = el.finishtime;
          item.todoappid = el.launshappid;
          if (this.isActive === 2) {
            item.appname = el.todoappname;
          }
        }
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
    async goTodo(str) {
      this.$router.push({
        path: "/acttodo",
      });
      this.$store.commit("changeSkipState", str);
    },

    //查看待办
    async goItem(item) {
      const { todoappid, pcformlink } = item;
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
          appId: todoappid,
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
.todo {
  width: 24px;
  height: 24px;
  background: url(../../assets/todo.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.havetodo {
  width: 24px;
  height: 24px;
  background: url(../../assets/havetodo.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.transferr {
  width: 24px;
  height: 24px;
  background: url(../../assets/right.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.divide {
  background: #eee;
  width: 2px;
  height: 100px;
  margin-top: 30px;
}
.layout {
  width: 100%;
  padding: 20px;
  height: 100%;
  &-title {
    font-size: 16px;
    color: #303133;
    font-weight: bold;
  }
  &-content {
    width: 100%;
    height: 100%;
    display: flex;
    &__todo {
      width: 34%;
      height: 120px;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-right: 1px solid #eee;
      margin-top: 25px;
      justify-content: center;
    }
    &__all {
      display: flex;
    }
    &__haveTodo {
      width: 30%;
      height: 100%;
    }
    &__transferr {
      width: 30%;
      height: 100%;
    }
    &__box {
      display: flex;
      flex-direction: column;
      width: fit-content;
      margin-top: 25px;
      margin-left: 20%;
    }
    &__title {
      width: fit-content;
      height: 16px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #909399;
      line-height: 16px;
    }
    &__row {
      display: flex;
      flex-direction: row;
      margin-top: 42px;
      margin-left: 0px;
    }
    &__text {
      width: fit-content;
      height: 40px;
      font-size: 45px;
      font-family: PangMenZhengDao;
      color: #484a4d;
      line-height: 46px;
      letter-spacing: 1px;
      font-weight: bold;
    }
    &__text:hover{
      color: $theme-color;
      cursor: pointer;
    }
    &__tiao {
      margin-top: 25px;
      margin-left: 10px;
      font-size: 15px;
    }
    &__icon {
      width: 40px;
      height: 40px;
      background: rgba(253, 147, 62, 0.15);
      border-radius: 50%;
      margin-top: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 30px;
    }
    &__iconHave {
      width: 40px;
      height: 40px;
      background: rgba(62, 138, 253, 0.15);
      border-radius: 50%;
      margin-top: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 30px;
    }
    &__iconTransfer {
      width: 40px;
      height: 40px;
      background: rgba(100, 208, 149, 0.15);
      border-radius: 50%;
      margin-top: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 30px;
    }
    &__row {
      display: flex;
      flex-direction: row;
    }
    &__iconBox {
      display: flex;
      justify-content: center;
      width: fit-content;
      margin-top: 18px;
    }
  }
}
</style>
