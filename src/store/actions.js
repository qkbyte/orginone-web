export const allUsersId = ({ commit }, newallUsersId) => {
  commit("SET_ALL_USER_ID", newallUsersId);
};

export const sectionId = ({ commit }, newsectionId) => {
  commit("SET_SECTION_ID", newsectionId);
};

export const loading = ({ commit, state }, payload) => {
  const { status, instance } = payload;
  commit("SET_LOADING_STATUS", status);
  if (status && !state.loadingInstance) {
    commit("SET_LOADING_INSTANCE", instance);
  } else if (state.loadingInstance) {
    state.loadingInstance.close();
    commit("SET_LOADING_INSTANCE", "");
  }
};
