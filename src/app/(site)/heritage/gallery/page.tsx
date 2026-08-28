import type { Metadata } from "next";
import { GalleryAlbumCard } from "@/components/heritage/gallery-album-card";
import { galleryAlbums } from "@/lib/migration/gallery-data";
export const metadata: Metadata = { title: "પ્રસંગ સ્મૃતિ", description: "માધવાનંદ પરિવારની ગુરુપરંપરા અને પ્રસંગોના ઉપલબ્ધ ઐતિહાસિક ચિત્રો." };
export default function GalleryPage() { return <main><header className="border-b border-border bg-[#efe1ce]"><div className="container-site py-12 sm:py-16"><p className="eyebrow">વારસા સંગ્રહ</p><h1 className="display-title mt-4 text-primary-strong">પ્રસંગ સ્મૃતિ</h1><p className="body-large mt-4 max-w-2xl">ગુરુપરંપરા અને પરિવારની ઉપલબ્ધ દૃશ્યસ્મૃતિઓનો સંભાળપૂર્વક ગોઠવાયેલ સંગ્રહ.</p></div></header><section className="section-pad"><div className="container-site grid gap-6 md:grid-cols-2">{galleryAlbums.map((album)=><GalleryAlbumCard key={album.id} album={album}/>)}</div></section></main>; }
