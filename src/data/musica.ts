/** la musica — only tracks Melani lists. Do not invent titles. */

export type MusicaTrack = {
  title: string;
  artist: string;
  cover?: string;
  /** Playable audio (mp3 / AAC preview). */
  src?: string;
};

export const MUSICA_TRACKS: MusicaTrack[] = [];
