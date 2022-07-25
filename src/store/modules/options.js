// state
const state = {
  pageSize: parseInt(localStorage.getItem("ZCY_OPTIONS_PAGESIZE")) || 30,
  formShow: {},
  formList: {},
  menuStyle: parseInt(sessionStorage.getItem("menuStyle")) || 0, // 0-正常状态，1-侧边栏显示
};
// getters
const getters = {};
// mutations
const mutations = {
  SET_PAGE_SIZE(state, size) {
    localStorage.setItem("ZCY_OPTIONS_PAGESIZE", size);
    state.pageSize = size;
  },
  SET_FORM(state, form) {
    state.formList = form;
  },
  SET_FORMSHOW(state, show) {
    state.formShow = show;
  },
  SET_MENUSTYLE(state, menuStyle) {
    state.menuStyle = menuStyle;
    sessionStorage.setItem("menuStyle", state.menuStyle);
  },
};
// actions
const actions = {
  async updatePageSize({ commit }, size) {
    await commit("SET_PAGE_SIZE", size);
  },
  getSearchForm({ commit }, form) {
    commit("SET_FORM", form);
  },
  getFormShow({ commit }, show) {
    commit("SET_FORMSHOW", show);
  },
  setMenuStyle({ commit }, menuStyle) {
    commit("SET_MENUSTYLE", menuStyle);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
