import { Module } from 'vuex';
import { State as RootState } from '../';

type SongRating = {
  id: string;
  rating: number;
};

export type FeedbackState = {
  message: string | null;
  userRatings: SongRating[];
  allRatings: Record<any, any> | null;
};

const feedbackModule: Module<FeedbackState, RootState> = {
  namespaced: true,
  state: {
    message: null,
    userRatings: [],
    allRatings: null,
  },
  getters: {
    lookupSongRating: state => (songId: string) => {
      return state.userRatings?.some(song => song.id === songId);
    },
  },
  mutations: {
    setUserRating(state, songRating: SongRating) {
      state.userRatings?.push(songRating);
    },
    setAllRatings(state, ratings) {
      state.allRatings = ratings;
    },
  },
  actions: {
    setUserRating({ commit }, songRating: SongRating) {
      commit('setUserRating', songRating);
    },
    setAllRatings({ commit }, ratings) {
      commit('setAllRatings', ratings);
    },
  },
};

export default feedbackModule;
