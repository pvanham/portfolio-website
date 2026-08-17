/** Per-project Open Graph image — title, role, and top technologies. */

import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/data/projects";
import { SITE_NAME } from "@/lib/site";

export const alt = "Project preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const title = project?.title ?? "Project";
  const role = project?.role ?? SITE_NAME;
  const technologies = (project?.technologies ?? []).slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(155deg, #0c1417 0%, #102228 50%, #0a1a1e 100%)",
          padding: "64px 72px",
          color: "#f2f6f6",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#19d4e6",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>parkervanham.com</span>
          <span>Project</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: title.length > 42 ? 48 : 64,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 16,
              color: "#19d4e6",
              fontSize: 28,
              fontWeight: 500,
            }}
          >
            {role}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {technologies.map((tech) => (
            <div
              key={tech}
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #2a4a52",
                borderRadius: 999,
                background: "rgba(25, 212, 230, 0.08)",
                color: "#c5e8ec",
                fontSize: 20,
                padding: "8px 18px",
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
