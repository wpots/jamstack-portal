import { Store, createStore, useStore as baseUseStore } from 'vuex';
import feedbackModule, { FeedbackState } from './feedback';
import contentModule, { ContentState } from './content';
import vuexLocal from '../plugins/vuex-persist.js';
import { InjectionKey } from 'vue';

export interface State {
  feedback: FeedbackState;
  content: ContentState;
}

export const key: InjectionKey<Store<State>> = Symbol();

const store = createStore<State>({
  modules: {
    feedback: feedbackModule,
    content: contentModule,
  },
  plugins: [vuexLocal.plugin],
});

export function useStore() {
  return baseUseStore(key);
}
export default store;
