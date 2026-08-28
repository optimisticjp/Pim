import Image from "next/image";
import Link from "next/link";
import { Images } from "lucide-react";
import type { GalleryAlbum } from "@/lib/migration/gallery-data";
export function GalleryAlbumCard({ album }: { album: GalleryAlbum }) { return <Link href={`/heritage/gallery/${album.slug}`} className="group overflow-hidden rounded-[1.35rem] border border-border bg-surface shadow-card"><div className="relative aspect-[16/10] bg-[#eadcc8]"><Image src={album.coverImage} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain transition-transform group-hover:scale-[1.02]" /></div><div className="p-5"><p className="eyebrow">{album.categoryGu}</p><h2 className="mt-2 font-serif text-2xl font-bold text-primary">{album.titleGu}</h2><p className="mt-3 inline-flex items-center gap-2 font-bold text-sacred-green"><Images className="size-4" />{album.images.length} ચિત્રો</p></div></Link>; }
