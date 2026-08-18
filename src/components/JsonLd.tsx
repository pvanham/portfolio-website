/** Person + WebSite JSON-LD for recruiter/search-engine rich results. */

import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
      jobTitle: "Full-Stack Developer",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Worcester Polytechnic Institute",
      },
      sameAs: [
        "https://www.linkedin.com/in/parker-van-ham-8545ab220",
        "https://github.com/pvanham",
      ],
    },
    {
      "@type": "WebSite",
      name: SITE_TITLE,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: {
        "@type": "Person",
        name: SITE_NAME,
      },
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
