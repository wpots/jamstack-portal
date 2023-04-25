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
      commit("setLayout", layout);
    },
  },
});
