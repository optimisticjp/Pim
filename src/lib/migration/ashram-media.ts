export interface AshramMediaImage { src: string; altGu: string; captionGu?: string; sourceUrl: string }
export interface AshramMedia { ashramId: string; heroImage?: string; images: AshramMediaImage[] }

const legacyHost = "https://omshreemadhavanandji.org";
const currentUploads = "https://sachchidanandmadhavanand.org/wp-content/uploads/2023/01";
const names: Record<string, string> = { surat: "સુરત", chanod: "ચાણોદ", sughad: "સુઘડ", bhavnagar: "ભાવનગર", akru: "આકરુ", haridwar: "હરિદ્વાર" };
const currentCounts: Record<string, number> = { surat: 9, chanod: 9, sughad: 12, akru: 6, haridwar: 20 };

export const ashramMedia: Record<string, AshramMedia> = Object.fromEntries(Object.entries(names).map(([id, name]) => {
  const legacyImage = `${legacyHost}/content/ashram/${id}/img_front.jpg`;
  const currentImages = Array.from({ length: currentCounts[id] ?? 0 }, (_, index) => `${currentUploads}/content_ashram_${id}_img_${index + 1}_l.jpg`);
  const images = [...currentImages, legacyImage].map((src) => ({ src, altGu: `શ્રી માધવાનંદ આશ્રમ, ${name}`, sourceUrl: src }));
  return [id, { ashramId: id, heroImage: currentImages[0] ?? legacyImage, images }];
}));
