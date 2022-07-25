import { loginByUsername, getUserInfoByToken } from "@api/login";
import { resetRouter } from "@/router/index";

const state = {
  userId: "", //用户id
  userName: {
    accountName: "", //账户
    realName: "", //用户真实姓名
  },
  id: "", // 人员id
  userPhoto: "", //用户头像
  token: localStorage.getItem("ZCY_TOKEN"),
  roleId: "", //用户角色
  roleName: "",
  isLogin: false, //当前用户是否登录
  RegLogin: false, //新注册用户登录，是否显示dialog
  isCreated: "",
  ifPurchase: false,
  dicts: {}
};
// getters
const getters = {
  dicts: state => state.dicts,
};
// mutations
const mutations = {
  SET_USER_NAME(state, userName) {
    state.userName = userName;
  },
  SET_ROLE_REALNAME(state, realName) {
    state.userName.realName = realName;
  },
  SET_USER_ID(state, userId) {
    state.userId = userId;
  },
  SET_USER_AVATAR(state, userPhoto) {
    state.userPhoto = userPhoto;
  },
  SET_TOKEN(state, token) {
    localStorage.setItem("ZCY_TOKEN", token);
    state.token = token;
  },
  SET_ROLE_ID(state, roleId) {
    state.roleId = roleId;
  },
  SET_ROLE_NAME(state, roleName) {
    state.roleName = roleName;
  },
  SET_LOGIN_STATE(state, isLogin) {
    state.isLogin = isLogin;
  },
  SET_REG_LOGIN(state, RegLogin) {
    state.RegLogin = RegLogin;
  },
  SET_ACCOUNTNAME(state, accountName) {
    state.userName.accountName = accountName;
  },
  SET_ID(state, id) {
    state.id = id;
  },
  SET_ISCREATED(state, isCreated){
    state.isCreated = isCreated;
  },
  SET_IFPURCHASE(state, ifPurchase){
    state.ifPurchase = ifPurchase;
  },
  ADD_DICTS: (state, dicts) => {
    state.dicts = Object.assign(dicts, state.dicts)
  }
};
// actions
const actions = {
  async login({ commit, dispatch }, payload) {
    //check token
    const hasToken = localStorage.getItem("ZCY_TOKEN");
    if (!hasToken) {
      await loginByUsername(payload).then((res) => {
        const { tokenType, accessToken } = res.data.data;
        commit("SET_TOKEN", tokenType + " " + accessToken);
      });
    } else {
      //get userInfo
      await getUserInfoByToken().then(async (res) => {
        const {
          userId,
          realName,
          roleId,
          tenantCode,
          roleName,
          userPhoto,
          phoneNumber,
          isCreated,
          theme,
          ifPurchase,
          id,
        } = res.data.data;
        const name = {
          accountName: phoneNumber,
          realName: realName,
        };
        commit("SET_USER_ID", userId);
        commit("SET_ROLE_ID", roleId);
        commit("SET_USER_NAME", name);
        commit("SET_USER_AVATAR", userPhoto);
        commit("SET_ROLE_NAME", roleName);
        commit("SET_ID", id);
        commit("SET_ISCREATED", isCreated);
        commit("SET_IFPURCHASE", ifPurchase);
        dispatch("tenant/initDefaultTenantCode", tenantCode, {
          root: true,
        });
        dispatch("tenant/getUnitTheme", theme, {
          root: true,
        });
        await commit("SET_LOGIN_STATE", true);
      });
    }
  },
  async logout({ dispatch }) {
    await dispatch("initInfo");
    dispatch(
      "menu/changeMenu",
      {
        id: -1,
        type: "platform",
        path: "/login",
      },
      {
        root: true,
      }
    );
  },
  async initInfo({ commit, dispatch }) {
    resetRouter();
    await commit("SET_TOKEN", "");
    localStorage.removeItem("ZCY_TOKEN");
    sessionStorage.clear();
    await dispatch("permission/changeRouteState", false, {
      root: true,
    });
    await commit("SET_LOGIN_STATE", false);
  },
  regLogin({ commit }, state) {
    commit("SET_REG_LOGIN", state);
  },
  changeUserId({ commit }, userId) {
    commit("SET_USER_ID", userId);
  },
  changeRoleId({ commit }, roleId) {
    commit("SET_ROLE_ID", roleId);
  },
  toggleLoginState({ commit }, state) {
    commit("SET_LOGIN_STATE", state);
  },
  changeToken({ commit }, token) {
    commit("SET_TOKEN", token);
  },
  changeAvatar({ commit }, avatar) {
    commit("SET_USER_AVATAR", avatar);
  },
  changeName({ commit }, realName) {
    commit("SET_ROLE_REALNAME", realName);
  },
  changeAccountName({ commit }, accountName) {
    commit("SET_ACCOUNTNAME", accountName);
  },
  addDicts({commit, state}, dicts) {
    return new Promise(resolve => {
      commit('ADD_DICTS', dicts)
      resolve()
    })
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
