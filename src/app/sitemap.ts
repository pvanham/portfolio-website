/** Dynamic sitemap generation for all static pages. */

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Replace this with your actual custom domain once you have it
  const baseUrl = "https://parkervanham.com";

  // List all your static pages here
  const staticPages = ["/", "/projects", "/skills", "/resume", "/contact", "/privacy"];

  const staticPageUrls = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1.0 : 0.8,
  }));

  return [...staticPageUrls];
}
