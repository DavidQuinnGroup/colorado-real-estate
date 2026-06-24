import { buildFAQSchema, type FAQItem } from '@/lib/schema/faqSchema';

type Props = {
  faqs: FAQItem[];
  pageUrl?: string;
};

function hasRenderableFaqs(faqs: FAQItem[]) {
  return faqs.some((faq) => faq.question.trim().length > 0 && faq.answer.trim().length > 0);
}

function getRenderableFaqCount(faqs: FAQItem[]) {
  return faqs.filter((faq) => faq.question.trim().length > 0 && faq.answer.trim().length > 0).length;
}

export default function FAQSchema({ faqs, pageUrl }: Props) {
  if (!hasRenderableFaqs(faqs)) return null;

  const renderableFaqCount = getRenderableFaqCount(faqs);
  const schema = buildFAQSchema({ faqs, pageUrl });

  return (
    <script
      type="application/ld+json"
      data-testid="reie-faq-schema"
      data-faq-schema-type="FAQPage"
      data-faq-schema-page-url={pageUrl ?? ""}
      data-faq-schema-has-page-url={pageUrl ? "true" : "false"}
      data-faq-schema-input-count={faqs.length}
      data-faq-schema-renderable-count={renderableFaqCount}
      data-faq-schema-has-graph={pageUrl ? "true" : "false"}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/schema/FAQSchema.tsx
