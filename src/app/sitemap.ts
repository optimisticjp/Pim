import type { MetadataRoute } from "next";

import { getPublicGuruProfiles } from "@/lib/cms/public-data";
import { getPublicAshrams } from "@/lib/operations/public-data";

const routes = [
  "",
  "/parampara",
  "/heritage",
  "/heritage/gallery",
  "/heritage/letters",
  "/ashrams",
  "/activities",
  "/seva",
  "/satsang",
  "/programmes",
  "/publications",
  "/veda-rahasya",
  "/veda-rahasya/membership",
  "/veda-rahasya/services",
  "/downloads",
  "/donation",
  "/events",
  "/forms",
  "/membership",
  "/volunteer",
  "/stay",
  "/contact",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [ashrams, gurus] = await Promise.all([getPublicAshrams(), getPublicGuruProfiles()]);
  const dynamicRoutes = [
    ...ashrams.map(ashram => `/ashrams/${ashram.slug}`),
    ...gurus.map(guru => `/parampara/${guru.slug}`),
  ];

  return [...routes, ...dynamicRoutes].map(route => ({
    url: `https://sachchidanandmadhavanand.org${route}`,
    changeFrequency: route === "/events" || route === "/satsang" || route === "/programmes" || route === "/veda-rahasya" || route === "/downloads" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
