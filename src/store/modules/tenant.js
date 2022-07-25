import { dubRemove } from "@utils/index";
import { getRoleIdByTenantId } from "@api/role";
import { getTenantList } from "@api/tenant";

// state
const state = {
  defaultTenantCode: "",
  tenantList: [],
  unitTheme: "",
};

// getters
const getters = {
  unitCount: (state) => state.tenantList.length,
  dropUnitList: (state) =>
    state.tenantList.filter((tenant) => !tenant.isActive),
  curTenant: (state) => state.tenantList.find((tenant) => tenant.isActive),
  curTenantCode: (state) =>
    state.tenantList.length > 0
      ? state.tenantList.find((tenant) => tenant.isActive).tenantCode
      : "",
  curTenantId: (state) =>
    state.tenantList.length > 0
      ? state.tenantList.find((tenant) => tenant.isActive).tenantId
      : "",
};
// mutations
const mutations = {
  SET_UNIT_LIST(state, tenantList) {
    let arr = [];
    let cur = 0;
    let count = 0;
    tenantList.forEach((item, index) => {
      if (state.defaultTenantCode == item.tenantCode) {
        cur = index;
      }
      let obj = {
        name: item.tenantName,
        logo: item.img,
        tenantCode: item.tenantCode,
        tenantId: item.id,
      };
      if (index === cur) {
        obj.isActive = true;
        obj.isDefault = true;
      } else {
        obj.isActive = false;
        obj.isDefault = false;
      }
      arr.push(obj);
    });
    if (arr.length > 0) {
      state.tenantList = arr.filter(
        (tenant) => tenant.tenantName !== "开放中心"
      );
    } else {
      state.tenantList = [];
    }
    state.tenantList.forEach((item) => {
      if (item.isActive == true) {
        count++;
      }
    });
    if (count == 2) {
      state.tenantList[0].isActive = false;
      state.tenantList[0].isDefault = false;
    }
  },
  SET_DEFAULT_TENANT(state, tenantCode) {
    state.defaultTenantCode = tenantCode;
  },
  SET_TENANT_ACTIVE_STATUS(state, tenantCode) {
    state.tenantList.forEach((element) => {
      if (element.tenantCode != tenantCode) {
        element.isActive = false;
      } else {
        element.isActive = true;
      }
    });
  },
  GET_UNIT_THEME(state, data) {
    if (data == "") {
      state.unitTheme = "default";
      window.document.documentElement.setAttribute("data-theme", "default");
    } else {
      state.unitTheme = data;
      window.document.documentElement.setAttribute("data-theme", "default");
    }
  },
  CHANGE_DROP_UNITLIST(state, data) {
    console.log("====", state.tenantList);
    for (let key in data) {
      for (let i = 0; i < state.tenantList.length; i++) {
        if (state.tenantList[i].tenantCode == key) {
          state.tenantList[i].todoNum = data[key];
          break;
        }
      }
    }
  },
};
// actions
const actions = {
  getChangeDropUnitList({ commit }, data) {
    commit("CHANGE_DROP_UNITLIST", data);
  },
  async initTenantList({ commit }, params) {
    await getTenantList(params).then((res) => {
      console.log("getTenantList", res);
      const tenantList = res.data.data;
      commit("SET_UNIT_LIST", tenantList);
    });
  },
  initDefaultTenantCode({ commit }, tenantCode) {
    commit("SET_DEFAULT_TENANT", tenantCode);
  },
  async toggleUnit({ commit, dispatch, rootState }, tenantCode) {
    await dispatch("permission/changeRouteState", false, {
      root: true,
    });
    let params = {
      account: rootState.user.userName.accountName,
      tenantCode,
    };
    await getRoleIdByTenantId(params).then((res) => {
      const { tokenType, accessToken, roleId, userId } = res.data.data;
      dispatch("user/changeToken", tokenType + " " + accessToken, {
        root: true,
      });
      dispatch("user/changeUserId", userId, {
        root: true,
      });
      dispatch("user/changeRoleId", roleId, {
        root: true,
      });
    });

    sessionStorage.removeItem("openMenu");
    sessionStorage.removeItem("openUrl");
    sessionStorage.removeItem("menuScroll");
    await commit("SET_TENANT_ACTIVE_STATUS", tenantCode);
    window.location.href = "/";
  },

  async lastToggleUnit({ commit, dispatch, rootState }, res) {
    await dispatch("permission/changeRouteState", false, {
      root: true,
    });
    dispatch("user/changeToken", res.tokenType + " " + res.accessToken, {
      root: true,
    });
    dispatch("user/changeUserId", res.userId, {
      root: true,
    });
    dispatch("user/changeRoleId", res.roleId, {
      root: true,
    });
    sessionStorage.removeItem("openMenu");
    sessionStorage.removeItem("openUrl");
    sessionStorage.removeItem("menuScroll");
    await commit("SET_TENANT_ACTIVE_STATUS", res.tenantCode);
    window.location.href = "/";
  },
  getUnitTheme({ commit }, data) {
    commit("GET_UNIT_THEME", data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
