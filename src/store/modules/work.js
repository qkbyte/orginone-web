export default {
  state: {
    // 主入口标签页
    isReresh: true,
    setValApp: '',
    todoNumIndexSend: '',
    //代办跳转状态
    skipState: "1",
  },
  mutations: {
    setNotRefresh (state, type) {
      // console.log("事项刷新完成",type);
        state.isReresh = type;
    },
    changeSetValApp(state, newVal) {
      state.setValApp = newVal
    },
    changeTodonum(state, newVal) {
      state.todoNumIndexSend = newVal
    },
    changeSkipState(state, newVal){
      state.skipState = newVal
    } 
  },
  actions: {
    changeMutation(context, newVal) {
      context.commit('changeTodonum', newVal)
    }
  }
}
