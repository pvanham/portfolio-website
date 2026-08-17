/** Web app manifest for installability and Lighthouse PWA/SEO signals. */

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Parker Van Ham — Portfolio",
    short_name: "Parker Van Ham",
    description:
      "The professional portfolio of Parker Van Ham, a Computer Science student at WPI specializing in full-stack development and AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c1417",
    theme_color: "#19d4e6",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
