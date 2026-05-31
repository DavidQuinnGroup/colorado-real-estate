import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Hammer, MapPinned, ShieldCheck, Zap } from "lucide-react";

import RelatedArticles from "@/components/RelatedArticles";
import FAQSchema from "@/components/schema/FAQSchema";
import { articles, type ProgrammaticArticle } from "@/lib/articles";
import { neighborhoods, type Neighborhood } from "@/lib/neighborhoods";
import type { FAQItem } from "@/lib/schema/faqSchema";
import { generateFAQs } from "@/lib/schema/generateFAQs";

type ArticlePageParams = {
  slug: string;
};

type ArticlePageProps = {
  params: Promise<ArticlePageParams>;
};

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function findArticle(slug: string) {
  return articles.find((article) => normalize(article.slug) === normalize(slug)) || null;
}

function findArticleNeighborhood(article: ProgrammaticArticle) {
  return (
    neighborhoods.find(
      (neighborhood) => normalize(neighborhood.city) === normalize(article.city) && normalize(neighborhood.name) === normalize(article.neighborhood),
    ) || null
  );
}

function getNeighborhoodHref(neighborhood: Neighborhood | null, article: ProgrammaticArticle) {
  if (!neighborhood) return `/search?city=${encodeURIComponent(article.city)}`;
  return `/market/${normalize(neighborhood.city)}/${neighborhood.slug}`;
}

function getArticleIntro(article: ProgrammaticArticle, neighborhood: Neighborhood | null) {
  if (!neighborhood) return article.contentBody;

  return `${article.contentBody} This REIE brief connects ${neighborhood.name} to live market behavior, construction diligence, resilience exposure, and lifestyle efficiency so buyers and sellers can evaluate the location beyond surface-level comps.`;
}

function getStrategyParagraph(article: ProgrammaticArticle, neighborhood: Neighborhood | null) {
  if (!neighborhood) {
    return "David Quinn Group evaluates each Colorado micro-market through inventory pressure, construction quality, lifestyle efficiency, and negotiation leverage.";
  }

  switch (article.intent) {
    case "Efficiency":
      return `${neighborhood.primaryAnchor} is the practical anchor for this analysis. The key question is whether daily access, commute exposure, and time-value efficiency justify the premium attached to ${neighborhood.name}.`;
    case "Investment":
      return `${neighborhood.name} should be underwritten through construction DNA, replacement-cost exposure, lot quality, and inspection leverage before treating recent comparable sales as durable value.`;
    case "Resilience":
      return `${neighborhood.name} carries a ${neighborhood.fireRisk.toLowerCase()} fire-risk profile and ${neighborhood.insuranceComplexity.toLowerCase()} insurance complexity, which should shape inspection scope and negotiation strategy.`;
    case "Lifestyle":
      return `${neighborhood.lifestyleVibe} The practical value test is whether that lifestyle premium is supported by durable construction, resilient location fundamentals, and usable daily access.`;
  }
}

function getArticleFaqs(article: ProgrammaticArticle, neighborhood: Neighborhood | null): FAQItem[] {
  const cityFaqs = generateFAQs(article.city, `${article.intent.toLowerCase()}-real-estate-intelligence`);

  if (!neighborhood) return cityFaqs.slice(0, 4);

  return [
    {
      question: `What is the core REIE takeaway for ${article.neighborhood}?`,
      answer: `The core takeaway is that ${article.neighborhood} should be evaluated through more than comparable sales. David Quinn Group weighs construction quality, resilience exposure, lifestyle efficiency, inventory pressure, and negotiation leverage before forming a buyer or seller strategy.`,
    },
    {
      question: `How does this ${article.intent.toLowerCase()} brief help buyers in ${article.city}?`,
      answer: `This brief helps buyers understand whether ${article.neighborhood} fits their practical priorities, risk tolerance, and timing. The REIE approach flags where to move decisively and where deeper diligence may be justified.`,
    },
    {
      question: `How does this ${article.intent.toLowerCase()} brief help sellers in ${article.neighborhood}?`,
      answer: `For sellers, this brief identifies the value signals that should be emphasized and the likely buyer objections that should be addressed before launch, including condition, resilience, location utility, and market alternatives.`,
    },
    {
      question: `Which neighborhood signals matter most in ${article.neighborhood}?`,
      answer: `${article.neighborhood} carries a resilience score of ${neighborhood.resilienceScore}/100 and an efficiency score of ${neighborhood.avgEfficiencyScore}/100. David Quinn Group also reviews ${neighborhood.primaryAnchor}, ${neighborhood.fireRisk.toLowerCase()} fire risk, ${neighborhood.insuranceComplexity.toLowerCase()} insurance complexity, and the tactical lever: ${neighborhood.tacticalLever}`,
    },
    ...cityFaqs.slice(4, 6),
  ];
}

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found | David Quinn Group",
    };
  }

  return {
    title: `${article.title} | David Quinn Group`,
    description: article.description,
    keywords: [
      `${article.neighborhood} real estate`,
      `${article.city} Colorado real estate`,
      `${article.intent.toLowerCase()} real estate intelligence`,
      "Colorado real estate intelligence",
      "David Quinn Group",
    ],
    alternates: {
      canonical: article.url,
    },
    openGraph: {
      title: `${article.title} | David Quinn Group`,
      description: article.description,
      url: article.url,
      siteName: "David Quinn Group",
      locale: "en_US",
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = findArticle(slug);

  if (!article) notFound();

  const neighborhood = findArticleNeighborhood(article);
  const neighborhoodHref = getNeighborhoodHref(neighborhood, article);
  const searchHref = `/search?city=${encodeURIComponent(article.city)}`;
  const articleFaqs = getArticleFaqs(article, neighborhood);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article.schema) }} />
      <FAQSchema faqs={articleFaqs} pageUrl={article.url} />

      <article className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <header className="border-b border-white/10 pb-10">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="border border-[#00ff80]/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-[#00ff80]">
              {article.intent}
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">
              {article.city} / {article.neighborhood}
            </span>
          </div>

          <h1 className="max-w-4xl text-4xl font-black uppercase italic leading-[0.92] tracking-tight md:text-7xl">{article.title}</h1>

          <div className="mt-8 grid gap-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35 md:grid-cols-3">
            <p>By {article.author}</p>
            <p>{article.experienceYears} years construction expertise</p>
            <p>Updated {article.dateModified}</p>
          </div>
        </header>

        <section className="grid gap-10 py-12 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-8">
            <p className="text-xl leading-9 text-white/72">{getArticleIntro(article, neighborhood)}</p>

            <section className="border-l-4 border-[#00ff80] bg-white/[0.03] p-6">
              <div className="mb-4 flex items-center gap-3">
                <Hammer className="h-5 w-5 text-[#00ff80]" />
                <h2 className="text-xl font-black uppercase italic tracking-tight">REIE Strategy Read</h2>
              </div>
              <p className="leading-8 text-white/68">{getStrategyParagraph(article, neighborhood)}</p>
            </section>

            {neighborhood ? (
              <section className="grid gap-3 md:grid-cols-3">
                <div className="border border-white/10 bg-white/[0.02] p-5">
                  <ShieldCheck className="mb-4 h-5 w-5 text-cyan-300" />
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Resilience</p>
                  <p className="mt-2 text-3xl font-black italic">{neighborhood.resilienceScore}/100</p>
                </div>
                <div className="border border-white/10 bg-white/[0.02] p-5">
                  <Zap className="mb-4 h-5 w-5 text-[#00ff80]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Efficiency</p>
                  <p className="mt-2 text-3xl font-black italic">{neighborhood.avgEfficiencyScore}/100</p>
                </div>
                <div className="border border-white/10 bg-white/[0.02] p-5">
                  <MapPinned className="mb-4 h-5 w-5 text-[#fbbf24]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">Anchor</p>
                  <p className="mt-2 text-sm font-black uppercase leading-6">{neighborhood.primaryAnchor}</p>
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-3">
            <Link
              href={neighborhoodHref}
              className="group flex items-center justify-between gap-4 border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-[#00ff80]/50"
            >
              <span>
                <span className="block text-[9px] font-black uppercase tracking-[0.24em] text-[#00ff80]">Neighborhood Hub</span>
                <span className="mt-2 block text-sm font-black uppercase leading-6 text-white">{article.neighborhood}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 text-white/35 transition-colors group-hover:text-[#00ff80]" />
            </Link>

            <Link
              href={searchHref}
              className="group flex items-center justify-between gap-4 border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-cyan-300/50"
            >
              <span>
                <span className="block text-[9px] font-black uppercase tracking-[0.24em] text-cyan-300">Inventory Search</span>
                <span className="mt-2 block text-sm font-black uppercase leading-6 text-white">{article.city} Listings</span>
              </span>
              <ArrowUpRight className="h-4 w-4 text-white/35 transition-colors group-hover:text-cyan-300" />
            </Link>
          </aside>
        </section>

        <section className="mb-14 border-y border-white/10 py-12">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">REIE FAQ Layer</p>
            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">
              {article.neighborhood} Strategy Questions
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
            {articleFaqs.slice(0, 4).map((faq) => (
              <article key={faq.question} className="bg-[#050505] p-6">
                <h3 className="text-sm font-black uppercase leading-6 tracking-[0.12em] text-white">
                  {faq.question}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/55">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <RelatedArticles city={article.city} currentSlug={article.slug} title={`More ${article.city} Intelligence`} />
      </article>
    </main>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/articles/[slug]/page.tsx
