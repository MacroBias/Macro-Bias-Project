"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

type LegalSection = {
  id: string;
  slug: string;
  title: string;
  body: string;
  sortOrder: number;
};

const defaultSections: LegalSection[] = [
  {
    id: "research-only-disclaimer",
    slug: "research-only-disclaimer",
    title: "Research-Only Disclaimer",
    body:
      "Macro Bias is a research and educational platform. All content, data, analyses, regime classifications, and performance metrics presented on this platform are for informational and research purposes only. " +
      "The platform is designed to illustrate systematic approaches to macro regime analysis and should not be construed as a complete investment program or strategy.",
    sortOrder: 1,
  },
  {
    id: "no-investment-advice",
    slug: "no-investment-advice",
    title: "No Investment Advice",
    body:
      "Nothing on this platform constitutes investment advice, a recommendation to buy or sell any security, or an offer or solicitation to invest in any fund, product, or strategy.\n\n" +
      "Users should:\n\n" +
      "- Consult with qualified financial advisors before making any investment decisions\n" +
      "- Conduct their own due diligence on any investment or strategy\n" +
      "- Consider their own financial situation, risk tolerance, and investment objectives\n" +
      "- Understand that leveraged products carry significant risks including potential loss of principal",
    sortOrder: 2,
  },
  {
    id: "backtest-limitations",
    slug: "backtest-limitations",
    title: "Backtest Limitations",
    body:
      "**Important:** All performance data shown on this platform is backtested and hypothetical. Backtested performance has inherent limitations:\n\n" +
      "- It is prepared with the benefit of hindsight\n" +
      "- It may not reflect the impact of material market factors\n" +
      "- Actual trading would have resulted in different outcomes due to slippage, fees, and execution timing\n" +
      "- Past performance is not indicative of future results",
    sortOrder: 3,
  },
  {
    id: "data-sources",
    slug: "data-sources",
    title: "Data Sources",
    body:
      "Data used in our analyses and displays comes from various third-party sources believed to be reliable. " +
      "However, we make no representations or warranties as to the accuracy, completeness, or timeliness of such information.\n\n" +
      "Data providers include:\n\n" +
      "- Major financial data vendors for market prices\n" +
      "- Central bank publications for monetary data\n" +
      "- Government statistical agencies for economic data",
    sortOrder: 4,
  },
  {
    id: "conflicts-of-interest",
    slug: "conflicts-of-interest",
    title: "Conflicts of Interest",
    body:
      "Users should be aware that the operators of this platform, their affiliates, and related parties may:\n\n" +
      "- Hold positions in securities mentioned or analyzed on the platform\n" +
      "- Trade in the same direction as or against regime signals\n" +
      "- Have financial interests in products or instruments discussed\n" +
      "- Receive compensation from third parties related to content",
    sortOrder: 5,
  },
];

export default function LegalPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [sections, setSections] = useState<LegalSection[]>(defaultSections);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const loadSections = async () => {
      const response = await fetch("/api/legal-sections");
      if (!response.ok) {
        return;
      }
      const payload = await response.json().catch(() => null);
      const loadedSections = Array.isArray(payload?.sections)
        ? (payload.sections as LegalSection[])
        : [];
      if (loadedSections.length > 0) {
        setSections(
          loadedSections.sort((a, b) => a.sortOrder - b.sortOrder)
        );
      }
    };

    loadSections();
  }, []);

  const orderedSections = useMemo(
    () => sections.sort((a, b) => a.sortOrder - b.sortOrder),
    [sections]
  );

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="max-w-4xl space-y-12">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Legal &amp; Disclosures
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Important information about the use of this platform
          </p>
        </div>

        {/* Dynamic sections */}
        {orderedSections.map((section) => (
          <section key={section.id} id={section.slug}>
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              {section.title}
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p {...props} className="leading-relaxed" />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      {...props}
                      className="list-inside space-y-2 pl-4"
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li {...props} className="flex items-start gap-3" />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong {...props} className="text-foreground" />
                  ),
                }}
              >
                {section.body}
              </ReactMarkdown>
            </div>
          </section>
        ))}

        {/* Static footer / last updated */}
        <section className="border-t border-border pt-8">
          <p className="mt-2 text-xs text-muted-foreground">
            Last updated: February 2026
          </p>
        </section>
      </div>
    </div>
  );
}
