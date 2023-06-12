import { computed, ref } from 'vue';
import { useStore } from '../../store';
import fireBase from './firebase.js';
import { getDatabase, ref as dbRef, child, push, update, get } from 'firebase/database';

export type FeedbackEntry = {
  id: string;
  tiptop: string;
  naam?: string;
};

export type SongRating = {
  id: string;
  average?: number | string | null | undefined;
  votes?: {
    count: number;
    average?: number;
  };
};
const db = getDatabase(fireBase);

const ratingMapper = result => {
  const ratings: SongRating[] = [];
  for (const songId in result) {
    // @ts-ignore unknown
    const votes = Object.values(result[songId]).map(vote => vote.rating);
    const averageVote = () => {
      const sum = votes.reduce((total, value) => total + value, 0);
      return sum / votes.length;
    };
    const rating = {
      id: songId,
      votes: {
        count: votes.length,
        average: averageVote(),
      },
    };
    ratings.push(rating);
  }
  return ratings;
};

const feedbackMapper = result => {
  const feedback: FeedbackEntry[] = [];
  for (const feedbackId in result) {
    feedback.push(result[feedbackId]);
  }
  return feedback;
};

export function useFeedback() {
  const store = useStore();

  const songRatings = ref<SongRating[] | null>(null);
  const getSongRatings = computed(() => store.state.feedback.allRatings);
  const resolveSongRating = id => {
    // @ts-ignore for later
    if (getSongRatings?.value?.length > 0) {
      // @ts-ignore for later
      const votes = getSongRatings.value.find(s => s.id === id)?.votes;
      if (votes?.average) {
        const avg = Math.round(votes?.average * 10) / 10;
        // @ts-ignore for later
        const modulus = parseFloat(avg % 1);
        const decimals = modulus !== 0 ? Math.round(modulus * 10) / 10 : false;
        const percentage = decimals ? `${decimals * 100}%` : false;

        return {
          count: votes.count,
          avg,
          trunc: Math.trunc(avg),
          decimals,
          percentage,
        };
      }
    }
  };

  const isRatedSong = id => store.getters['feedback/lookupSongRating'](id);

  const setUserRating = async songRating => {
    const currentRating = isRatedSong(songRating.id);
    const updates = {};
    const postData = {
      id: Date.now(),
      rating: songRating.rating,
    };
    const postKey = currentRating?.key || push(child(dbRef(db), `songRatings`)).key;

    try {
      if (!currentRating || currentRating.rating !== songRating.rating) {
        updates[`songRatings/${songRating.id}/${postKey}`] = postData;
        update(dbRef(db), updates);
        songRating.key = songRating.key ?? postKey;
        store.dispatch('feedback/setUserRating', songRating);
      }
    } catch (error) {
      console.error('{SENDING SONG}', error);
    }
    fetchSongRatings();
  };

  const fetchSongRatings = async () => {
    try {
      const result = await get(child(dbRef(db), `songRatings`)).then(snapshot => {
        if (snapshot.exists()) {
          return ratingMapper(snapshot.val());
        }
      });
      store.dispatch('feedback/setAllRatings', result);
    } catch (error) {
      console.error('SongRatings', error);
    }
  };

  const fetchFeedback = async () => {
    try {
      const result = await get(child(dbRef(db), `feedback`)).then(snapshot => {
        if (snapshot.exists()) {
          return feedbackMapper(snapshot.val());
        }
      });
      store.dispatch('feedback/setAllFeedback', result);
    } catch (error) {
      console.error('Feedback', error);
    }
  };

  const getFeedback = computed(() => store.state.feedback.allFeedback);

  const sendFeedbackForm = async form => {
    form.date = Date.now();
    try {
      const key = push(child(dbRef(db), 'feedback')).key;
      const updates = {};
      updates[`feedback/${key}`] = form;
      await update(dbRef(db), updates);
    } catch (error) {
      console.error('Feedback', error);
    }
  };

  return {
    songRatings,
    fetchSongRatings,
    getSongRatings,
    fetchFeedback,
    getFeedback,
    resolveSongRating,
    setUserRating,
    sendFeedbackForm,
    isRatedSong,
  };
}
