// state
const state = {
  appRouter: [],
  appBack:false,
};

// getters
const getters = {
  //   groupCount: (state) => state.groupList.length,
};
// mutations
const mutations = {
  CHANGE_ROUTER(state, data) {
    state.appRouter.push(data);
  },
  DELETE_ROUTER(state, data) {
    state.appRouter.splice(-1, 1)
  },
  CHANGE_BACK(state, data) {
    state.appBack = data
  },
};
// actions
const actions = {
  handleRouter({ commit }, data) {
    commit("CHANGE_ROUTER", data);
  },
  deleRouter({ commit }) {
    commit("DELETE_ROUTER");
  },
  changeBack({ commit },data) {
    commit("CHANGE_BACK", data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
