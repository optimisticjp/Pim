import type { MetadataRoute } from "next";

import { getAshrams } from "@/lib/ashram-data";
import { getPublications } from "@/lib/publication-data";
import { getPublishedEvents } from "@/lib/event-data";

const routes = ["", "/parampara", "/heritage", "/heritage/gallery", "/heritage/gallery/guru-parampara-portraits", "/ashrams", "/activities", "/satsang", "/publications", "/events", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const branchRoutes = getAshrams().map((ashram) => `/ashrams/${ashram.slug}`);
  const publicationRoutes = getPublications().map((publication) => `/publications/${publication.slug}`);
  const eventRoutes = getPublishedEvents().map((event) => `/events/${event.slug}`);
  return [...routes, ...branchRoutes, ...publicationRoutes, ...eventRoutes].map((route) => ({
    url: `https://sachchidanandmadhavanand.org${route}`,
    changeFrequency: route === "/events" || route === "/satsang" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
