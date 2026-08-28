import { guruProfiles } from "@/lib/migration/guru-data";
export interface GalleryImage { src: string; altGu: string; sourceUrl: string }
export interface GalleryAlbum { id: string; slug: string; titleGu: string; categoryGu: string; coverImage: string; images: GalleryImage[]; sourceUrl: string; guruId?: string }
const sourceUrl = "https://omshreemadhavanandji.org/about_us.php";
export const galleryAlbums: GalleryAlbum[] = [{ id: "guru-parampara-portraits", slug: "guru-parampara-portraits", titleGu: "ગુરુપરંપરાના ચિત્રો", categoryGu: "ગુરુપરંપરા", coverImage: guruProfiles[0].portraitUrl, sourceUrl, guruId: guruProfiles[0].id, images: guruProfiles.map((guru) => ({ src: guru.portraitUrl, altGu: `${guru.nameGu}નું ઐતિહાસિક ચિત્ર`, sourceUrl: guru.originalAssetUrl })) }];
