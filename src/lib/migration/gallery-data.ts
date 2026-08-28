import crawl from "@/data/source-crawl.json";
import { guruProfiles } from "@/lib/migration/guru-data";

export interface GalleryImage { src: string; altGu: string; sourceUrl: string }
export interface GalleryAlbum { id: string; slug: string; titleGu: string; categoryGu: string; coverImage: string; images: GalleryImage[]; sourceUrl: string; ashramId?: string; guruId?: string }

const albumSources = [
  ["sweet-memories-of-our-swamiji", "Sweet Memories of Our Swamiji", "ગુરુપરંપરા"],
  ["sweet-memories-of-shree-madhav-gurukul-bakrol", "Sweet Memories of Shree Madhav Gurukul (Bakrol)", "આશ્રમ"],
  ["sweet-memories-of-our-swamiji-2", "Shree Madhav Gurukul (Bakrol, 2013)", "આશ્રમ"],
  ["sharad-purnima-mishri-tula-mahotsav-surat-29-oct-2012", "Sharad Purnima & Mishri Tula Mahotsav (Surat, 29 Oct 2012)", "ઉત્સવ"],
  ["samaiyu-shobha-yatra-surat-24-oct-2012", "Samaiyu & Shobha Yatra (Surat, 24 Oct 2012)", "ઉત્સવ"],
  ["blood-donation-camp-at-shree-madhav-gurukul-bakrol-2012", "Blood Donation Camp at Shree Madhav Gurukul (Bakrol, 2012)", "સેવા"],
  ["shreemad-bhagwat-saptah-mumbai-2008", "Shreemad Bhagwat Saptah (Mumbai – 2008)", "ભાગવત સપ્તાહ"],
  ["shree-krishna-janmashtami-celebration-surat-10-aug-2012", "Shree Krishna Janmashtami Celebration (Surat, 10 Aug 2012)", "ઉત્સવ"],
  ["shreemad-bhagwat-saptah-vastadi-2009", "Shreemad Bhagwat Saptah (Vastadi – 2009)", "ભાગવત સપ્તાહ"],
  ["janmashtami-prabhat-pheri-surat-10-aug-2012", "Janmashtami Prabhat Pheri (Surat, 10 Aug 2012)", "ઉત્સવ"],
  ["our-swami-shree", "Our Swami Shree", "ગુરુપરંપરા"],
  ["shreemad-bhagwat-saptah-new-jersey-usa-jun-2012", "Shreemad Bhagwat Saptah (New Jersey, USA – Jun 2012)", "ભાગવત સપ્તાહ"],
] as const;

const photoAlbums: GalleryAlbum[] = albumSources.flatMap(([slug, titleGu, categoryGu]) => {
  const sourceUrl = `https://sachchidanandmadhavanand.org/photo-gallery/${slug}`;
  const page = crawl.pages.find((item) => item.pageUrl === sourceUrl);
  const images = (page?.images ?? []).filter((src) => /\/content_photogallery_[^/]+\.(?:jpe?g|png|webp)$/i.test(src));
  if (!images.length) return [];
  return [{ id: `gallery-${slug}`, slug, titleGu, categoryGu, coverImage: images[0], sourceUrl, ashramId: /surat/.test(slug) ? "surat" : undefined, images: images.map((src, index) => ({ src, altGu: `${titleGu} — ચિત્ર ${index + 1}`, sourceUrl })) }];
});

export const galleryAlbums: GalleryAlbum[] = [{
  id: "guru-parampara-portraits", slug: "guru-parampara-portraits", titleGu: "ગુરુપરંપરાના ચિત્રો", categoryGu: "ગુરુપરંપરા",
  coverImage: guruProfiles[0].portraitUrl, sourceUrl: "https://omshreemadhavanandji.org/about_us.php", guruId: guruProfiles[0].id,
  images: guruProfiles.map((guru) => ({ src: guru.portraitUrl, altGu: `${guru.nameGu}નું ઐતિહાસિક ચિત્ર`, sourceUrl: guru.originalAssetUrl })),
}, ...photoAlbums];
