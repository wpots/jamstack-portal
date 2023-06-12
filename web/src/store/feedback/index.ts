import { Module } from 'vuex';
import { State as RootState } from '../';
import { FeedbackEntry } from '@/composables/useFeedback';

type SongRating = {
  id: string;
  rating: number;
};

export type FeedbackState = {
  message: string | null;
  userRatings: SongRating[];
  userId: string | null;
  allRatings: SongRating[] | null;
  allFeedback: FeedbackEntry[] | null;
};

const feedbackModule: Module<FeedbackState, RootState> = {
  namespaced: true,
  state: {
    message: null,
    userId: null,
    userRatings: [],
    allRatings: null,
    allFeedback: null,
  },
  getters: {
    lookupSongRating: state => (songId: string) => {
      return state.userRatings?.find(song => song.id === songId);
    },
    getUserId: state => state.userId,
  },
  mutations: {
    setUserId(state, id) {
      state.userId = id;
    },
    setUserRating(state, songRating: SongRating) {
      state.userRatings?.push(songRating);
    },
    setAllRatings(state, ratings) {
      state.allRatings = ratings;
    },
    setAllFeedback(state, feedback) {
      state.allFeedback = feedback;
    },
  },
  actions: {
    setUserId({ commit }, id) {
      commit('setUserId', id);
    },
    setUserRating({ commit }, songRating: SongRating) {
      commit('setUserRating', songRating);
    },
    setAllRatings({ commit }, ratings) {
      commit('setAllRatings', ratings);
    },
    setAllFeedback({ commit }, feedback) {
      commit('setAllFeedback', feedback);
    },
  },
};

export default feedbackModule;
