"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

type FrameworkSection = {
  id: string;
  slug: string;
  title: string;
  body: string;
  sortOrder: number;
};

type TableOfContentsItem = {
  id: string;
  title: string;
};

const defaultSections: FrameworkSection[] = [
  {
    id: "what-is",
    slug: "what-is",
    title: "What is Macro Bias",
    body:
      "Macro Bias is a systematic macro regime overlay designed to provide actionable signals for portfolio exposure management. " +
      "The framework synthesizes multiple data streams including macroeconomic indicators, liquidity conditions, and volatility regimes to classify market environments.\n\n" +
      "The core output is a regime classification (Risk-On, Neutral, or Risk-Off) accompanied by a continuous score ranging from -1 to +1. " +
      "This allows for both discrete regime-based decisions and more granular position sizing.\n\n" +
      "The methodology is designed for investors who seek to reduce drawdowns while participating in market upside, particularly those comfortable with leveraged exposure during favorable conditions.",
    sortOrder: 1,
  },
  {
    id: "what-not",
    slug: "what-not",
    title: "What Macro Bias is Not",
    body:
      "- Not a trading system or specific trade recommendation service\n" +
      "- Not investment advice or financial guidance\n" +
      "- Not a guaranteed system for avoiding all market losses\n" +
      "- Not suitable for all investors or risk profiles\n" +
      "- Not a substitute for professional financial advice",
    sortOrder: 2,
  },
  {
    id: "core-inputs",
    slug: "core-inputs",
    title: "Core Inputs",
    body:
      "### Macro Environment\n" +
      "Economic growth indicators, inflation dynamics, central bank policy signals, and cross-asset correlations inform the broader economic context.\n\n" +
      "### Liquidity Conditions\n" +
      "Central bank balance sheets, credit spreads, funding market stress indicators, and cross-border capital flows drive liquidity assessment.\n\n" +
      "### Volatility Regime\n" +
      "Implied vs realized volatility, term structure dynamics, correlation regimes, and tail risk indicators determine market stress levels.",
    sortOrder: 3,
  },
  {
    id: "why-no-futures",
    slug: "why-no-futures",
    title: "Why We Avoid Futures",
    body:
      "A key design decision is the preference for leveraged ETFs/ETPs over futures contracts. " +
      "This stems from a fundamental difference in cost structure that has significant implications for long-term compounding.\n\n" +
      "**Futures/Perpetuals Cost Structure**\n" +
      "Time-based financing costs accumulate continuously. The longer you hold, the more you pay, regardless of how often you adjust positions. " +
      "This is particularly punitive for regime-following strategies that may hold positions for extended periods.\n\n" +
      "**Leveraged ETF/ETP Cost Structure**\n" +
      "Decision-based costs that primarily manifest during rebalancing. If you hold through a regime without changes, your cost is minimal. " +
      "This aligns better with our methodology.\n\n" +
      "| Instrument Type        | Illustrative Annual Cost | Cost Driver                     |\n" +
      "| ---------------------- | ------------------------ | ------------------------------- |\n" +
      "| Futures / Perpetuals   | 20-35% p.a.             | Time-based (exposure × time)    |\n" +
      "| Leveraged ETFs/ETPs    | 2-4% p.a.               | Decision-based (rebalancing events) |\n\n" +
      "Note: Costs are illustrative and vary by market conditions, specific instruments, and broker arrangements.",
    sortOrder: 4,
  },
  {
    id: "update-frequency",
    slug: "update-frequency",
    title: "Update Frequency",
    body:
      "- **Daily Score**: Updated at market close each trading day based on intraday data.\n" +
      "- **Weekly Review**: Full model recalibration and regime assessment every weekend.\n" +
      "- **Regime Change Alerts**: Immediate notification when regime classification changes.\n" +
      "- **Monthly Reports**: Comprehensive performance and attribution analysis.",
    sortOrder: 5,
  },
];

export default function FrameworkPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [sections, setSections] = useState<FrameworkSection[]>(defaultSections);
  const [activeSection, setActiveSection] = useState<string>(
    defaultSections[0]?.slug ?? "what-is"
  );

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const loadSections = async () => {
      const response = await fetch("/api/framework-sections");
      if (!response.ok) {
        return;
      }
      const payload = await response.json().catch(() => null);
      const loadedSections = Array.isArray(payload?.sections)
        ? (payload.sections as FrameworkSection[])
        : [];
      if (loadedSections.length > 0) {
        setSections(
          loadedSections.sort((a, b) => a.sortOrder - b.sortOrder)
        );
        setActiveSection(loadedSections[0]?.slug ?? activeSection);
      }
    };

    loadSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tocItems: TableOfContentsItem[] = useMemo(
    () =>
      sections.map((section) => ({
        id: section.slug,
        title: section.title,
      })),
    [sections]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex gap-12">
        {/* Main content */}
        <div className="flex-1 space-y-12">
          {/* Page header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Framework & Methodology
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Understanding the Macro Bias systematic overlay approach
            </p>
          </div>

          {/* Dynamic sections */}
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.slug}
              className="scroll-mt-24"
            >
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              <div className="prose prose-invert max-w-none text-sm text-muted-foreground">
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <p {...props} className="leading-relaxed" />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        {...props}
                        className="ml-4 list-disc space-y-2 text-muted-foreground"
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        {...props}
                        className="ml-4 list-decimal space-y-2 text-muted-foreground"
                      />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                        <table
                          {...props}
                          className="w-full text-sm text-muted-foreground"
                        />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        {...props}
                        className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        {...props}
                        className="px-4 py-2 align-top text-sm text-muted-foreground"
                      />
                    ),
                  }}
                >
                  {section.body}
                </ReactMarkdown>
              </div>
            </section>
          ))}
        </div>

        {/* Sticky table of contents */}
        <aside className="hidden w-48 shrink-0 lg:block">
          <div className="sticky top-24">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              On this page
            </h3>
            <nav>
              <ul className="space-y-2">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`block text-sm transition-colors ${
                        activeSection === item.id
                          ? "font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
