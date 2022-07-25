import { getMenu } from "@api/aggregator";
import router from "../../router/index.js";

// state
const state = {
  menuList: [],
  menuState: parseInt(sessionStorage.getItem("menuState")) || 0,
  openMenu: JSON.parse(sessionStorage.getItem("openMenu")) || {},
  menuKey:1,
};

// getters
const getters = {
  openMenuId: (state) => (state.openMenu.id ? state.openMenu.id : -1),
  openUrl: (state) => (state.openMenu.url ? state.openMenu.url : ""),
};

// mutations
const mutations = {
  SET_MENU_LIST(state, menuList) {
    let addProp = function addProp(state, list) {
      if (!list) return [];
      list.forEach((el) => {
        el.type = "platform";
        if (el.appId) {
          if (el.icon == "") {
            el.icon = "icon-linshitubiao";
          }
          el.name = el.menuName;
          el.url = el.menuUrl;
          el.type = "app";
        }
        el.showSubMenu = false;
        el.isSelected = false;
        if (el.children) {
          addProp(state, el.children);
        }
      });
    };
    addProp(state, menuList);
    state.menuList = menuList;
  },
  SET_OPEN_MENU(state, menu) {
    sessionStorage.setItem("openMenu", JSON.stringify(menu));
    state.openMenu = menu;
  },
  SET_OPEN_URL(state, url) {
    console.log("url", url);
    sessionStorage.setItem("openUrl", url);
    state.openUrl = url;
  },
  SET_MENU_STATE(state) {
    state.menuState == 2 ? (state.menuState = 0) : state.menuState++;
    sessionStorage.setItem("menuState", state.menuState);
  },
  HANDLE_SHOW(state) {
    state.menuKey += 1
  },
};

// actions
const actions = {
  async initMenuList({ commit, rootState }) {
    let params = {
      roleIds: rootState.user.roleId,
      platform: 1,
    };
    await getMenu(params).then((res) => {
      res.data.data.forEach(item =>{
        if (item.name == "应用市场") {
          item.name = "软件共享仓库"
        }
      })
      commit("SET_MENU_LIST", res.data.data);
    });
  },
  handleShow({ commit }){
    commit("HANDLE_SHOW");
  },
  async updateAppMenu({ commit, rootState }) {
    let params = {
      roleIds: rootState.user.roleId,
      platform: 1,
    };
    await getMenu(params).then((res) => {
      commit("SET_MENU_LIST", res.data.data);
    });
  },
  toggleMenuState({ commit }) {
    commit("SET_MENU_STATE");
  },
  changeMenu({ state, commit }, menu) {
    if (menu.str == "back") {
      if (menu.router.appId) {
        const {
          id: openId,
          path,
          alias,
          type,
          url,
          appId: openAppId,
        } = menu.router;
        const { id: sourceId, appId: sourceAppId } = state.openMenu;
        commit("SET_OPEN_MENU", menu.router);
        commit("SET_OPEN_URL", url);
        if (sourceAppId !== openAppId || openId === sourceId) {
          console.log('123');
          router.push({
            path: "/online",
          });
        }
      } else {
        let path = menu.router.path;
        router.push({ path });
      }
    } else {
      const { id: openId, path, alias, type, url, appId: openAppId } = menu;
      const { id: sourceId, appId: sourceAppId } = state.openMenu;
      commit("SET_OPEN_MENU", menu);
      if (type === "platform") {
        console.log('path', path);
        if (alias === "approve-form") {
          router.push({
            path: "/app/index/approvalIssue",
            query: { id: openId },
          });
        } else {
          router.push({ path });
        }
      } else if (type === "app") {
        commit("SET_OPEN_URL", url);
        if (sourceAppId !== openAppId || openId === sourceId) {
          console.log("openId", sourceAppId, openAppId, openId, sourceId);
          if (!menu.isDialog) {
            router.push({
              path: "/online",  
            });  
          }
        }
      }
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
