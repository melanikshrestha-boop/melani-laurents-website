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
  {
    title: "Strawberry Fields",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/43/0e/37/430e3790-75d5-c96a-1380-f9d9803aa700/18UMGIM31245.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/50/dc/3e/50dc3ea7-0c12-3a54-cbfa-874c8e1e9730/mzaf_8056056744713597418.plus.aac.p.m4a",
  },
  {
    title: "Do You Want to Know a Secret",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9c/ff/b5/9cffb5a6-a37f-c84a-7240-0333a071bc92/00602567725275.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ca/65/d7/ca65d70d-6730-286d-0e46-adb676b7ed2a/mzaf_7600185218231817592.plus.aac.p.m4a",
  },
  {
    title: "A Hard Day's Night",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/db/a2/7a/dba27a46-3685-508d-d32e-a0e73cc82251/00602567713296.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ff/fc/b6/fffcb61c-6eae-4bfc-0aeb-2c108e37daa5/mzaf_8090789301194267540.plus.aac.p.m4a",
  },
  {
    title: "I Wanna Hold Your Hand",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/83/56/3c/83563c70-437e-af42-4327-32842b34d467/00602537669042.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/23/39/04/233904f8-fcb8-06cf-cbe8-1381da0e7688/mzaf_5151378790459346359.plus.aac.p.m4a",
  },
  {
    title: "And I Love Her",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/db/a2/7a/dba27a46-3685-508d-d32e-a0e73cc82251/00602567713296.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/43/e0/95/43e095c6-ef7c-d45a-7fbe-ab89b37e0336/mzaf_18008742720880760686.plus.aac.p.m4a",
  },
  {
    title: "Come Together",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/df/db/61/dfdb615d-47f8-06e9-9533-b96daccc029f/18UMGIM31076.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/26/65/7c/26657c20-9fec-56d6-55ff-61a76996f19b/mzaf_6128091568231335556.plus.aac.p.m4a",
  },
  {
    title: "Yesterday",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/1a/19/db/1a19db26-17ad-b986-11a9-f72ac7a6194b/18UMGIM31214.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d1/69/2d/d1692d74-fe32-c676-7a1d-00deacae1644/mzaf_11316115358642175957.plus.aac.p.m4a",
  },
  {
    title: "Goodbye Hello",
    artist: "The Beatles",
    cover:
      "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/43/0e/37/430e3790-75d5-c96a-1380-f9d9803aa700/18UMGIM31245.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d3/ec/3a/d3ec3aa8-b89f-22c8-818d-21dadeb7f8c9/mzaf_9172963447154933282.plus.aac.p.m4a",
  },
];
