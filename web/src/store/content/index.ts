import { Module } from 'vuex';
import { State as RootState } from '../';
export type ContentState = {
  layout: Record<any, any> | null;
};

const contentModule: Module<ContentState, RootState> = {
  namespaced: true,
  state: () => ({
    layout: null,
  }),
  getters: {
    getHeader: state => state.layout?.home?.header,
    getFooter: state => state.layout?.home?.footer,
  },
  mutations: {
    setLayout(state, layout) {
      state.layout = layout;
    },
  },
  actions: {
    setLayout({ commit }, layout) {
      commit('setLayout', layout);
    },
  },
};
export default contentModule;
