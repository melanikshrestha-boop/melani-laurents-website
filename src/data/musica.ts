/** la musica — only tracks Melani lists. Do not invent titles. */

export type MusicaTrack = {
  title: string;
  artist: string;
  cover?: string;
  /** Playable audio (mp3 / AAC preview). */
  src?: string;
};

export const MUSICA_TRACKS: MusicaTrack[] = [
  {
    title: "Heroes",
    artist: "David Bowie",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e2/65/b2/e265b2ae-48d5-9dd8-0251-6cd6c6c4eb53/190295842826.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1f/f3/12/1ff3122a-eb3e-373d-d524-cfe00de9b19a/mzaf_8446634475827049231.plus.aac.p.m4a",
  },
  {
    title: "Sailor Song",
    artist: "Gigi Perez",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/25/d4/96/25d49699-acc0-401f-a7cc-d7697339a474/24UM1IM03751.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6d/fe/18/6dfe184e-7612-f171-0356-0b7a84112e9a/mzaf_9760607751711758843.plus.aac.p.m4a",
  },
  {
    title: "A Breath",
    artist: "Pink Floyd",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/76/b0/3e76b0e3-762b-2286-a019-8afb19cee541/886445635829.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/81/89/f1/8189f16a-9181-0900-9d73-29bfc3551a6c/mzaf_5153718388939194858.plus.aac.p.m4a",
  },
];
