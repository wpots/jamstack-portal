import { Module } from 'vuex';
import { State as RootState } from '../';
export type Layout = {
  // @ts-ignore fuck any
  [key: string]: Record<string, any>;
};

export type ContentState = {
  layout: Layout | null;
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
