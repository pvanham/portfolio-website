// src/app/resume/page.tsx
import { H1 } from "@/components/ui/H1";
import { Metadata } from "next";
import { DownloadCloud } from "lucide-react";

export const metadata: Metadata = {
  title: "Parker Van Ham - Resume",
  description: "View and download Parker Van Ham's professional resume.",
};

export default function ResumePage() {
  const resumePdfUrl = "/Parker_Van_Ham_Resume_Website.pdf";

  return (
    <main className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <header className="mb-10 text-center md:mb-12">
        <H1>My Resume</H1>
        <p className="text-muted-foreground mt-3 text-lg sm:mt-4 sm:text-xl">
          Here you can view my resume online or download a PDF copy.
        </p>
      </header>

      {/* Download Button Section */}
      <section className="mb-10 flex justify-center md:mb-12">
        <a
          href={resumePdfUrl}
          download="Parker_Van_Ham_Resume.pdf" // This attribute triggers the download
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          <DownloadCloud className="mr-2 h-5 w-5" />
          Download Resume (PDF)
        </a>
      </section>

      {/* Embedded PDF Section */}
      <section>
        <h2 className="text-foreground mb-6 text-center text-2xl font-semibold sm:text-3xl">
          View Online
        </h2>
        <div className="border-border mx-auto aspect-[8.5/11] w-full max-w-4xl overflow-hidden rounded-lg border shadow-lg">
          {/* Using <object> for better browser compatibility for PDF embedding */}
          <object
            data={resumePdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
            aria-label="Parker Van Ham's Resume PDF"
          >
            {/* Fallback content if the PDF cannot be displayed */}
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                It appears your browser does not support embedding PDFs
                directly.
              </p>
              <p className="text-muted-foreground mb-4">
                No worries! You can still download it using the button above.
              </p>
              <a href={resumePdfUrl} className="text-primary hover:underline">
                Click here to download the PDF.
              </a>
            </div>
          </object>
        </div>
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Note: Embedded PDF viewer experience may vary by browser. For the best
          view, please download the resume.
        </p>
      </section>
    </main>
  );
}
