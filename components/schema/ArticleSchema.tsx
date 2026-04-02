type Props = {
  title: string;
  description: string;
  url: string;
};

export default function ArticleSchema({
  title,
  description,
  url,
}: Props) {

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "mainEntityOfPage": url,
    "author": {
      "@type": "Person",
      "name": "David Quinn",
    },
    "publisher": {
      "@type": "Organization",
      "name": "David Quinn Real Estate",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}