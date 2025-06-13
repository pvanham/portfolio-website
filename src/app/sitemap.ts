// src/app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Replace this with your actual custom domain once you have it
  const baseUrl = "https://parkervanham.com";

  // List all your static pages here
  const staticPages = ["/", "/projects", "/skills", "/resume", "/contact"];

  const staticPageUrls = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const, // How often you expect the content to change
    priority: path === "/" ? 1.0 : 0.8, // Homepage is highest priority
  }));

  // In the future, when there are dynamic pages,
  // fetch those paths and add them to this array.
  // For example:
  // const projectUrls = projects.map((project) => ({
  //   url: `${baseUrl}/projects/${project.slug}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'weekly',
  //   priority: 0.6,
  // }));

  return [
    ...staticPageUrls,
    // ...projectUrls, // Uncomment when there are dynamic project pages
  ];
}
