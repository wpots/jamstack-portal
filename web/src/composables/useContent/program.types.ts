export type ProgramItem = ProgramRichTextItem | ProgramTeaserItem | ProgramSetItem;

export interface ProgramPage {
  pageTitle?: string;
  eyebrow?: string;
  intro?: string;
  programItems: ProgramItem[];
}

export interface ProgramRichTextItem {
  type: 'richText';
  eyebrow?: string;
  title?: string;
  body: {
    json: Record<string, unknown>;
  };
  ticketForm?: boolean;
  embeddedYouTubeId?: string;
}

export interface ProgramTeaserItem {
  type: 'teaser';
  cms: Record<string, unknown>;
}

export interface ProgramSetItem {
  type: 'set';
  eyebrow?: string;
  title?: string;
  songs: ProgramSongEntry[];
}

export interface LinkedScore {
  sys?: {
    id?: string;
  };
  title?: string;
  artist?: string;
  albumart?: {
    url?: string;
  };
}

export interface ProgramSongEntry {
  title: string;
  artist?: string;
  imageUrl?: string;
  linkedScore?: LinkedScore;
}
