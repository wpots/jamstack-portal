import { computed, ref } from 'vue';
import { useStore } from '../../store';
import fireBase from './firebase.js';
import { getDatabase, ref as dbRef, child, push, update, get } from 'firebase/database';

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
    console.log('votes', votes);
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

export type SongRating = {
  id: string;
  average?: number | string | null | undefined;
  votes?: {
    count: number;
    average?: number;
  };
};
export function useFeedback() {
  const store = useStore();

  const songRatings = ref<SongRating[] | null>(null);
  const getSongRatings = computed(() => store.state.feedback.allRatings);
  const resolveSongRating = id => {
    // @ts-ignore for later
    if (getSongRatings?.value?.length > 0) {
      // @ts-ignore for later
      const avg = getSongRatings.value.find(s => s.id === id)?.votes?.average;
      if (avg) {
        // @ts-ignore for later
        const modulus = parseFloat(avg % 1);
        const decimals = modulus !== 0 ? Math.round(modulus * 10) / 10 : false;
        const percentage = decimals ? `${decimals * 100}%` : false;

        return {
          avg,
          trunc: Math.trunc(avg),
          decimals,
          percentage,
        };
      }
    }
  };

  // let fetchRatingsTimer;

  // const stopRatingsTimer = () => {
  //   clearInterval(fetchRatingsTimer);
  //   fetchRatingsTimer = null;
  // };

  const isRatedSong = id => store.getters['feedback/lookupSongRating'](id);

  const setUserRating = async songRating => {
    const postData = {
      id: Date.now(),
      rating: songRating.rating,
    };

    // stopRatingsTimer();
    try {
      if (!isRatedSong(songRating.id)) {
        const updates = {};

        const postKeyAsId = push(child(dbRef(db), `songRatings`)).key;
        updates[`songRatings/${songRating.id}/${postKeyAsId}`] = postData;
        update(dbRef(db), updates);
        songRating.userId = postKeyAsId; // maybe later people may change their vote
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
          console.log(snapshot.val());
          return ratingMapper(snapshot.val());
        }
      });
      store.dispatch('feedback/setAllRatings', result);
    } catch (error) {
      console.error('Feedback', error);
    }
  };

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
    resolveSongRating,
    setUserRating,
    sendFeedbackForm,
    isRatedSong,
  };
}
