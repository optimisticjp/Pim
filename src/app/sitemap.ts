import type { MetadataRoute } from "next";

const routes = ["", "/parampara", "/ashrams", "/activities", "/satsang", "/publications", "/events", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://sachchidanandmadhavanand.org${route}`,
    changeFrequency: route === "/events" || route === "/satsang" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
