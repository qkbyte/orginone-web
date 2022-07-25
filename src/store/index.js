/* eslint-disable no-mixed-spaces-and-tabs */
import Vue from "vue";
import Vuex from "vuex";
import * as getters from "./getters";
import * as actions from "./actions";
import * as mutations from "./mutations";
import permission from "./modules/permission";
import menu from "./modules/menu";
import tenant from "./modules/tenant";
import group from "./modules/group";
import user from "./modules/user";
import work from "./modules/work";
import router from "./modules/router";
import options from "./modules/options";

Vue.use(Vuex);

const state = {
  allUsersId: "",
  sectionId: "", //选择的部门
  searchContent: "",
  loadingStatus: false, //全局加载状态
  loadingInstance: "", //全局加载实例
};

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    permission,
    user,
    tenant,
    group,
    menu,
    work,
    router,
    options,
  },
});

export default store;
