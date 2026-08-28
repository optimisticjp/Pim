import type { MetadataRoute } from "next";

import { getAshrams } from "@/lib/ashram-data";
import { getPublications } from "@/lib/publication-data";

const routes = ["", "/parampara", "/ashrams", "/activities", "/satsang", "/publications", "/events", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const branchRoutes = getAshrams().map((ashram) => `/ashrams/${ashram.slug}`);
  const publicationRoutes = getPublications().map((publication) => `/publications/${publication.slug}`);
  return [...routes, ...branchRoutes, ...publicationRoutes].map((route) => ({
    url: `https://sachchidanandmadhavanand.org${route}`,
    changeFrequency: route === "/events" || route === "/satsang" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
