import type { ProgramItem, ProgramSongEntry } from '@/composables/useContent/program.types';
import { findRepertoireMatch } from '@/composables/useFeedback/resolveRatingSong.ts';

export type FeedbackDisplaySong = {
  sys?: { id?: string };
  title?: string;
  artist?: string;
  albumart?: { url?: string };
};

type RepertoireSong = FeedbackDisplaySong & {
  sys?: { id?: string };
};

export function isProgramSongPerformed(
  song: ProgramSongEntry,
  repertoire: RepertoireSong[] = [],
): boolean {
  if (song.linkedScore?.sys?.id) {
    return true;
  }

  return Boolean(findRepertoireMatch(song, repertoire));
}

function mapPerformedSong(
  song: ProgramSongEntry,
  repertoire: RepertoireSong[],
): FeedbackDisplaySong | null {
  const linkedScoreId = song.linkedScore?.sys?.id;
  const fromRepertoire = findRepertoireMatch(song, repertoire);
  const linked = song.linkedScore;

  if (linkedScoreId) {
    return {
      sys: { id: linkedScoreId },
      title: linked?.title || song.title || fromRepertoire?.title,
      artist: linked?.artist || song.artist || fromRepertoire?.artist,
      albumart: linked?.albumart || fromRepertoire?.albumart,
    };
  }

  if (fromRepertoire?.sys?.id) {
    return {
      sys: { id: fromRepertoire.sys.id },
      title: fromRepertoire.title || song.title,
      artist: fromRepertoire.artist || song.artist,
      albumart: fromRepertoire.albumart,
    };
  }

  return null;
}

function mapReferenceSong(song: ProgramSongEntry): FeedbackDisplaySong {
  return {
    title: song.title,
    artist: song.artist,
  };
}

export function getProgramSongLists(
  programItems: ProgramItem[] = [],
  repertoire: RepertoireSong[] = [],
) {
  const performedSongs: FeedbackDisplaySong[] = [];
  const referenceSongs: FeedbackDisplaySong[] = [];
  const seenPerformed = new Set<string>();
  const seenReference = new Set<string>();

  for (const item of programItems) {
    if (item.type !== 'set' || !Array.isArray(item.songs)) {
      continue;
    }

    for (const song of item.songs) {
      if (isProgramSongPerformed(song, repertoire)) {
        const mapped = mapPerformedSong(song, repertoire);
        const dedupeKey = mapped?.sys?.id || (mapped?.title || '').toLowerCase();

        if (!mapped || !dedupeKey || seenPerformed.has(dedupeKey)) {
          continue;
        }

        seenPerformed.add(dedupeKey);
        performedSongs.push(mapped);
        continue;
      }

      const titleKey = (song.title || '').toLowerCase();

      if (!titleKey || seenReference.has(titleKey)) {
        continue;
      }

      seenReference.add(titleKey);
      referenceSongs.push(mapReferenceSong(song));
    }
  }

  return { performedSongs, referenceSongs };
}
