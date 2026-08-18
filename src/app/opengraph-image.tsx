/** Default Open Graph image — dark-mode graphic with name, role, and stack. */

import { ImageResponse } from "next/og";
import { SITE_JOB_TITLE, SITE_NAME, SITE_STACK } from "@/lib/site";

export const alt = `${SITE_NAME} — ${SITE_JOB_TITLE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
            alignItems: "center",
            color: "#19d4e6",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          parkervanham.com
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              marginTop: 16,
              color: "#19d4e6",
              fontSize: 32,
              fontWeight: 500,
            }}
          >
            {SITE_JOB_TITLE}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {SITE_STACK.map((tech) => (
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
