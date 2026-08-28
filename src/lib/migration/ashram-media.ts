export interface AshramMediaImage { src: string; altGu: string; captionGu?: string; sourceUrl: string }
export interface AshramMedia { ashramId: string; heroImage?: string; images: AshramMediaImage[] }
const host = "https://omshreemadhavanandji.org";
const names: Record<string,string> = { surat:"સુરત", chanod:"ચાણોદ", sughad:"સુઘડ", bhavnagar:"ભાવનગર", akru:"આકરુ", haridwar:"હરિદ્વાર" };
export const ashramMedia: Record<string,AshramMedia> = Object.fromEntries(Object.entries(names).map(([id,name])=>{const src=`${host}/content/ashram/${id}/img_front.jpg`;return [id,{ashramId:id,heroImage:src,images:[{src,altGu:`શ્રી માધવાનંદ આશ્રમ, ${name}`,sourceUrl:`${host}/content/ashram/${id}/img_front.jpg`}]}]}));
