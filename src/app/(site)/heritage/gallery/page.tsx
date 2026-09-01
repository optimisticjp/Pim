import type { Metadata } from "next";
import { ExternalLink, FileImage, FolderOpen } from "lucide-react";

import { getPublicMediaAssets, getPublicMediaFolders } from "@/lib/cms/public-data";

export const metadata: Metadata = {
  title: "પ્રસંગ સ્મૃતિ",
  description: "સમિતિ દ્વારા Media Libraryમાં Publish કરાયેલા ઉપલબ્ધ ફોટા અને દૃશ્યસ્મૃતિઓ.",
};

export default async function GalleryPage() {
  const [folders, assets] = await Promise.all([getPublicMediaFolders(), getPublicMediaAssets()]);
  const images = assets.filter(asset => asset.media_type === "image");
  const folderMap = new Map(folders.map(folder => [folder.id, folder]));
  const groups = folders
    .map(folder => ({ folder, images: images.filter(image => image.folder_id === folder.id) }))
    .filter(group => group.images.length > 0);
  const ungrouped = images.filter(image => !image.folder_id || !folderMap.has(image.folder_id));

  return <main>
    <header className="border-b border-border bg-[#efe1ce]"><div className="container-site py-12 sm:py-16"><p className="eyebrow">વારસા સંગ્રહ</p><h1 className="display-title mt-4 text-primary-strong">પ્રસંગ સ્મૃતિ</h1><p className="body-large mt-4 max-w-2xl">Media Libraryમાંથી Publish થયેલા ફોટા અહીં આપમેળે દેખાય છે. Draft અથવા Archived ફોટા સામાન્ય ભક્તોને દેખાતા નથી.</p></div></header>
    <section className="section-pad"><div className="container-site space-y-10">
      {groups.map(({ folder, images: folderImages }) => <section key={folder.id}>
        <div className="flex items-start gap-3"><FolderOpen className="mt-1 size-5 text-gold-deep" /><div><h2 className="font-serif text-2xl font-bold text-primary">{folder.title_gu}</h2>{folder.description_gu ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{folder.description_gu}</p> : null}</div></div>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{folderImages.map(image => <a key={image.id} href={image.asset_url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="aspect-[4/3] bg-[#eadcc8] bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(image.thumbnail_url || image.asset_url).slice(1, -1)})` }} aria-hidden="true" />
          <div className="p-3"><h3 className="line-clamp-2 font-bold text-primary">{image.title_gu}</h3><p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">મૂળ ફોટો <ExternalLink className="size-3" /></p></div>
        </a>)}</div>
      </section>)}

      {ungrouped.length ? <section><div className="flex items-center gap-2"><FileImage className="size-5 text-gold-deep" /><h2 className="font-serif text-2xl font-bold text-primary">અન્ય પ્રકાશિત ફોટા</h2></div><div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{ungrouped.map(image => <a key={image.id} href={image.asset_url} target="_blank" rel="noreferrer" className="rounded-2xl border border-border bg-surface p-4"><FileImage className="size-5 text-sacred-green" /><h3 className="mt-3 font-bold text-primary">{image.title_gu}</h3><p className="mt-2 text-xs text-muted-foreground">ફોટો ખોલો ↗</p></a>)}</div></section> : null}

      {!images.length ? <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted-foreground">હાલ કોઈ ફોટો Publish નથી. Admin → Media Libraryમાંથી image asset Publish કર્યા પછી અહીં દેખાશે.</div> : null}
    </div></section>
  </main>;
}
