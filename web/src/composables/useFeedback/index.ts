import { computed, ref } from 'vue';
import { useStore } from '../../store';

export type SongRating = {
  id: string;
  average: number | string | null | undefined;
};
export function useFeedback() {
  const store = useStore();

  const songRatings = ref<SongRating[] | null>(null);
  const getSongRatings = computed(() => store.state.feedback.allRatings);
  const resolveSongRating = id => {
    // @ts-ignore for later
    if (getSongRatings?.value?.length > 0) {
      // @ts-ignore for later
      const avg = getSongRatings.value.find(s => s.id === id).average;
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

  let fetchRatingsTimer;
  const stopRatingsTimer = () => {
    clearInterval(fetchRatingsTimer);
    fetchRatingsTimer = null;
  };

  const setUserRating = async songRating => {
    stopRatingsTimer();
    const isRated = store.getters['feedback/lookupSongRating'](songRating.id);
    try {
      if (!isRated) {
        await fetch('/api/v1/feedback', {
          method: 'POST',
          body: JSON.stringify({ [songRating.id]: songRating.rating }),
        });
        store.dispatch('feedback/setUserRating', songRating);
      }
    } catch (error) {
      console.error('{SENDING SONG}', error);
    }
    fetchSongRatings();
  };

  const fetchSongRatings = async (c = 0) => {
    let count = c;
    try {
      count++;
      const result = await fetch('/api/v1/feedback')
        .then(async res => await res.json())
        .then(data => data);

      store.dispatch('feedback/setAllRatings', result);
    } catch (error) {
      console.error('TimeOut ERROR', count);
    }

    if (!fetchRatingsTimer) {
      fetchRatingsTimer = setInterval(async () => {
        await fetchSongRatings();
      }, 360 * 1000);
    }
  };

  return { songRatings, fetchSongRatings, getSongRatings, resolveSongRating, setUserRating };
}
