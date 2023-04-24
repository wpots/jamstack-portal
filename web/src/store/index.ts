import { createStore } from "vuex";

export default createStore({
  state: {
    layout: null,
  },
  mutations: {
    setLayout(state, layout) {
      state.layout = layout;
    },
  },
  actions: {
    setLayout({ commit }, layout) {
      console.log("we are here", layout);
      commit("setLayout", layout);
    },
  },
});
