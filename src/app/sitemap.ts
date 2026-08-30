import type { MetadataRoute } from "next";
import { getAshrams } from "@/lib/ashram-data";
import { getPublications } from "@/lib/publication-data";
import { getPublishedEvents } from "@/lib/event-data";
const routes=["","/parampara","/heritage","/heritage/gallery","/heritage/letters","/heritage/gallery/guru-parampara-portraits","/ashrams","/activities","/seva","/satsang","/programmes","/publications","/veda-rahasya","/veda-rahasya/membership","/veda-rahasya/services","/donation","/events","/forms","/membership","/volunteer","/stay","/contact"];
export default function sitemap():MetadataRoute.Sitemap{const branchRoutes=getAshrams().map(a=>`/ashrams/${a.slug}`);const publicationRoutes=getPublications().map(p=>`/publications/${p.slug}`);const eventRoutes=getPublishedEvents().map(e=>`/events/${e.slug}`);return [...routes,...branchRoutes,...publicationRoutes,...eventRoutes].map(route=>({url:`https://sachchidanandmadhavanand.org${route}`,changeFrequency:route==="/events"||route==="/satsang"||route==="/programmes"||route==="/veda-rahasya"?"weekly":"monthly",priority:route===""?1:0.8}));}
