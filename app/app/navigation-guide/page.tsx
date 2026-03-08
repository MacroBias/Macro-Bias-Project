"use client";

import { useEffect, useState } from "react";

type NavigationGuide = {
  id: string;
  title: string;
  description: string;
  fileName?: string | null;
  mimeType?: string | null;
  fileSizeBytes?: number | null;
  openUrl?: string | null;
  downloadUrl?: string | null;
};

export default function NavigationGuidePage() {
  const [guides, setGuides] = useState<NavigationGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGuides = async () => {
      try {
        const response = await fetch("/api/admin/navigation-guides");
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          setError(payload?.message || "Unable to load navigation guide.");
          setIsLoading(false);
          return;
        }

        const payload = await response.json().catch(() => null);
        setGuides(payload?.guides ?? []);
        setError(null);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load navigation guide."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadGuides();
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Operational Dashboard Navigation Guide
        </h1>
        <p className="text-sm text-muted-foreground">
          Learn how to navigate the Operational Dashboard, interpret every section,
          and apply the information in your day-to-day decision process.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading guide content...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {!isLoading && !error ? (
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Operational Dashboard Navigation Guide
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All available guide documents are listed under this section.
          </p>

          {guides.length === 0 ? (
            <div className="mt-4 rounded-xl border border-border/70 bg-secondary/20 p-4 text-sm text-muted-foreground">
              No guide documents available yet.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {guides.map((guide) => (
                <section
                  key={guide.id}
                  className="rounded-xl border border-border/80 bg-secondary/20 p-4"
                >
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{guide.title}</h3>
                      {guide.description ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {guide.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border/80 bg-card p-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {guide.fileName
                          ? `Document: ${guide.fileName}`
                          : "No file attached yet."}
                      </p>
                      {guide.fileName && guide.openUrl && guide.downloadUrl ? (
                        <div className="flex flex-wrap gap-3">
                          <a
                            href={guide.openUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition hover:bg-secondary"
                          >
                            Open Document
                          </a>
                          <a
                            href={guide.downloadUrl}
                            download={guide.fileName}
                            className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition hover:bg-secondary"
                          >
                            Download
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
