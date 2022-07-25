import { constantRouter, dynamicRouter, resetRouter } from "@/router";

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role));
  } else {
    return true;
  }
}
// state
const state = {
  routers: constantRouter,
  addRouters: [],
  isRoute: false,
};

// getters
const getters = {};
// mutations
const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers;
    state.routers = constantRouter.concat(routers);
  },
  SET_ROUTERS_STATE: (state, isRoute) => {
    state.isRoute = isRoute;
  },
};
// actions
const actions = {
  async initRoutes({ commit, rootState }) {
    resetRouter();
    const roles = rootState.user.roleId.split(",");
    const accessedRouters = dynamicRouter.filter((v) => {
      if (roles.includes("124")) return true;
      if (hasPermission(roles, v)) {
        if (v.children && v.children.length > 0) {
          v.children = v.children.filter((child) => {
            if (hasPermission(roles, child)) {
              return child;
            }
            return false;
          });
          return v;
        } else {
          return v;
        }
      }
      return false;
    });
    commit("SET_ROUTERS", accessedRouters);
  },
  async changeRouteState({ commit }, isRoute) {
    await commit("SET_ROUTERS_STATE", isRoute);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
