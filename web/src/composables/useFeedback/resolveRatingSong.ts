export type RatingSongInput = {
  title?: string;
  artist?: string;
  sys?: { id?: string };
  linkedScore?: {
    sys?: { id?: string };
    title?: string;
    artist?: string;
  };
};

export type RepertoireEntry = {
  title?: string;
  artist?: string;
  sys?: { id?: string };
  albumart?: { url?: string };
};

export type SongRatingSummary = {
  id: string;
  votes?: {
    count: number;
    average?: number;
  };
};

export function normalizeRatingId(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '');
}

function normalizeTitleKey(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/^the\s+/, '')
    .replaceAll(/[^a-z0-9\s]+/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

function titleWords(title: string): string[] {
  return normalizeTitleKey(title).split(' ').filter((word) => word.length > 2);
}

export function titlesMatch(programTitle: string, repertoireTitle: string): boolean {
  const programKey = normalizeTitleKey(programTitle);
  const repertoireKey = normalizeTitleKey(repertoireTitle);

  if (!programKey || !repertoireKey) {
    return false;
  }

  if (programKey === repertoireKey) {
    return true;
  }

  if (programKey.includes(repertoireKey) || repertoireKey.includes(programKey)) {
    return true;
  }

  const programWordList = titleWords(programTitle);
  const repertoireWordList = titleWords(repertoireTitle);

  if (!programWordList.length || !repertoireWordList.length) {
    return false;
  }

  const matchedWords = programWordList.filter((word) =>
    repertoireWordList.some(
      (candidate) => candidate === word || candidate.startsWith(word) || word.startsWith(candidate),
    ),
  );

  return (
    matchedWords.length >= Math.min(2, programWordList.length, repertoireWordList.length)
  );
}

export function findRepertoireMatch<T extends RepertoireEntry>(
  song: RatingSongInput,
  repertoire: T[] = [],
): T | undefined {
  const title = song.linkedScore?.title || song.title || '';

  if (!title.trim()) {
    return undefined;
  }

  return repertoire.find((entry) => titlesMatch(title, entry.title || ''));
}

export function resolveRatingSongIdentity(
  song: RatingSongInput,
  repertoire: RepertoireEntry[] = [],
) {
  const repertoireMatch = findRepertoireMatch(song, repertoire);
  const linkedId = song.linkedScore?.sys?.id || song.sys?.id;
  const repertoireId = repertoireMatch?.sys?.id;
  const title = song.linkedScore?.title || repertoireMatch?.title || song.title || 'Onbekend nummer';
  const canonicalId = linkedId || repertoireId || `rating-${normalizeRatingId(title)}`;
  const aliases = new Set<string>([canonicalId]);

  if (linkedId) {
    aliases.add(linkedId);
  }

  if (repertoireId) {
    aliases.add(repertoireId);
  }

  aliases.add(`rating-${normalizeRatingId(title)}`);

  if (repertoireMatch?.title && repertoireMatch.title !== title) {
    aliases.add(`rating-${normalizeRatingId(repertoireMatch.title)}`);
  }

  return {
    id: canonicalId,
    aliases: [...aliases],
    performedByUs: Boolean(linkedId || repertoireId),
    title,
    repertoireMatch,
  };
}

export function mergeSongRatingSummaries(
  ratings: SongRatingSummary[] | null | undefined,
  ids: string[],
) {
  const entries = (ratings || []).filter((entry) => ids.includes(entry.id));
  const totalCount = entries.reduce((sum, entry) => sum + (entry.votes?.count || 0), 0);

  if (!totalCount) {
    return null;
  }

  const weightedSum = entries.reduce(
    (sum, entry) => sum + (entry.votes?.average || 0) * (entry.votes?.count || 0),
    0,
  );
  const avg = Math.round((weightedSum / totalCount) * 10) / 10;
  const modulus = avg % 1;
  const decimals = modulus === 0 ? false : Math.round(modulus * 10) / 10;
  const percentage = decimals ? `${decimals * 100}%` : false;

  return {
    count: totalCount,
    avg,
    trunc: Math.trunc(avg),
    decimals,
    percentage,
  };
}
