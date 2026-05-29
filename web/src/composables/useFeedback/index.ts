import { computed, ref } from 'vue';
import { useStore } from '../../store';
import fireBase from './firebase.js';
import { getDatabase, ref as dbRef, child, get } from 'firebase/database';
import { getFeedbackAvailability, getVotingWindow, isVoteInVotingWindow } from './availability';
import { markFeedbackSubmitted } from './submission';

export type FeedbackEntry = {
  id: string;
  tiptop: string;
  naam?: string;
  date?: number;
  updatedAt?: string;
};

export type SongRating = {
  id: string;
  rating?: number;
  key?: string;
  performedByUs?: boolean;
  average?: number | string | null;
  votes?: {
    count: number;
    average?: number;
  };
};

type FeedbackFormPayload = {
  naam?: string | null;
  tiptop: string;
  website?: string;
};

type SongRatingResultMap = Record<
  string,
  Record<string, { rating: number; performedByUs?: boolean; id?: number; updatedAt?: string }>
>;

const db = getDatabase(fireBase);
const feedbackParticipantStorageKey = 'goed-gebekt-feedback-participant-id';

function getApiPath(path: string) {
  return `/api/v1/${path}`;
}

function createParticipantId() {
  if (globalThis.window?.crypto?.randomUUID) {
    return globalThis.window.crypto.randomUUID().replaceAll('-', '_');
  }

  return `participant_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

function getParticipantId() {
  if (globalThis.window === undefined) {
    return createParticipantId();
  }

  const storedParticipantId = globalThis.window.localStorage.getItem(feedbackParticipantStorageKey);

  if (storedParticipantId) {
    return storedParticipantId;
  }

  const participantId = createParticipantId();
  globalThis.window.localStorage.setItem(feedbackParticipantStorageKey, participantId);
  return participantId;
}

function getDevApiUnavailableMessage() {
  return 'Stemmen API niet bereikbaar. Start `npm run dev` in web/ en open http://localhost:8888.';
}

async function parseFeedbackResponse<T>(response: Response) {
  const rawBody = await response.text();

  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody) as { message?: string } & T;
  } catch {
    throw new Error(
      response.status === 404
        ? 'Stemmen API niet gevonden. Probeer het later opnieuw.'
        : 'Stemmen API gaf een ongeldig antwoord. Probeer het later opnieuw.',
    );
  }
}

function assertFeedbackResponseOk(response: Response, body: { message?: string } | null) {
  if (!response.ok) {
    if (import.meta.env.DEV && response.status === 404) {
      throw new Error(getDevApiUnavailableMessage());
    }

    throw new Error(body?.message || 'Er ging iets mis bij het versturen.');
  }
}

async function postFeedbackRequest<T>(path: string, payload: Record<string, unknown>) {
  const response = await fetch(getApiPath(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const body = await parseFeedbackResponse<T>(response);
  assertFeedbackResponseOk(response, body);
  return body;
}

async function getFeedbackRequest<T>(path: string) {
  const response = await fetch(getApiPath(path), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const body = await parseFeedbackResponse<T>(response);
  assertFeedbackResponseOk(response, body);
  return body;
}

const ratingMapper = (result: SongRatingResultMap) => {
  const votingWindow = getVotingWindow();
  const ratings: SongRating[] = [];
  for (const songId in result) {
    const performanceVotes = Object.values(result[songId])
      .filter((vote) => vote.performedByUs !== false)
      .filter((vote) => isVoteInVotingWindow(vote.id, votingWindow, vote.updatedAt))
      .map((vote) => vote.rating);
    const averageVote = () => {
      const sum = performanceVotes.reduce((total, value) => total + value, 0);
      return sum / performanceVotes.length;
    };
    const rating = {
      id: songId,
      votes: {
        count: performanceVotes.length,
        average: performanceVotes.length ? averageVote() : undefined,
      },
    };
    ratings.push(rating);
  }
  return ratings;
};

export function useFeedback() {
  const store = useStore();

  const songRatings = ref<SongRating[] | null>(null);
  const getSongRatings = computed(() => store.state.feedback.allRatings);
  const resolveSongRating = (id: string) => {
    if (getSongRatings.value?.length) {
      const votes = getSongRatings.value.find((song) => song.id === id)?.votes;

      if (votes?.average) {
        const avg = Math.round(votes.average * 10) / 10;
        const modulus = avg % 1;
        const decimals = modulus === 0 ? false : Math.round(modulus * 10) / 10;
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

    return null;
  };

  const isRatedSong = (id: string) => store.getters['feedback/lookupSongRating'](id);

  const setUserRating = async (songRating: SongRating) => {
    const { isVotingOpen } = getFeedbackAvailability();

    if (isVotingOpen === false) {
      throw new Error('Voting is momenteel gesloten.');
    }

    const currentRating = isRatedSong(songRating.id);
    const participantId = currentRating?.key || getParticipantId();

    try {
      if (!currentRating || currentRating.rating !== songRating.rating) {
        await postFeedbackRequest<{ key: string }>('submit-rating', {
          participantId,
          rating: songRating.rating,
          songId: songRating.id,
          performedByUs: songRating.performedByUs !== false,
        });
        songRating.key = songRating.key ?? participantId;
        await store.dispatch('feedback/setUserRating', songRating);
      }
    } catch (error) {
      console.error('{SENDING SONG}', error);
      throw error;
    }

    await fetchSongRatings();
  };

  const fetchSongRatings = async () => {
    try {
      const result = await get(child(dbRef(db), `songRatings`)).then((snapshot) => {
        if (snapshot.exists()) {
          return ratingMapper(snapshot.val() as SongRatingResultMap);
        }

        return [];
      });

      songRatings.value = result;
      await store.dispatch('feedback/setAllRatings', result);
    } catch (error) {
      console.error('SongRatings', error);
      throw error;
    }
  };

  const fetchFeedback = async () => {
    try {
      const result = await getFeedbackRequest<{ feedback?: FeedbackEntry[] }>('list-feedback');
      const feedback = Array.isArray(result?.feedback) ? result.feedback : [];

      await store.dispatch('feedback/setAllFeedback', feedback);
    } catch (error) {
      console.error('Feedback', error);
      throw error;
    }
  };

  const getFeedback = computed(() => store.state.feedback.allFeedback);

  const sendFeedbackForm = async (form: FeedbackFormPayload) => {
    const { isFeedbackOpen } = getFeedbackAvailability();
    const trimmedMessage = form.tiptop?.trim();
    const trimmedName = form.naam?.trim() || '';

    if (isFeedbackOpen === false) {
      throw new Error('Feedback is momenteel gesloten.');
    }

    if (!trimmedMessage) {
      throw new Error('Vul eerst een bericht in.');
    }

    try {
      const result = await postFeedbackRequest<{ id: string }>('submit-feedback', {
        naam: trimmedName || null,
        tiptop: trimmedMessage,
        website: form.website || '',
      });
      markFeedbackSubmitted();
      await store.dispatch('feedback/setFeedbackSubmitted');
      await fetchFeedback();
      return result;
    } catch (error) {
      console.error('Feedback', error);
      throw error;
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
