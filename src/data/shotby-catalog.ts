/** Shot by Celine — photography section. Her photos. */
export const SHOTBY_BASE = "/shotbyCeline";

export type ShotByGalleryId = "portraits" | "vision" | "scenery";

export const SHOTBY_HERO = "/photography/shotby/hero/_DSC2205.jpeg";
export const SHOTBY_ABOUT_PORTRAIT = "/photography/shotby/about/about.jpeg";

export const SHOTBY_INSTAGRAM =
  "https://www.instagram.com/shotbymelanis";
export const SHOTBY_EMAIL = "shotbymelani@gmail.com";
export const SHOTBY_PHONE = "(347) 546-4259";

export const SHOTBY_PORTRAITS: string[] = [
  "/photography/shotby/portraits/DC343A05-5E01-4E95-AB42-BE27D42F7B16.JPG",
  "/photography/shotby/portraits/9C871A31-0289-4FF2-9463-98A169E3C29C.JPG",
  "/photography/shotby/portraits/0771CCC9-2D18-4F34-82EB-D03B461E3A8F.JPG",
  "/photography/shotby/portraits/4268805B-2B09-4CFF-9A5A-B90C3C57CD10.JPG",
  "/photography/shotby/portraits/132933EC-32C5-4E6B-98F7-BAA0AA6A7741.JPG",
  "/photography/shotby/portraits/A28449D9-BAED-4FB1-A26B-FA6C55DFD538.JPG",
  "/photography/shotby/portraits/_DSC2664.jpeg",
  "/photography/shotby/portraits/_DSC2689.JPG",
  "/photography/shotby/portraits/_DSC2728.jpeg",
  "/photography/shotby/portraits/_DSC2478.jpeg",
  "/photography/shotby/portraits/_DSC2512.jpeg",
  "/photography/shotby/portraits/_DSC2292.jpeg",
  "/photography/shotby/portraits/_DSC2329.jpeg",
  "/photography/shotby/portraits/_DSC2266.jpeg",
  "/photography/shotby/portraits/_DSC1089.jpeg",
  "/photography/shotby/portraits/DSC02047.jpeg",
  "/photography/shotby/portraits/_DSC1090.jpeg",
  "/photography/shotby/portraits/71688946-DC60-4796-B6E9-36CB2C20B2BA.jpeg",
  "/photography/shotby/portraits/_DSC6420.jpeg",
  "/photography/shotby/portraits/FF2AE199-E800-41C0-8D69-6FDC9443F68A.jpeg",
  "/photography/shotby/portraits/_DSC4961.jpeg",
  "/photography/shotby/portraits/_DSC5327.jpeg",
  "/photography/shotby/portraits/_DSC5338.jpeg",
  "/photography/shotby/portraits/_DSC5501.jpeg",
  "/photography/shotby/portraits/_DSC5489.jpeg",
  "/photography/shotby/portraits/_DSC1696.jpeg",
  "/photography/shotby/portraits/_DSC1684.jpeg",
  "/photography/shotby/portraits/_DSC1687.JPG",
  "/photography/shotby/portraits/_DSC2417.JPG",
  "/photography/shotby/portraits/_DSC2683.JPG",
  "/photography/shotby/portraits/_DSC2684.JPG",
  "/photography/shotby/portraits/_DSC2685.JPG",
  "/photography/shotby/portraits/_DSC4946.jpeg",
  "/photography/shotby/portraits/_DSC2220.jpeg",
  "/photography/shotby/portraits/_DSC2228.jpeg",
  "/photography/shotby/portraits/_DSC1799.jpeg",
  "/photography/shotby/portraits/_DSC1808.jpeg",
  "/photography/shotby/portraits/DSC01903.jpeg",
  "/photography/shotby/portraits/_DSC2497.JPG",
];

export const SHOTBY_VISION: string[] = [
  "/photography/shotby/vision/image00008.jpeg",
  "/photography/shotby/vision/image00002.jpeg",
  "/photography/shotby/vision/image00010.jpeg",
  "/photography/shotby/vision/image00001.jpeg",
  "/photography/shotby/vision/image00009.jpeg",
  "/photography/shotby/vision/image00004.jpeg",
  "/photography/shotby/vision/image00003.jpeg",
  "/photography/shotby/vision/image00005.jpeg",
  "/photography/shotby/vision/image00006.jpeg",
  "/photography/shotby/vision/image00007.jpeg",
];

export const SHOTBY_SCENERY: string[] = [
  "/photography/shotby/scenery/_DSC1768.jpeg",
  "/photography/shotby/scenery/DSC01775.jpeg",
  "/photography/shotby/scenery/_DSC2205.jpeg",
  "/photography/shotby/scenery/_DSC2206.jpeg",
  "/photography/shotby/scenery/_DSC7309.jpeg",
  "/photography/shotby/scenery/DSC01801.jpeg",
  "/photography/shotby/scenery/IMG_0708.jpeg",
  "/photography/shotby/scenery/DSC01805.jpeg",
  "/photography/shotby/scenery/_DSC7265.jpeg",
];

export const SHOTBY_GALLERIES: { id: ShotByGalleryId; label: string; href: string; photos: string[] }[] = [
  { id: "portraits", label: "Portraits", href: `${SHOTBY_BASE}/portraits`, photos: SHOTBY_PORTRAITS },
  { id: "vision", label: "Vision", href: `${SHOTBY_BASE}/vision`, photos: SHOTBY_VISION },
  { id: "scenery", label: "Scenery", href: `${SHOTBY_BASE}/scenery`, photos: SHOTBY_SCENERY },
];
