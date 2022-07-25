import { dubRemove } from "@utils/index";
import { getManageGroupList } from "@api/group";
import { Message } from "element-ui";

// state
const state = {
  defaultGroupId: "",
  groupList: [],
};

// getters
const getters = {
  groupCount: (state) => state.groupList.length,
  dropGroupList: (state) => state.groupList.filter((group) => !group.isActive),
  curGroup: (state) => state.groupList.find((group) => group.isActive),
  curGroupId: (state) =>
    state.groupList.length > 0
      ? state.groupList.find((group) => group.isActive).groupId
      : "",
};
// mutations
const mutations = {
  SET_GROUP_LIST(state, groupList) {
    let arr = [];
    let cur = 0;
    let count = 0;
    groupList.forEach((item, index) => {
      if (state.defaultGroupId == item.groupId) {
        cur = index;
      }
      let obj = {
        name: item.groupName,
        groupId: item.id,
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
      state.groupList = dubRemove(arr);
    } else {
      state.groupList = [];
    }
    state.groupList.forEach((item) => {
      if (item.isActive == true) {
        count++;
      }
    });
    if (count == 2) {
      state.groupList[0].isActive = false;
      state.groupList[0].isDefault = false;
    }
  },
  SET_DEFAULT_GROUP(state, groupId) {
    state.defaultGroupId = groupId;
  },
  SET_GROUP_ACTIVE_STATUS(state, groupId) {
    state.groupList.forEach((element) => {
      if (element.groupId != groupId) {
        element.isActive = false;
      } else {
        element.isActive = true;
      }
    });
  },
  SET_GROUPLIST(state, groupName){
    console.log('state', state.groupList);
    state.groupList.forEach((el)=>{
      if(el.isActive){
        el.name = groupName
      }
    })
  },
  SAVE_GROUPSTATE(state, groupState){
    state.groupList.forEach(el => {
      if(el.groupId == state.defaultGroupId){
        el.groupState = groupState
      }
    });
    localStorage.setItem("groupState", JSON.stringify(state.groupList));
  },
};
// actions
const actions = {
  async initGroupList({ commit }) {
    await getManageGroupList({type:1}).then((res) => {
      const groupList = res.data.data;
      if (groupList.length === 0) {
        commit("SET_GROUP_LIST", []);
      } else {
        commit("SET_DEFAULT_GROUP", groupList[0].id);
        commit("SET_GROUP_LIST", groupList);
      }
    });
  },
  initDefaultTenantCode({ commit }, groupId) {
    commit("SET_DEFAULT_GROUP", groupId);
  },
  async toggleGroup({ commit }, groupId) {
    commit("SET_GROUP_ACTIVE_STATUS", groupId);
    Message.success({
      message: "集团切换成功！",
      duration: 800,
    });
  },
  changeGroupList({ commit }, groupName){
    commit("SET_GROUPLIST", groupName);
  },
  saveGroupState({ commit }, groupState){
    commit("SAVE_GROUPSTATE", groupState);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
