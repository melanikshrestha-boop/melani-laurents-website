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
    title: "strawberry fields",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/43/0e/37/430e3790-75d5-c96a-1380-f9d9803aa700/18UMGIM31245.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/50/dc/3e/50dc3ea7-0c12-3a54-cbfa-874c8e1e9730/mzaf_8056056744713597418.plus.aac.p.m4a",
  },
  {
    title: "do you want to know a secret",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9c/ff/b5/9cffb5a6-a37f-c84a-7240-0333a071bc92/00602567725275.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ca/65/d7/ca65d70d-6730-286d-0e46-adb676b7ed2a/mzaf_7600185218231817592.plus.aac.p.m4a",
  },
  {
    title: "a hard day's night",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/db/a2/7a/dba27a46-3685-508d-d32e-a0e73cc82251/00602567713296.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ff/fc/b6/fffcb61c-6eae-4bfc-0aeb-2c108e37daa5/mzaf_8090789301194267540.plus.aac.p.m4a",
  },
  {
    title: "i wanna hold your hand",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/83/56/3c/83563c70-437e-af42-4327-32842b34d467/00602537669042.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/23/39/04/233904f8-fcb8-06cf-cbe8-1381da0e7688/mzaf_5151378790459346359.plus.aac.p.m4a",
  },
  {
    title: "and i love her",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/db/a2/7a/dba27a46-3685-508d-d32e-a0e73cc82251/00602567713296.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/43/e0/95/43e095c6-ef7c-d45a-7fbe-ab89b37e0336/mzaf_18008742720880760686.plus.aac.p.m4a",
  },
  {
    title: "come together",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/df/db/61/dfdb615d-47f8-06e9-9533-b96daccc029f/18UMGIM31076.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/26/65/7c/26657c20-9fec-56d6-55ff-61a76996f19b/mzaf_6128091568231335556.plus.aac.p.m4a",
  },
  {
    title: "yesterday",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/1a/19/db/1a19db26-17ad-b986-11a9-f72ac7a6194b/18UMGIM31214.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d1/69/2d/d1692d74-fe32-c676-7a1d-00deacae1644/mzaf_11316115358642175957.plus.aac.p.m4a",
  },
  {
    title: "goodbye, hello",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/43/0e/37/430e3790-75d5-c96a-1380-f9d9803aa700/18UMGIM31245.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d3/ec/3a/d3ec3aa8-b89f-22c8-818d-21dadeb7f8c9/mzaf_9172963447154933282.plus.aac.p.m4a",
  },
];
