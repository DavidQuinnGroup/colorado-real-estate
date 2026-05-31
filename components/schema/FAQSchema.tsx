import { buildFAQSchema, type FAQItem } from '@/lib/schema/faqSchema';

type Props = {
  faqs: FAQItem[];
  pageUrl?: string;
};

function hasRenderableFaqs(faqs: FAQItem[]) {
  return faqs.some((faq) => faq.question.trim().length > 0 && faq.answer.trim().length > 0);
}

export default function FAQSchema({ faqs, pageUrl }: Props) {
  if (!hasRenderableFaqs(faqs)) return null;

  const schema = buildFAQSchema({ faqs, pageUrl });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/schema/FAQSchema.tsx
