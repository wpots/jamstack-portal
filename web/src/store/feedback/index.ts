import { Module } from 'vuex';
import { State as RootState } from '../';
import { FeedbackEntry } from '@/composables/useFeedback';

type SongRating = {
  id: string;
  rating: number;
  key?: string;
  performedByUs?: boolean;
};

type SetUserRatingPayload = {
  songRating: SongRating;
  aliasIds?: string[];
};

export type FeedbackState = {
  message: string | null;
  userRatings: SongRating[];
  userId: string | null;
  allRatings: SongRating[] | null;
  allFeedback: FeedbackEntry[] | null;
  hasSubmittedFeedback: boolean;
};

const feedbackModule: Module<FeedbackState, RootState> = {
  namespaced: true,
  state: {
    message: null,
    userId: null,
    userRatings: [],
    allRatings: null,
    allFeedback: null,
    hasSubmittedFeedback: false,
  },
  getters: {
    lookupSongRating: (state) => (songId: string) => {
      return state.userRatings?.find((song) => song.id === songId);
    },
    getUserId: (state) => state.userId,
  },
  mutations: {
    setUserId(state, id) {
      state.userId = id;
    },
    setUserRating(state, { songRating, aliasIds = [] }: SetUserRatingPayload) {
      const aliasLookup = new Set(aliasIds.filter((id) => id !== songRating.id));
      state.userRatings = state.userRatings.filter((song) => !aliasLookup.has(song.id));

      const currentIndex = state.userRatings.findIndex((song) => song.id === songRating.id);

      if (currentIndex >= 0) {
        state.userRatings.splice(currentIndex, 1, songRating);
        return;
      }

      state.userRatings.push(songRating);
    },
    setAllRatings(state, ratings) {
      state.allRatings = ratings;
    },
    setAllFeedback(state, feedback) {
      state.allFeedback = feedback;
    },
    setFeedbackSubmitted(state) {
      state.hasSubmittedFeedback = true;
    },
  },
  actions: {
    setUserId({ commit }, id) {
      commit('setUserId', id);
    },
    setUserRating({ commit }, payload: SetUserRatingPayload) {
      commit('setUserRating', payload);
    },
    setAllRatings({ commit }, ratings) {
      commit('setAllRatings', ratings);
    },
    setAllFeedback({ commit }, feedback) {
      commit('setAllFeedback', feedback);
    },
    setFeedbackSubmitted({ commit }) {
      commit('setFeedbackSubmitted');
    },
  },
};

export default feedbackModule;
